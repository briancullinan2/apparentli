import React, { useEffect, useState } from 'react';
import { PageLayoutType } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import messageStyles from '../styles'
import generateMessages from '../utils/message'
import sendMessage from '../utils/send'

function PageFour() {
  const s = useStyles2(messageStyles);
  const [input, setInput] = useState('');
  //const [responseHtml, setResponseHtml] = useState('');
  const [messages, setMessages] = useState<React.JSX.Element[]>([])
  const [messagesPlain, setMessagesPlain] = useState<string[]>([])
  const [_, setMessagesJson] = useState<any[]>([])
  const [messagesFinal, setMessagesFinal] = useState<React.JSX.Element[]>([])
  const [selectedDataSource, setSelectedDataSource] = useState<string[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<string[]>([]);
  //const [dataRefs, setDataRef] = useState<MutableRefObject<React.JSX.Element>[]>([]);

  const handleSend = () => {
    sendMessage(input, setMessages, setMessagesPlain, setMessagesJson, setInput, s)
  }

  const handleKeyPress = async (e: any) => {
    if (e.key === 'Enter') {
      await sendMessage(input, setMessages, setMessagesPlain, setMessagesJson, setInput, s);
    }
  };

  // TODO: pass in data sources from state and make them configurable
  useEffect(() => { // useMemo(() => 
    setMessagesFinal(prev => {
      let newMessages: React.JSX.Element[] = []
      for (let i = 0; i < messages.length; i++) {
        let result = generateMessages(messages[i], i, s, selectedDataSource[i] ? selectedDataSource[i] : '', ((i: number, value: string) => setSelectedDataSource(prev => {
          prev[i] = value
          return Array.from(prev)
        })).bind(null, i), selectedGraph[i] ? selectedGraph[i] : '', ((i: number, value: string) => setSelectedGraph(prev => {
          prev[i] = value
          return Array.from(prev)
        })).bind(null, i), messagesPlain[i])
        newMessages.push(...result)
      }
      return newMessages
    })
  }, [selectedDataSource, selectedGraph, messagesPlain, messages, s])

  return (
    <PluginPage layout={PageLayoutType.Canvas}>
      <div className={s.page} data-testid={testIds.pageFour.container}>
        <div className={s.container}>{messagesFinal}</div>
        <div className={s.footer}>
          <div className={s.inputs}>
            <input
              className={s.input}
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSend} className={s.button}>Send</button>
          </div>
        </div>
      </div>
    </PluginPage>
  );
}

export default PageFour;
