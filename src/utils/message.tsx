import React from 'react';
import DataSourcePicker from './data';
import { EmbeddedScene, UrlSyncContextProvider } from '@grafana/scenes';
import { AdvancedTimeRangeComparisonScene } from '../utils/scenes';

function generateMessages(
  messages: React.JSX.Element[], 
  s: { mine: any; theirs: any; scene: string | undefined; query: string | undefined; },
  selectedDataSource: string | undefined,
  setSelectedDataSource: ((text: string) => void)
): React.JSX.Element[] {
  const newMessages: React.JSX.Element[] = []

  for(let i = 0; i < messages.length; i++) {
    if(messages[i].props.className === s.mine) {
      newMessages.push(messages[i])
    } else if (messages[i].props.className === s.theirs) {
      newMessages.push(messages[i])
      let scene: EmbeddedScene = AdvancedTimeRangeComparisonScene(selectedDataSource)
      newMessages.push((
        <div key={messages.length} className={s.scene}>
          <div>
            <label className={s.query}>query0</label>
            <DataSourcePicker onSelect={setSelectedDataSource} />
          </div><UrlSyncContextProvider scene={scene} updateUrlOnInit={true} createBrowserHistorySteps={true} >
            <scene.Component model={scene} />
          </UrlSyncContextProvider>
        </div>
      ))
    } else if (messages[i].props.className === s.scene) {
      
    }
  }
  return newMessages
}

export default generateMessages
