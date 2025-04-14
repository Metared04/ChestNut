import React, { StrictMode } from "react";

import ManageFoodScreen from './screens/ManageFoodScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {

  return (
    <StrictMode>
      <ManageFoodScreen />
    </StrictMode>
  );
}