import React, { useState, useEffect } from 'react';
//import { getDataSourceSrv } from '@grafana/runtime';
import { useStyles2, Select } from '@grafana/ui'; // Grafana's UI components
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { css } from '@emotion/css';

type VisualizationPickerProps = {
  init?: string
  onSelect?: (text: string) => void; // Use camelCase for the prop name
};

const VisualizationPicker: React.FC<VisualizationPickerProps> = ({init, onSelect}) => {
  const s = useStyles2(getStyles);

  const [dataSources, setDataSources] = useState<any[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<string | undefined>(init);

  useEffect(() => {
    async function fetchDataSources() {
      //const dsSrv = getDataSourceSrv();
      const allDataSources = await [
        {name: 'Bar chart', uid: 'bar'},
        {name: 'Bar guage', uid: 'barguage'},
        {name: 'Data grid', uid: 'grid'},
        {name: 'Flame graph', uid: 'flame'},
        {name: 'Guage', uid: 'guage'},
        {name: 'Geomap', uid: 'geomap'},
        {name: 'Heatmap', uid: 'heat'},
        {name: 'Histogram', uid: 'histogram'},
        {name: 'Logs', uid: 'logs'},
        {name: 'News', uid: 'news'},
        {name: 'Node graph', uid: 'node'},
        {name: 'Pie chart', uid: 'pie'},
        {name: 'Stat', uid: 'stat'},
        {name: 'State timeline', uid: 'state'},
        {name: 'Status history', uid: 'status'},
        {name: 'Table', uid: 'table'},
        {name: 'Text', uid: 'text'},
        {name: 'Time series', uid: 'timeseries'},
        {name: 'Trend', uid: 'trend'},
        {name: 'Traces', uid: 'traces'},
        {name: 'xychart', uid: 'xy'},
      ];
      setDataSources(allDataSources);
    }
    fetchDataSources();
  }, []);

  const handleDataSourceChange = (value: SelectableValue<string>) => {
    setSelectedGraph(value.value);
    if(onSelect && value.value) {
      onSelect(value.value)
    }
  };

  return (
    <div className={s.page}>
      <Select
        options={dataSources.map(ds => ({ label: ds.name, value: ds.uid }))}
        value={selectedGraph}
        onChange={handleDataSourceChange}
      />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  page: css`
    visibility: visible;
    /* flex: 1 1 auto; */
    display: inline-block;
    grid-area: 1 / 1 / 2 / 3;
    grid-template-columns: 0px min-content;
    margin: 0px;
    color: inherit;
    box-sizing: border-box;
    padding: 0px;
    z-index: 1;
    flex: 100%;
  `
})

export default VisualizationPicker;
