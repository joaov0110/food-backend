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
import { filterTenatWithDiferentId } from '../../utils/diffTenantFilter';

export interface ITenantService {
  tenantByIdShouldExist: (id: number) => Promise<ItenantReturnal | void>;

  tenantByNameShouldExist: (email: string) => Promise<ItenantReturnal | null>;

  tenantByEmailShouldExist: (name: string) => Promise<ItenantReturnal | null>;

  tenantByDocumentShouldExist: (
    document: string,
  ) => Promise<ItenantReturnal | null>;

  tenantByNameShouldNotExist: (name: string) => Promise<void>;

  tenantByEmailShouldNotExist: (email: string) => Promise<void>;

  tenantByDocumentShouldNotExist: (document: string) => Promise<void>;

  checkIfNewTenantEmailIsAllowed: (
    tenant_id: number,
    email: string,
  ) => Promise<ItenantReturnal | void>;

  checkIfNewTenantNameIsAllowed: (
    tenant_id: number,
    name: string,
  ) => Promise<ItenantReturnal | void>;

  checkIfNewTenantDocumentIsAllowed: (
    tenant_id: number,
    document: string,
  ) => Promise<ItenantReturnal | void>;

  createTenant: (
    tenantData: IcreateTenantInfo,
    addressData: Iaddress,
  ) => Promise<ItenantReturnal | void>;

  updateTenant: (data: IupdateTenantRepo) => Promise<ItenantReturnal | void>;

  updateTenantProfilePic: (
    image_url: string,
    image_name: string,
    tenant_id: number,
  ) => Promise<ItenantReturnal | void>;

  updateTenantCoverPic: (
    image_url: string,
    image_name: string,
    tenant_id: number,
  ) => Promise<ItenantReturnal | void>;

  deleteTenant: (id: number) => Promise<ItenantReturnal | void>;
}

export class TenantService implements ITenantService {
  tenantRepo: ITenantRepo;

  constructor(tenantRepo: ITenantRepo) {
    this.tenantRepo = tenantRepo;
  }

  tenantByNameShouldNotExist = async (name: string) => {
    const tenant = await this.tenantRepo.getTenantByName(name);

    if (tenant) {
      throw new Api400Error('A tenant with this name already exists');
    }
  };

  tenantByEmailShouldNotExist = async (email: string) => {
    const tenant = await this.tenantRepo.getTenantByEmail(email);
    if (tenant) {
      throw new Api400Error('A tenant with this email already exists');
    }
  };

  tenantByDocumentShouldNotExist = async (document: string) => {
    const tenant = await this.tenantRepo.getTenantByDocument(document);
    if (tenant) {
      throw new Api400Error('A tenant with this document already exists');
    }
  };

  tenantByIdShouldExist = async (id: number) => {
    const tenant = await this.tenantRepo.getTenantById(id);

    if (!tenant) {
      throw new Api404Error('Tenant not found');
    }

    return tenant;
  };

  tenantByNameShouldExist = async (name: string) => {
    const tenant = await this.tenantRepo.getTenantByName(name);

    if (!tenant) {
      throw new Api404Error('Tenant not found');
    }

    return tenant;
  };

  tenantByEmailShouldExist = async (email: string) => {
    const tenant = await this.tenantRepo.getTenantByEmail(email);
    if (!tenant) {
      throw new Api404Error('Tenant not found');
    }

    return tenant;
  };

  tenantByDocumentShouldExist = async (document: string) => {
    const tenant = await this.tenantRepo.getTenantByDocument(document);

    if (!tenant) {
      throw new Api404Error('Tenant not found');
    }

    return tenant;
  };

  checkIfNewTenantEmailIsAllowed = async (tenant_id: number, email: string) => {
    const tenant = await this.tenantRepo.getTenantByEmail(
      email,
      filterTenatWithDiferentId(tenant_id),
    );

    if (tenant) {
      throw new Api406Error('Tenant email already in use');
    }
  };

  checkIfNewTenantNameIsAllowed = async (tenant_id: number, name: string) => {
    const tenant = await this.tenantRepo.getTenantByName(
      name,
      filterTenatWithDiferentId(tenant_id),
    );

    if (tenant) {
      throw new Api406Error('Tenant name already in use');
    }
  };

  checkIfNewTenantDocumentIsAllowed = async (
    tenant_id: number,
    document: string,
  ) => {
    const tenant = await this.tenantRepo.getTenantByDocument(
      document,
      filterTenatWithDiferentId(tenant_id),
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

  updateTenantProfilePic = async (
    image_url: string,
    image_name: string,
    tenant_id: number,
  ) => {
    try {
      await this.tenantRepo.updateTenantProfilePic(
        image_url,
        image_name,
        tenant_id,
      );
    } catch (err) {
      console.error(err);
      throw new Api500Error(
        'Error updating tenant profile pic. Try again later',
      );
    }
  };

  updateTenantCoverPic = async (
    image_url: string,
    image_name: string,
    tenant_id: number,
  ) => {
    try {
      await this.tenantRepo.updateTenantCoverPic(
        image_url,
        image_name,
        tenant_id,
      );
    } catch (err) {
      console.error(err);
      throw new Api500Error('Error updating tenant cover pic. Try again later');
    }
  };

  deleteTenant = async (tenant_id: number) => {
    const removed = await this.tenantRepo.deleteTenant(tenant_id);

    if (!removed) {
      throw new Api500Error('Error deleting tenant. Try again later');
    }
  };
}
