/* eslint-disable @typescript-eslint/naming-convention */

import { request } from "http";
import * as UUID from "uuid";

export interface BuildCanHandleIntentRequestProps {
  sessionId?: string;
  userId?: string;
  requestId?: string;
  locale: string;
  intentName: string;
  slots: Record<string, { name: string; value: string }>;
  includeUser?: boolean;
}

export const buildCanHandleIntentRequest = (skillId: string) => (
  props: BuildCanHandleIntentRequestProps
): ASKAPI.Request<ASKAPI.CanFulfillIntentRequest> => {
  if (!props.sessionId) {
    props.sessionId = `SessionId.${UUID.v4()}`;
  }

  if (!props.userId) {
    props.userId = `amzn1.ask.account.${UUID.v4()}`;
  }

  if (!props.requestId) {
    props.requestId = `EdwRequestId.${UUID.v4()}`;
  }

  const result: ASKAPI.Request<ASKAPI.CanFulfillIntentRequest> = {
    request: {
      type: "CanFulfillIntentRequest",
      requestId: props.requestId,
      intent: {
        name: props.intentName,
        slots: props.slots,
      },
      locale: props.locale,
      timestamp: new Date().toISOString(),
    },
    session: {
      new: true,
      sessionId: props.sessionId,
      application: {
        applicationId: skillId,
      },
      attributes: {},
    },
    context: {
      AudioPlayer: {
        playerActivity: "IDLE",
      },
      System: {
        application: {
          applicationId: skillId,
        },
        device: {
          supportedInterfaces: {},
        },
      },
    },
    version: "1.0",
  };

  if (props.includeUser) {
    if (result.session) {
      result.session.user = {
        userId: props.userId,
      };
    }

    result.context.System.user = { userId: props.userId };
  }

  return result;
};
