// inspired by https://github.com/grafana/grafana/issues/73434

import React from 'react';
//import { getDataSourceSrv } from '@grafana/runtime';
import { useStyles2, Select, ActionMeta } from '@grafana/ui'; // Grafana's UI components
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { css } from '@emotion/css';
import { SceneFlexItem, SceneQueryRunner, SceneTimeRange } from '@grafana/scenes';
import getBuilder from 'services/builder';
import getRunners from 'services/runner';

interface RefreshPickerProps {
  value?: number
  onSelect?: (text: number) => void; // Use camelCase for the prop name
  dataSources?: Array<{ name: string, uid: number }>
  onChange?: (value: SelectableValue<number>, actionMeta: ActionMeta) => void | {}
  scene?: SceneFlexItem
  graph?: string
  title?: string
  from?: string
  to?: string
  query?: string
  data?: string
  onStatable?: (setState: (state: any) => void) => void
};

const refreshTimes = [
  { name: 'Off', uid: 0 },
  { name: 'Auto', uid: 15 * 1001 },
  { name: '5s', uid: 5 * 1000 },
  { name: '10s', uid: 10 * 1000 },
  { name: '15s', uid: 15 * 1000 },
  { name: '30s', uid: 30 * 1000 },
  { name: '1m', uid: 60 * 1000 },
  { name: '5m', uid: 5 * 60 * 1000 },
  { name: '15m', uid: 15 * 60 * 1000 },
  { name: '30m', uid: 30 * 60 * 1000 },
  { name: '1h', uid: 60 * 60 * 1000 },
  { name: '2h', uid: 2 * 60 * 60 * 1000 },
  { name: '1d', uid: 12 * 60 * 60 * 1000 },
];

/*
const RefreshPicker: React.FC<RefreshPickerProps> = ({ init, onSelect }) => {

  const [dataSources, setDataSources] = useState<any[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<number | undefined>(init);

  setDataSources(refreshTimes);

  const ;

  return (
    
  );
};
*/
const RefreshWrapper: React.FC<RefreshPickerProps> = ({ onChange, dataSources, value }) => {
  const s = useStyles2(getStyles);

  function defaultChange() { }

  return (
    <div className={s.page}>
      <Select
        options={dataSources ? dataSources.map(ds => ({ label: ds.name, value: ds.uid })) : []}
        value={value}
        onChange={onChange || defaultChange}
      />
    </div>
  )
}


const getStyles = (theme: GrafanaTheme2) => ({
  page: css`
    visibility: visible;
    display: inline-block;
    grid-area: 1 / 1 / 2 / 3;
    grid-template-columns: 0px min-content;
    margin: 0px;
    color: inherit;
    box-sizing: border-box;
    padding: 0px;
    z-index: 1;
  `
})

class RefreshPicker extends React.Component<RefreshPickerProps> {

  state = {
    value: 15 * 1001,
    dataSources: []
  }

  public constructor(state?: Partial<RefreshPickerProps>) {
    super({ value: 15 * 1001, onStatable: undefined, from: 'now - 30m', to: 'now', dataSources: refreshTimes, ...state });

    // simulate async
    setTimeout(() => {
      this.setState({ ...state, dataSources: refreshTimes })

      this.handleRefreshChange({value: this.state.value})

      if(this.props.onStatable) {
        this.props.onStatable(this.setState)
      }
    }, 2000)
  }

  timer?: number | any = undefined;
  onSelect?: (value: number) => void = undefined
  queryRunner?: SceneQueryRunner

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  setState(newState: {} | ((prevState: Readonly<{}>, props: Readonly<RefreshPickerProps>) => {} | Pick<{}, never> | null) | Pick<{}, never> | null) {
    super.setState(newState)
    console.log(newState)
  }

  forceRefresh = () => {
    let thisState = {query: this.props.query, graph: this.props.graph, title: this.props.title}
    this.queryRunner = getRunners(JSON.stringify([thisState]), this.props.data)[0].queryRunner
    if (this.props.scene) {
      this.props.scene.setState({
        $data: this.queryRunner,
        $timeRange: new SceneTimeRange({ from: this.props.from, to: this.props.to }),
        body: getBuilder(this.props.graph || '').setTitle(this.props.title || '').build()
      })
    }
    if (this.queryRunner) {
      this.queryRunner.runQueries()
    }
  }

  handleRefreshChange = (value: SelectableValue<number>) => {
    this.setState({ value: value.value });
    if (this.onSelect && value.value) {
      this.onSelect(value.value)
    }
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (value.value) {
      this.timer = setInterval(this.forceRefresh, value.value);
      this.forceRefresh()
    }
  }

  render() {
    return (
      <RefreshWrapper onChange={this.handleRefreshChange} value={this.state.value} dataSources={this.state.dataSources} />
    )
  }
}

export default RefreshPicker;
