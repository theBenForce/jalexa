import * as success from "./success";
import * as invocation from "./invocation";
import { RequestTypes } from "../responses";

declare global {
  namespace jest {
    interface Matchers<R> {
      /** Verify that the skill request succeded. */
      toBeSuccessful(): R;
      /**
       * Verify the endpoint that is being called by the test.
       * @param expected Endpoint that you are expecting the alexa service to use
       */
      toUseEndpoint(expected: string): R;

      /**
       * Check the response time of the skill.
       * @param expected The maximum allowed time in milliseconds
       */
      toBeFasterThan(expected: number): R;

      /**
       * Verify that Alexa considered a specific intent.
       * @param expected Name of intent that should be considered.
       */
      toHaveConsideredIntent(expected: string): R;

      /**
       * Verify that Alexa processed this as a specific type of request
       * @param expected Expected type of request
       */
      toBeRequestType(expected: RequestTypes): R;
    }
  }
}

expect.extend({
  ...success,
  ...invocation
});