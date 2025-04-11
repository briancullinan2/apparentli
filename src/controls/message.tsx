import React, { useState } from 'react';
import DataSourcePicker from './data';
import { UrlSyncContextProvider } from '@grafana/scenes';
import AdvancedScene from './scene';
import getRunners from 'services/runner';

function generateMessage(
  message: React.JSX.Element,
  index: number,
  setSelectedDataSource: ((text: string) => void),
  //  dataRef: MutableRefObject<React.JSX.Element>,
  //  setDataRef: ((ref: MutableRefObject<React.JSX.Element>) => void),
  plainText: string,
  selectedDataSource: string,
  MessageStyles: { mine: string, theirs: string, scene: string, query: string },
  editing: boolean,
  setEditing: (edit: boolean) => void,
  messageJson: any,
  setMessagesJson: ((obj: any) => void) | undefined,
): React.JSX.Element[] {
  const newMessages: React.JSX.Element[] = []

  if (message.props.className === MessageStyles.mine) {
    newMessages.push(message)
  } else if (message.props.className === MessageStyles.theirs) {
    newMessages.push(message)
    if(!plainText.includes('graph') && !plainText.includes('type')) {
      return newMessages
    }
    let queries = getRunners(messageJson ? JSON.stringify(messageJson) : plainText, selectedDataSource)
    let scene = AdvancedScene(queries, selectedDataSource, editing, (i: number, query: any) => {
      queries[i] = query
    })
    let toggleEditing = () => setEditing(true)
    let toggleSave = () => {
      if(setMessagesJson) {
        setMessagesJson(queries.map(({query, title, graph}) => ({query, title, graph})))
      }
      setEditing(false)
    }
    newMessages.push((
      <div key={index} className={MessageStyles.scene}>
        <div>
          <label className={MessageStyles.query}>Data source</label>
          <DataSourcePicker onSelect={setSelectedDataSource} />
          <button hidden={editing} onClick={toggleEditing} className={MessageStyles.query}>Edit</button>
          <button hidden={!editing} onClick={toggleSave} className={MessageStyles.query}>Save</button>
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
  messagesJson: any[]
  setMessagesJson?: (next: any) => void
  styles: { mine: string, theirs: string, scene: string, query: string }
}

function MessagesClass({ messages, messagesPlain, messagesJson, setMessagesJson, styles }: MessagesProps) {
  let newMessages: React.JSX.Element[] = []
  const [selectedDataSource, setSelectedDataSource] = useState<string[]>([]);
  const [editing, setEditing] = useState<boolean[]>([]);
  for (let i = 0; i < messages.length; i++) {
    let result = generateMessage(messages[i], i,
      ((i: number, value: string) => setSelectedDataSource(prev => {
        prev[i] = value
        return Array.from(prev)
      })).bind(null, i), messagesPlain[i], selectedDataSource[i], styles, editing[i],
      ((i: number, value: boolean) => setEditing(prev => {
        prev[i] = value
        return Array.from(prev)
      })).bind(null, i),
      messagesJson[i], setMessagesJson ? ((i: number, value: any) => setMessagesJson((prev: any[]) => {
        prev[i] = value
        return Array.from(prev)
      })).bind(null, i) : undefined
    )
    newMessages.push(...result)
  }
  return (<div>{newMessages}</div>)
}

let Messages: React.FC<MessagesProps> = MessagesClass

export default Messages
