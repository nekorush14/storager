require 'rails_helper'

RSpec.describe Stuff, type: :model do
  let(:tag) { Tag.create(name: "test", description: "test") }

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
  end
end
