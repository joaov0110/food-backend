import { Request, Response, NextFunction } from 'express';
import { IcatalogService } from '../services/catalogService';
import { IproductGroupsService } from '../services/productGroupsService';
import { HTTP } from '../../constants/http';
import dayjs from 'dayjs';

type getProductGroupRequest = Request<{ productGroup_id: string }, any, any>;
type getProductGroupsRequest = Request<{ catalog_id: string }, any, any>;
type createProductGroupRequest = Request<
  any,
  any,
  { name: string; catalog_id: number }
>;

export interface IproductGroupsController {
  getProductGroup: (
    req: getProductGroupRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getProductGroups: (
    req: getProductGroupsRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  createProductGroup: (
    req: createProductGroupRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

class ProductGroupsController implements IproductGroupsController {
  private productGroupService: IproductGroupsService;
  private catalogService: IcatalogService;

  constructor(
    productGroupService: IproductGroupsService,
    catalogService: IcatalogService,
  ) {
    this.productGroupService = productGroupService;
    this.catalogService = catalogService;
  }

  getProductGroup = async (
    req: getProductGroupRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const id = parseInt(req.params.productGroup_id, 10);
    console.log('dfsdfsdfsdf', id);

    try {
      const productGroup =
        await this.productGroupService.productGroupByIdShouldExist(id);

      return res.status(HTTP.OK).send(productGroup);
    } catch (err) {
      return next(err);
    }
  };

  getProductGroups = async (
    req: getProductGroupsRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const catalog_id = parseInt(req.params.catalog_id, 10);

    try {
      await this.catalogService.catalogByIdShouldExist(catalog_id);
    } catch (err) {
      return next(err);
    }

    try {
      const productGroups =
        await this.productGroupService.productGroupsByCatalogShouldExist(
          catalog_id,
        );

      return res.status(HTTP.OK).send(productGroups);
    } catch (err) {
      return next(err);
    }
  };

  createProductGroup = async (
    req: createProductGroupRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { name, catalog_id } = req.body;

    try {
      await this.catalogService.catalogByIdShouldExist(catalog_id);
      await this.productGroupService.productGroupByNameShouldNotExist(name);
    } catch (err) {
      return next(err);
    }

    try {
      await this.productGroupService.createProductGroup(
        {
          name,
          created_at: dayjs().toDate(),
        },
        catalog_id,
      );

      return res.status(HTTP.CREATED).send('Product group created');
    } catch (err) {
      return next(err);
    }
  };
}

export default ProductGroupsController;
