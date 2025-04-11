import { getBackendSrv, getDataSourceSrv, getAppEvents } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';


export async function performQuery(text: string, selectedDataSource: string, format?: string) {
  return performTarget({expr: text}, selectedDataSource, format)
}

export async function performTarget(target: any, selectedDataSource: string, format?: string) {
  const ds = await getDataSourceSrv().get(selectedDataSource);
  const appEvents = getAppEvents();
  try {
    const result = await getBackendSrv().fetch({
      method: 'POST',
      url: 'api/ds/query',
      data: {
        from: (Date.now() - 60 * 60) + '',
        to: Date.now() + '',
        queries: [
          {
            datasourceId: ds.id,
            format: format ? format : 'time_series',
            datasource: {
              type: ds.type,
              uid: selectedDataSource,
            },
            ... target,
            refId: 'A',
          }
        ],
      },
    });

    let resp = await lastValueFrom(result)

    console.log(resp)

    appEvents.publish({
      type: 'success',
      payload: [target.expr + ': ' + resp.status + ' (' + resp.statusText + ')'],
    });

    return (resp.data as any).results.A.frames

  } catch (error: any) {
    appEvents.publish({
      type: 'error',
      payload: [target.expr + ': ' + error.status + ' (' + error.statusText + ') ' + error.data.message],
    });
  }
}

