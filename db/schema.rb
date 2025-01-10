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

ActiveRecord::Schema[8.0].define(version: 2025_01_10_120337) do
  create_table "instruments", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "rooms", force: :cascade do |t|
    t.string "name"
    t.string "style"
    t.integer "maxPlayer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_admin_id", null: false
    t.integer "player_playing"
    t.index ["user_admin_id"], name: "index_rooms_on_user_admin_id"
  end

  create_table "slot_type_instruments", force: :cascade do |t|
    t.integer "instrument_id", null: false
    t.integer "slot_type_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instrument_id"], name: "index_slot_type_instruments_on_instrument_id"
    t.index ["slot_type_id"], name: "index_slot_type_instruments_on_slot_type_id"
  end

  create_table "slot_types", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "slots", force: :cascade do |t|
    t.integer "slot_type_id"
    t.boolean "is_occupied"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "room_id", null: false
    t.index ["room_id"], name: "index_slots_on_room_id"
    t.index ["slot_type_id"], name: "index_slots_on_slot_type_id"
  end

  create_table "user_instruments", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "instrument_id", null: false
    t.integer "slot_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instrument_id"], name: "index_user_instruments_on_instrument_id"
    t.index ["slot_id"], name: "index_user_instruments_on_slot_id"
    t.index ["user_id"], name: "index_user_instruments_on_user_id"
  end

  create_table "user_slots", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "slot_id", null: false
    t.integer "room_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["room_id"], name: "index_user_slots_on_room_id"
    t.index ["slot_id"], name: "index_user_slots_on_slot_id"
    t.index ["user_id"], name: "index_user_slots_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "pseudo"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "rooms", "users", column: "user_admin_id"
  add_foreign_key "slot_type_instruments", "instruments"
  add_foreign_key "slot_type_instruments", "slot_types"
  add_foreign_key "slots", "rooms"
  add_foreign_key "slots", "rooms", on_delete: :cascade
  add_foreign_key "slots", "slot_types"
  add_foreign_key "user_instruments", "instruments"
  add_foreign_key "user_instruments", "slots"
  add_foreign_key "user_instruments", "users"
  add_foreign_key "user_slots", "rooms"
  add_foreign_key "user_slots", "slots"
  add_foreign_key "user_slots", "users"
end
