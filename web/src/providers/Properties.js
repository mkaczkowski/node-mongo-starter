// @flow
/**
 * Properties Context responsible for storing and passing properties together with public methods to manage it
 */
import * as React from 'react';
import _findIndex from 'lodash/findIndex';
import updateImmutable from 'immutability-helper';
import * as PropertyApi from '../api/property';
import type { Property } from '../model/Property';
import type { GetPropertiesAPI, GetPropertyByIdAPI, UpdatePropertyAPI } from '../api/property';

export type PropertiesProviderState = {
  isLoading: boolean,
  isRestricted: boolean,
  properties: Property[],
};

type PropertiesProviderProps = {
  children: any,
};

export type ActionType = {
  // eslint-disable-next-line react/no-unused-prop-types
  values?: Property, // eslint-disable-next-line react/no-unused-prop-types
  onSuccess: () => void, // eslint-disable-next-line react/no-unused-prop-types
  onError: (err: any) => void,
};

export type PropertiesContextProps = {
  +isLoading: boolean,
  +isRestricted: boolean,
  +showAll: () => any,
  +showRestricted: () => any,
  +properties: Property[],
  api: {
    +update: (params: ActionType) => Promise<any>,
    +fetchById: (id: string) => Promise<any>,
  },
};

//$FlowIssue
export const PropertiesContext = React.createContext();

class PropertiesProvider extends React.PureComponent<PropertiesProviderProps, PropertiesProviderState> {
  state = {
    isLoading: true,
    isRestricted: false,
    properties: [],
  };

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps: PropertiesProviderProps, prevState: PropertiesProviderState) {
    if (prevState.isRestricted !== this.state.isRestricted) {
      this.fetch();
    }
  }

  fetch = async () => {
    const { isRestricted } = this.state;
    this.setState(() => ({ properties: [], isLoading: true }));
    const query: any = isRestricted ? this.getCoordinates() : undefined;
    const properties = await PropertyApi.getProperties(query);
    this.setState(() => ({ properties, isLoading: false }));
  };

  fetchAll = () => this.setState(() => ({ isRestricted: false }));

  fetchByCoordinates = () => this.setState(() => ({ isRestricted: true }));

  getCoordinates = () => {
    // read coordinates from env variables
    const coordinatesString = process.env.RESTRICT_COORDINATES;
    const [latitude, longitude] = coordinatesString ? coordinatesString.split(' ') : [];
    return { latitude, longitude };
  };

  fetchById = async (id: string) => {
    const data: GetPropertyByIdAPI = { id };
    return PropertyApi.getPropertyById(data);
  };

  update = async ({ values, onSuccess, onError }: ActionType) => {
    const data: UpdatePropertyAPI = {
      property: { ...values },
    };
    try {
      const updatedProperty = await PropertyApi.updateProperty(data);
      this.refreshUpdatedProperty(updatedProperty);
      onSuccess();
    } catch (err) {
      onError(err);
    }
  };

  refreshUpdatedProperty = (property: Property) => {
    const itemIndex = _findIndex(this.state.properties, { _id: property._id });
    this.setState(state => ({ properties: updateImmutable(state.properties, { [itemIndex]: { $set: property } }) }));
  };

  render() {
    //context properties available from all subscribed consumers
    const value: PropertiesContextProps = {
      isLoading: this.state.isLoading,
      isRestricted: this.state.isRestricted,
      properties: this.state.properties,
      showAll: this.fetchAll,
      showRestricted: this.fetchByCoordinates,
      api: {
        fetchById: this.fetchById,
        update: this.update,
      },
    };
    //prettier-ignore
    return (
      <PropertiesContext.Provider value={value}>
        {this.props.children}
      </PropertiesContext.Provider>
    );
  }
}

export default PropertiesProvider;
