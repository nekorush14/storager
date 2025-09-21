FactoryBot.define do
  factory :tag do
    name { "MyString" }
    description { "MyText" }
    color_code { "MyString" }
    taggable { nil }
  end
end
