import { Router } from 'express';
import { IproductGroupsController } from '../controllers/productGroupsController';

class ProductGroupsRoutes {
  public router: Router;
  private productGroupsController: IproductGroupsController;

  constructor(productGroupsController: IproductGroupsController) {
    this.router = Router();
    this.productGroupsController = productGroupsController;

    this.routes();
  }

  private routes() {
    this.router.get(
      '/:productGroup_id',
      this.productGroupsController.getProductGroup,
    );

    this.router.get(
      '/catalog/:catalog_id',
      this.productGroupsController.getProductGroups,
    );

    this.router.post('/', this.productGroupsController.createProductGroup);
  }
}

export default ProductGroupsRoutes;
