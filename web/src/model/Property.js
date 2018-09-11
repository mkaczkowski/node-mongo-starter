export type Property = {
  _id: string,
  owner: string,
  address: {
    line1: string,
    line2?: string,
    line3?: string,
    line4: string,
    postCode: string,
    city: string,
    country: string,
  },
  airbnbId: number,
  numberOfBedrooms: number,
  numberOfBathrooms: number,
  incomeGenerated: number,
  location: {
    coordinates: number[]
  },
};
