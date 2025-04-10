//import { useState } from 'react';
import {
  EmbeddedScene,
  SceneFlexLayout,
  SceneFlexItem,
  //  PanelBuilders,
  SceneQueryRunner,
  SceneTimeRange,
//  SceneTimePicker,
  //  SceneTimeRangeCompare,
//  SceneRefreshPicker,
  VizPanelBuilder,
} from '@grafana/scenes';
import getBuilder from '../services/builder'
import { Controls } from './controls';
//import performQuery from '../utils/query'
//import { lastValueFrom } from 'rxjs';

function AdvancedScene(queryText: string, selectedDataSource: string /*, selectedGraph: string */) {
  //const [_, setSelectedGraph] = useState<string>('')
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

  const queryRunners = queries.map((query): { queryRunner: SceneQueryRunner; selectedBuilder: VizPanelBuilder<any, any>; title: string; graph: string; } => ({
    queryRunner: new SceneQueryRunner({
      //runQueriesMode: 'manual',
      //liveStreaming: true,
      datasource: {
        type: 'prometheus',
        uid: selectedDataSource,
      },
      // TODO: generate query from LLM
      queries: [
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
    graph: query.graph,
  }));

  //performQuery('rate(prometheus_http_requests_total{handler=~"/metrics"}[5m])', selectedDataSource)
  //let result = queryRunner.getResultsStream()
  //console.log(lastValueFrom(result))

  const scene = new EmbeddedScene({
    //controls: [new SceneTimePicker({}) /*, new SceneTimeRangeCompare({})*/, new SceneRefreshPicker({ refresh: '5s' })],
    body: new SceneFlexLayout({
      direction: 'row',
      children: queryRunners.map(({ queryRunner, selectedBuilder, title, graph }) => {
        selectedBuilder.setTitle(title)
        let sceneItem = new SceneFlexItem({
          $timeRange: new SceneTimeRange({ from: 'now-30m', to: 'now' }),
          $data: queryRunner,
          width: '100%',
          height: '100%',
          body: selectedBuilder.build(),
        })
        //selectedBuilder.setHeaderActions()
        let newLayout: SceneFlexLayout = new SceneFlexLayout({
          direction: 'column',
          children: [
            new Controls({query: queryRunner, title: title, graph: graph, sceneItem: sceneItem}),
            sceneItem
          ]
        })

        return newLayout
      })
    })
  });

  return scene;
}

export default AdvancedScene
