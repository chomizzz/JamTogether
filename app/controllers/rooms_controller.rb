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
        redirect_to room_path(@room), notice: "La salle a été créée avec succès."
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
    @room = Room.find(params[:id])
    @user = current_user
    @slotTypes = SlotType.all
    @instruments = Instrument.all
    @room.create_spectator_slot

    @room.slots.each do |s|
      if s.is_occupied == false
        UserSlot.create(room: @room, user: current_user, slot: s)
      end
    end

    render :show
  end


  private

  def rooms_params
    params.require(:room).permit(:name, :maxPlayer, :style)
  end
end

