import {
  isIntentRequest,
} from "../responses";
import { AlexaSimulationResult, BaseResult } from "../result";

export function toEndSession(received: AlexaSimulationResult) {
  const endSession = received.responseBody?.response.shouldEndSession;

  return endSession === true
    ? {
        pass: true,
        message: () => `Expected shouldEndSession not to be true`,
      }
    : {
        pass: false,
        message: () => `Expected shouldEndSession to be true`,
      };
}

export function toHaveError(received: BaseResult) {
  const error = received.error;

  return Boolean(error) === true
    ? {
        pass: true,
        message: () => `Expected error not to be "${error}"`,
      }
    : {
        pass: false,
        message: () => `Expected error to be present`,
      };
}

export function toHaveSpeech(received: AlexaSimulationResult, ...text: string[]) {
  const speech = received.responseBody?.response.outputSpeech.ssml;

  return text.some((t) => speech?.includes(t))
    ? {
        pass: true,
        message: () => `Expected speech not to include "${text.join(", ")}"`,
      }
    : {
        pass: false,
        message: () => `Expected speech to include "${text.join(", ")}", recieved "${speech}"`,
      };
}

export function toHaveSlot(
  received: AlexaSimulationResult,
  slotName: string,
  value?: string
) {
  const request = received.requestBody.request;

  if (isIntentRequest(request)) {
    const slot = request.intent.slots[slotName];

    if (!value || !slot) {
      const slotNames = Object.keys(request.intent.slots);
      return slot
        ? {
            pass: true,
            message: () =>
              `Expected slot ${slotName} not to be in slots [${slotNames.join(
                ", "
              )}]`,
          }
        : {
            pass: false,
            message: () =>
              `Expected slot ${slotName} to be included in request slots [${slotNames.join(
                ", "
              )}]`,
          };
    }

    return slot.value.toLowerCase() === value.toLowerCase()
      ? {
          pass: true,
          message: () =>
            `Expected slot ${slotName} not to have value "${value}"`,
        }
      : {
          pass: false,
          message: () =>
            `Expected slot ${slotName} to be "${value}", recieved "${slot.value}"`,
        };
  }

  return {
    pass: false,
    message: () => `Slots are not included in ${request.type} requests`,
  };
}
