
import { AlexaSimulationResult } from "../result";


export function toBeSuccessful(received: AlexaSimulationResult) {
  return received.status === "SUCCESSFUL" ? {
    pass: true,
    message: () => `Expected ${received.status} not to be "SUCCESSFUL`
  } : {
    pass: false,
    message: () => `Expected ${received.status} to be SUCCESSFUL`
  }
}