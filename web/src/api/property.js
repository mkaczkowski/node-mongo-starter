//@flow
import type { Property } from '../model/Property';
import { getUrlWithParams } from '../util/query/queryParams';
import fetchIt from './index';

/**
 * Fetch all properties with optional coordinates search query
 * @param property object
 * @returns {Promise<*|void>}
 */
export type GetPropertiesAPI = {
  latitude?: string,
  longitude?: string,
};

export async function getProperties({ latitude, longitude }: GetPropertiesAPI = {}): Object {
  const url = `${process.env.API_URL}/properties`;

  const query: any = {
    latitude,
    longitude,
  };

  const options = {
    method: 'GET',
  };

  return fetchIt(getUrlWithParams(url, query), options);
}

/**
 * Fetch full property by id
 * @param id
 * @returns {Promise<*|void>}
 */
export type GetPropertyByIdAPI = {
  id: string,
};

export async function getPropertyById({ id }: GetPropertyByIdAPI): Object {
  const url = `${process.env.API_URL}/properties/${id}`;
  const options = {
    method: 'GET',
  };
  return fetchIt(url, options);
}

/**
 * Update existing property
 * @param property object
 * @returns {Promise<*|void>}
 */
export type UpdatePropertyAPI = {
  property: Property,
};

export async function updateProperty({ property }: UpdatePropertyAPI): Object {
  const url = `${process.env.API_URL}/properties/${property._id}`;

  const options = {
    method: 'PATCH',
    body: JSON.stringify(property),
  };

  return fetchIt(url, options);
}
