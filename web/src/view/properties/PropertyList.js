// @flow
import * as React from 'react';
import ButtonBar from '../../components/common/buttonbar';
import Map from '../../components/complex/map';
import { getRestrictedCoordinates } from '../../util/geolocation/geolocation';
import PropertyItem from './item/PropertyItem';

import type { PropertiesContextProps } from '../../providers/Properties';
import type { Property } from '../../model/Property';

import './PropertyList.css';

type PropertyListState = {
  isRestricted: boolean,
};

class PropertyList extends React.PureComponent<PropertiesContextProps, PropertyListState> {
  state = {
    isRestricted: false,
  };

  componentDidMount() {
    this.fetchProperties();
  }

  fetchProperties = () => {
    this.props.api.fetchAll();
  };

  componentDidUpdate(prevProps: PropertiesContextProps, prevState: PropertyListState) {
    const { api } = this.props;
    if (prevState.isRestricted !== this.state.isRestricted) {
      if (this.state.isRestricted) {
        api.fetchByCoordinates();
      } else {
        api.fetchAll();
      }
    }
  }

  showAll = () => {
    this.setState(() => ({ isRestricted: false }));
  };

  showRestricted = () => {
    this.setState(() => ({ isRestricted: true }));
  };

  renderLoading = () => <div>Loading...</div>;

  renderList = (properties: Property[]) =>
    properties.length > 0 ? (
      properties.map((property: Property) => <PropertyItem property={property} key={property._id} />)
    ) : (
      <h2>No properties were found.</h2>
    );

  render() {
    const { isLoading, properties } = this.props;
    const { isRestricted } = this.state;

    const mapProps = { properties, isRestricted };

    const navigationButtons = [
      { label: 'Show all', action: this.showAll },
      { label: 'Show near', action: this.showRestricted },
    ];

    return (
      <div styleName="wrapper">
        <Map center={getRestrictedCoordinates()} {...mapProps} />
        <ButtonBar buttons={navigationButtons} />
        <h2>Properties found ({isLoading ? '-' : properties.length})</h2>
        <hr />
        {isLoading ? this.renderLoading() : this.renderList(properties)}
      </div>
    );
  }
}

export default PropertyList;
