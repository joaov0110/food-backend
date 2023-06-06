import { prisma } from '../config/prismaClient';
import {
  Ifilter,
  ItenantData,
  IcreateTenantRequest,
  IupdateTenant,
} from '../interfaces/tenant';
import { Service } from 'typedi';
import { PrismaClient } from '@prisma/client';

const dataToSelect = {
  id: true,
  name: true,
  document: true,
  email: true,
  accountant_name: true,
  accountant_email: true,
  accountant_phone: true,
  is_new_tenant: true,
  image_url: true,
  bgImage_url: true,
  created_at: true,
  updated_at: true,
};

interface ITenantRepo {
  getTenantById: (id: number) => Promise<ItenantData | null>;

  getTenantByName: (
    name: string,
    filter?: Ifilter,
  ) => Promise<ItenantData | null>;

  getTenantByEmail: (
    email: string,
    filter?: Ifilter,
  ) => Promise<ItenantData | null>;

  getTenantByDocument: (
    document: string,
    filter?: Ifilter,
  ) => Promise<ItenantData | null>;

  filterTenant: (filter: Ifilter) => Promise<ItenantData | null>;

  createTenant: (data: IcreateTenantRequest) => Promise<ItenantData | null>;

  updateTenant: (
    id: number,
    data: IupdateTenant,
  ) => Promise<ItenantData | null>;

  deleteTenant: (id: number) => Promise<ItenantData | null>;
}

@Service()
export class TenantRepo implements ITenantRepo {
  private orm: PrismaClient;

  constructor() {
    this.orm = prisma;
  }

  getTenantById = async (id: number) =>
    await this.orm.tenant.findUnique({
      where: {
        id,
      },
      select: dataToSelect,
    });

  getTenantByName = async (name: string, filter: Ifilter = [] as Ifilter) =>
    await this.orm.tenant.findFirst({
      where: {
        name,
        ...filter,
      },
      select: dataToSelect,
    });

  getTenantByEmail = async (email: string, filter: Ifilter = [] as Ifilter) =>
    await this.orm.tenant.findUnique({
      where: {
        email,
        ...filter,
      },
      select: dataToSelect,
    });

  getTenantByDocument = async (
    document: string,
    filter: Ifilter = [] as Ifilter,
  ) =>
    await this.orm.tenant.findUnique({
      where: {
        document,
        ...filter,
      },
      select: dataToSelect,
    });

  filterTenant = async (filter: Ifilter) =>
    await this.orm.tenant.findFirst({
      where: {
        ...filter,
      },
    });

  createTenant = async (data: IcreateTenantRequest) =>
    await this.orm.tenant.create({
      data: {
        ...data,
      },
      select: dataToSelect,
    });

  updateTenant = async (id: number, data: IupdateTenant) =>
    await this.orm.tenant.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
      select: dataToSelect,
    });

  deleteTenant = async (id: number) =>
    await this.orm.tenant.delete({
      where: {
        id,
      },
      select: dataToSelect,
    });
}
