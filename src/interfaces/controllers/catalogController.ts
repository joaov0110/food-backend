import { Request, Response, NextFunction } from 'express';
import { IcatalogService } from '../services/catalogService';
import { IcreateCatalogRequest } from '../../schemas/catalog';
import { IPointService } from '../services/pointService';
import { ITenantService } from '../services/tenantService';
import { HTTP } from '../../constants/http';
import dayjs from 'dayjs';

type getCatalogReq = Request<
  any,
  any,
  { catalog_id: number; point_id: number }
>;
type getCatalogsByPointReq = Request<{ point_id: string }, any, any>;
type getCatalogsByTenantReq = Request<any, any, any>;
type createCatalogReq = Request<any, any, IcreateCatalogRequest>;

export interface IcatalogController {
  getCatalog: (
    req: getCatalogReq,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getCatalogsByPoint: (
    req: getCatalogsByPointReq,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getCatalogsByTenant: (
    req: getCatalogsByTenantReq,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  createCatalog: (
    req: createCatalogReq,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

class CatalogController implements IcatalogController {
  private catalogService: IcatalogService;
  private pointService: IPointService;
  private tenantService: ITenantService;

  constructor(
    catalogService: IcatalogService,
    pointService: IPointService,
    tenantService: ITenantService,
  ) {
    this.catalogService = catalogService;
    this.pointService = pointService;
    this.tenantService = tenantService;
  }

  getCatalog = async (
    req: getCatalogReq,
    res: Response,
    next: NextFunction,
  ) => {
    const { catalog_id, point_id } = req.body;

    try {
      Promise.all([
        await this.tenantService.tenantByIdShouldExist(6),
        await this.pointService.pointByIdShouldExist(point_id),
      ]);

      const catalog = await this.catalogService.catalogByIdShouldExist(
        catalog_id,
      );

      return res.status(HTTP.OK).send(catalog);
    } catch (err) {
      return next(err);
    }
  };

  getCatalogsByPoint = async (
    req: getCatalogsByPointReq,
    res: Response,
    next: NextFunction,
  ) => {
    const point_id = parseInt(req.params.point_id, 10);

    try {
      Promise.all([
        await this.tenantService.tenantByIdShouldExist(6),
        await this.pointService.pointByIdShouldExist(point_id),
      ]);

      const catalogs = await this.catalogService.catalogsByPointShouldExist(
        point_id,
      );

      return res.status(HTTP.OK).json(catalogs);
    } catch (err) {
      return next(err);
    }
  };

  getCatalogsByTenant = async (
    req: getCatalogsByTenantReq,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.tenantService.tenantByIdShouldExist(6);
      const catalogs = await this.catalogService.catalogsByTenantShouldExist(6);

      return res.status(HTTP.OK).json(catalogs);
    } catch (err) {
      return next(err);
    }
  };

  createCatalog = async (
    req: createCatalogReq,
    res: Response,
    next: NextFunction,
  ) => {
    const point_id = parseInt(req.body.point_id, 10);
    const { name } = req.body;

    try {
      Promise.all([
        await this.tenantService.tenantByIdShouldExist(6),
        await this.pointService.pointByIdShouldExist(point_id),
        await this.catalogService.catalogByNameShouldNotExist(name),
      ]);
    } catch (err) {
      return next(err);
    }

    try {
      await this.catalogService.createCatalog(
        {
          name,
          created_at: dayjs().toDate(),
        },
        point_id,
      );

      return res.status(HTTP.CREATED).send('Catalog created');
    } catch (err) {
      return next(err);
    }
  };
}

export default CatalogController;
