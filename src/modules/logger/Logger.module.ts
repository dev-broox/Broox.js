/**
 * Provides logging options.
 * #### Usage
 *
 * ``` typescript
 * import { LogController } from './brooxLogger.js';
 * ```
 * <br/>
 *
 * #### {@link LogController}
 *
 * Enables or disables logs to console.
 *
 * ``` typescript
 * // example
 * const logController = new LogController(true, () => {...);
 * console.log(message);
 * ```
 * <br/>
 * 
 * @module logger
 */
export { LogController } from './LogController';
