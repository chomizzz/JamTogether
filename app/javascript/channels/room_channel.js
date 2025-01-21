import { createConsumer } from "@rails/actioncable";

const consumer = createConsumer();

export const joinRoom = (roomName, onCountUpdate) => {
    consumer.subscriptions.create(
        { channel: "RoomChannel", room: roomName },
        {
            received(data) {
                if (data.action === "update_count") {
                    onCountUpdate(data.count);
                }
            }
        }
    );
};
