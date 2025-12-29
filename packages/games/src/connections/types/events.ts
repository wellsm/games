import type { RealtimeTriggerType } from "./triggers";

export const enum RealtimeEventType {
  Refresh = "refresh",
}

export type RealtimeEvents = RealtimeRefreshEvent;

export type RealtimeRefreshEvent = {
  type: RealtimeEventType.Refresh;
  trigger: RealtimeTriggerType;
};
