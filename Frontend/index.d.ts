export interface selectedPharmacy {
  id: string;
  name: string;
  address: string;
  email: string;
  website: string;
  Tel: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  services: string[];
}

export interface User {
  _id: number;
  name: string;
  email: string;
  password?: string;
  role?: 'admin' | 'user';
  token?: string;
}
