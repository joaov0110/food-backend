import dayjs from 'dayjs';
import {
  IcreateProductGroup,
  IproductGroupsData,
  productGroupDataToSelect,
} from '../../schemas/productGroups';
import { prisma } from '../../services/prismaClient';

export interface IproductGroupRepo {
  getProductGroupById: (
    id: number,
  ) => Promise<IproductGroupsData | null | void>;

  getProductGroupsByName: (
    name: string,
  ) => Promise<IproductGroupsData[] | null | void>;

  getProductGroupsByCatalog: (
    catalog_id: number,
  ) => Promise<IproductGroupsData[]>;

  getProductGroupByName: (
    name: string,
  ) => Promise<IproductGroupsData | null | void>;

  createProductGroup: (
    data: IcreateProductGroup,
    catalog_id: number,
  ) => Promise<IproductGroupsData | null | void>;
}

class ProductGroupRepo implements IproductGroupRepo {
  private orm;

  constructor() {
    this.orm = prisma;
  }

  public getProductGroupById = async (id: number) => {
    try {
      return await this.orm.productGroups.findUnique({
        where: {
          id,
        },
        select: productGroupDataToSelect,
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };

  public getProductGroupsByName = async (name: string) => {
    try {
      return await this.orm.productGroups.findMany({
        where: {
          name,
        },
        select: productGroupDataToSelect,
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };

  public getProductGroupsByCatalog = async (catalog_id: number) => {
    try {
      return await this.orm.productGroups.findMany({
        where: {
          catalogs: {
            some: {
              catalogs: {
                id: catalog_id,
              },
            },
          },
        },
        select: productGroupDataToSelect,
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };

  public getProductGroupByName = async (name: string) => {
    try {
      return await this.orm.productGroups.findFirst({
        where: {
          name,
        },
        select: productGroupDataToSelect,
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };

  public createProductGroup = async (
    data: IcreateProductGroup,
    catalog_id: number,
  ) => {
    try {
      return await this.orm.productGroups.create({
        data: {
          ...data,
          catalogs: {
            create: [
              {
                catalog_id,
                created_at: dayjs().toDate(),
              },
            ],
          },
        },
        select: productGroupDataToSelect,
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };
}

export default ProductGroupRepo;
