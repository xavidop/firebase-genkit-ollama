import {generate} from "@genkit-ai/ai";
import {configureGenkit} from "@genkit-ai/core";
import {onFlow, noAuth} from "@genkit-ai/firebase/functions";

import * as z from "zod";
import {firebase} from "@genkit-ai/firebase";
import {ollama} from "genkitx-ollama";

configureGenkit({
  plugins: [
    firebase(),
    ollama({
      models: [{ name: 'gemma' }],
      serverAddress: 'http://127.0.0.1:11434', // default ollama local address
    }),
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

export const translatorFlow = onFlow(
  {
    name: "translatorFlow",
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.string(),
    authPolicy: noAuth(), // Not requiring authentication, but you can change this. It is highly recommended to require authentication for production use cases.
  },
  async (toTranslate) => {
    const prompt =
      `Translate this ${toTranslate.text} to Spanish. Autodetect the language.`;

    const llmResponse = await generate({
      model: 'ollama/gemma',
      prompt: prompt,
      config: {
        temperature: 1,
      },
    });

    return llmResponse.text();
  }
);

