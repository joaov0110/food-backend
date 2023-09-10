import { prisma } from '../../config/prismaClient';
import { PrismaClient } from '@prisma/client';

import {
  Ifilter,
  ItenantReturnal,
  tenantDataToSelect,
  IcreateTenantInfo,
  IupdateTenantRepo,
} from '../../schemas/tenant';
import { Iaddress } from '../../schemas/address';

export interface ITenantRepo {
  getTenantById: (id: number) => Promise<ItenantReturnal | null>;

  getTenantByName: (
    name: string,
    filter?: Ifilter,
  ) => Promise<ItenantReturnal | null>;

  getTenantByEmail: (
    email: string,
    filter?: Ifilter,
  ) => Promise<ItenantReturnal | null>;

  getTenantByDocument: (
    document: string,
    filter?: Ifilter,
  ) => Promise<ItenantReturnal | null>;

  createTenant: (
    tenant: IcreateTenantInfo,
    address: Iaddress,
  ) => Promise<ItenantReturnal | null>;

  updateTenant: (
    updateData: IupdateTenantRepo,
  ) => Promise<ItenantReturnal | null>;

  deleteTenant: (id: number) => Promise<ItenantReturnal | null>;

  filterTenant?: (filter: Ifilter) => Promise<ItenantReturnal | null>;
}

export class TenantRepo implements ITenantRepo {
  private orm: PrismaClient;

  constructor() {
    this.orm = prisma;
  }

  public getTenantById = async (id: number) =>
    await this.orm.tenant.findUnique({
      where: {
        id,
      },
      select: tenantDataToSelect,
    });

  public getTenantByName = async (
    name: string,
    filter: Ifilter = [] as Ifilter,
  ) =>
    await this.orm.tenant.findFirst({
      where: {
        name,
        ...filter,
      },
      select: tenantDataToSelect,
    });

  public getTenantByEmail = async (
    email: string,
    filter: Ifilter = [] as Ifilter,
  ) =>
    await this.orm.tenant.findUnique({
      where: {
        email,
        ...filter,
      },
      select: tenantDataToSelect,
    });

  public getTenantByDocument = async (
    document: string,
    filter: Ifilter = [] as Ifilter,
  ) =>
    await this.orm.tenant.findUnique({
      where: {
        document,
        ...filter,
      },
      select: tenantDataToSelect,
    });

  public filterTenant = async (filter: Ifilter) =>
    await this.orm.tenant.findFirst({
      where: {
        ...filter,
      },
      select: tenantDataToSelect,
    });

  public createTenant = async (
    tenant: IcreateTenantInfo,
    addressData: Iaddress,
  ) =>
    await this.orm.tenant.create({
      data: {
        ...tenant,
        address: {
          create: {
            ...addressData,
          },
        },
      },
      select: tenantDataToSelect,
    });

  public updateTenant = async (updateData: IupdateTenantRepo) => {
    const { id, tenant, address } = updateData;

    return await this.orm.tenant.update({
      where: {
        id,
      },
      data: {
        ...tenant,
        address: {
          update: {
            ...address,
          },
        },
      },
      select: tenantDataToSelect,
    });
  };

  public deleteTenant = async (id: number) =>
    await this.orm.tenant.delete({
      where: {
        id,
      },
      select: tenantDataToSelect,
    });
}
