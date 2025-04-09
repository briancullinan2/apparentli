import React, { useEffect, useMemo, useState } from 'react';
import { PageLayoutType } from '@grafana/data';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import chatStyles from '../styles/chat'
import sendMessage from '../utils/send'
import Messages from '../utils/message';
import messageStyles from '../styles/message'
import { useStyles2 } from '@grafana/ui';

function Chat() {
  const MessageStyles = useStyles2(messageStyles)
  const ChatStyles = useStyles2(chatStyles)
  const [input, setInput] = useState('');
  //const [responseHtml, setResponseHtml] = useState('');
  const [messages, setMessages] = useState<React.JSX.Element[]>([
    <div className={MessageStyles.theirs} key={0} dangerouslySetInnerHTML={{ __html: '[ {"graph": "stat", "query": "up", "title": "Target Status"}, {"graph": "time", "query": "rate(prometheus_http_requests_total[5m])", "title": "Prometheus HTTP Request Rate"}, {"graph": "time", "query": "scrape_duration_seconds", "title": "Scrape Duration"} ]' }}></div>
  ])
  const [messagesPlain, setMessagesPlain] = useState<string[]>([
    '[ {"graph": "stat", "query": "up", "title": "Target Status"}, {"graph": "time", "query": "rate(prometheus_http_requests_total[5m])", "title": "Prometheus HTTP Request Rate"}, {"graph": "time", "query": "scrape_duration_seconds", "title": "Scrape Duration"} ]'
  ])
  const [_, setMessagesJson] = useState<any[]>([])
  const [messagesFinal, setMessagesFinal] = useState<React.JSX.Element[]>([])
  //const [selectedGraph, setSelectedGraph] = useState<string[]>([]);
  //const [dataRefs, setDataRef] = useState<MutableRefObject<React.JSX.Element>[]>([]);

  const handleSend = () => {
    sendMessage(input, setMessages, setMessagesPlain, setMessagesJson, setInput, MessageStyles)
  }

  const handleKeyPress = async (e: any) => {
    if (e.key === 'Enter') {
      await sendMessage(input, setMessages, setMessagesPlain, setMessagesJson, setInput, MessageStyles);
    }
  };

  // TODO: pass in data sources from state and make them configurable
  useEffect(() => { // useMemo(() => 
    setMessagesFinal(messages)
  }, [messagesPlain, messages])

  return (
    <PluginPage layout={PageLayoutType.Canvas}>
      <div className={ChatStyles.page} data-testid={testIds.pageFour.container}>
        <div className={ChatStyles.container}>
          {useMemo(() => (
            <Messages styles={MessageStyles} messages={messagesFinal} messagesPlain={messagesPlain} />
          ), [messagesFinal, MessageStyles, messagesPlain])}
        </div>
        <div className={ChatStyles.footer}>
          <div className={ChatStyles.inputs}>
            <input
              className={ChatStyles.input}
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSend} className={ChatStyles.button}>Send</button>
          </div>
        </div>
      </div>
    </PluginPage>
  );
}

export default Chat;
