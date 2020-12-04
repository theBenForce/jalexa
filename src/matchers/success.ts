import { SimulationResponse } from "../responses";


export function toBeSuccessful(received: SimulationResponse) {
  return received.status === "SUCCESSFUL" ? {
    pass: true,
    message: () => `Expected ${received.status} not to be "SUCCESSFUL`
  } : {
    pass: false,
    message: () => `Expected ${received.status} to be SUCCESSFUL`
  }
}