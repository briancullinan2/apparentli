import { getBackendSrv, getDataSourceSrv, getAppEvents } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';

async function performQuery(text: string, selectedDataSource: string) {
  const ds = await getDataSourceSrv().get(selectedDataSource);
  const appEvents = getAppEvents();
  try {
    const result = await getBackendSrv().fetch({
      method: 'POST',
      url: 'api/ds/query',
      data: {
        queries: [
          {
            datasourceId: ds.id,
            refId: '1',
            datasource: {
              type: 'prometheus',
              uid: selectedDataSource,
            },
            expr: 'rate(prometheus_http_requests_total{handler=~"/metrics"}[5m])',
          }
        ],
      },
    });

    let resp = await lastValueFrom(result)

    console.log(resp)

    appEvents.publish({
      type: 'success',
      payload: [text + ': ' + resp.status + ' (' + resp.statusText + ')'],
    });
  } catch (error: any) {
    appEvents.publish({
      type: 'error',
      payload: [text + ': ' + error.status + ' (' + error.statusText + ') ' + error.data.message],
    });
  }
}

export default performQuery
