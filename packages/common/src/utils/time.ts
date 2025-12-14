/**
 * Get the current ISO date and time.
 *
 * @returns Returns the current ISO date and time.
 */
export const getCurrentIsoDateTime = () => {
  return new Date().toISOString();
};