import React, { useEffect, useState } from 'react';
import { PageLayoutType } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import messageStyles from '../styles'
import generateMessages from '../utils/message'
import sendMessage from '../utils/send'
import AdvancedScene from '../utils/scenes';

function Chat() {
  const s = useStyles2(messageStyles);
  const [input, setInput] = useState('');
  //const [responseHtml, setResponseHtml] = useState('');
  const [messages, setMessages] = useState<React.JSX.Element[]>([
    <div className={s.theirs} key={0} dangerouslySetInnerHTML={{ __html: '[ {"graph": "stat", "query": "up", "title": "Target Status"}, {"graph": "time", "query": "rate(prometheus_http_requests_total[5m])", "title": "Prometheus HTTP Request Rate"}, {"graph": "time", "query": "scrape_duration_seconds", "title": "Scrape Duration"} ]' }}></div>
  ])
  const [messagesPlain, setMessagesPlain] = useState<string[]>([
    '[ {"graph": "stat", "query": "up", "title": "Target Status"}, {"graph": "time", "query": "rate(prometheus_http_requests_total[5m])", "title": "Prometheus HTTP Request Rate"}, {"graph": "time", "query": "scrape_duration_seconds", "title": "Scrape Duration"} ]'
  ])
  const [_, setMessagesJson] = useState<any[]>([])
  const [messagesFinal, setMessagesFinal] = useState<React.JSX.Element[]>([])
  const [selectedDataSource, setSelectedDataSource] = useState<string[]>([]);
  //const [selectedGraph, setSelectedGraph] = useState<string[]>([]);
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
        let scene = AdvancedScene(messagesPlain[i], selectedDataSource[i] /*, selectedGraph[i]*/)
        let result = generateMessages(messages[i], i, s, ((i: number, value: string) => setSelectedDataSource(prev => {
          prev[i] = value
          return Array.from(prev)
        })).bind(null, i), scene)
        newMessages.push(...result)
      }
      return newMessages
    })
  }, [selectedDataSource, messagesPlain, messages, s])

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

export default Chat;
