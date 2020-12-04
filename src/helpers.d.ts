/* eslint-disable @typescript-eslint/naming-convention */
type CallbackFunction<E = any, T = any> = (
  err: { body: E },
  response: { body: T }
) => void;

enum ProductTypes {
  Subscription = "SUBSCRIPTION",
  Entitlement = "ENTITLEMENT",
  Consumable = "CONSUMABLE",
}

interface InSkillProductSummary {
  editableState: "EDITABLE";
  lastUpdated: string;
  nameByLocale: Record<string, string>;
  pricing: Record<
    string,
    {
      defaultPriceListing: {
        currency: string;
        price: number;
        primeMemberPrice: number;
      };
      releaseDate: string;
    }
  >;
  productId: string;
  promotableState: string;
  purchasableState: string;
  referenceName: string;
  stage: "live" | "development";
  status: string;
  type: ProductTypes;
}

declare module "ask-cli/lib/clients/smapi-client" {
  

  declare class SmapiClient {
    isp: {
      getIsp(ispId: string, stage: string, callback: CallbackFunction): void;
      getIspSummary(
        ispId: string,
        stage: string,
        callback: CallbackFunction
      ): void;
      listIspForSkill(
        skillId: string,
        stage: string,
        queryParams: { maxResults?: number; nextToken?: string },
        callback: CallbackFunction<
          any,
          { inSkillProductSummaryList: Array<InSkillProductSummary> }
        >
      ): void;
      resetIspEntitlement(
        ispId: string,
        stage: string,
        callback: CallbackFunction
      ): void;
    };
  }
}

declare module "ask-cli/lib/controllers/skill-simulation-controller" {
  import { SmapiClient } from "ask-cli/lib/clients/smapi-client";

  interface SkillSimulationControllerParameters {
    skillId: string;
    locale: string;
    stage: "live" | "development";
    profile: string;
    saveSkillIo?: string;
    debug?: boolean;
  }

  declare class SkillSimulationController {
    constructor(configuration: SkillSimulationControllerParameters);

    smapiClient: SmapiClient;

    startSkillSimulation(
      utterance: string,
      newSession: boolean,
      callback: CallbackFunction<ErrorResponse, SimulationResponse>
    );
    getSkillSimulationResult(
      simulationId: string,
      callback: CallbackFunction<ErrorResponse, SimulationResponse>
    );
  }

  export default SkillSimulationController;
}

declare module "ask-cli/lib/model/app-config" {
  declare class AppConfig {
    constructor();
  }

  export default AppConfig;
}
