import { SceneQueryRunner, VizPanelBuilder } from "@grafana/scenes";
import getBuilder from "./builder";

export type QueryScene = {
  queryRunner: SceneQueryRunner
  selectedBuilder: VizPanelBuilder<any, any>
  title: string
  graph: string
  query: string
}

// TODO: delete this in favor of matching dashboard service "panels: []" array

function getRunners(queryText: string, selectedDataSource?: string): QueryScene[] {

  let queries = [{ query: queryText, graph: '', title: '' }]
  try {
    queries = JSON.parse(queryText)
  } catch (e) { }

  //let selectedBuilder = getBuilder(selectedGraph)
  if(typeof (queries as any).graph !== 'undefined') {
    queries = [{ query: '', graph: '', title: '', ...queries }]
  }

  /*selectedBuilder.setOption('legend', {
    displayMode: 'list', // or 'table', 'hidden'
    placement: 'bottom', // or 'right'
  })*/
  const queryRunners = queries.map((query: any) => ({
    queryRunner: new SceneQueryRunner({
      //runQueriesMode: 'manual',
      //liveStreaming: true,
      datasource: query.datasource ? {...query.datasource, uid: selectedDataSource} : {
        type: 'prometheus',
        uid: selectedDataSource,
      },
      // TODO: generate query from LLM
      queries: query.targets ? query.targets.map((query: any) => {
        delete query.datasource
        return query
      }) : [
        {
          format: query.graph === 'table' || query.graph === 'logs' ? 'table' : (query.graph === 'heatmap' ? 'heatmap' : 'time_series'),
          refId: 'A',
          //  expr: '{__name__=~"agent_.+"}' 
          expr: query.query,
          /*
          "stringInput": "",
          "scenarioId": "streaming_client",
          "stream": {
            "noise": 10,
            "speed": 100,
            "spread": 20,
            "type": "signal"
          }
            */
        },
      ]
    }),
    selectedBuilder: getBuilder(query.graph),
    title: query.title,
    graph: query.type || query.graph,
    query: query.targets ? query.targets[0].expr : query.query,
  }));

  return queryRunners
}

export default getRunners
