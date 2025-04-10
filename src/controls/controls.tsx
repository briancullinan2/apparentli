import { SceneComponentProps, SceneFlexItem, SceneFlexLayout, SceneObjectBase, SceneObjectState, SceneQueryRunner, SceneTimeRange } from "@grafana/scenes";
import { useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import VisualizationPicker from './graph';
import React, { ChangeEvent } from "react";
import getBuilder from '../services/builder'
import RefreshPicker from "./refresh";
import getRunners from "services/runner";

export interface PanelState extends SceneObjectState {
  from: string;
  to: string;
  title: string;
  graph: string;
  refresh: number;
  setGraph?: (graph: string) => void
  getLayout?: () => SceneFlexLayout
  sceneItem?: SceneFlexItem
  queryRunner?: SceneQueryRunner
  query?: string
  data?: string
}

type refreshState = (state: any) => void | undefined

/*
import { locationService } from '@grafana/runtime';
locationService.push({
  query: {
    'refresh': '5s',
  },
  partial: true,
  replace: true,
});
*/

function ControlsRenderer({ model }: SceneComponentProps<Controls>) {
  const { to, from, query, data, title, graph, sceneItem } = model.useState()
  const ControlStyles = useStyles2(controlStyles)

  function onChange(graph: string) {
    let queryRunner = getRunners(JSON.stringify([{ query, graph, title }]), data)[0].queryRunner
    model.setGraph(graph)
    if (sceneItem) {
      sceneItem.setState({
        $data: queryRunner,
        $timeRange: new SceneTimeRange({ from: from, to: to }),
        body: getBuilder(graph).setTitle(title).build()
      })
    }
  }

  let timer: any
  let refresh: refreshState
  function updateScene() {
    if (refresh) {
      refresh({
        from: from,
        to: to,
      })
    }
    if (sceneItem) {
      let queryRunner = getRunners(JSON.stringify([{ query, graph, title }]), data)[0].queryRunner
      sceneItem.setState({
        $data: queryRunner,
        $timeRange: new SceneTimeRange({ from: from, to: to }),
        body: getBuilder(graph).setTitle(title).build()
      })
      if (queryRunner) {
        queryRunner.runQueries()
      }
    }
  }

  function setFrom(event: ChangeEvent<HTMLInputElement>) {
    model.setState({ from: event.target.value })
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(updateScene, 1000)
  }

  function setTo(event: ChangeEvent<HTMLInputElement>) {
    model.setState({ to: event.target.value })
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(updateScene, 1000)
  }

  function setQuery(event: ChangeEvent<HTMLInputElement>) {
    model.setState({ query: event.target.value })
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(updateScene, 1000)
  }

  function onState(setState: (state: any) => void) {
    refresh = setState
  }

  return (
    <div className={ControlStyles.tools}>
      <div className={ControlStyles.queryInput}>
        <label className={ControlStyles.query}>Visualization</label>
        <VisualizationPicker init={graph} onSelect={onChange} />
      </div>
      <div className={ControlStyles.queryInput}>
        <label className={ControlStyles.query}>Refresh</label>
        <RefreshPicker onStatable={onState} data={data} query={query} from={from} to={to} title={title} graph={graph} scene={sceneItem} />
      </div>
      <div className={ControlStyles.queryInput}>
        <label className={ControlStyles.query}>From</label>
        <input className={ControlStyles.input} value={from} onChange={setFrom} />
      </div>
      <div className={ControlStyles.queryInput}>
        <label className={ControlStyles.query}>To</label>
        <input className={ControlStyles.input} value={to} onChange={setTo} />
      </div>
      <div className={ControlStyles.queryInput}>
        <label className={ControlStyles.query}>Query</label>
        <input className={ControlStyles.input} value={query} onChange={setQuery} />
      </div>
    </div>
  );
}


const controlStyles = (theme: GrafanaTheme2) => ({
  tools: css`
    display: flex;
    flex-wrap: wrap;
  `,
  query: css`
    background: rgb(24, 27, 31);
    display: inline-block;
    box-align: center;
    align-items: center;
    padding: 0px 8px;
    font-weight: 500;
    font-size: 0.857143rem;
    height: 32px;
    line-height: 32px;
    border-radius: 2px;
    border: 1px solid rgba(204, 204, 220, 0.2);
    position: relative;
    right: -1px;
    white-space: nowrap;
    gap: 4px;
  `,
  input: css`
    padding: 0px 0px 0px 8px;
    width: auto;
    max-width: 100%;
    display: inline-block;
    flex: 100%;
    flex-flow: wrap;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    position: relative;
    box-sizing: border-box;
    border-radius: 2px;
    background: rgb(17, 18, 23);
    line-height: 1.57143;
    font-size: 14px;
    color: rgb(204, 204, 220);
    border: 1px solid rgba(204, 204, 220, 0.2);
    position: relative;
    box-sizing: border-box;
    flex-flow: wrap;
    -webkit-box-align: stretch;
    align-items: stretch;
    -webkit-box-pack: justify;
    justify-content: space-between;
    min-height: 32px;
    height: auto;
    max-width: 100%;
    cursor: pointer;
  `,
  queryInput: css`
    flex-grow: 1;
    white-space: nowrap;
    display:flex;
  `
})

export class Controls extends SceneObjectBase<PanelState> {
  static Component = ControlsRenderer;

  public constructor(state?: Partial<PanelState>) {
    super({ query: '', data: '', to: 'now', from: 'now - 30m', title: '', graph: '', queryRunner: undefined, refresh: 0, ...state });
  }

  public setGraph = (value: string) => {
    this.setState({ graph: value });
  };
}
