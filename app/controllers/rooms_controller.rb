class RoomsController < ApplicationController
  before_action :authenticate_user!, only: [ :create ]
  def index
    @rooms = Room.includes(:user_admin).all
  end

  def new
    @room = Room.new
  end

  def create
    @room = Room.new(rooms_params)
    @room.user_admin = current_user
    @room.current_player_number = 0
    @room.current_spectator_number = 0

    if @room.valid?
      if @room.save
        @room.create_playable_slots
        redirect_to join_room_path(@room, turbo: false), notice: "La salle a été créée avec succès."
      else
        flash[:alert] = @room.errors.full_messages.to_sentence
      end
    else
      flash[:alert] = @room.errors.full_messages.join(", ")
      render :new
    end
  end



  def show
    @room = Room.find(params[:id])
    @user
  end

  def join_as_spectator
    @room = Room.find(params[:id])

    if @room.current_spectator_number >= Room::MAX_SPECTATORS
      flash[:alert] = "Room is full!"
      redirect_to rooms_path
    else
      UserSlot.new(user_id: current_user, room_id: @room, slot_id: @room.create_spectator_slot).save
      @room.increment!(:current_spectator_number, 1)
      @room.save
      redirect_to @room
    end

  end


  def join
    @room = Room.find(params[:id])
    @slotTypes = SlotType.all
    if @room.current_player_number >= @room.maxPlayer
      flash[:alert] = "Room is full!"
      redirect_to rooms_path
    else
      render :select_role, turbo: false
    end
  end

  def play
    @room = Room.find_by(id: params[:id])
    @user_slot = current_user.user_slot
    @user_instrument = current_user.user_instrument.instrument
    authorize @room

    render :play
  end

  def select_role
    @room = Room.find(params[:id])
    @slotTypes = SlotType.all
  end



  # def update
  #   @room = Room.find(params[:id]) # Assurer que la room est récupérée
  #
  #   if @room.update(room_params)
  #     # Diffusion de la mise à jour
  #     ActionCable.server.broadcast "room_#{@room.id}", {
  #       current_player_number: @room.current_player_number
  #     }
  #     redirect_to @room, notice: "La salle a été mise à jour."
  #   else
  #     render :edit
  #   end
  # end


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
        current_user.user_slot&.delete
        user_slot = UserSlot.new(user: current_user, slot: slot, room: room)

        slot.is_occupied = true
        room.increment!(:current_player_number, 1)

        if user_instrument.save && user_slot.save
          render json: { redirect_url: play_room_path(room) }, status: :ok
          break
        else
          render "Erreur de sauvegarde : #{user_instrument.errors.full_messages} - #{user_slot.errors.full_messages}".to_json
        end
      end
    end
  end


  private

  def rooms_params
    params.require(:room).permit(:name, :maxPlayer, :style)
  end

end


