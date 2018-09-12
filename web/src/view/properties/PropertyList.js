// @flow
import * as React from 'react';
import Map from '../map';
import { getRestrictedCoordinates } from '../../util/geolocation/geolocation';
import PropertyItem from './item/PropertyItem';
import PropertyItemHeader from './header/PropertyItemHeader';

import type { PropertiesContextProps } from '../../providers/Properties';
import type { Property } from '../../model/Property';

import './PropertyList.css';

class PropertyList extends React.Component<PropertiesContextProps> {
  renderLoading = () => <div>Loading...</div>;

  renderList = () => {
    const { properties } = this.props;
    return properties.length > 0 ? (
      properties.map((property: Property) => <PropertyItem property={property} key={property._id} />)
    ) : (
      <h2>No properties were found.</h2>
    );
  };

  render() {
    const { isLoading } = this.props;
    return (
      <div styleName="wrapper">
        <Map center={getRestrictedCoordinates()} />
        <div styleName="product-list">
          <PropertyItemHeader />
          {isLoading ? this.renderLoading() : this.renderList()}
        </div>
      </div>
    );
  }
}

export default PropertyList;
