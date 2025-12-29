import { useAuth } from "@clerk/clerk-react";
import {
  type RealtimeEventType,
  RealtimeMessageType,
  type RealtimeTriggerType,
} from "@games/games";
import { useEffect } from "react";
import { env } from "@/config/env";

type Callbacks = {
  [RealtimeEventType.Refresh]: (trigger: RealtimeTriggerType) => void;
};

export const useRealtimeEvents = (
  triggers: RealtimeTriggerType[],
  callbacks: Callbacks
) => {
  const { getToken } = useAuth();

  useEffect(() => {
    let ws: WebSocket;

    async function connect() {
      const token = await getToken();

      if (!token) {
        return;
      }

      ws = new WebSocket(`${env.VITE_WS_URL}?auth=${token}`);

      ws.onopen = () => {
        console.log("WS connected");

        ws.send(
          JSON.stringify({
            type: RealtimeMessageType.Subscribe,
            triggers,
          })
        );
      };

      ws.onmessage = ({ data }: MessageEvent) => {
        console.log("Message", data);

        try {
          const { type, trigger } = JSON.parse(data);

          const callback = callbacks[type as RealtimeEventType];

          if (callback) {
            console.log("Event:", trigger);
            callback(trigger);
          }
        } catch (error) {
          console.error("WS payload error", error);
          ws.close();
        }
      };

      ws.onerror = () => {
        console.log("WS connection error");
        ws.close();
      };

      ws.onclose = () => console.log("WS disconnected");
    }

    connect();

    return () => {
      ws?.close();
    };
  }, [triggers]);
};
