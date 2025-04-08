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
  const [messagesFinal, setMessagesFinal] = useState<React.JSX.Element[]>([])
  const [selectedDataSource, setSelectedDataSource] = useState<string | undefined>(undefined);

  const handleSend = () => {
    sendMessage(input, setMessages, setInput, s)
  }

  const handleKeyPress = async (e: any) => {
    if (e.key === 'Enter') {
      await sendMessage(input, setMessages, setInput, s);
    }
  };

  // TODO: pass in data sources from state and make them configurable
  useEffect(() => {
    setMessagesFinal(prev => generateMessages(messages, s, selectedDataSource, setSelectedDataSource))
  }, [selectedDataSource, messages, s])

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
