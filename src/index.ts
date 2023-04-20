

import {SkillSimulationController} from "ask-cli/dist/lib/controllers/skill-simulation-controller";
import {InSkillProductSummary} from "ask-cli/dist/lib/clients/smapi-client";
import AppConfig from "ask-cli/dist/lib/model/app-config";
import { EndpointRegion } from "ask-cli/dist/lib/clients/smapi-client";
import * as requests from "./requests";
import { DirectInvocationResponse, ErrorResponse, SimulationResponse } from "./responses";
import { AlexaInvocationResult, AlexaSimulationResult } from "./result";

export * from "./matchers";
export * from "./responses";

interface AlexaSkillParameters {
  skillId: string;
  /** The skill stage to test. Default is development. */
  stage?: "live" | "development";
  /** ASK profile to use. Will use the "default" profile if none is specified. */
  askProfile?: string;
  /** Skill locale to communicate with. Will use "en-US" by default */
  locale?: string;
}

interface SpeakOptions {
  newConversation?: boolean;
}

interface RequestOptions {
  intentName: string;
  slots?: Record<string, { name: string; value: string }>;
  includeUser?: boolean;
  locale?: string;
  endpointRegion?: EndpointRegion;
}

export class AlexaSkill<T = Record<string, any>> {
  private conversationId?: string;
  private controller: SkillSimulationController;

  buildCanHandleIntent: (
    props: requests.BuildCanHandleIntentRequestProps
  ) => ASKAPI.Request<ASKAPI.CanFulfillIntentRequest>;

  constructor(private params: AlexaSkillParameters) {
    new AppConfig();

    this.params.locale = this.params.locale ?? "en-US";
    this.params.stage = this.params.stage ?? "development";
    this.params.askProfile = this.params.askProfile ?? "default";

    this.controller = new SkillSimulationController({
      skillId: params.skillId,
      profile: params.askProfile ?? "default",
      stage: params.stage ?? "development",
      locale: params.locale ?? "en-US",
    });

    this.buildCanHandleIntent = requests.buildCanHandleIntentRequest(
      params.skillId
    );
  }

  private async _startSimulation(
    input: string,
    newConversation: boolean
  ): Promise<SimulationResponse> {
    const res = await this.controller.startSkillSimulation<ErrorResponse, SimulationResponse>(
      input,
      newConversation);
    
    this.conversationId = res.body.id;
    return res.body;
  }

  private async _getResponse(conversationId: string): Promise<SimulationResponse> {
    const result = await this.controller.getSkillSimulationResult<ErrorResponse, SimulationResponse>(conversationId);

    return result.body;
  }

  async canHandleIntent(props: RequestOptions): Promise<AlexaInvocationResult> {
    const payload = this.buildCanHandleIntent({
      intentName: props.intentName,
      locale: props.locale ?? this.params.locale!,
      slots: props.slots ?? {},
      includeUser: props.includeUser,
    });

    const result = await this.controller.smapiClient.skill.test.invokeSkill(
          this.params.skillId,
          this.params.stage!,
          { body: payload },
          props.endpointRegion ?? "DEFAULT").then((response: any) => response.body);

    return new AlexaInvocationResult(result);
  }

  async speak(
    input: string,
    options: SpeakOptions = {}
  ): Promise<AlexaSimulationResult<T>> {
    const conversation = await this._startSimulation(
      input,
      Boolean(options.newConversation) || !Boolean(this.conversationId)
    );
    const response = await this._getResponse(conversation.id);

    return new AlexaSimulationResult<T>(response);
  }

  async resetIspEntitlement(referenceName: string): Promise<void> {
    const products: Array<InSkillProductSummary> = await this.controller.smapiClient.isp.listIspForSkill(
          this.params.skillId,
          this.params.stage!,
          {},
        ).then((response: any) => response.body.inSkillProductSummaryList);

    const product = products.find(
      (product) => product.referenceName === referenceName
    );

    if (!product) {
      throw new Error(`Could not find product ${referenceName}`);
    }

    return this.controller.smapiClient.isp.resetIspEntitlement(
        product.productId,
        this.params.stage!);
  }
}