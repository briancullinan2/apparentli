import React, { SetStateAction, JSX } from "react";


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
}

export default sendMessage
