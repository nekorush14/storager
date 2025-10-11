FactoryBot.define do
  factory :stuff do
    sequence(:name) { |n| "Stuff #{n}" }
    description { "MyText" }
    quantity { nil }
    unit { nil }
    expiration_date { nil }
    archived { false }

    # Trait for stuff with quantity
    trait :with_quantity do
      quantity { 10.0 }
      unit { "kg" }
    end

    # Trait for archived stuff
    trait :archived do
      archived { true }
    end

    # Trait for stuff with expiration date
    trait :with_expiration do
      expiration_date { Time.current + 1.month }
    end
  end
end
