import { IgetCatalog, IcreateCatalog } from '../../schemas/catalog';
import { Api400Error } from '../../utils/errors/api400Error';
import { Api404Error } from '../../utils/errors/api404Error';
import { Api500Error } from '../../utils/errors/api500Error';
import { IcatalogRepo } from '../repositories/catalogRepo';

export interface IcatalogService {
  catalogByIdShouldExist: (catalog_id: number) => Promise<IgetCatalog | void>;
  catalogsByPointShouldExist: (
    point_id: number,
  ) => Promise<IgetCatalog[] | void>;
  catalogsByTenantShouldExist: (
    tenant_id: number,
  ) => Promise<IgetCatalog[] | void>;
  catalogByNameShouldNotExist: (catalog_name: string) => Promise<void>;
  createCatalog: (
    data: IcreateCatalog,
    point_id: number,
  ) => Promise<IgetCatalog | void>;
}

class CatalogService implements IcatalogService {
  private catalogRepo: IcatalogRepo;

  constructor(catalogRepo: IcatalogRepo) {
    this.catalogRepo = catalogRepo;
  }

  catalogByIdShouldExist = async (catalog_id: number) => {
    const catalog = await this.catalogRepo.getCatalog(catalog_id);

    if (!catalog) {
      throw new Api404Error('Catalog not found');
    }

    return catalog;
  };

  catalogsByPointShouldExist = async (point_id: number) => {
    const catalogs = await this.catalogRepo.getCatalogsByPoint(point_id);

    if (!catalogs.length) {
      throw new Api404Error('Not catalogs found for this point');
    }

    return catalogs;
  };

  catalogsByTenantShouldExist = async (tenant_id: number) => {
    const catalogs = await this.catalogRepo.getCatalogsByTenant(tenant_id);

    if (!catalogs.length) {
      throw new Api404Error('Not catalogs found for this tenant');
    }

    return catalogs;
  };

  catalogByNameShouldNotExist = async (catalog_name: string) => {
    const catalog = await this.catalogRepo.getCatalogByName(catalog_name);

    if (catalog) {
      throw new Api400Error('Catalog this name already exists');
    }
  };

  createCatalog = async (data: IcreateCatalog, point_id: number) => {
    try {
      return await this.catalogRepo.createCatalog(data, point_id);
    } catch (err) {
      throw new Api500Error('Error creating catalog, try again later');
    }
  };
}

export default CatalogService;
