import React, { SetStateAction, JSX } from "react";
import { openai } from '@grafana/llm';

const uids = [
  'bar',
  'barguage',
  'grid',
  'flame',
  'guage',
  'geomap',
  'heat',
  'histogram',
  'logs',
  'news',
  'node',
  'pie',
  'stat',
  'state',
  'status',
  'table',
  'text',
  'time',
  'trend',
  'traces',
  'xy'
];


async function sendMessage(input: string,
  setMessages: { (value: SetStateAction<JSX.Element[]>): void; (arg0: { (prev: any): any[]; }): void; },
  setMessagesPlain: { (value: SetStateAction<string[]>): void; (arg0: { (prev: any): string[]; }): void; },
  setMessagesJson: { (value: SetStateAction<any[]>): void; (arg0: { (prev: any): any[]; }): void; },
  setInput: ((arg0: string) => void),
  s: { mine: string | undefined; theirs: string | undefined; }
) {
  if (!input.trim()) {
    return;
  }

  const message = {
    text: input.trim(),
    time: new Date().toLocaleTimeString(),
  };

  setMessages(prev => [...prev, (<div data-message={message} className={s.mine} key={prev.length}>{message.text}</div>)]);
  setMessagesPlain(prev => [...prev, message.text]);
  setInput('');

  await openai.enabled()
  const stream = openai
      .chatCompletions({
        // model: openai.Model.LARGE, // defaults to BASE, use larger model for longer context and complex tasks
        messages: [
          { role: 'system', content: 'You are a helpful assistant with deep knowledge of the Grafana, Prometheus and general observability ecosystem.' },
          { role: 'user', content: 
            'Available graph types:\n' + 
            uids.join('\n') + 
            // TODO: replace prometheus with the right language for other connection types
            'Generate a Prometheus query similar to these:\n' + 
            'sum(process_resident_memory_bytes{job=\"prometheus\"})\n' + 
            'process_virtual_memory_bytes{job=\"prometheus\"}\n' +
            'topk(1, grafana_info or grafana_build_info)\n' + 
            'sort(topk(8, sum by (handler) (grafana_http_request_duration_seconds_count)))\n' + 
            '\nCreate a short list of queries that is most fitting for the following prompt:\n' + input.trim() + 
            '\nSpecify the most fitting graph type for each query and respond in JSON format like {"graph": "...", "query": "...", "title": "..."}.'
          },
        ],
      })
  
    // Subscribe to the stream and update the state for each returned value.
    let responseObject = (await stream).object;

    setMessages(prev => [...prev, (<div className={s.theirs} key={prev.length} dangerouslySetInnerHTML={{ __html: responseObject }}></div>)])
    setMessagesPlain(prev => [...prev, responseObject]);
    /*
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
    */


}

export default sendMessage
