import * as React from 'react';
import { hot } from 'react-hot-loader';
import Header from './view/header';
import PropertiesProvider from './providers/Properties';
import PropertyList from './view/properties';

import './styles/index.css';

function App() {
  return (
    <PropertiesProvider>
      <main>
        <Header />
        <PropertyList />
      </main>
    </PropertiesProvider>
  );
}

export default hot(module)(App);
