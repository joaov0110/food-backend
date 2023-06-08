import { Router } from 'express';
import { Service, Inject } from 'typedi';
import { checkSchema } from 'express-validator';
import { TenantService } from '../services/tenantService';
import { tenantSchema } from '../utils/validators/tenant';
import { validatorsReturnal } from '../utils/validators/validatorsReturnal';

@Service()
export class TenantController {
  public router: Router;
  private tenantService: TenantService;

  constructor(@Inject() tenantService: TenantService) {
    this.router = Router();
    this.tenantService = tenantService;

    this.routes();
  }

  private routes() {
    this.router.get('/tenant', this.tenantService.getTenant);

    this.router.post(
      '/tenant',
      checkSchema(tenantSchema),
      validatorsReturnal,
      this.tenantService.createTenant,
    );

    this.router.put(
      '/tenant',
      checkSchema(tenantSchema),
      validatorsReturnal,
      this.tenantService.updateTenant,
    );

    this.router.delete('/tenant', this.tenantService.removeTenant);
  }
}
