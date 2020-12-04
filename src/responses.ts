/* eslint-disable @typescript-eslint/naming-convention */
export enum RequestTypes {
  LaunchRequest = "LaunchRequest",
  CanFulfillIntentRequest = "CanFulfillIntentRequest",
  IntentRequest = "IntentRequest",
  SessionEndedRequest = "SessionEndedRequest"
}

interface BasicRequest<T extends RequestTypes> {
  type: T;
  requestId: string;
  timestamp: string;
  locale: string;
}

interface LaunchRequest extends BasicRequest<RequestTypes.LaunchRequest> {
}

interface CanFulfillIntentRequest extends BasicRequest<RequestTypes.CanFulfillIntentRequest> {
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
    code: "ER_SUCCESS_MATCH" | "ER_SUCCESS_NO_MATCH" | "ER_ERROR_TIMEOUT" | "ER_ERROR_EXCEPTION";
  };
  values: [
    {
      value: {
        name: string;
        id: string;
      };
    }
  ];
};

interface IntentRequest extends BasicRequest<RequestTypes.IntentRequest>  {
  dialogState: "STARTED" | "IN_PROGRESS" | "COMPLETED";
  intent: {
    name: string;
    confirmationStatus: ConfirmationStatus;
    slots: {
      SlotName: {
        name: string;
        value: string;
        confirmationStatus: ConfirmationStatus;
        resolutions: {
          resolutionsPerAuthority: Array<AuthorityResolution>;
        };
      };
    };
  };
}

interface SessionEndedRequest extends BasicRequest<RequestTypes.SessionEndedRequest> {
  "reason": "USER_INITIATED" | "ERROR" | "EXCEEDED_MAX_REPROMPTS";
  "error": {
    "type": "INVALID_RESPONSE" | "DEVICE_COMMUNICATION_ERROR" | "INTERNAL_SERVICE_ERROR" | "ENDPOINT_TIMEOUT";
    "message": string;
  };
}

interface User {
  "userId": string;
  "permissions": {
    "consentToken"?: string;
  };
}

interface ResponseBody {
  "version": string;
  "session": {
    "new": true,
    "sessionId": string;
    "application": {
      "applicationId": string;
    };
    "user": User;
  };
  "context": {
    "Extensions"?: {
      "available": Record<string, any>;
    };
    "System": {
      "application": {
        "applicationId": string;
      };
      "user": User;
      "device": {
        "deviceId": string;
        "supportedInterfaces": Record<string, any>;
      },
      "apiEndpoint": string;
      "apiAccessToken": string;
    }
  },
  "request": LaunchRequest | CanFulfillIntentRequest | IntentRequest | SessionEndedRequest;
}

export interface SimulationResponse {
  id: string;
  status: "IN_PROGRESS" | "SUCCESSFUL" | "FAILED";
  result?: {
    skillExecutionInfo?: {
      invocations: [
        {
          invocationRequest: {
            endpoint: string;
            body: ResponseBody;
          };
          invocationResponse: {
            body: object;
          };
          metrics: {
            skillExecutionTimeInMilliseconds: number;
          };
        }
      ];
    };
    alexaExecutionInfo?: {
      alexaResponses: [
        {
          type: "Speech";
          content: {
            caption: string;
          };
        }
      ];
      consideredIntents: [
        {
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
      ];
    };
    error?: {
      message: string;
    };
  };
}

export interface ErrorResponse {
  message: string;
}
