# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_10_11_004544) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "stuffs", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "quantity", precision: 10, scale: 2
    t.string "unit"
    t.datetime "expiration_date", precision: nil
    t.boolean "archived", default: false
    t.index ["archived"], name: "index_stuffs_on_archived"
    t.index ["expiration_date"], name: "index_stuffs_on_expiration_date"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "color_code"
    t.string "taggable_type"
    t.bigint "taggable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tags_on_name"
    t.index ["taggable_type", "taggable_id"], name: "index_tags_on_taggable"
  end
end
