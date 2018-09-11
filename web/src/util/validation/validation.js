export const required = value => (!value ? 'Field is required' : undefined);

// eslint-disable-next-line no-restricted-globals
export const number = value => (value && isNaN(Number(value)) ? 'Invalid number' : undefined);
