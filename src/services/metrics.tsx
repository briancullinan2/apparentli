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

  let relevantMetrics = []
  let BATCH_COUNT = 500
  for (let i = 0; i < Math.ceil(metricNames.length / BATCH_COUNT); i++) {
    const matchedMetrics = await promptModel(
      'Are any of the following metrics related to the prompt:\n' +
      metricNames.slice(i * BATCH_COUNT, i * BATCH_COUNT + BATCH_COUNT).join('\n') +
      '\nList only a few related metrics, no explaination needed:\n' +
      input.trim() + 
      '\nOnly list a few metrics, we\'ll generate a dashboard in another step.'
    )

    relevantMetrics.push(...metricNames.filter((name: string) => matchedMetrics.includes(name)))
  }
  console.log(relevantMetrics)
  return relevantMetrics
}
