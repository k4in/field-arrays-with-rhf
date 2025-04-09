/**
 * Creates a Promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms The number of milliseconds to delay.
 * @returns {Promise<void>} A Promise that resolves after the delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
