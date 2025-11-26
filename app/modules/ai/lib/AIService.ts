import { OpenAIDefaults } from "../utils/OpenAIDefaults";
import OpenAIService from "./OpenAIService";

export async function createChatCompletion(data: {
  prompt: string;
  model: string;
  temperature?: number;
  role?: "user" | "assistant" | "system";
  max_tokens?: number;
  user?: string;
  stream?: boolean;
}): Promise<string[]> {
  const provider = OpenAIDefaults.getModelProvider(data.model);
  // eslint-disable-next-line no-console
  console.log("Executing createChatCompletion with provider: ", provider);
  if (provider === "OpenAI") {
    try {
      const response = await OpenAIService.createChatCompletion(data);
      // eslint-disable-next-line no-console
      console.log({ provider, response });
      return response;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log({ provider, error });
      throw new Error(error);
    }
  }
  throw new Error("Invalid provider in model: " + data.model);
}

export default {
  createChatCompletion,
};
