export interface DataLayerEvent {
  /**
   * GTM event name.
   */
  event: string;

  /**
   * Additional event payload.
   */
  [key: string]: unknown;
}
