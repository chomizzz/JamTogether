class ChatsController < ApplicationController
  def index
    @chats = Chat.all
  end

  def create
    @chat = Chat.build(chat_params)
    @chat.save

    render json: {}, status: :no_content
  end

  private

  def chat_params
    params.require(:chat).permit(:message)
  end
end
