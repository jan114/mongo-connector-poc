import {RetryOptions} from "./types";

/**
 * Retries the function until it succeeds or the attempts are exhausted.
 *
 * @param fn - function to retry
 * @param attempts - number of attempts
 * @param delay - delay between attempts
 * @param forErrors - array of error predicates to retry for
 */
export async function retry<T>(
  fn: () => Promise<T>,
  {
    attempts = 5,
    delay = 2000,
    forErrors = [],
  }: RetryOptions = {
    attempts: 5,
    delay: 2000,
    forErrors: [],
  }
): Promise<T> {
  let error: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      if (
        i === attempts - 1 ||
        (
          forErrors?.length !== 0 &&
          !forErrors?.some((fn) => fn(e))
        )
      ) {
        error = e;
        break;
      }
      console.log(`Error occurred: ${e}; retrying [${i + 1}/${attempts}]`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.log(`Error occurred: ${error}; no more attempts left`);
  throw error;
}