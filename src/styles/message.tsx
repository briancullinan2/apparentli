import { css } from "@emotion/css"
import { GrafanaTheme2 } from "@grafana/data"

const messageStyles = (theme: GrafanaTheme2) => ({
  scene: css`
  flex: 50%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
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
  mine: css`
  padding: 10px;
  display: inline-block;
  background: black;
  border-radius: 10px;
  margin: 10px 0;
`,
  theirs: css`
  z-index: 2;
`
})

export default messageStyles
