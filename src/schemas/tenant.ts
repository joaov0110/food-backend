import { Iaddress, addressDataToGet } from './address';

export interface ITenantData {
  id: number;
  name: string;
  document: string;
  email: string;
  accountant_name: string;
  accountant_email: string;
  accountant_phone: string;
  is_new_tenant: boolean;
  image_name: string | null;
  image_url: string | null;
  bgImage_url: string | null;
  created_at: Date;
  updated_at: Date | null;
  address: Iaddress | null;
}

export interface ItenantReturnal extends ITenantData {}

export interface ItenantReturnalWithPassword extends ItenantReturnal {
  password: string;
}

export interface IcreateTenantInfo {
  name: string;
  document: string;
  email: string;
  password: string;
  accountant_name: string;
  accountant_email: string;
  accountant_phone: string;
}

export interface IcreateTenantRequest extends IcreateTenantInfo {
  address: Iaddress;
}

interface IupdateTenantInfo {
  name: string;
  document: string;
  email: string;
  accountant_name: string;
  accountant_email: string;
  accountant_phone: string;
}

export interface IupdateTenantRequest extends IupdateTenantInfo {
  tenant_id: number;
  address: Iaddress;
}

export interface IupdateTenant extends IupdateTenantInfo {
  updated_at: Date;
}

export interface IupdateTenantRepo {
  id: number;
  tenant: IupdateTenant;
  address: Iaddress;
}

interface IorFilter {
  [key: string]: {
    equals: number | string | undefined;
  };
}

export interface Ifilter {
  OR?: IorFilter[];
  NOT?: IorFilter;
}

export const tenantDataToSelect = {
  id: true,
  name: true,
  document: true,
  email: true,
  accountant_name: true,
  accountant_email: true,
  accountant_phone: true,
  is_new_tenant: true,
  image_name: true,
  image_url: true,
  bgImage_url: true,
  created_at: true,
  updated_at: true,
  address: addressDataToGet,
};
