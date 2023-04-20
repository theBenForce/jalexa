


declare module "ask-cli/dist/lib/clients/smapi-client" {
  type SkillStage = "live" | "development";
  type EndpointRegion = "DEFAULT" | "NA" | "EU" | "FE";

  interface IspApi {
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
  }

  interface TestApi {
      invokeSkill(
        skillId: string,
        stage: SkillStage,
        invokePayload: any,
        endpointRegion: EndpointRegion,
        callback: CallbackFunction
      ): void;
  }
  
  interface EvaluationsApi {
    callProfileNlu(
      skillId: string,
      stage: string,
      locale: string,
      utterance: string,
      multiTurnToken: string,
      callback: CallbackFunction
    ): void;
  }

  export interface ISmapiClient {
    profile: string;
    doDebug: boolean;
    skill: {
      test: TestApi;
      evaluations: EvaluationsApi;
    };
    isp: IspApi;
  }

  
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
}

declare module "ask-cli/dist/lib/controllers/skill-simulation-controller" {
  import { ISmapiClient, SkillStage } from "ask-cli/dist/lib/clients/smapi-client";

  import { CallbackFunction } from "ask-cli/dist/lib/clients/smapi-client";

  interface SkillSimulationControllerParameters {
    skillId: string;
    locale: string;
    stage: SkillStage;
    profile: string;
    saveSkillIo?: string;
    debug?: boolean;
    smapiClient?: ISmapiClient;
  }

  export class SkillSimulationController {
    constructor(configuration: SkillSimulationControllerParameters);

    smapiClient: ISmapiClient;

    startSkillSimulation<ErrorResponse, SimulationResponse>(
      utterance: string,
      newSession: boolean
    ): Promise<{ body: SimulationResponse }>;
    getSkillSimulationResult<ErrorResponse, SimulationResponse>(
      simulationId: string
    ): Promise<{body: SimulationResponse}>;
  }
}


declare module "ask-cli/dist/lib/model/app-config" {
  class AppConfig {
    constructor();
  }

  export default AppConfig;
}