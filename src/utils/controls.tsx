import { SceneComponentProps, SceneFlexItem, SceneFlexLayout, SceneObjectBase, SceneObjectState } from "@grafana/scenes";
import { useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import VisualizationPicker from './graph';
import React from "react";
import getBuilder from './builder'

export interface PanelState extends SceneObjectState {
  graph: string;
  query: string;
  setGraph?: (graph: string) => void
  getLayout?: () => SceneFlexLayout
  sceneItem?: SceneFlexItem 
}

function ControlsRenderer({ model }: SceneComponentProps<Controls>) {
  const { graph, sceneItem } = model.useState()
  const s = useStyles2(controlStyles)

  function onChange(graph: string) {
    model.setGraph(graph)
    if (sceneItem) {
      sceneItem.setState({
        body: getBuilder(graph).build()
      })
    }
  }

  return (
    <div>
      <label className={s.query}>Visualization</label>
      <VisualizationPicker init={graph} onSelect={onChange} />
    </div>
  );
}

const controlStyles = (theme: GrafanaTheme2) => ({
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
    super({ graph: '', query: '', ...state });
  }

  public setGraph = (value: string) => {
    this.setState({ graph: value });
  };
}
