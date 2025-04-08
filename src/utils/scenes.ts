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

export function AdvancedScene(selectedDataSource: string, selectedGraph: string) {
  //const [selectedDataSource, _] = useState<string | undefined>(undefined);

  let selectedBuilder
  switch(selectedGraph) {
    case 'bar':
      selectedBuilder = PanelBuilders.barchart()
      break;
    case 'barguage':
      selectedBuilder = PanelBuilders.bargauge()
      break;
    case 'grid':
      selectedBuilder = PanelBuilders.datagrid()
      break;
    case 'flame':
      selectedBuilder = PanelBuilders.flamegraph()
      break;
    case 'guage':
      selectedBuilder = PanelBuilders.gauge()
      break;
    case 'geomap':
      selectedBuilder = PanelBuilders.geomap()
      break;
    case 'heat':
      selectedBuilder = PanelBuilders.heatmap()
      break;
    case 'histogram':
      selectedBuilder = PanelBuilders.histogram()
      break;
    case 'logs':
      selectedBuilder = PanelBuilders.logs()
      break;
    case 'news':
      selectedBuilder = PanelBuilders.news()
      break;
    case 'node':
      selectedBuilder = PanelBuilders.nodegraph()
      break;
    case 'pie':
      selectedBuilder = PanelBuilders.piechart()
      break;
    case 'stat':
      selectedBuilder = PanelBuilders.stat()
      break;
    case 'state':
      selectedBuilder = PanelBuilders.statetimeline()
      break;
    case 'status':
      selectedBuilder = PanelBuilders.statushistory()
      break;
    case 'table':
      selectedBuilder = PanelBuilders.table()
      break;
    case 'text':
      selectedBuilder = PanelBuilders.text()
      break;
    case 'time':
      selectedBuilder = PanelBuilders.timeseries()
      break;
    case 'trend':
      selectedBuilder = PanelBuilders.trend()
      break;
    case 'traces':
      selectedBuilder = PanelBuilders.traces()
      break;
    case 'xy':
      selectedBuilder = PanelBuilders.xychart()
      break;
    default:
      selectedBuilder = PanelBuilders.timeseries()
  }

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
          body: selectedBuilder.setTitle('Panel using global time range').build(),
        }),
      ],
    }),
  });

  return scene;
}
