import {
  IcreateProductGroup,
  IproductGroupsData,
} from '../../schemas/productGroups';
import { Api400Error } from '../../utils/errors/api400Error';
import { Api404Error } from '../../utils/errors/api404Error';
import { IproductGroupRepo } from '../repositories/productGroupsRepo';

export interface IproductGroupsService {
  productGroupByIdShouldExist: (
    id: number,
  ) => Promise<IproductGroupsData | void>;

  productGroupByIdShouldNotExist: (
    productGroup_id: number,
  ) => Promise<IproductGroupsData | void>;

  productGroupByNameShouldNotExist: (
    name: string,
  ) => Promise<IproductGroupsData | void>;

  productGroupsByCatalogShouldExist: (
    catalog_id: number,
  ) => Promise<IproductGroupsData[] | void>;

  createProductGroup: (
    data: IcreateProductGroup,
    catalog_id: number,
  ) => Promise<IproductGroupsData | null | void>;
}

class ProductGroupsService implements IproductGroupsService {
  private productGroupRepo: IproductGroupRepo;

  constructor(productGroupRepo: IproductGroupRepo) {
    this.productGroupRepo = productGroupRepo;
  }

  productGroupByIdShouldExist = async (id: number) => {
    const productGroup = await this.productGroupRepo.getProductGroupById(id);

    if (!productGroup) {
      throw new Api404Error('Product group not found');
    }

    return productGroup;
  };

  productGroupByIdShouldNotExist = async (productGroup_id: number) => {
    const productGroup = await this.productGroupRepo.getProductGroupById(
      productGroup_id,
    );

    if (productGroup) {
      throw new Api400Error('Product group already exists');
    }
  };

  productGroupByNameShouldNotExist = async (name: string) => {
    const productGroup = await this.productGroupRepo.getProductGroupByName(
      name,
    );

    if (productGroup) {
      throw new Api400Error('Product group with this name already exists');
    }
  };

  productGroupsByCatalogShouldExist = async (catalog_id: number) => {
    const productGroups = await this.productGroupRepo.getProductGroupsByCatalog(
      catalog_id,
    );

    if (!productGroups.length) {
      throw new Api404Error('Product groups not found for this catalog');
    }

    return productGroups;
  };

  createProductGroup = async (
    data: IcreateProductGroup,
    catalog_id: number,
  ) => {
    const productGroup = await this.productGroupRepo.createProductGroup(
      data,
      catalog_id,
    );

    return productGroup;
  };
}

export default ProductGroupsService;
