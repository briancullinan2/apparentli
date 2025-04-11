import React, { SetStateAction, JSX } from "react";
import { getMetrics, getRelevant } from '../services/metrics'
import { graphQuery, uids } from "./graph";
import { FUNCTIONAL_PROMPT, functionQuery } from "./function";
import { dashboardQuery, fetchDashboards } from "./dashboard";
import { getDataSourceSrv } from "@grafana/runtime";
import { promptModel } from "./openai";
const {Remarkable} = require('remarkable');
const md = new Remarkable({html: true, xhtmlOut: true, breaks: true});

async function generalQuery(input: string) {
  let dashboards = await fetchDashboards()
  let dataSources = await getDataSourceSrv().getList()
  let contextPreface = 'Available graphs:\n' +
    uids.join('\n') +
    '\nAvailable functions:\n' +
    FUNCTIONAL_PROMPT +
    '\nAvailable data sources:\n' +
    dataSources.map(({ name, uid, type }) => JSON.stringify({ name, uid, type })).join('\n') +
    '\nAvailable dashboards:\n' +
    dashboards.map(({ title, uid, type }) => JSON.stringify({ title, uid, type })).join('\n') +
    // TODO: include recent message history
    '\nRespond to the following prompt:\n' + input
  let result = await promptModel(contextPreface)
  let html = md.render(result)
  return html
}


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

  let relevantFunctions = await functionQuery(input)

  let responseObject = ''
  for (let i = 0; i < relevantFunctions.length; i++) {
    switch (relevantFunctions[i]) {
      case 'queryResults':

        break;
      case 'generalChitChat':
        responseObject += await generalQuery(input)
        break;
      case 'displayDashboard':
        let dashboards = await fetchDashboards()
        let dataSources = await getDataSourceSrv().getList()
        responseObject += await dashboardQuery(input, dashboards, dataSources)
        break;
      case 'generateGraph':
      default:
        let metricNames = await getMetrics()
        let relevantMetrics = await getRelevant(input, metricNames)
        responseObject += await graphQuery(input, relevantMetrics)
    }
    break;
  }
  setMessages(prev => [...prev, (<div className={MessageStyles.theirs} key={prev.length} dangerouslySetInnerHTML={{ __html: responseObject }}></div>)])
  setMessagesPlain(prev => [...prev, responseObject]);
}

export default sendMessage
