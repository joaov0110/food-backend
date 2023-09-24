import dayjs from 'dayjs';
import { Iaddress } from '../schemas/address';
import {
  ITenantData,
  IcreateTenantInfo,
  IupdateTenantRepo,
  Ifilter,
} from '../schemas/tenant';
import { ITenantRepo } from '../interfaces/repositories/tenantRepo';

class TenantRepoMock implements ITenantRepo {
  private tenants: ITenantData[];

  constructor() {
    this.tenants = [
      {
        id: 0,
        name: 'Ash Ketchun',
        document: '19989101000165',
        email: 'ash@outlook.com',
        accountant_name: 'Nami',
        accountant_email: 'nami@outlook.com',
        accountant_phone: '5511987884556',
        is_new_tenant: true,
        image_url: '',
        bgImage_url: '',
        created_at: dayjs().toDate(),
        updated_at: null,
        address: {
          postalCode: '05790150',
          street: 'Rua Cantanhede',
          street_number: '120',
          district: 'Campo Limpo',
          city: 'São Paulo',
          UF: 'SP',
          created_at: dayjs().toDate(),
          updated_at: null,
        },
      },
    ];
  }

  private findTenant = (by: keyof ITenantData, value: number | string) => {
    return this.tenants.find((tenant) =>
      tenant[by] === value ? tenant : null,
    );
  };

  public getTenantById = async (id: number) => {
    const tenantPromise = new Promise<ITenantData | null>((resolve, reject) => {
      const tenant = this.findTenant('id', id);

      if (tenant) {
        resolve(tenant);
      } else {
        reject(null);
      }
    });

    return await tenantPromise;
  };

  public getTenantByName = async (name: string) => {
    const tenantPromise = new Promise<ITenantData | null>((resolve, reject) => {
      const tenant = this.findTenant('name', name);

      if (tenant) {
        resolve(tenant);
      } else {
        reject(null);
      }
    });

    return await tenantPromise;
  };

  public getTenantByEmail = async (email: string) => {
    const tenantPromise = new Promise<ITenantData | null>((resolve, reject) => {
      const tenant = this.findTenant('email', email);

      if (tenant) {
        resolve(tenant);
      } else {
        reject(null);
      }
    });

    return await tenantPromise;
  };

  public getTenantByDocument = async (document: string) => {
    const tenantPromise = new Promise<ITenantData | null>((resolve, reject) => {
      const tenant = this.findTenant('document', document);

      if (tenant) {
        resolve(tenant);
      } else {
        reject(null);
      }
    });

    return await tenantPromise;
  };

  public createTenant = async (
    tenant: IcreateTenantInfo,
    address: Iaddress,
  ) => {
    const tenantPromise = new Promise<ITenantData>((resolve, reject) => {
      const data = {
        id: 1,
        is_new_tenant: true,
        image_url: '',
        bgImage_url: '',
        created_at: dayjs().toDate(),
        updated_at: null,
        address: address,
        ...tenant,
      };

      this.tenants.push(data);

      const findCreatedTenant = this.findTenant('id', 1);

      if (findCreatedTenant) {
        resolve(findCreatedTenant);
      } else {
        reject(null);
      }
    });

    return await tenantPromise;
  };

  public updateTenant = async (updateData: IupdateTenantRepo) => {
    const tenantPromise = new Promise<ITenantData>((resolve, reject) => {
      const { id, tenant, address } = updateData;
      const data = {
        ...{ ...tenant, address: address },
      };

      const tenantsWithUpdatedRecord = this.tenants.map((tenantData) => {
        if (tenantData.id === id) {
          tenantData = {
            ...tenantData,
            ...data,
          };
        }
        return tenantData;
      });

      this.tenants = [...tenantsWithUpdatedRecord];

      const findUpdatedRecord = this.findTenant('id', id);

      if (findUpdatedRecord) {
        resolve(findUpdatedRecord);
      } else {
        reject(null);
      }
    });

    return await tenantPromise;
  };

  public deleteTenant = async (id: number) => {
    const tenantPromise = new Promise<ITenantData>((resolve, reject) => {
      const getTenantToDelete = this.findTenant('id', id);

      const tenantsWithouDeletedRecords = this.tenants.filter(
        (tenantData) => tenantData.id !== id,
      );

      this.tenants = [...tenantsWithouDeletedRecords];

      const canTenantStillBeFound = this.findTenant('id', id);

      if (!canTenantStillBeFound) {
        resolve(getTenantToDelete as ITenantData);
      } else {
        reject(null);
      }
    });

    return await tenantPromise;
  };
}

export default TenantRepoMock;
