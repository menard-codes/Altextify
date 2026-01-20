/**
 * Blocks the thread for a given period of time.
 * Uses setTimeout and Promise under the hood.
 * @param ms Duration of sleep in Milliseconds `(default: 1000ms or 1s)`
 */
export async function sleep(ms = 1000) {
  await new Promise((res) => setTimeout(res, ms));
}
