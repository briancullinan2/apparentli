import React, { useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2, PageLayoutType } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { UrlSyncContextProvider } from '@grafana/scenes';
import { getAdvancedTimeRangeComparisonScene } from '../utils/scenes';

function PageFour() {
  const s = useStyles2(getStyles);
  const [username] = useState('');
  const [input, setInput] = useState('');
  const [responseHtml, setResponseHtml] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    const message = {
      user: username,
      text: input.trim(),
      time: new Date().toLocaleTimeString(),
    };

    //setMessages(prev => [...prev, message]);
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

      setResponseHtml(await res.text())
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleKeyPress = async (e: any) => {
    if (e.key === 'Enter') {
      await sendMessage();
    }
  };

  const scene = useMemo(() => getAdvancedTimeRangeComparisonScene(), []);

  return (
    <PluginPage layout={PageLayoutType.Canvas}>
      <div className={s.page} data-testid={testIds.pageFour.container}>
        <div className={s.scene}>
          <UrlSyncContextProvider scene={scene} updateUrlOnInit={true} createBrowserHistorySteps={true} >
            <scene.Component model={scene} />
          </UrlSyncContextProvider>
        </div>
        <div className={s.container} dangerouslySetInnerHTML={{ __html: responseHtml }}></div>
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
  `
});
