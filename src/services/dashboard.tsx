import { getBackendSrv } from '@grafana/runtime';
import { promptModel } from './openai';
import { uids } from './graph';

interface Dashboard {
  id: number;
  uid: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
  isStarred: boolean;
}

interface DataSource {
  readonly name: string;
  readonly id: number;
  readonly type: string;
  readonly uid: string;
  readonly apiVersion?: string;
  interval?: string;
}

export async function fetchDashboards(): Promise<Dashboard[]> {
  try {
    const response = await getBackendSrv().get('/api/search', { type: 'dash-db' });
    return response as Dashboard[];
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    throw error;
  }
}

export async function fetchDashboardJson(uid: string): Promise<Dashboard[]> {
  try {
    const response = await getBackendSrv().get('/api/dashboards/uid/' + uid, {});
    return response as any;
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    throw error;
  }
}

export async function dashboardQuery(input: string, dashboards: Dashboard[], dataSources: DataSource[]): Promise<string> {
  const matchedObjects = await promptModel(
    'Are any of the following data sources related to the prompt:\n' +
    dataSources.map(({ name, uid, type }) => JSON.stringify({ name, uid, type })).join('\n') +
    '\nOr are any of the following dashboards related:\n' +
    dashboards.map(({ title, uid, type }) => JSON.stringify({ title, uid, type })).join('\n') +
    '\nList only a few related uids we\ll generate a graph together later, no explaination needed:\n' +
    input.trim()
  )

  let matchedDataSources = dataSources.filter(ds => matchedObjects.includes(ds.uid))
  let matchedDashboards = dashboards.filter(ds => matchedObjects.includes(ds.uid))

  let fullDashboards: any[] = []
  for (let i = 0; i < matchedDashboards.length; i++) {
    fullDashboards.push((await fetchDashboardJson(matchedDashboards[i].uid) as any).dashboard)
  }

  return await promptModel(
    'Available dashboards (' + matchedDashboards.map(dash => dash.title).join(', ') + '):\n' +
    dashboards.map(({ title, uid, type }) => JSON.stringify({ title, uid, type })).join('\n') +
    '\nAvailable panels:\n' +
    fullDashboards.map(({ panels }) => (panels as any[]).map(({ title, type, targets, datasouce }) =>
      JSON.stringify({ title: title, type: type, queries: targets, datasouce })
    )).flat().join('\n') +
    '\nAvailable graph types:\n' +
    uids.join('\n') +
    '\nAvailable data sources:\n' +
    matchedDataSources.map(ds => JSON.stringify(ds)).join('\n') +
    '\nAttempt to fullfil the requested information as best as possible in JSON or graph format like {"graph": "...", "query": "...", "title": "..."} for the following prompt:\n' +
    input.trim()
  )
}

