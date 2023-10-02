import { Router } from 'express';

import CatalogRepo from '../repositories/catalogRepo';
import { TenantRepo } from '../repositories/tenantRepo';
import PointRepo from '../repositories/pointRepo';

import CatalogService from '../services/catalogService';
import { TenantService } from '../services/tenantService';
import PointService from '../services/pointService';

import CatalogController from '../controllers/catalogController';

import CatalogRouter from '../routes/catalogRoutes';

class CatalogFactory {
  private catalogRepo: CatalogRepo;
  private tenantRepo: TenantRepo;
  private pointRepo: PointRepo;

  private catalogService: CatalogService;
  private tenantService: TenantService;
  private pointService: PointService;

  private catalogController: CatalogController;

  public catalogRouter: Router;

  constructor() {
    this.catalogRepo = new CatalogRepo();
    this.tenantRepo = new TenantRepo();
    this.pointRepo = new PointRepo();

    this.catalogService = new CatalogService(this.catalogRepo);
    this.tenantService = new TenantService(this.tenantRepo);
    this.pointService = new PointService(this.pointRepo);

    this.catalogController = new CatalogController(
      this.catalogService,
      this.pointService,
      this.tenantService,
    );

    this.catalogRouter = new CatalogRouter(this.catalogController).router;
  }
}

const catalogFactory = new CatalogFactory().catalogRouter;

export default catalogFactory;
