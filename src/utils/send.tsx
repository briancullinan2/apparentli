import React, { SetStateAction, JSX } from "react";
import { openai } from '@grafana/llm';
import performQuery from "./query";
import { getDataSourceSrv } from '@grafana/runtime';

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
  //  'text',
  'time',
  'trend',
  'traces',
  'xy'
];

const PromQL = [
  "abs()", "absent()", "absent_over_time()", "ceil()", "changes()", "clamp()", "clamp_max()", "clamp_min()", "day_of_month()",
  "day_of_week()", "day_of_year()", "days_in_month()", "delta()", "deriv()", "exp()", "floor()", "histogram_avg()",
  "histogram_count()", "histogram_sum()", "histogram_fraction()", "histogram_quantile()", "histogram_stddev()",
  "histogram_stdvar()", "double_exponential_smoothing()", "hour()", "idelta()", "increase()", "info()", "irate()",
  "label_join()", "label_replace()", "ln()", "log2()", "log10()", "minute()", "month()", "predict_linear()", "rate()",
  "resets()", "round()", "scalar()", "sgn()", "sort()", "sort_desc()", "sort_by_label()", "sort_by_label_desc()",
  "sqrt()", "time()", "timestamp()", "vector()", "year()"
]


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

  let sources = await getDataSourceSrv().getList()
  let prometheus = sources.filter(source => source.name === 'prometheus')

  let metrics = await performQuery('{__name__!=""}', prometheus[0].uid, 'table')
  let metricNames = metrics.map((metric: any) => metric.schema.fields[1].name).filter((a: string, i: number, arr: string[]) => arr.indexOf(a) === i)
  console.log(metricNames)

  let relevantMetrics = []
  let BATCH_COUNT = 500
  for(let i = 0; i < Math.ceil(metricNames.length / BATCH_COUNT); i++) {
    const stream = openai
    .chatCompletions({
      // model: openai.Model.LARGE, // defaults to BASE, use larger model for longer context and complex tasks
      messages: [
        { role: 'system', content: 'You are a helpful assistant with deep knowledge of the Grafana, Prometheus and general observability ecosystem.' },
        {
          role: 'user', content:
            'Are any of the following metrics related to the prompt:\n' +
            metricNames.slice(i * BATCH_COUNT, i * BATCH_COUNT + BATCH_COUNT).join('\n') +
            '\nList only a few related metrics, no explaination needed:\n' +
            input.trim()
        }
      ]
    })

    let matchedMetrics = (await stream).object;
    relevantMetrics.push(...metricNames.filter((name: string) => matchedMetrics.includes(name)))
  }

  console.log(relevantMetrics)

  //await openai.enabled()
  const stream = openai
    .chatCompletions({
      // model: openai.Model.LARGE, // defaults to BASE, use larger model for longer context and complex tasks
      messages: [
        { role: 'system', content: 'You are a helpful assistant with deep knowledge of the Grafana, Prometheus and general observability ecosystem.' },
        {
          role: 'user', content:
            'List of relevant metrics:\n' + 
            relevantMetrics.join('\n') + 
            '\nAvailable PromQL functions:\n' +
            PromQL.join('\n') +
            '\nAvailable graph types:\n' +
            uids.join('\n') +
            // TODO: replace prometheus with the right language for other connection types
            '\nGenerate a Prometheus query similar to these:\n' +
            'sum(process_resident_memory_bytes{job=\"prometheus\"})\n' +
            'process_virtual_memory_bytes{job=\"prometheus\"}\n' +
            'topk(1, grafana_info or grafana_build_info)\n' +
            'sort(topk(8, sum by (handler) (grafana_http_request_duration_seconds_count)))\n' +
            '\nCreate a short list of PromQL queries that is most fitting for the following prompt:\n' +
            input.trim() +
            '\nSpecify the most fitting graph type for each query and respond in JSON format like {"graph": "...", "query": "...", "title": "..."}, JSON only, no further explaination necessary.'
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
