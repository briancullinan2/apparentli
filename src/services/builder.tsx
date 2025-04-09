import { PanelBuilders, VizPanelBuilder } from '@grafana/scenes';


function getBuilder (selectedGraph: string): VizPanelBuilder<any, any> {
  let selectedBuilder
  switch (selectedGraph) {
    case 'bar':
      selectedBuilder = PanelBuilders.barchart()
      break;
    case 'barguage':
      selectedBuilder = PanelBuilders.bargauge()
      break;
    case 'grid':
      selectedBuilder = PanelBuilders.datagrid()
      break;
    case 'flame':
      selectedBuilder = PanelBuilders.flamegraph()
      break;
    case 'guage':
      selectedBuilder = PanelBuilders.gauge()
      break;
    case 'geomap':
      selectedBuilder = PanelBuilders.geomap()
      break;
    case 'heat':
      selectedBuilder = PanelBuilders.heatmap()
      break;
    case 'histogram':
      selectedBuilder = PanelBuilders.histogram()
      break;
    case 'logs':
      selectedBuilder = PanelBuilders.logs()
      break;
    case 'news':
      selectedBuilder = PanelBuilders.news()
      break;
    case 'node':
      selectedBuilder = PanelBuilders.nodegraph()
      break;
    case 'pie':
      selectedBuilder = PanelBuilders.piechart()
      break;
    case 'stat':
      selectedBuilder = PanelBuilders.stat()
      break;
    case 'state':
      selectedBuilder = PanelBuilders.statetimeline()
      break;
    case 'status':
      selectedBuilder = PanelBuilders.statushistory()
      break;
    case 'table':
      selectedBuilder = PanelBuilders.table()
      break;
    case 'text':
      selectedBuilder = PanelBuilders.text()
      break;
    case 'time':
      selectedBuilder = PanelBuilders.timeseries()
      break;
    case 'trend':
      selectedBuilder = PanelBuilders.trend()
      break;
    case 'traces':
      selectedBuilder = PanelBuilders.traces()
      break;
    case 'xy':
      selectedBuilder = PanelBuilders.xychart()
      break;
    default:
      selectedBuilder = PanelBuilders.logs()
  }
  return selectedBuilder
}

export default getBuilder
