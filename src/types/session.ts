import type { Attribution } from "./attribution";

export interface Conversion {
  eventId: string;

  started: boolean;

  completed: boolean;

  fired: boolean;

  createdAt: number;

  attribution: Attribution;
}
