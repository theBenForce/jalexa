


declare module "ask-cli/dist/lib/clients/smapi-client" {
  type SkillStage = "live" | "development";
  type EndpointRegion = "DEFAULT" | "NA" | "EU" | "FE";

  
  export type CallbackFunction<E = any, T = any> = (
    err: { body: E },
    response: { body: T }
  ) => void;

  export enum ProductTypes {
    Subscription = "SUBSCRIPTION",
    Entitlement = "ENTITLEMENT",
    Consumable = "CONSUMABLE",
  }

  export interface InSkillProductSummary {
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

  class SmapiClient {
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
    skill: {
      test: {
        invokeSkill(
          skillId: string,
          stage: SkillStage,
          invokePayload: any,
          endpointRegion: EndpointRegion,
          callback: CallbackFunction
        ): void;
      };
    };
  }
}

declare module "ask-cli/dist/lib/controllers/skill-simulation-controller" {
  import { SmapiClient, SkillStage } from "ask-cli/dist/lib/clients/smapi-client";

  import { CallbackFunction } from "ask-cli/dist/lib/clients/smapi-client";

  interface SkillSimulationControllerParameters {
    skillId: string;
    locale: string;
    stage: SkillStage;
    profile: string;
    saveSkillIo?: string;
    debug?: boolean;
  }

  class SkillSimulationController {
    constructor(configuration: SkillSimulationControllerParameters);

    smapiClient: SmapiClient;

    startSkillSimulation<ErrorResponse, SimulationResponse>(
      utterance: string,
      newSession: boolean,
      callback: CallbackFunction<ErrorResponse, SimulationResponse>
    ): void;
    getSkillSimulationResult<ErrorResponse, SimulationResponse>(
      simulationId: string,
      callback: CallbackFunction<ErrorResponse, SimulationResponse>
    ): void;
    clearSession(): void;
  }

  export default SkillSimulationController;
}


declare module "ask-cli/dist/lib/model/app-config" {
  class AppConfig {
    constructor();
  }

  export default AppConfig;
}