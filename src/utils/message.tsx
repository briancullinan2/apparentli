import React from 'react';
import DataSourcePicker from './data';
import { EmbeddedScene, UrlSyncContextProvider } from '@grafana/scenes';

function generateMessages (
  message: React.JSX.Element, 
  index: number,
  s: { mine: any; theirs: any; scene: string | undefined; query: string | undefined; },
  setSelectedDataSource: ((text: string) => void),
//  dataRef: MutableRefObject<React.JSX.Element>,
//  setDataRef: ((ref: MutableRefObject<React.JSX.Element>) => void),
  scene: EmbeddedScene,
): React.JSX.Element[] {
  const newMessages: React.JSX.Element[] = []

  if(message.props.className === s.mine) {
    newMessages.push(message)
  } else if (message.props.className === s.theirs) {
    newMessages.push(message)
    newMessages.push((
      <div key={index} className={s.scene}>
        <div>
          <label className={s.query}>query0</label>
          <DataSourcePicker onSelect={setSelectedDataSource} />
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
