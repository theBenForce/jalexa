# Jalexa

Easily create unit tests for alexa skills.

[![npm](https://img.shields.io/npm/v/jalexa)](https://www.npmjs.com/package/jalexa)
[![Release](https://github.com/theBenForce/jalexa/workflows/Release/badge.svg)](https://github.com/theBenForce/jalexa/actions?query=workflow%3ARelease)
[![Maintainability](https://api.codeclimate.com/v1/badges/0bf0df59c76b99a3918a/maintainability)](https://codeclimate.com/github/theBenForce/jalexa/maintainability) [![Join the chat at https://gitter.im/jest-alexa/community](https://badges.gitter.im/jest-alexa/community.svg)](https://gitter.im/jest-alexa/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation

Jalexa uses the ask-cli to make requests to your skill. Before running tests with jalexa you need to install and authenticate the ask-cli. You can find out more here: https://www.npmjs.com/package/ask-cli

Once the ask cli is configured, you just need to install jalexa in your project:

```bash
yarn add -D jalexa
```

Then add it to your setup files in `jest.config.js`:

```js
module.exports = {
  setupFilesAfterEnv: ["jalexa/dist/matchers"],
  ...
};
```

## Testing

To test your skill, you'll just need the skill id:

```typescript
import { AlexaSkill, RequestTypes } from "jalexa";

describe("Basic skill test", () => {
  test("Can start conversation", async () => {
    const skill = new AlexaSkill({
      skillId: "amzn1.ask.skill.YOUR_SKILL_ID",
    });

    const response = await skill.speak("open my skill");

    expect(response).toBeSuccessful();
    expect(response).toBeRequestType(RequestTypes.LaunchRequest);
  });
});
```
