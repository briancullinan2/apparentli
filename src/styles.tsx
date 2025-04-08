import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

const messageStyles = (theme: GrafanaTheme2) => ({
  page: css`
    padding: ${theme.spacing(3)};
    background-color: ${theme.colors.background.secondary};
    display: flex;
    justify-content: center;
    height: 100%;
    flex-direction: column;
    margin-bottom: 72px;
  `,
  container: css`
    width: 100%;
    max-width: 100%;
    min-height: 500px;
    height: 100%;
    flex: 100%;
  `,
  content: css`
    margin-top: ${theme.spacing(6)};
  `,
  footer: css`
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-top: 1px solid #ccc;
    position: fixed;
    bottom: 0;
    background: rgb(34, 37, 43);
    left: 300px;
    right: 0;
  `,
  inputs: css`
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  `,
  input: css`
    flex: 1;
    padding: 8px;
    font-size: 14px;
  `,
  button: css`
    padding: 8px 16px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `,
  scene: css`
    flex: 50%;
    min-height: 300px;
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
});

export default messageStyles
