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

  let sqrt = Math.sqrt(queryRunners.length)
  let rows = 1
  let cols = 3
  if(sqrt >= 2) {
    rows = Math.ceil(sqrt)
    cols = Math.ceil(sqrt)
  }

  let rowLayouts = []
  let queryCount = 0
  for(let i = 0; i < rows; i++) {
    let columns = []
    for(let j = 0; j < cols; j++) {
      if(!queryRunners[queryCount]) {
        break
      }

      let { queryRunner, selectedBuilder, title, graph, query } = queryRunners[queryCount]
      selectedBuilder.setTitle(title)
      let sceneItem = new SceneFlexItem({
        $timeRange: new SceneTimeRange({ from: 'now-30m', to: 'now' }),
        $data: queryRunner,
        width: '100%',
        height: '100%',
        minHeight: '200px',
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
      columns.push(newLayout)
      queryCount++
    }

    rowLayouts.push(new SceneFlexLayout({
      direction: 'row',
      children: columns
    }))
  }


  const scene = new EmbeddedScene({
    //controls: [new SceneTimePicker({}) /*, new SceneTimeRangeCompare({})*/, new SceneRefreshPicker({ refresh: '5s' })],
    body: new SceneFlexLayout({
      direction: 'column',
      children: rowLayouts
    })
  });

  return scene;
}

export default AdvancedScene
