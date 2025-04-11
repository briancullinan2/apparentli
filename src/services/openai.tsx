import { openai } from '@grafana/llm';

let first = false
export async function promptModel(input: string, retry = 0): Promise<string> {
  if(!first) {
    first = true
    let health = await openai.health()
    console.log(health)
  }

  const result = await openai
    .chatCompletions({
      // model: openai.Model.LARGE, // defaults to BASE, use larger model for longer context and complex tasks
      messages: [
        { role: 'system', content: 'You are a helpful assistant with deep knowledge of the Grafana, Prometheus and general observability ecosystem. Respond in markdown or JSON or as requested.' },
        {
          role: 'user', content: input.trim()
        },
      ],
    })

  // Subscribe to the stream and update the state for each returned value.
  let responseObject = result.object;

  if(!responseObject && retry < 5) {
    return await promptModel(input, retry++)
  }
  // TODO: return unwrapped json?

  return responseObject as string

}
