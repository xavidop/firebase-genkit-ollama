import {genkit, z } from "genkit";
import {ollama} from "genkitx-ollama";
import { logger } from 'genkit/logging';
import { onCallGenkit } from "firebase-functions/https";

const ai = genkit({
  plugins: [
    ollama({
      models: [{ name: 'gemma3n:e4b' }],
      serverAddress: 'http://127.0.0.1:11434', // default ollama local address
    }),
  ]
});
logger.setLogLevel('debug');

export const translatorFlow = ai.defineFlow(
  {
    name: "translatorFlow",
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.string(),
  },
  async (toTranslate) => {
    const prompt =
      `Translate this ${toTranslate.text} to Spanish. Autodetect the language.`;

    const llmResponse = await ai.generate({
      model: 'ollama/gemma3n:e4b',
      prompt: prompt,
      config: {
        temperature: 1,
      },
    });

    return llmResponse.text;
  }
);

export const translatedFunction = onCallGenkit({
  authPolicy: () => true, // Allow all users to call this function. Not recommended for production.
}, translatorFlow);