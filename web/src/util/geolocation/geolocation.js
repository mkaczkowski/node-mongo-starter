// eslint-disable-next-line import/prefer-default-export
export const getRestrictedCoordinates = () => {
  const coordinatesString = process.env.RESTRICT_COORDINATES;
  const [latitude, longitude] = coordinatesString.split(' ');
  return { latitude, longitude };
};
