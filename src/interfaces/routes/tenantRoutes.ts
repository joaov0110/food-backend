import { Router } from 'express';
import { ITenantController } from '../controllers/tenantController';

export class TenantRoutes {
  public router: Router;
  private tenantController: ITenantController;

  constructor(tenantController: ITenantController) {
    this.router = Router();
    this.tenantController = tenantController;

    this.routes();
  }

  private routes() {
    this.router.get('/tenant', this.tenantController.getTenant);

    this.router.post('/tenant', this.tenantController.createTenant);

    this.router.put('/tenant', this.tenantController.updateTenant);

    this.router.delete('/tenant', this.tenantController.removeTenant);
  }
}
