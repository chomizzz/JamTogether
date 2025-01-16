class RoomsController < ApplicationController
  before_action :authenticate_user!, only: [:create]
  def new
    @room = Room.new
  end

  def create
    @room = Room.new(rooms_params)
    @room.user_admin = current_user

    if @room.valid?
      if @room.save
        @room.create_playable_slots
        redirect_to join_room_path(@room), notice: "La salle a été créée avec succès."
      else
        render :new
      end
    else
      flash.now[:alert] = @room.errors.full_messages.join(", ")
      render :new
    end
  end



  def show
    @room = Room.find(params[:id])
    @user
  end

  def join

    room = Room.find(params[:id])
    slot = room.create_spectator_slot
    current_user.take_spectator_slot(slot, room)
    @room = room
    @slotTypes = SlotType.all

    render :join
  end


  def submit_join_form
    puts("On est ici")
    room = Room.find(params[:roomId])
    slot_type_id = params[:slotTypeId]
    instrument_id = params[:instrumentId]

    slot_type = SlotType.find_by(id: slot_type_id)
    instrument = Instrument.find_by(id: instrument_id)

    # Si les données sont invalides, retournez une erreur
    if slot_type.nil? || instrument.nil?
      render json: { error: "Invalid slot type or instrument" }, status: :unprocessable_entity
      return
    end

    # Créez ou récupérez le slot pour l'utilisateur
    # slot = room.create_spectator_slot
    # current_user.take_spectator_slot(slot, room)

    # Enregistrer les associations (si nécessaire)
    room.slots.each do |slot|
      if slot.is_occupied == false
        # Créer une nouvelle instance de UserInstrument
        user_instrument = UserInstrument.new(user: current_user, slot: slot, instrument: instrument)

        # Créer une nouvelle instance de UserSlot avec la relation avec Slot, Room et User
        user_slot = UserSlot.new(user: current_user, slot: slot, room: room)

        # Sauvegarder les associations
        if user_instrument.save && user_slot.save
          puts "UserInstrument et UserSlot ont été enregistrés avec succès"
          render json: { redirect_url: play_room_path(room) }, status: :ok
          break
        else
          render "Erreur de sauvegarde : #{user_instrument.errors.full_messages} - #{user_slot.errors.full_messages}"
        end
      end
    end
  end


  def play
    @room = Room.find_by(id: params[:id])
    render :play
  end

  private

  def rooms_params
    params.require(:room).permit(:name, :maxPlayer, :style)
  end

end


