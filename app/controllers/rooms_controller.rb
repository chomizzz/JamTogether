class RoomsController < ApplicationController
  before_action :authenticate_user!, only: [ :create ]
  def new
    @room = Room.new
  end

  def create
    @room = Room.new(rooms_params)
    @room.user_admin = current_user
    @room.current_player_number = 1
    @room.current_spectator_number = 0

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

  def join_as_spectator
    @room = Room.find(params[:id])
    @slotTypes = SlotType.all
    UserSlot.new(user_id: current_user, room_id: @room, slot_id: @room.create_spectator_slot).save
    @room.increment!(:current_spectator_number, 1)
    render :show
  end

  def join
    @room = Room.find(params[:id])
    @slotTypes = SlotType.all

    render :join
  end


  def update
    @room = Room.find(params[:id]) # Assurer que la room est récupérée

    if @room.update(room_params)
      # Diffusion de la mise à jour
      ActionCable.server.broadcast "room_#{@room.id}", {
        current_player_number: @room.current_player_number
      }
      redirect_to @room, notice: "La salle a été mise à jour."
    else
      render :edit
    end
  end


  def submit_join_form
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

        slot.is_occupied = true
        room.increment!(:current_player_number, 1)
        ActionCable.server.broadcast(
          "room_#{room.id}",
          current_player_number: room.current_player_number,
          current_spectator_number: room.current_spectator_number
        )


        # Sauvegarder les associations
        if user_instrument.save && user_slot.save
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


