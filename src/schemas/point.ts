import { Iaddress, addressDataToGet } from './address';

export interface IgetPoint {
  id: number;
  name: string;
  email: string;
  phone: string;
  image_url?: string | null;
  bgImage_url?: string | null;
  created_at: Date;
  updated_at: Date | null;

  pointAddress?: Iaddress;
}

export interface IcreatePoint {
  name: string;
  email: string;
  phone: string;
  image_url?: string | null;
  bgImage_url?: string | null;
  created_at: Date;
}

export interface IcreatePointRequestData {
  tenant_id: number;
  name: string;
  email: string;
  phone: string;
}

export interface IupdatePoint {
  name: string;
  email: string;
  phone: string;
  pointAddress: Omit<Iaddress, 'created_at'>;
}

export interface IupdatePointRequest {
  point_id: string;
  name: string;
  email: string;
  phone: string;
  address: Omit<Iaddress, 'created_at' | 'updated_at'>;
}

export const pointDataToSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image_url: true,
  bgImage_url: true,
  created_at: true,
  updated_at: true,
  address: addressDataToGet,
};
