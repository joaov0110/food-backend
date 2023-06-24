import { ITenantRepo } from '../repositories/tenantRepo';
import { Api404Error } from '../../utils/errors/api404Error';
import { Api400Error } from '../../utils/errors/api400Error';
import { Api500Error } from '../../utils/errors/api500Error';
import { Api406Error } from '../../utils/errors/api406Error';
import {
  IcreateTenantInfo,
  ItenantReturnal,
  IupdateTenantRepo,
} from '../../schemas/tenant';
import { Iaddress } from '../../schemas/address';

export interface ITenantService {
  getTenantById: (id: number) => Promise<ItenantReturnal | void>;

  getTenantByEmail: (email: string) => Promise<ItenantReturnal | void>;

  getTenantByName: (name: string) => Promise<ItenantReturnal | void>;

  getTenantByDocument: (document: string) => Promise<ItenantReturnal | void>;

  tenantWithSameEmailAlreadyExists: (
    tenant_id: number,
    email: string,
  ) => Promise<ItenantReturnal | void>;

  tenantWithSameNameAlreadyExists: (
    tenant_id: number,
    name: string,
  ) => Promise<ItenantReturnal | void>;

  tenantWithSameDocumentAlreadyExists: (
    tenant_id: number,
    document: string,
  ) => Promise<ItenantReturnal | void>;

  createTenant: (
    tenantData: IcreateTenantInfo,
    addressData: Iaddress,
  ) => Promise<ItenantReturnal | void>;

  updateTenant: (data: IupdateTenantRepo) => Promise<ItenantReturnal | void>;

  deleteTenant: (id: number) => Promise<ItenantReturnal | void>;
}

export class TenantService implements ITenantService {
  tenantRepo: ITenantRepo;

  constructor(tenantRepo: ITenantRepo) {
    this.tenantRepo = tenantRepo;
  }

  private filterTenatWhereDiferentId = (tenant_id: number) => {
    return {
      NOT: {
        id: {
          equals: tenant_id,
        },
      },
    };
  };

  getTenantById = async (id: number) => {
    const tenant = await this.tenantRepo.getTenantById(1);

    if (!tenant) {
      throw new Api404Error('Tenant not found');
    }

    return tenant;
  };

  getTenantByEmail = async (email: string) => {
    const tenant = await this.tenantRepo.getTenantByEmail(email);

    if (!tenant) {
      throw new Api400Error('Tenant not found');
    }

    return tenant;
  };

  getTenantByName = async (name: string) => {
    const tenant = await this.tenantRepo.getTenantByName(name);

    if (!tenant) {
      throw new Api400Error('Tenant not found');
    }

    return tenant;
  };

  getTenantByDocument = async (document: string) => {
    const tenant = await this.tenantRepo.getTenantByDocument(document);

    if (!tenant) {
      throw new Api400Error('Tenant not found');
    }

    return tenant;
  };

  tenantWithSameEmailAlreadyExists = async (
    tenant_id: number,
    email: string,
  ) => {
    const tenant = await this.tenantRepo.getTenantByEmail(
      email,
      this.filterTenatWhereDiferentId(tenant_id),
    );

    if (tenant) {
      throw new Api406Error('Tenant email already in use');
    }
  };

  tenantWithSameNameAlreadyExists = async (tenant_id: number, name: string) => {
    const tenant = await this.tenantRepo.getTenantByName(
      name,
      this.filterTenatWhereDiferentId(tenant_id),
    );

    if (tenant) {
      throw new Api406Error('Tenant name already in use');
    }
  };

  tenantWithSameDocumentAlreadyExists = async (
    tenant_id: number,
    document: string,
  ) => {
    const tenant = await this.tenantRepo.getTenantByDocument(
      document,
      this.filterTenatWhereDiferentId(tenant_id),
    );

    if (tenant) {
      throw new Api406Error('Tenant document already in use');
    }
  };

  createTenant = async (tenantData: IcreateTenantInfo, address: Iaddress) => {
    const created = await this.tenantRepo.createTenant(tenantData, address);

    if (!created) {
      throw new Api500Error('An error has ocurred. Please try again later');
    }

    return created;
  };

  updateTenant = async (data: IupdateTenantRepo) => {
    const { id, tenant, address } = data;

    const updated = await this.tenantRepo.updateTenant({
      id,
      tenant,
      address,
    });

    if (!updated) {
      throw new Api500Error('Error updating tenant. Try again later');
    }
  };

  deleteTenant = async (tenant_id: number) => {
    const removed = await this.tenantRepo.deleteTenant(tenant_id);

    if (!removed) {
      throw new Api500Error('Error deleting tenant. Try again later');
    }
  };
}
