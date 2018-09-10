// @flow
import queryString from 'qs';

// eslint-disable-next-line import/prefer-default-export
export const getUrlWithParams = (url: any, params: Object) => {
  if (!url) throw new Error('url is not specified!');
  return `${url}?${queryString.stringify(params, { sort: false })}`;
};
