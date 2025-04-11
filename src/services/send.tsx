import React, { SetStateAction, JSX } from "react";
import { getMetrics, getRelevant } from '../services/metrics'
import { graphQuery } from "./graph";
import { functionQuery } from "./function";
import { dashboardQuery, fetchDashboards } from "./dashboard";
import { getDataSourceSrv } from "@grafana/runtime";
import { promptModel } from "./openai";


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

  let relevantFunction = await functionQuery(input)

  let responseObject: string
  switch (relevantFunction) {
    case 'queryResults':
      
      break;
    case 'generalChitChat':
      responseObject = await promptModel(input)
      break;
    case 'displayDashboard':
      let dashboards = await fetchDashboards()
      let dataSources = await getDataSourceSrv().getList()
      responseObject = await dashboardQuery(input, dashboards, dataSources)
      break;
    case 'generateGraph':
    default:
      let metricNames = await getMetrics()
      let relevantMetrics = await getRelevant(input, metricNames)
      responseObject = await graphQuery(input, relevantMetrics)
  }
  setMessages(prev => [...prev, (<div className={MessageStyles.theirs} key={prev.length} dangerouslySetInnerHTML={{ __html: responseObject }}></div>)])
  setMessagesPlain(prev => [...prev, responseObject]);
}

export default sendMessage
