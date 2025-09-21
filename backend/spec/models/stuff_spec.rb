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
