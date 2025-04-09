//import { useState } from 'react';
import React from 'react';
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
import getBuilder from './builder'
import { useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import VisualizationPicker from './graph';
//import performQuery from '../utils/query'
//import { lastValueFrom } from 'rxjs';

function AdvancedScene(queryText: string, selectedDataSource: string /*, selectedGraph: string */) {
  //const [_, setSelectedGraph] = useState<string>('')
  //const [selectedDataSource, _] = useState<string | undefined>(undefined);
  const s = useStyles2((theme: GrafanaTheme2) => ({
    query: css`
      background: rgb(24, 27, 31);
      display: inline-block;
      box-align: center;
      align-items: center;
      padding: 0px 8px;
      font-weight: 500;
      font-size: 0.857143rem;
      height: 32px;
      line-height: 32px;
      border-radius: 2px;
      border: 1px solid rgba(204, 204, 220, 0.2);
      position: relative;
      right: -1px;
      white-space: nowrap;
      gap: 4px;
    `
  }));

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
    title: query.title
  }));

  //performQuery('rate(prometheus_http_requests_total{handler=~"/metrics"}[5m])', selectedDataSource)
  //let result = queryRunner.getResultsStream()
  //console.log(lastValueFrom(result))

  const scene = new EmbeddedScene({
    controls: [new SceneTimePicker({}) /*, new SceneTimeRangeCompare({})*/, new SceneRefreshPicker({ refresh: '5s' })],
    body: new SceneFlexLayout({
      direction: 'row',
      children: queryRunners.map(({ queryRunner, selectedBuilder, title }) => {
        selectedBuilder.setTitle(title)
        selectedBuilder.setHeaderActions(<div>
          <label className={s.query}>Visualization</label>
          <VisualizationPicker />
        </div>)
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

export default AdvancedScene
