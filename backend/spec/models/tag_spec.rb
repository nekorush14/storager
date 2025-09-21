require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe "validate" do
    let(:stuff) { Stuff.create!(name: "test stuff", description: "test") }

    it "successful with name and description" do
      tag = Tag.new(name: "test", description: "test", taggable: stuff)
      expect(tag).to be_valid
    end

    it "failed without name" do
      tag = Tag.new(description: "test", taggable: stuff)
      tag.valid?
      expect(tag).to be_invalid
    end

    it "failed with duplicate name" do
      Tag.create!(name: "unique_tag", description: "test", taggable: stuff)
      duplicate_tag = Tag.new(name: "unique_tag", description: "test2", taggable: stuff)
      duplicate_tag.valid?
      expect(duplicate_tag).to be_invalid
    end

    it "successful with valid color code" do
      tag = Tag.new(name: "colored_tag", color_code: "#FF0000", taggable: stuff)
      expect(tag).to be_valid
    end

    it "failed with invalid color code" do
      tag = Tag.new(name: "invalid_color", color_code: "red", taggable: stuff)
      tag.valid?
      expect(tag).to be_invalid
    end

    it "successful with blank color code" do
      tag = Tag.new(name: "no_color", color_code: "", taggable: stuff)
      expect(tag).to be_valid
    end
  end

  describe "associations" do
    it { should belong_to(:taggable) }
  end
end
