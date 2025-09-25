require 'rails_helper'

RSpec.describe Api::V1::StuffsController, type: :controller do
  let(:valid_attributes) { { name: 'Test Stuff', tags_attributes: [ { name: 'Tag 1' } ] } }
  let(:invalid_attributes) { { name: nil } }

  describe 'GET #index' do
    context 'when no stuffs exist' do
      it 'returns empty array' do
        get :index
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to eq([])
      end
    end

    context 'when stuffs exist' do
      let!(:stuff1) { create(:stuff, name: 'First Stuff') }
      let!(:stuff2) { create(:stuff, name: 'Second Stuff') }
      let!(:tag1) { create(:tag, name: 'Tag 1', taggable: stuff1) }

      it 'returns all stuffs' do
        get :index
        expect(response).to have_http_status(:ok)

        parsed_response = JSON.parse(response.body)

        # Use match_array and a_hash_including for order-independent assertions
        expect(parsed_response).to match_array([
          a_hash_including(
            'name' => 'First Stuff',
            'tags' => [
              a_hash_including('name' => 'Tag 1')
            ]
          ),
          a_hash_including(
            'name' => 'Second Stuff',
            'tags' => []
          )
        ])
      end
    end
  end

  describe 'GET #show' do
    context 'when stuff exists' do
      let!(:stuff) { create(:stuff, name: 'Test Stuff') }
      let!(:tag) { create(:tag, taggable: stuff) }

      it 'returns the stuff' do
        get :show, params: { id: stuff.id }
        expect(response).to have_http_status(:ok)

        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to include(
          'id' => stuff.id,
          'name' => 'Test Stuff',
          'tags' => [
            a_hash_including(
              'name' => tag.name,
              'description' => tag.description,
              'color_code' => tag.color_code
            )
          ]
        )
      end
    end

    context 'when stuff does not exist' do
      it 'returns 404 not found' do
        expect {
          get :show, params: { id: 999999 }
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      it 'creates a new stuff' do
        expect {
          post :create, params: { stuff: valid_attributes }
        }.to change(Stuff, :count).by(1)
      end

      it 'returns created status' do
        post :create, params: { stuff: valid_attributes }
        expect(response).to have_http_status(:created)

        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to include(
          'name' => 'Test Stuff',
          'tags' => [
            a_hash_including('name' => 'Tag 1')
          ]
        )
        expect(parsed_response).to have_key('id')
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new stuff' do
        expect {
          post :create, params: { stuff: invalid_attributes }
        }.to change(Stuff, :count).by(0)
      end

      it 'returns unprocessable entity status' do
        post :create, params: { stuff: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)

        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to include(
          'name' => include('can\'t be blank')
        )
      end
    end
  end

  describe 'PUT #update' do
    let!(:stuff) { create(:stuff, name: 'Original Name') }

    context 'with valid parameters' do
      let(:new_attributes) { { name: 'Updated Name', tags_attributes: [ { name: 'New Tag' } ] } }
      let(:no_tag_attributes) { { name: 'Updated Name', tags_attributes: [] } }

      it 'updates the requested stuff' do
        put :update, params: { id: stuff.id, stuff: new_attributes }
        stuff.reload
        expect(stuff.name).to eq('Updated Name')
        expect(stuff.tags.count).to eq(1)
        expect(stuff.tags[0].name).to eq('New Tag')
      end

      it 'updates to remove tags' do
        put :update, params: { id: stuff.id, stuff: no_tag_attributes }
        stuff.reload
        expect(stuff.name).to eq('Updated Name')
        expect(stuff.tags.count).to eq(0)
      end

      it 'returns ok status' do
        put :update, params: { id: stuff.id, stuff: new_attributes }
        expect(response).to have_http_status(:ok)

        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to include(
          'id' => stuff.id,
          'name' => 'Updated Name'
        )
      end
    end

    context 'with invalid parameters' do
      it 'returns unprocessable entity status' do
        put :update, params: { id: stuff.id, stuff: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)

        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to include(
          'name' => include('can\'t be blank')
        )
      end

      it 'does not update the stuff' do
        original_name = stuff.name
        put :update, params: { id: stuff.id, stuff: invalid_attributes }
        stuff.reload
        expect(stuff.name).to eq(original_name)
      end
    end

    context 'when stuff does not exist' do
      it 'raises record not found' do
        expect {
          put :update, params: { id: 999999, stuff: valid_attributes }
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:stuff) { create(:stuff, name: 'To Be Deleted') }
    let!(:tag) { create(:tag, taggable: stuff, name: 'Tag 1') }

    context 'when stuff exists' do
      it 'destroys the requested stuff' do
        expect {
          delete :destroy, params: { id: stuff.id }
        }.to change(Stuff, :count).by(-1)
      end

      it 'returns no content status' do
        delete :destroy, params: { id: stuff.id }
        expect(response).to have_http_status(:no_content)
        expect(response.body).to be_blank
      end
    end

    context 'when stuff does not exist' do
      it 'raises record not found' do
        expect {
          delete :destroy, params: { id: 999999 }
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
