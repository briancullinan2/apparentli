import React, { useState, useEffect } from 'react';
import { getDataSourceSrv } from '@grafana/runtime';
import { useStyles2, Select } from '@grafana/ui'; // Grafana's UI components
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { css } from '@emotion/css';

const DataSourcePicker: React.FC = () => {
  const s = useStyles2(getStyles);

  const [dataSources, setDataSources] = useState<any[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchDataSources() {
      const dsSrv = getDataSourceSrv();
      const allDataSources = await dsSrv.getList();
      setDataSources(allDataSources);
    }
    fetchDataSources();
  }, []);

  const handleDataSourceChange = (value: SelectableValue<string>) => {
    setSelectedDataSource(value.value);
  };

  return (
    <div className={s.page}>
      <Select
        options={dataSources.map(ds => ({ label: ds.name, value: ds.id }))}
        value={selectedDataSource}
        onChange={handleDataSourceChange}
      />
    </div>
  );
};

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

export default DataSourcePicker;
