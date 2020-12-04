

declare module "ask-cli/lib/controllers/skill-simulation-controller" {
  
  
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

    startSkillSimulation(utterance: string, newSession: boolean, callback: (err: {body: ErrorResponse}, res: {body: SimulationResponse}) => void);
    getSkillSimulationResult(simulationId: string, callback: (err: {body: ErrorResponse}, res: {body: SimulationResponse}) => void); 
  }

  export default SkillSimulationController;
}

declare module "ask-cli/lib/model/app-config" {
  declare class AppConfig {
    constructor();
  }

  export default AppConfig;
}
