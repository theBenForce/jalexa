/* eslint-disable @typescript-eslint/naming-convention */
export enum RequestTypes {
  LaunchRequest = "LaunchRequest",
  CanFulfillIntentRequest = "CanFulfillIntentRequest",
  IntentRequest = "IntentRequest",
  SessionEndedRequest = "SessionEndedRequest",
}

interface BasicRequest<T extends RequestTypes> {
  type: T;
  requestId: string;
  timestamp: string;
  locale: string;
}

export function isLaunchRequest(request: BasicRequest<RequestTypes>): request is LaunchRequest {
  return request.type === RequestTypes.LaunchRequest;
}

interface LaunchRequest extends BasicRequest<RequestTypes.LaunchRequest> {}


export function isCanFulfillIntentRequest(request: BasicRequest<RequestTypes>): request is CanFulfillIntentRequest {
  return request.type === RequestTypes.CanFulfillIntentRequest;
}

interface CanFulfillIntentRequest
  extends BasicRequest<RequestTypes.CanFulfillIntentRequest> {
  intent: {
    name: string;
    slots: Record<
      string,
      {
        name: string;
        value: string;
      }
    >;
  };
}

type ConfirmationStatus = "NONE" | "CONFIRMED" | "DENIED";

interface AuthorityResolution {
  authority: string;
  status: {
    code:
      | "ER_SUCCESS_MATCH"
      | "ER_SUCCESS_NO_MATCH"
      | "ER_ERROR_TIMEOUT"
      | "ER_ERROR_EXCEPTION";
  };
  values: [
    {
      value: {
        name: string;
        id: string;
      };
    }
  ];
}

export function isIntentRequest(request: BasicRequest<RequestTypes>): request is IntentRequest {
  return request.type === RequestTypes.IntentRequest;
}

interface IntentRequest extends BasicRequest<RequestTypes.IntentRequest> {
  dialogState: "STARTED" | "IN_PROGRESS" | "COMPLETED";
  intent: {
    name: string;
    confirmationStatus: ConfirmationStatus;
    slots: Record<string, {
        name: string;
        value: string;
        confirmationStatus: ConfirmationStatus;
        resolutions: {
          resolutionsPerAuthority: Array<AuthorityResolution>;
        };
      }>;
  };
}


export function isSessionEndedRequest(request: BasicRequest<RequestTypes>): request is SessionEndedRequest {
  return request.type === RequestTypes.SessionEndedRequest;
}

interface SessionEndedRequest
  extends BasicRequest<RequestTypes.SessionEndedRequest> {
  reason: "USER_INITIATED" | "ERROR" | "EXCEEDED_MAX_REPROMPTS";
  error: {
    type:
      | "INVALID_RESPONSE"
      | "DEVICE_COMMUNICATION_ERROR"
      | "INTERNAL_SERVICE_ERROR"
      | "ENDPOINT_TIMEOUT";
    message: string;
  };
}

interface User {
  userId: string;
  permissions: {
    consentToken?: string;
  };
}

export interface RequestBody {
  version: string;
  session: {
    new: boolean;
    sessionId: string;
    application: {
      applicationId: string;
    };
    user: User;
  };
  context: {
    Extensions?: {
      available: Record<string, any>;
    };
    System: {
      application: {
        applicationId: string;
      };
      user: User;
      device: {
        deviceId: string;
        supportedInterfaces: Record<string, any>;
      };
      apiEndpoint: string;
      apiAccessToken: string;
    };
  };
  request:
    | LaunchRequest
    | CanFulfillIntentRequest
    | IntentRequest
    | SessionEndedRequest;
}

export interface OutputSpeech {
  type: "PlainText" | "SSML";
  text?: string;
  ssml?: string;
  playBehavior?: "REPLACE_ENQUEUED" | "ENQUEUE" | "REPLACE_ALL";
}

export interface ResponseBody {
  version: string;
  sessionAttributes?: Record<string, any>;
  response: {
    outputSpeech?: OutputSpeech;
    card?: {
      type: "Standard" | "Simple" | "LinkAccount" | "AskForPermissionsConsent";
      title?: string;
      content?: string;
      text?: string;
      image?: {
        smallImageUrl: string;
        largeImageUrl: string;
      };
    };
    reprompt?: {
      outputSpeech: OutputSpeech;
    };
    directives?: [
      {
        type: string;
        [key: string]: any;
      }
    ];
    shouldEndSession?: boolean;
  };
}

export interface ExecutionMetrics {
skillExecutionTimeInMilliseconds: number;
}

export interface Invocation {
  invocationRequest: {
    endpoint: string;
    body: RequestBody;
  };
  invocationResponse: {
    body: ResponseBody;
  };
  metrics: ExecutionMetrics;
}

export interface AlexaResponse {
  type: "Speech";
  content: {
    caption: string;
  };
}

export interface ConsideredIntent {
  name: string;
  confirmationStatus: "NONE" | "CONFIRMED" | "DENIED";
  slots: {
    SlotName: {
      name: string;
      value: string;
      confirmationStatus: string;
      resolutions: {
        resolutionsPerAuthority: Array<AuthorityResolution>;
      };
    };
  };
}

export interface AlexaExecutionInfo {
  alexaResponses: Array<AlexaResponse>;
  consideredIntents: Array<ConsideredIntent>;
}

export interface SimulationResponse {
  id: string;
  status: "IN_PROGRESS" | "SUCCESSFUL" | "FAILED";
  result: {
    skillExecutionInfo: {
      invocations: Array<Invocation>;
    };
    alexaExecutionInfo: AlexaExecutionInfo;
    error?: {
      message: string;
    };
  };
}

export interface ErrorResponse {
  message: string;
}
