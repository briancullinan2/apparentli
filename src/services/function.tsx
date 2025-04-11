import { uids } from "./graph";
import { promptModel } from "./openai";

const knownFunctions: { [key: string]: string; } = {
  'queryResults': 'query data available from data sources directly',
  'generateGraph': 'generate a single graph or an entire dashboard',
  'generalChitChat': 'general inquiry into this grafana system',
  'displayDashboard': 'display and existing dashboard or information from it'
}

export async function functionQuery(input: string) {
  //await openai.enabled()
  let response = await promptModel(
    '\nAvailable graph types:\n' +
    uids.join('\n') +
    // TODO: replace prometheus with the right language for other connection types
    '\nList of known basic functions:\n' +
    Object.keys(knownFunctions).map(functionName => functionName + ' - ' + knownFunctions[functionName]).join('\n') +
    '\nCreate a short list of PromQL queries that is most fitting for the following prompt:\n' +
    input.trim() +
    '\nSpecify only the most fitting function name, no further explaination necessary.'
  )

  return Object.keys(knownFunctions).filter(key => response.includes(key))[0]
}

