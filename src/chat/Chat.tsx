import React, { useEffect, useMemo, useState } from 'react';
import { PageLayoutType } from '@grafana/data';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import chatStyles from '../styles/chat'
import sendMessage from '../services/send'
import Messages from '../controls/message';
import messageStyles from '../styles/message'
import { useStyles2 } from '@grafana/ui';
//import { fetchDashboardJson, fetchDashboards } from 'services/dashboard';

//let first = false
function Chat() {
  const MessageStyles = useStyles2(messageStyles)
  const ChatStyles = useStyles2(chatStyles)
  const [input, setInput] = useState('');
  //const [first, setFirst] = useState(false);
  //const [responseHtml, setResponseHtml] = useState('');
  
  const [messages, setMessages] = useState<React.JSX.Element[]>([
    //<div className={MessageStyles.theirs} key={0} dangerouslySetInnerHTML={{ __html: '[ {"graph": "stat", "query": "up", "title": "Target Status"}, {"graph": "time", "query": "rate(prometheus_http_requests_total[5m])", "title": "Prometheus HTTP Request Rate"}, {"graph": "time", "query": "scrape_duration_seconds", "title": "Scrape Duration"}, {"graph": "stat", "query": "sum(agent_inflight_requests)", "title": "Total Inflight Requests"}, {"graph": "time", "query": "rate(prometheus_http_requests_total[5m])", "title": "HTTP Request Rate"}, {"graph": "stat", "query": "sum(agent_metrics_active_configs)", "title": "Active Agent Configurations"}, {"graph": "time", "query": "avg(scrape_duration_seconds)", "title": "Scrape Duration"}, {"graph": "time", "query": "sum(go_cpu_classes_total_cpu_seconds_total)", "title": "Total CPU Usage"} ]' }}></div>
  ])
  const [messagesPlain, setMessagesPlain] = useState<string[]>([
    //'[ {"graph": "stat", "query": "up", "title": "Target Status"}, {"graph": "time", "query": "rate(prometheus_http_requests_total[5m])", "title": "Prometheus HTTP Request Rate"}, {"graph": "time", "query": "scrape_duration_seconds", "title": "Scrape Duration"}, {"graph": "stat", "query": "sum(agent_inflight_requests)", "title": "Total Inflight Requests"}, {"graph": "time", "query": "rate(prometheus_http_requests_total[5m])", "title": "HTTP Request Rate"}, {"graph": "stat", "query": "sum(agent_metrics_active_configs)", "title": "Active Agent Configurations"}, {"graph": "time", "query": "avg(scrape_duration_seconds)", "title": "Scrape Duration"}, {"graph": "time", "query": "sum(go_cpu_classes_total_cpu_seconds_total)", "title": "Total CPU Usage"} ]'
  ])
  const [messagesJson, setMessagesJson] = useState<any[]>([])
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

  /*
  fetchDashboards().then(dashboards => fetchDashboardJson(dashboards[0]?.uid))
    .then((dashboardSpec: any) => {
      if(!first) {
        first = true
        setMessages(prev => [...prev, (<div className={MessageStyles.theirs} key={prev.length} dangerouslySetInnerHTML={{ __html: JSON.stringify(dashboardSpec.dashboard.panels) }}></div>)])
        setMessagesPlain(prev => [...prev, JSON.stringify(dashboardSpec.dashboard.panels)]);
      }
    })
  */

  // TODO: pass in data sources from state and make them configurable
  useEffect(() => { // useMemo(() => 
    setMessagesFinal(messages)
  }, [messagesPlain, messages])

  return (
    <PluginPage layout={PageLayoutType.Canvas}>
      <div className={ChatStyles.page} data-testid={testIds.pageFour.container}>
        <div className={ChatStyles.container}>
          {useMemo(() => (
            <Messages styles={MessageStyles} messages={messagesFinal} messagesPlain={messagesPlain} messagesJson={messagesJson} setMessagesJson={setMessagesJson} />
          ), [messagesFinal, MessageStyles, messagesPlain, messagesJson])}
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
