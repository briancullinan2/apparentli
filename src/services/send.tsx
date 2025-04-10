import React, { SetStateAction, JSX } from "react";
import { getMetrics, getRelevant } from '../services/metrics'
import { graphQuery } from "./graph";


async function sendMessage(input: string,
  setMessages: { (value: SetStateAction<JSX.Element[]>): void; (arg0: { (prev: any): any[]; }): void; },
  setMessagesPlain: { (value: SetStateAction<string[]>): void; (arg0: { (prev: any): string[]; }): void; },
  setMessagesJson: { (value: SetStateAction<any[]>): void; (arg0: { (prev: any): any[]; }): void; },
  setInput: ((arg0: string) => void),
  MessageStyles: { mine: string, theirs: string, scene: string, query: string }
) {
  if (!input.trim()) {
    return;
  }

  const message = {
    text: input.trim(),
    time: new Date().toLocaleTimeString(),
  };

  setMessages(prev => [...prev, (<div data-message={message} className={MessageStyles.mine} key={prev.length}>{message.text}</div>)]);
  setMessagesPlain(prev => [...prev, message.text]);
  setInput('');

  let metricNames = await getMetrics()

  let relevantMetrics = await getRelevant(input, metricNames)

  let responseObject = await graphQuery(input, relevantMetrics)

  setMessages(prev => [...prev, (<div className={MessageStyles.theirs} key={prev.length} dangerouslySetInnerHTML={{ __html: responseObject }}></div>)])
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
