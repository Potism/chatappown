// src/App.js
import { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import client from "./StreamChatClient";
import { getStaticToken } from "./getStaticToken";

const App = () => {
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const setupClient = async () => {
      try {
        const userToken = await getStaticToken();

        await client.connectUser(
          {
            id: "static-user-id", // Ensure this matches the user_id used to generate the token
            name: "Static User", // Name can be anything
          },
          userToken
        );

        const channel = client.channel("messaging", "channel-id", {
          // channel options, if any
        });
        await channel.watch();
        setChannel(channel);
      } catch (error) {
        console.error("Error connecting user:", error);
      }
    };

    setupClient();

    return () => {
      client.disconnectUser();
    };
  }, []);

  if (!channel) return <div>Loading...</div>;

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;
