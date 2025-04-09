import React, { SetStateAction, JSX } from "react";
import { openai } from '@grafana/llm';


async function sendMessage(input: string,
  setMessages: { (value: SetStateAction<JSX.Element[]>): void; (value: SetStateAction<JSX.Element[]>): void; (arg0: { (prev: any): any[]; (prev: any): any[]; }): void; },
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

  setMessages(prev => [...prev, (<div className={s.mine} key={prev.length}>{message.text}</div>)]);
  setInput('');

  await openai.enabled()
  const stream = openai
      .chatCompletions({
        // model: openai.Model.LARGE, // defaults to BASE, use larger model for longer context and complex tasks
        messages: [
          { role: 'system', content: 'You are a helpful assistant with deep knowledge of the Grafana, Prometheus and general observability ecosystem.' },
          { role: 'user', content: input.trim() },
        ],
      })
  
    // Subscribe to the stream and update the state for each returned value.
    let responseObject = (await stream).object;

    setMessages(prev => [...prev, (<div className={s.theirs} key={prev.length} dangerouslySetInnerHTML={{ __html: responseObject }}></div>)])
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
