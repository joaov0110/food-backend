import { TenantRepo } from '../repositories/tenantRepo';
import { TenantService } from '../services/tenantService';
import { TenantController } from '../controllers/tenantController';
import { TenantRoutes } from '../routes/tenantRoutes';

class TenantFactory {
  private tenantRepo: TenantRepo;
  private tenantService: TenantService;
  private tenantController: TenantController;
  public tenantRoutes: TenantRoutes;

  constructor() {
    this.tenantRepo = new TenantRepo();
    this.tenantService = new TenantService(this.tenantRepo);
    this.tenantController = new TenantController(this.tenantService);
    this.tenantRoutes = new TenantRoutes(this.tenantController);
  }
}

const {
  tenantRoutes: { router },
} = new TenantFactory();

export default router;
