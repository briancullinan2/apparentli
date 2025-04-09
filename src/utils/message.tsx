import React from 'react';
import DataSourcePicker from './data';
import VisualizationPicker from './graph';
import { EmbeddedScene, UrlSyncContextProvider } from '@grafana/scenes';
import { AdvancedScene } from '../utils/scenes';

function generateMessages(
  message: React.JSX.Element, 
  index: number,
  s: { mine: any; theirs: any; scene: string | undefined; query: string | undefined; },
  selectedDataSource: string,
  setSelectedDataSource: ((text: string) => void),
  selectedGraph: string,
  setSelectedGraph: ((text: string) => void),
  plainText: string,
//  dataRef: MutableRefObject<React.JSX.Element>,
//  setDataRef: ((ref: MutableRefObject<React.JSX.Element>) => void),
): React.JSX.Element[] {
  const newMessages: React.JSX.Element[] = []

  if(message.props.className === s.mine) {
    newMessages.push(message)
  } else if (message.props.className === s.theirs) {
    newMessages.push(message)
    let scene: EmbeddedScene = AdvancedScene(plainText, selectedDataSource, selectedGraph)
    newMessages.push((
      <div key={index} className={s.scene}>
        <div>
          <label className={s.query}>query0</label>
          <DataSourcePicker onSelect={setSelectedDataSource} />
          <label className={s.query}>Visualization</label>
          <VisualizationPicker onSelect={setSelectedGraph} />
        </div>
        <UrlSyncContextProvider scene={scene} updateUrlOnInit={true} createBrowserHistorySteps={true} >
          <scene.Component model={scene} />
        </UrlSyncContextProvider>
      </div>
    ))
  } else if (message.props.className === s.scene) {
    
  }

  return newMessages
}

export default generateMessages
