/**
 * Get the current ISO date and time.
 *
 * @returns Returns the current ISO date and time.
 */
export const getCurrentIsoDateTime = () => new Date().toISOString();

/**
 * Get the unix timestamp for the given date and time.
 * If none is given, the current date and time is used.
 *
 * @param datetime Input date and time.
 * @returns Returns the current unix timestamp.
 */
export const getUnixTimestamp = (datetime?: Date) => {
  return Math.trunc((datetime?.getTime() ?? Date.now()) / 1000);
};

/**
 * Get a TTL (unix timestamp) for the given seconds.
 *
 * @param seconds TTL in seconds.
 * @returns Returns the TTL timestamp.
 */
export const getTimeToLiveSeconds = (seconds: number) => {
  return getUnixTimestamp() + seconds;
};

/**
 * Get a TTL (unix timestamp) for the given minutes.
 *
 * @param minutes TTL in minutes.
 * @returns Returns the TTL timestamp.
 */
export const getTimeToLiveMinutes = (minutes: number) => {
  return getTimeToLiveSeconds(minutes * 60);
};

/**
 * Get a TTL (unix timestamp) for the given hours.
 *
 * @param hours TTL in hours.
 * @returns Returns the TTL timestamp.
 */
export const getTimeToLiveHours = (hours: number) => {
  return getTimeToLiveMinutes(hours * 60);
};

/**
 * Get a TTL (unix timestamp) for the given days.
 *
 * @param hours TTL in days.
 * @returns Returns the TTL timestamp.
 */
export const getTimeToLiveDays = (days: number) => {
  return getTimeToLiveHours(days * 24);
};
