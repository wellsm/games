import type { RealtimeTriggerType } from "./triggers";

export const enum RealtimeMessageType {
  Subscribe = "subscribe",
  Alive = "alive",
  Ack = "ack",
}

export type RealtimeSubscribeMessage = {
  type: RealtimeMessageType.Subscribe;
  triggers: RealtimeTriggerType[];
};

export type RealtimeAliveMessage = {
  type: RealtimeMessageType.Alive;
};

export type RealtimeAckMessage = {
  type: RealtimeMessageType.Ack;
};
