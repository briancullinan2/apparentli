import { openai } from '@grafana/llm';

export async function promptModel(input: string): Promise<string> {
  //await openai.enabled()
  const stream = openai
    .chatCompletions({
      // model: openai.Model.LARGE, // defaults to BASE, use larger model for longer context and complex tasks
      messages: [
        { role: 'system', content: 'You are a helpful assistant with deep knowledge of the Grafana, Prometheus and general observability ecosystem.' },
        {
          role: 'user', content: input.trim()
        },
      ],
    })

  // Subscribe to the stream and update the state for each returned value.
  let responseObject = (await stream).object;

  // TODO: return unwrapped json?

  return responseObject as string

}
