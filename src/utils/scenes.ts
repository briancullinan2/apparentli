//import { useState } from 'react';
import {
  EmbeddedScene,
  SceneFlexLayout,
  SceneFlexItem,
  //  PanelBuilders,
  SceneQueryRunner,
  SceneTimeRange,
  SceneTimePicker,
  //  SceneTimeRangeCompare,
  SceneRefreshPicker,
  VizPanelBuilder,
} from '@grafana/scenes';
import getBuilder from '../utils/builder'
//import performQuery from '../utils/query'
//import { lastValueFrom } from 'rxjs';

export function AdvancedScene(queryText: string, selectedDataSource: string, selectedGraph: string) {
  //const [selectedDataSource, _] = useState<string | undefined>(undefined);

  let queries = [{ query: queryText, graph: '', title: '' }]
  try {
    queries = JSON.parse(queryText)
  } catch (e) { }

  //let selectedBuilder = getBuilder(selectedGraph)


  /*selectedBuilder.setOption('legend', {
    displayMode: 'list', // or 'table', 'hidden'
    placement: 'bottom', // or 'right'
  })*/

  const queryRunners = queries.map((query): { queryRunner: SceneQueryRunner; selectedBuilder: VizPanelBuilder<any, any>; title: string; } => ({
    queryRunner: new SceneQueryRunner({
      datasource: {
        type: 'prometheus',
        uid: selectedDataSource,
      },
      // TODO: generate query from LLM
      queries: [
        {
          //  format: 'table',
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
    title: query.title
  }));

  //performQuery('rate(prometheus_http_requests_total{handler=~"/metrics"}[5m])', selectedDataSource)
  //let result = queryRunner.getResultsStream()

  //console.log(lastValueFrom(result))

  const scene = new EmbeddedScene({
    controls: [new SceneTimePicker({}) /*, new SceneTimeRangeCompare({})*/, new SceneRefreshPicker({ refresh: '5s' })],
    body: new SceneFlexLayout({
      direction: 'row',
      children: queryRunners.map(({queryRunner, selectedBuilder, title}) => {
        selectedBuilder.setTitle(title)
        return new SceneFlexItem({
          $data: queryRunner,
          $timeRange: new SceneTimeRange({ from: 'now-5h', to: 'now' }),
          width: '100%',
          height: '100%',
          body: selectedBuilder.build(),
        })
      })
    })
  });

  return scene;
}
