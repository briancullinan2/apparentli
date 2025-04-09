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
} from '@grafana/scenes';
import getBuilder from '../utils/builder'

export function AdvancedScene(selectedDataSource: string, selectedGraph: string) {
  //const [selectedDataSource, _] = useState<string | undefined>(undefined);

  let selectedBuilder = getBuilder(selectedGraph)
  

  /*selectedBuilder.setOption('legend', {
    displayMode: 'list', // or 'table', 'hidden'
    placement: 'bottom', // or 'right'
  })*/

  selectedBuilder.setTitle('Panel using global time range')

  const queryRunner = new SceneQueryRunner({
    datasource: {
      type: 'prometheus',
      uid: selectedDataSource,
    },
    queries: [
      {
      //  format: 'table',
        refId: 'A',
      //  expr: '{__name__=~"agent_.+"}' 
        expr: 'rate(prometheus_http_requests_total{handler=~"/metrics"}[5m])',
      },
    ]
  });

  const scene = new EmbeddedScene({
    $data: queryRunner,
    $timeRange: new SceneTimeRange({ from: 'now-5h', to: 'now' }),
    controls: [new SceneTimePicker({}) /*, new SceneTimeRangeCompare({})*/, new SceneRefreshPicker({refresh: '5s'})],
    body: new SceneFlexLayout({
      direction: 'row',
      children: [
        new SceneFlexItem({
          width: '100%',
          height: '100%',
          body: selectedBuilder.build(),
        }),
      ],
    }),
  });

  return scene;
}
