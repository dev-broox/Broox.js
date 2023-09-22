/**
 * Query filter.
 */
export interface Filter {
  /**
   * Location ID.
   */
  locationId?: string,
  /**
   * Installation ID.
   */
  installationId?: string,
  /**
   * Campaign Id.
   */
  campaignId?: string,
  /**
   * Start date.
   */
  from?: Date,
  /**
   * End date.
   */
  to?: Date
}