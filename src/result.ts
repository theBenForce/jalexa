import {
  AlexaExecutionInfo,
  DirectInvocationResponse,
  ExecutionMetrics,
  Invocation,
  RequestBody,
  ResponseBody,
  SimulationResponse,
  SkillResponseStatus,
} from "./responses";

export interface BaseResult<ResponseType = any> {
  result: ResponseType;

  metrics: ExecutionMetrics;
  responseBody: ResponseBody | undefined;
  status: SkillResponseStatus;
  error?: string;
}

export class AlexaSimulationResult<A = Record<string, any>>
  implements BaseResult<SimulationResponse> {
  constructor(public result: SimulationResponse) {}

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
    return this.responseBody?.sessionAttributes as A;
  }

  get requestBody(): RequestBody {
    return this.firstInvocation.invocationRequest.body;
  }

  get responseBody(): ResponseBody | undefined {
    return this.firstInvocation.invocationResponse?.body;
  }

  get alexaExecution(): AlexaExecutionInfo | undefined {
    return this.result.result.alexaExecutionInfo;
  }

  get status(): SkillResponseStatus {
    return this.result.status;
  }

  get error(): string | undefined {
    return this.result.result.error?.message;
  }
}

export class AlexaInvocationResult
  implements BaseResult<DirectInvocationResponse> {
  constructor(public result: DirectInvocationResponse) {}

  get metrics(): ExecutionMetrics {
    return this.result.result.skillExecutionInfo.metrics;
  }

  get responseBody(): ResponseBody | undefined {
    return this.result.result.skillExecutionInfo.invocationResponse?.body;
  }

  get status(): SkillResponseStatus {
    return this.result.status;
  }

  get error(): string | undefined {
    return this.result.result.error?.message;
  }
}
