FactoryBot.define do
  factory :stuff do
    sequence(:name) { |n| "Stuff #{n}" }
    description { "MyText" }
  end
end
