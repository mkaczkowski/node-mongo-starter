import * as React from 'react';
import { PropertiesContext } from '../../providers/Properties';
import Map from './../../components/complex/map';

//prettier-ignore
export default (props) => (
  <PropertiesContext.Consumer>
    { context => <Map {...context} {...props}/>}
  </PropertiesContext.Consumer>
);
