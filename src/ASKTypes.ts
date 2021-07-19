/* eslint-disable @typescript-eslint/naming-convention */
declare namespace ASKAPI {
  interface UserInfo {
    userId: string;
  }

  interface ApplicationInfo {
    applicationId: string;
  }

  interface Session {
    new?: boolean;
    sessionId: string;
    application: ApplicationInfo;
    attributes: Record<string, unknown>;
    user?: UserInfo;
  }

  type RequestTypes = "CanFulfillIntentRequest";

  interface RequestData<Type extends RequestTypes = "CanFulfillIntentRequest"> {
    type: Type;
    requestId: string;
    locale: string;
    timestamp: string;
  }

  interface CanFulfillIntentRequest
    extends RequestData<"CanFulfillIntentRequest"> {
    intent: {
      name: string;
      slots: Record<string, { name: string; value: string }>;
    };
  }

  interface Request<RequestBody extends RequestData> {
    session?: Session;
    request: RequestBody;
    context: {
      AudioPlayer: {
        playerActivity: "IDLE";
      };
      System: {
        application: ApplicationInfo;
        user?: UserInfo;
        device: {
          supportedInterfaces: {};
        };
      };
    };
    version: "1.0";
  }
}
