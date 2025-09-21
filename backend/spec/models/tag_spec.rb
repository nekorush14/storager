require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe "validate" do
    it "successful with name and description" do
      tag = Tag.new(name: "test", description: "test")
      expect(tag).to be_valid
    end

    it "failed without name" do
      tag = Tag.new(description: "test")
      tag.valid?
      expect(tag).to be_invalid
    end
  end

  describe "associations" do
    it { should belong_to(:taggable).optional }
  end
end
