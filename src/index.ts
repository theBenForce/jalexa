import SkillSimulationController from "ask-cli/lib/controllers/skill-simulation-controller";
import AppConfig from "ask-cli/lib/model/app-config";
import { SimulationResponse, InSkillProductSummary } from "./responses";

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

export class AlexaSkill {
  private conversationId?: string;
  private controller: SkillSimulationController;

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
  }

  private _startSimulation(input: string, newConversation: boolean): Promise<SimulationResponse> {
    return new Promise((resolve, reject) =>
    this.controller.startSkillSimulation(input, newConversation, (err: unknown, res: {body: SimulationResponse}) => {
      if (err) {
        reject(err);
        return;
      }
      this.conversationId = res.body.id;
      resolve(res.body);
    })
  )
  }

  private _getResponse(conversationId: string): Promise<SimulationResponse> {
    return new Promise((resolve, reject) =>
    this.controller.getSkillSimulationResult(conversationId, (err, res) => {
      if (err) {
        reject(err.body);
        return;
      }
      resolve(res.body);
    })
  );
  }

  async speak(input: string, options: SpeakOptions = {}): Promise<SimulationResponse> {
    const conversation = await this._startSimulation(input, Boolean(options.newConversation) || !Boolean(this.conversationId));
    return this._getResponse(conversation.id);
  }

  async resetIspEntitlement(referenceName: string): Promise<void> {
    const products: Array<InSkillProductSummary> = await new Promise((resolve, reject) => this.controller.smapiClient.isp.listIspForSkill(this.params.skillId, this.params.stage!, {}, (err, response) => {
      if(err) {
        reject(err.body);
        return;
      }
      resolve(response.body.inSkillProductSummaryList);
    }));

    const product = products.find((product) => product.referenceName === referenceName);

    if(!product) {
      throw new Error(`Could not find product ${referenceName}`);
    }

    return new Promise((resolve, reject) => this.controller.smapiClient.isp.resetIspEntitlement(product.productId, this.params.stage!, (err, response) => {
      if(err) {
        reject(err.body);
        return;
      }
      resolve(response);
    }));

  }
}