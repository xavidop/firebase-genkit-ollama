import {genkit, z } from "genkit";
import {onFlow, noAuth} from "@genkit-ai/firebase/functions";
import {ollama} from "genkitx-ollama";
import { logger } from 'genkit/logging';

const ai = genkit({
  plugins: [
    ollama({
      models: [{ name: 'gemma' }],
      serverAddress: 'http://127.0.0.1:11434', // default ollama local address
    }),
  ]
});
logger.setLogLevel('debug');

export const translatorFlow = onFlow(
  ai,
  {
    name: "translatorFlow",
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.string(),
    authPolicy: noAuth(), // Not requiring authentication, but you can change this. It is highly recommended to require authentication for production use cases.
  },
  async (toTranslate) => {
    const prompt =
      `Translate this ${toTranslate.text} to Spanish. Autodetect the language.`;

    const llmResponse = await ai.generate({
      model: 'ollama/gemma',
      prompt: prompt,
      config: {
        temperature: 1,
      },
    });

    return llmResponse.text;
  }
);

