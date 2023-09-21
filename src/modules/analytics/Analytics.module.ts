/**
 * Analytics API.
 * #### Usage
 * 
 * ``` typescript
 * import { getProfile, getAudiences } from './brooxAnalytics.js';
 * ```
 * <br/>
 *
 * #### Functions
 * - {@link getProfile}
 *   <br/>
 *   Gets profile information.
 * - {@link getProduct}
 *   <br/>
 *   Gets product information.
 * - {@link getAudiences}
 *   <br/>
 *   Gets audiences.
 * - {@link getCollapsed}
 *   <br/>
 *   Gets stores with installations, campaigns and categories.
 * - {@link getByYear}
 *   <br/>
 *   Gets information grouped by year.
 * - {@link getByMonth}
 *   <br/>
 *   Gets information grouped by month.
 * - {@link getByWeekday}
 *   <br/>
 *   Gets information grouped by weekday.
 * - {@link getByHour}
 *   <br/>
 *   Gets information grouped by hour.
 * 
 * @module analytics
 */

export { getProfile, getProduct, getAudiences, getClient, getCollapsed, getByYear, getByMonth, getByWeekday, getByHour } from './Report';
