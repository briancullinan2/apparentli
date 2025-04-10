import { SceneComponentProps, SceneFlexItem, SceneFlexLayout, SceneObjectBase, SceneObjectState, SceneQueryRunner } from "@grafana/scenes";
import { useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import VisualizationPicker from './graph';
import React from "react";
import getBuilder from '../services/builder'
import RefreshPicker from "./refresh";

export interface PanelState extends SceneObjectState {
  title: string;
  graph: string;
  refresh: number;
  setGraph?: (graph: string) => void
  getLayout?: () => SceneFlexLayout
  sceneItem?: SceneFlexItem
  query: SceneQueryRunner
}

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
  const { query, title, graph, sceneItem } = model.useState()
  const s = useStyles2(controlStyles)

  function onChange(graph: string) {
    model.setGraph(graph)
    if (sceneItem) {
      sceneItem.setState({
        body: getBuilder(graph).setTitle(title).build()
      })
    }
  }

  return (
    <div className={s.tools}>
      <label className={s.query}>Visualization</label>
      <VisualizationPicker init={graph} onSelect={onChange} />
      <label className={s.query}>Refresh</label>
      <RefreshPicker query={query} title={title} graph={graph} scene={sceneItem} />
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
  `
})

export class Controls extends SceneObjectBase<PanelState> {
  static Component = ControlsRenderer;

  public constructor(state?: Partial<PanelState>) {
    super({ title: '', graph: '', query: '', refresh: 0, ...state });
  }

  public setGraph = (value: string) => {
    this.setState({ graph: value });
  };
}
