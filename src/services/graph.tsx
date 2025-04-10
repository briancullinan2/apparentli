import { promptModel } from "./openai";

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
  'timeseries',
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

const PromQLOps = [
  'sum', 'min', 'max', 'avg', 'group', 'stddev', 'stdvar', 'count', 'count_values', 'bottomk', 'topk', 'quantile',
  'limitk', 'limit_ratio', 'group_left', 'group_right'
]


export async function graphQuery(input: string, relevantMetrics: string[]) {
  //await openai.enabled()
  return await promptModel(
    'List of relevant metrics:\n' +
    relevantMetrics.join('\n') +
    '\nAvailable PromQL functions and operators:\n' +
    PromQL.join('\n') + '\n' + PromQLOps.join('\n') +
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
  )

}

