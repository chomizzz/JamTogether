class Api::V1::JoinRoomController < ApplicationController
    def by_slot_type
    slot_type_id = params[:slot_type_id]

    if slot_type_id.blank?
      render json: { error: 'Slot type ID is required' }, status: :unprocessable_entity
      return
    end

    instruments = Instrument.joins(:slot_types)
                            .where(slot_types: { id: slot_type_id })
                            .distinct

    if instruments.empty?
      render json: { error: 'No join_room found for the given slot type' }, status: :not_found
    else
      render json: instruments
    end
    end

    def fetch_instruments
      slot_type = SlotType.find(params[:slot_type_id])
      @instruments = slot_type.slot_type_instruments.map(&:instrument)
      render json: @instruments
    end
end
