import React, { useEffect, useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2, PageLayoutType } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { UrlSyncContextProvider } from '@grafana/scenes';
import { AdvancedTimeRangeComparisonScene } from '../utils/scenes';
import DataSourcePicker from '../utils/data';

function PageFour() {
  const s = useStyles2(getStyles);
  const [username] = useState('');
  const [input, setInput] = useState('');
  //const [responseHtml, setResponseHtml] = useState('');
  const [messages, setMessages] = useState<React.JSX.Element[]>([])
  const [messagesFinal, setMessagesFinal] = useState<React.JSX.Element[]>([])
  const [selectedDataSource, setSelectedDataSource] = useState<string | undefined>(undefined);

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    const message = {
      user: username,
      text: input.trim(),
      time: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, (<div className={s.mine} key={prev.length}>{message.text}</div>)]);
    setInput('');

    try {
      const res = await fetch('/api/plugins/briancullinan-mycomputer-app/resources/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!res.ok) {
        console.error('Failed to send message:', await res.text());
        return
      }

      let responseHTML = await res.text()
      setMessages(prev => [...prev, (<div className={s.theirs} key={prev.length} dangerouslySetInnerHTML={{ __html: responseHTML }}></div>)])
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleKeyPress = async (e: any) => {
    if (e.key === 'Enter') {
      await sendMessage();
    }
  };

  // TODO: pass in data sources from state and make them configurable
  const scene = useMemo(() => AdvancedTimeRangeComparisonScene(selectedDataSource), [selectedDataSource]); // second param is dependencies
  useEffect(() => {
    setMessagesFinal(prev => {
      const newMessages: React.JSX.Element[] = []

      for(let i = 0; i < messages.length; i++) {
        if(messages[i].props.className === s.mine) {
          newMessages.push(messages[i])
        } else if (messages[i].props.className === s.theirs) {
          newMessages.push(messages[i])
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
    })
  }, [selectedDataSource, messages, s, scene])

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
            <button onClick={sendMessage} className={s.button}>Send</button>
          </div>
        </div>
      </div>
    </PluginPage>
  );
}

export default PageFour;

const getStyles = (theme: GrafanaTheme2) => ({
  page: css`
    padding: ${theme.spacing(3)};
    background-color: ${theme.colors.background.secondary};
    display: flex;
    justify-content: center;
    height: 100%;
    flex-direction: column;
    margin-bottom: 72px;
  `,
  container: css`
    width: 100%;
    max-width: 100%;
    min-height: 500px;
    height: 100%;
    flex: 100%;
  `,
  content: css`
    margin-top: ${theme.spacing(6)};
  `,
  footer: css`
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-top: 1px solid #ccc;
    position: fixed;
    bottom: 0;
    background: rgb(34, 37, 43);
    left: 300px;
    right: 0;
  `,
  inputs: css`
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  `,
  input: css`
    flex: 1;
    padding: 8px;
    font-size: 14px;
  `,
  button: css`
    padding: 8px 16px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `,
  scene: css`
    flex: 50%;
    min-height: 300px;
    display: flex;
    flex-direction: column;
  `,
  query: css`
    background: rgb(24, 27, 31);
    display: inline-block;
    box-align: center;
    align-items: center;
    padding: 0px 8px;
    font-weight: 500;
    font-size: 0.857143rem;
    height: 32px;
    line-height: 32px;
    border-radius: 2px;
    border: 1px solid rgba(204, 204, 220, 0.2);
    position: relative;
    right: -1px;
    white-space: nowrap;
    gap: 4px;
  `,
  mine: css`
    z-index: 1;
  `,
  theirs: css`
    z-index: 2;
  `
});
