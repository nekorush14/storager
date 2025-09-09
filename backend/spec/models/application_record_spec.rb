require_relative '../spec_helper'

RSpec.describe "RSpec Setup" do
  it 'can run basic tests' do
    expect(2 + 2).to eq(4)
  end

  it 'supports shoulda matchers syntax' do
    expect("hello").to be_a(String)
  end
end