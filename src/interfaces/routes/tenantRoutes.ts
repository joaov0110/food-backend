import { Router } from 'express';

import { ITenantController } from '../controllers/tenantController';

import createTenant from '../../utils/validations/createTenantValidator';
import updateTenant from '../../utils/validations/updateTenantValidator';

import { uploader } from '../../services/multer';

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

    this.router.post(
      '/tenant',
      createTenant,
      this.tenantController.createTenant,
    );

    this.router.put(
      '/tenant',
      updateTenant,
      this.tenantController.updateTenant,
    );

    this.router.put(
      '/tenant/profilePicture',
      uploader.single('image'),
      this.tenantController.updateTenantProfilePicture,
    );

    this.router.delete('/tenant', this.tenantController.removeTenant);
  }
}
