import ProductGroupRepo from '../repositories/productGroupsRepo';
import CatalogRepo from '../repositories/catalogRepo';
import ProductGroupsService from '../services/productGroupsService';
import CatalogService from '../services/catalogService';
import ProductGroupsController from '../controllers/productGroupsController';
import ProductGroupsRoutes from '../routes/productGroupsRoutes';

class ProductGroupFactory {
  private productGroupRepo: ProductGroupRepo;
  private catalogsRepo: CatalogRepo;
  private productGroupService: ProductGroupsService;
  private catalogsService: CatalogService;
  private productGroupsController: ProductGroupsController;
  public productGroupsRouter: ProductGroupsRoutes;

  constructor() {
    this.productGroupRepo = new ProductGroupRepo();
    this.catalogsRepo = new CatalogRepo();

    this.catalogsService = new CatalogService(this.catalogsRepo);
    this.productGroupService = new ProductGroupsService(this.productGroupRepo);

    this.productGroupsController = new ProductGroupsController(
      this.productGroupService,
      this.catalogsService,
    );

    this.productGroupsRouter = new ProductGroupsRoutes(
      this.productGroupsController,
    );
  }
}

const productGroupFactory = new ProductGroupFactory();

export default productGroupFactory.productGroupsRouter.router;
