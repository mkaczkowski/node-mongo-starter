import * as React from 'react';
import { hot } from 'react-hot-loader';
import Header from './view/header';
import Footer from './view/footer/Footer';
import PropertiesProvider from './providers/Properties';
import PropertyList from './view/properties';

import './styles/index.css';

function App() {
  return (
    <main>
      <Header />
      <PropertiesProvider>
        <PropertyList />
      </PropertiesProvider>
      <Footer />
    </main>
  );
}

export default hot(module)(App);
