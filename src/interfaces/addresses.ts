export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressesResponse {
  status: string;
  results: number;
  data: Address[];
}

export interface AddressResponse {
  status: string;
  data: Address;
}
