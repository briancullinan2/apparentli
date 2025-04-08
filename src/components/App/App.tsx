import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
const PageFour = React.lazy(() => import('../../pages/PageFour'));

function App(props: AppRootProps) {

  React.useEffect(() => {
    //debugger
    console.log('App plugin initialized:', props)
  });

  return (
    <Routes>
      <Route path="*" element={<PageFour />} />
    </Routes>
  );
}

export default App;
