//import { useState } from 'react';
import {
  EmbeddedScene,
  SceneFlexLayout,
  SceneFlexItem,
  PanelBuilders,
  SceneQueryRunner,
  SceneTimeRange,
  SceneTimePicker,
//  SceneTimeRangeCompare,
  SceneRefreshPicker,
} from '@grafana/scenes';

export function AdvancedTimeRangeComparisonScene(selectedDataSource?: string) {
  //const [selectedDataSource, _] = useState<string | undefined>(undefined);

  const queryRunner = new SceneQueryRunner({
    datasource: {
      type: 'prometheus',
      uid: selectedDataSource,
    },
    queries: [
      {
        refId: 'A',
        expr: 'rate(prometheus_http_requests_total{handler=~"/metrics"}[5m])',
      },
    ],
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
          body: PanelBuilders.timeseries().setTitle('Panel using global time range').build(),
        }),
      ],
    }),
  });

  return scene;
}
