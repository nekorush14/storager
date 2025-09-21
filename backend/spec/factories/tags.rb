FactoryBot.define do
  factory :tag do
    sequence(:name) { |n| "Tag #{n}" }
    description { "A useful tag for organizing items" }
    color_code { "##{sprintf('%06X', rand(0xFFFFFF))}" }
    association :taggable, factory: :stuff

    trait :with_red_color do
      color_code { "#FF0000" }
    end

    trait :with_blue_color do
      color_code { "#0000FF" }
    end

    trait :without_color do
      color_code { nil }
    end
  end
end
