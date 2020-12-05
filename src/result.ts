import { AlexaExecutionInfo, ExecutionMetrics, Invocation, RequestBody, ResponseBody, SimulationResponse } from "./responses";

export class AlexaSimulationResult<A = Record<string, any>> {
  
  constructor(public result: SimulationResponse) { }

  get metrics(): ExecutionMetrics {
    return this.firstInvocation.metrics;
  }

  get firstInvocation(): Invocation {
    return this.result.result.skillExecutionInfo.invocations[0];
  }

  get id(): string {
    return this.result.id;
  }

  get endpoint(): string {
    return this.firstInvocation.invocationRequest.endpoint;
  }

  get sessionAttributes(): A | undefined {
    return this.responseBody.sessionAttributes as A;
  }

  get requestBody(): RequestBody {
    return this.firstInvocation.invocationRequest.body;
  }

  get responseBody(): ResponseBody {
    return this.firstInvocation.invocationResponse.body;
  }

  get alexaExecution(): AlexaExecutionInfo | undefined {
    return this.result.result.alexaExecutionInfo;
  }

  get status(): "IN_PROGRESS" | "SUCCESSFUL" | "FAILED" {
    return this.result.status;
  }
}