import { uids } from "./graph";
import { promptModel } from "./openai";

const knownFunctions: { [key: string]: string; } = {
  'queryResults': 'query data available from data sources directly',
  'generateGraph': 'generate a single graph or an entire dashboard from various metrics',
  'generalChitChat': 'general inquiry into this grafana system',
  'displayDashboard': 'display and existing dashboard or information from it'
}

export const FUNCTIONAL_PROMPT = Object.keys(knownFunctions).map(functionName => functionName + ' - ' + knownFunctions[functionName]).join('\n')

export async function functionQuery(input: string): Promise<string[]> {
  let response = await promptModel(
    '\nAvailable graph types:\n' +
    uids.join('\n') +
    '\nList of known basic functions:\n' +
    FUNCTIONAL_PROMPT +
    '\nDetermine the most relevant function to the following prompt:\n' +
    input.trim() +
    '\nSpecify only the most fitting function name, no further explaination necessary.'
  )

  return Object.keys(knownFunctions).filter(key => response.includes(key))
}

