import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
const Chat = React.lazy(() => import('../../chat/Chat'));

function App(props: AppRootProps) {

  React.useEffect(() => {
    //debugger
    console.log('App plugin initialized:', props)
  });

  return (
    <Routes>
      <Route path="*" element={<Chat />} />
    </Routes>
  );
}

export default App;
