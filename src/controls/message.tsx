import React, { useState } from 'react';
import DataSourcePicker from './data';
import { UrlSyncContextProvider } from '@grafana/scenes';
import AdvancedScene from './scene';

function generateMessage(
  message: React.JSX.Element,
  index: number,
  setSelectedDataSource: ((text: string) => void),
  //  dataRef: MutableRefObject<React.JSX.Element>,
  //  setDataRef: ((ref: MutableRefObject<React.JSX.Element>) => void),
  plainText: string,
  selectedDataSource: string,
  MessageStyles: {mine: string, theirs: string, scene: string, query: string}
): React.JSX.Element[] {
  const newMessages: React.JSX.Element[] = []

  if (message.props.className === MessageStyles.mine) {
    newMessages.push(message)
  } else if (message.props.className === MessageStyles.theirs) {
    newMessages.push(message)
    let scene = AdvancedScene(plainText, selectedDataSource)

    newMessages.push((
      <div key={index} className={MessageStyles.scene}>
        <div>
          <label className={MessageStyles.query}>Data source</label>
          <DataSourcePicker onSelect={setSelectedDataSource} />
        </div>
        <UrlSyncContextProvider scene={scene} updateUrlOnInit={true} createBrowserHistorySteps={true} >
          <scene.Component model={scene} />
        </UrlSyncContextProvider>
      </div>
    ))
  } else if (message.props.className === MessageStyles.scene) {

  }

  return newMessages
}

type MessagesProps = {
  messages: React.JSX.Element[]
  messagesPlain: string[]
  styles: {mine: string, theirs: string, scene: string, query: string}
}

function MessagesClass({ messages, messagesPlain, styles }: MessagesProps) {
  let newMessages: React.JSX.Element[] = []
  const [selectedDataSource, setSelectedDataSource] = useState<string[]>([]);
  for (let i = 0; i < messages.length; i++) {
    let result = generateMessage(messages[i], i, ((i: number, value: string) => setSelectedDataSource(prev => {
      prev[i] = value
      return Array.from(prev)
    })).bind(null, i), messagesPlain[i], selectedDataSource[i], styles)
    newMessages.push(...result)
  }
  return (<div>{newMessages}</div>)
}

let Messages: React.FC<MessagesProps> = MessagesClass

export default Messages
