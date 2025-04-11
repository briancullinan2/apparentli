import { performQuery } from "./query";
import { getDataSourceSrv } from '@grafana/runtime';
import { promptModel } from "./openai";

export async function getMetrics(): Promise<string[]> {

  let sources = await getDataSourceSrv().getList()
  let prometheus = sources.filter(source => source.name === 'prometheus')

  let metrics = await performQuery('{__name__!=""}', prometheus[0].uid, 'table')
  let metricNames = metrics.map((metric: any) => metric.schema.fields[1].name).filter((a: string, i: number, arr: string[]) => arr.indexOf(a) === i)
  console.log(metricNames)
  return metricNames
}

export async function getRelevant(input: string, metricNames?: string[]) {
  if (!metricNames) {
    metricNames = await getMetrics()
  }

  // TODO: show status: "collecting metrics" because this shit takes too long

  // TODO: batch this to multiple processes?

  let relevantMetrics = []
  let batchMetrics = ''
  let batchPrompt = async () => await promptModel(
    'Are any of the following metrics related to the prompt:\n' +
    batchMetrics +
    '\nList only a few related metrics, no explaination needed:\n' +
    input.trim() +
    '\nOnly list a few metrics, we\'ll generate a dashboard in another step.'
  )
  for (let i = 0; i < metricNames.length; i++) {
    if (batchMetrics.length + metricNames[i].length + 2 > 2048) {
      const matchedMetrics = await batchPrompt()
      relevantMetrics.push(metricNames.filter((name: string) => matchedMetrics.includes(name)))
      // reset batch
      batchMetrics = ''
    }
    batchMetrics += (batchMetrics === '' ? '' : ', ') + metricNames[i]
  }
  // last batch
  if (batchMetrics.length > 0) {
    const matchedMetrics = await batchPrompt()
    relevantMetrics.push(metricNames.filter((name: string) => matchedMetrics.includes(name)))
  }

  console.log(relevantMetrics)
  return relevantMetrics.flat(1)
}
