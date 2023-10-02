import { IcatalogController } from '../controllers/catalogController';
import { Router } from 'express';

class CatalogRouter {
  public router: Router;
  private catalogController: IcatalogController;

  constructor(catalogController: IcatalogController) {
    this.router = Router();
    this.catalogController = catalogController;

    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get('/catalog', this.catalogController.getCatalog);

    this.router.get(
      '/point/:point_id',
      this.catalogController.getCatalogsByPoint,
    );

    this.router.get('/tenant', this.catalogController.getCatalogsByTenant);

    this.router.post('/catalog', this.catalogController.createCatalog);
  };
}

export default CatalogRouter;
