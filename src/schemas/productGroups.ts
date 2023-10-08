import { IproductData } from './product';

export interface IproductGroupsData {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  product: IproductData[];
}

export interface IcreateProductGroup {
  name: string;
  created_at: Date;
}

export interface IupdateProductGroup {
  name: string;
  updated_at: Date;
}

export const productGroupDataToSelect = {
  id: true,
  name: true,
  created_at: true,
  updated_at: true,
  product: true,
};
