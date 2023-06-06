import { Request, Response, NextFunction } from 'express';

export interface ItenantData {
  id: number;
  name: string;
  document: string;
  email: string;
  accountant_name: string;
  accountant_email: string;
  accountant_phone: string;
  is_new_tenant: boolean;
  image_url: string | null;
  bgImage_url: string | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface ItenantDataWithPassword extends ItenantData {
  password: string;
}

export interface IcreateTenantRequest {
  name: string;
  document: string;
  email: string;
  password: string;
  accountant_name: string;
  accountant_email: string;
  accountant_phone: string;
}

export interface updateTenantData {
  name: string;
  document: string;
  email: string;
  accountant_name: string;
  accountant_email: string;
  accountant_phone: string;
}

export interface IupdateTenantRequest extends updateTenantData {
  tenant_id: number;
}

export interface IupdateTenant extends updateTenantData {
  updated_at: Date;
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
