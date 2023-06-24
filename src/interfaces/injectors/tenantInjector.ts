import { TenantRepo } from '../repositories/tenantRepo';
import { TenantService } from '../services/tenantService';
import { TenantController } from '../controllers/tenantController';
import { TenantRoutes } from '../routes/tenantRoutes';

const tenantRepo = new TenantRepo();

const tenantService = new TenantService(tenantRepo);

const tenantController = new TenantController(tenantService);

const tenantRoutes = new TenantRoutes(tenantController);

export default tenantRoutes.router;
