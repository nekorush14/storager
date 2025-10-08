require 'rails_helper'

RSpec.describe Stuff, type: :model do
  describe "validate" do
    it "successful with name and description" do
      stuff = Stuff.new(name: "test", description: "test")
      expect(stuff).to be_valid
    end

    it "failed without name" do
      stuff = Stuff.new(description: "test")
      stuff.valid?
      expect(stuff).to be_invalid
    end

    describe "quantity validation" do
      it "accepts positive quantity" do
        stuff = Stuff.new(name: "test", quantity: 10.5, unit: "kg")
        expect(stuff).to be_valid
      end

      it "accepts zero quantity" do
        stuff = Stuff.new(name: "test", quantity: 0, unit: "kg")
        expect(stuff).to be_valid
      end

      it "rejects negative quantity" do
        stuff = Stuff.new(name: "test", quantity: -5, unit: "kg")
        expect(stuff).to be_invalid
        expect(stuff.errors[:quantity]).to include("must be greater than or equal to 0")
      end

      it "allows nil quantity" do
        stuff = Stuff.new(name: "test", quantity: nil)
        expect(stuff).to be_valid
      end
    end

    describe "unit validation" do
      it "requires unit when quantity is present" do
        stuff = Stuff.new(name: "test", quantity: 10.5, unit: nil)
        expect(stuff).to be_invalid
        expect(stuff.errors[:unit]).to include("can't be blank")
      end

      it "does not require unit when quantity is absent" do
        stuff = Stuff.new(name: "test", quantity: nil, unit: nil)
        expect(stuff).to be_valid
      end

      it "accepts unit when quantity is present" do
        stuff = Stuff.new(name: "test", quantity: 10.5, unit: "kg")
        expect(stuff).to be_valid
      end
    end

    describe "expiration_date" do
      it "accepts expiration_date" do
        stuff = Stuff.new(name: "test", expiration_date: Time.current + 1.month)
        expect(stuff).to be_valid
      end

      it "allows nil expiration_date" do
        stuff = Stuff.new(name: "test", expiration_date: nil)
        expect(stuff).to be_valid
      end
    end

    describe "archived" do
      it "defaults to false" do
        stuff = Stuff.create!(name: "test")
        expect(stuff.archived).to eq(false)
      end

      it "accepts true value" do
        stuff = Stuff.new(name: "test", archived: true)
        expect(stuff).to be_valid
        expect(stuff.archived).to eq(true)
      end
    end
  end

  describe "associations" do
    it { should have_many(:tags) }

    it "can have multiple tags" do
      stuff = Stuff.create!(name: "test item", description: "test description")
      tag1 = Tag.create!(name: "tag1", description: "first tag", taggable: stuff)
      tag2 = Tag.create!(name: "tag2", description: "second tag", taggable: stuff)

      expect(stuff.tags).to include(tag1, tag2)
      expect(stuff.tags.count).to eq(2)
    end

    it "polymorphic association works correctly" do
      stuff = Stuff.create!(name: "test item", description: "test description")
      tag = Tag.create!(name: "polymorphic_tag", description: "test tag", taggable: stuff)

      expect(tag.taggable).to eq(stuff)
      expect(tag.taggable_type).to eq("Stuff")
      expect(tag.taggable_id).to eq(stuff.id)
    end
  end
end
