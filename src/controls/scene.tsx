import {
  EmbeddedScene,
  SceneFlexLayout,
  SceneFlexItem,
  SceneTimeRange,
} from '@grafana/scenes';
import { Controls } from './controls';
import getRunners from 'services/runner';

function AdvancedScene(queryText: string, selectedDataSource: string /*, selectedGraph: string */) {
  let queryRunners = getRunners(queryText, selectedDataSource)

  const scene = new EmbeddedScene({
    //controls: [new SceneTimePicker({}) /*, new SceneTimeRangeCompare({})*/, new SceneRefreshPicker({ refresh: '5s' })],
    body: new SceneFlexLayout({
      direction: 'row',
      children: queryRunners.map(({ queryRunner, selectedBuilder, title, graph, query }) => {
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
            new Controls({data: selectedDataSource, graph: graph, query: query, title: title, sceneItem: sceneItem}),
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
