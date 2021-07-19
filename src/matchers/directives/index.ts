import { AlexaSimulationResult } from "../../result";

export function toHaveDirective(
  received: AlexaSimulationResult,
  directiveType: string
) {
  const directives = received.responseBody?.response.directives ?? [];

  return directives.find((directive) => directive.type === directiveType)
    ? {
        pass: true,
        message: () =>
          `Expected directives [${directives
            .map((d) => d.type)
            .join(", ")}] not to include ${directiveType}`,
      }
    : {
        pass: false,
        message: () =>
          `Expected directives [${directives
            .map((d) => d.type)
            .join(", ")}] to include ${directiveType}`,
      };
}

function connectionCheck(
  received: AlexaSimulationResult,
  name: string,
  productId?: string
) {
  const directives = received.responseBody?.response.directives ?? [];
  const directive = directives.find(
    (directive) =>
      directive.type === "Connections.SendRequest" && directive.name === name
  );

  if (!productId) {
    return directive
      ? {
          pass: true,
          message: () =>
            `Expected directives [${directives
              .map((d) => d.type)
              .join(
                ", "
              )}] not to include "Connections.SendRequest" with name ${name}`,
        }
      : {
          pass: false,
          message: () =>
            `Expected directives [${directives
              .map((d) => d.type)
              .join(
                ", "
              )}] to include "Connections.SendRequest" with name ${name}`,
        };
  }

  return directive?.payload?.InSkillProduct?.productId === productId
    ? {
        pass: true,
        message: () =>
          `Expected not to find "Connections.SendRequest" ${name} directive for product ${productId}`,
      }
    : {
        pass: false,
        message: () =>
          `Expected to find "Connections.SendRequest" ${name} directive for product ${productId}`,
      };
}

export function toHaveBuyRequest(
  received: AlexaSimulationResult,
  productId?: string
) {
  return connectionCheck(received, "Buy", productId);
}

export function toHaveUpsellRequest(
  received: AlexaSimulationResult,
  productId?: string
) {
  return connectionCheck(received, "Upsell", productId);
}

export function toHaveRefundRequest(
  received: AlexaSimulationResult,
  productId?: string
) {
  return connectionCheck(received, "Cancel", productId);
}
