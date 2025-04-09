import { SceneComponentProps, SceneObjectBase, SceneObjectState } from "@grafana/scenes";

export interface PanelState extends SceneObjectState {
  graph: string;
  query: string;
}

function ControlsRenderer({ model }: SceneComponentProps<PanelState>) {
  const { count } = model.useState();

  return (
    <div>
      <div>Counter: {count}</div>
    </div>
  );
}

export class Controls extends SceneObjectBase<PanelState> {
  static Component = ControlsRenderer;

  public constructor(state?: Partial<PanelState>) {
    super({ graph: '', query: '', ...state });
  }

}