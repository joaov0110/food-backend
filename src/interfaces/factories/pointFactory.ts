import PointRepo from '../repositories/pointRepo';
import PointService from '../services/pointService';
import PointController from '../controllers/pointController';
import PointRouter from '../routes/pointRoutes';

import { TenantService } from '../services/tenantService';
import { TenantRepo } from '../repositories/tenantRepo';

class PointFactory {
  private pointRepo: PointRepo;
  private pointService: PointService;
  private pointController: PointController;
  public pointRouter: PointRouter;

  private tenantService: TenantService;
  private tenantRepo: TenantRepo;

  constructor() {
    this.pointRepo = new PointRepo();
    this.tenantRepo = new TenantRepo();
    this.pointService = new PointService(this.pointRepo);
    this.tenantService = new TenantService(this.tenantRepo);
    this.pointController = new PointController(
      this.pointService,
      this.tenantService,
    );
    this.pointRouter = new PointRouter(this.pointController);
  }
}

const { pointRouter } = new PointFactory();

export default pointRouter.router;
