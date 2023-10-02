import { prisma } from '../../services/prismaClient';
import {
  IgetCatalog,
  IcreateCatalog,
  catalogDataToSelect,
} from '../../schemas/catalog';
import dayjs from 'dayjs';

export interface IcatalogRepo {
  getCatalog: (catalog_id: number) => Promise<IgetCatalog | null>;
  getCatalogByName: (catalog_name: string) => Promise<IgetCatalog | null>;
  getCatalogsByPoint: (point_id: number) => Promise<IgetCatalog[]>;
  getCatalogsByTenant: (tenant_id: number) => Promise<IgetCatalog[]>;
  createCatalog: (
    data: IcreateCatalog,
    point_id: number,
  ) => Promise<IgetCatalog | void>;
}

class CatalogRepo implements IcatalogRepo {
  private orm;

  constructor() {
    this.orm = prisma;
  }

  getCatalog = async (catalog_id: number) => {
    try {
      return await this.orm.catalog.findUnique({
        where: {
          id: catalog_id,
        },
        select: catalogDataToSelect,
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };

  getCatalogsByPoint = async (point_id: number) => {
    try {
      return await this.orm.catalog.findMany({
        where: {
          points: {
            some: {
              point_id,
            },
          },
        },
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };

  getCatalogsByTenant = async (tenant_id: number) => {
    try {
      return await this.orm.catalog.findMany({
        where: {
          points: {
            some: {
              point: {
                tenant_id,
              },
            },
          },
        },
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };

  getCatalogByName = async (catalog_name: string) => {
    try {
      return await this.orm.catalog.findFirst({
        where: {
          name: catalog_name,
        },
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };

  createCatalog = async (data: IcreateCatalog, point_id: number) => {
    try {
      return await this.orm.catalog.create({
        data: {
          ...data,
          points: {
            create: [
              {
                point_id,
                created_at: dayjs().toDate(),
              },
            ],
          },
        },
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };
}

export default CatalogRepo;
