class Chat < ApplicationRecord
  after_create_commit :broadcast_chat

  def broadcast_chat
    broadcast_append_to(
      "chats",
      target: "chats",
      partial: "chats/chat",
      locals: { chat: self }
    )
  end
end
