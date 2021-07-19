import * as success from "./success";
import * as invocation from "./invocation";
import { RequestTypes } from "../responses";
import * as responseMatchers from "./responses";
import * as directives from "./directives";

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

      /**
       * Test to see if `shouldEndSession` was set to true.
       */
      toEndSession(): R;

      /**
       * Test to see if an error message is included in the response
       */
      toHaveError(): R;

      /**
       * Verifies that the desired slot is present in the intent request
       * @param slotName Name of the slot that should be present
       * @param value Expected value of the slot, will do a case insensitive comparison
       */
      toHaveSlot(slotName: string, value?: string): R;

      /**
       * Verifies that the given directive is present in the response
       * @param directiveType Name of directive type that should be present
       */
      toHaveDirective(directiveType: string): R;

      /**
       * Verifies the response contains a request to buy a product.
       */
      toHaveBuyRequest(productId?: string): R;

      /** Verifies the response contains a request to upsell a product */
      toHaveUpsellRequest(productId?: string): R;

      /** Verifies the response contains a request to refund a product */
      toHaveRefundRequest(productId?: string): R;
    }
  }
}

expect.extend({
  ...success,
  ...invocation,
  ...responseMatchers,
  ...directives
});