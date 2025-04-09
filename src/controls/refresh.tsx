import React from 'react';
//import { getDataSourceSrv } from '@grafana/runtime';
import { useStyles2, Select } from '@grafana/ui'; // Grafana's UI components
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { css } from '@emotion/css';

interface RefreshPickerProps {
  value?: number
  onSelect?: (text: number) => void; // Use camelCase for the prop name
};

const refreshTimes = [
  { name: 'Off', uid: 0 },
  { name: 'Auto', uid: 15 * 1000 },
  { name: '5s', uid: 15 * 1000 },
  { name: '10s', uid: 15 * 1000 },
  { name: '15s', uid: 15 * 1000 },
  { name: '30s', uid: 15 * 1000 },
  { name: '1m', uid: 15 * 1000 },
  { name: '5m', uid: 15 * 1000 },
  { name: '15m', uid: 15 * 1000 },
  { name: '30m', uid: 15 * 1000 },
  { name: '1h', uid: 15 * 1000 },
  { name: '2h', uid: 15 * 1000 },
  { name: '1d', uid: 15 * 1000 },
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


const getStyles = (theme: GrafanaTheme2) => ({
  page: css`
    visibility: visible;
    flex: 1 1 auto;
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

  public constructor(state?: Partial<RefreshPickerProps>) {
    super(state || {});

    this.setState({dataSources: refreshTimes})
  }

  state = {
    value: 0,
    dataSources: [] as {name: string, uid: number}[],
  }

  timer?: number | any = undefined;
  onSelect?: (value: number) => void = undefined

  next = () => {
    this.timer = setTimeout(() => {

      //this.setState((prevState) => ({ index: prevState.index + 1 }));
    }, 1500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleDataSourceChange(value: SelectableValue<number>) {
    this.setState({value: value.value});
    if (this.onSelect && value.value) {
      this.onSelect(value.value)
    }
  }

  render() {
    const s = useStyles2(getStyles);

    return (
      <div className={s.page}>
        <Select
          options={this.state.dataSources.map(ds => ({ label: ds.name, value: ds.uid }))}
          value={this.state.value}
          onChange={this.handleDataSourceChange}
        />
      </div>
    )
  }
}

export default RefreshPicker;
