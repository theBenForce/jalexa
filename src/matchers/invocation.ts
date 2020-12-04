import { RequestTypes, SimulationResponse } from "../responses";

export function toUseEndpoint(received: SimulationResponse, expected: string) {
  const usedEndpoint = received.result?.skillExecutionInfo?.invocations[0].invocationRequest.endpoint;
  return usedEndpoint === expected ?
    {
      pass: true,
      message: () => `Expected ${usedEndpoint} not to be ${expected}`
    } :
    {
      pass: false,
      message: () => `Expected ${usedEndpoint} to be ${expected}`
    };
}


export function toBeFasterThan(received: SimulationResponse, expected: number) {
  const responseTime = received.result?.skillExecutionInfo?.invocations[0].metrics.skillExecutionTimeInMilliseconds ?? Infinity;

  return responseTime <= expected ?
    {
      pass: true,
      message: () => `Expected response time of ${responseTime}ms not to be faster than ${expected}ms`
    } :
    {
      pass: false,
      message: () => `Expected response time of ${responseTime}ms to be faster than ${expected}ms`
    };
}

export function toHaveConsideredIntent(received: SimulationResponse, expected: string) {
  const consideredIntents = received.result?.alexaExecutionInfo?.consideredIntents.map(intent => intent.name) ?? [];

  return consideredIntents.find((intent) => intent === expected) ?
    {
      pass: true,
      message: () => `Expected considered intents ${consideredIntents.join(", ")} not to include ${expected}`
    } : {
      pass: false,
      message: () => `Expected considered intents ${consideredIntents.join(", ")} to include ${expected}`
    };
}


export function toBeRequestType(received: SimulationResponse, expected: RequestTypes) {
  const requestType = received.result?.skillExecutionInfo?.invocations?.[0]?.invocationRequest?.body?.request.type

  return requestType === expected ?
  {
    pass: true,
    message: () => `Expected request type ${requestType} not to be ${expected}`
  } : {
    pass: false,
    message: () => `Expected request type ${requestType} to be ${expected}`
  };
}