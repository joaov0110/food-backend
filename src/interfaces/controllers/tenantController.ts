import { Request, Response, NextFunction } from 'express';

import {
  IcreateTenantRequest,
  IupdateTenantRequest,
} from '../../schemas/tenant';

import { ITenantService } from '../services/tenantService';

import { HTTP } from '../../constants/http';

import { PasswordHash } from '../../utils/hashPassword';

import dayjs from 'dayjs';

type createTenantReq = Request<any, any, IcreateTenantRequest>;
type updateTenantReq = Request<any, any, IupdateTenantRequest>;
type removeTenantReq = Request<any, any, { tenant_id: number }>;

export interface ITenantController {
  getTenant: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  createTenant: (
    req: createTenantReq,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  updateTenant: (
    req: updateTenantReq,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  removeTenant: (
    req: removeTenantReq,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export class TenantController implements ITenantController {
  tenantService: ITenantService;

  constructor(tenantService: ITenantService) {
    this.tenantService = tenantService;
  }

  public getTenant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const tenant = await this.tenantService.getTenantById(1);

      return res.status(HTTP.OK).send(tenant);
    } catch (err) {
      return next(err);
    }
  };

  public createTenant = async (
    req: createTenantReq,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      name,
      document,
      email,
      password,
      accountant_name,
      accountant_phone,
      accountant_email,
      address,
    } = req.body;

    let passwordHash: string;

    try {
      await Promise.all([
        this.tenantService.getTenantByName(name),
        this.tenantService.getTenantByEmail(email),
        this.tenantService.getTenantByDocument(document),
      ]);
    } catch (err) {
      return next(err);
    }

    try {
      passwordHash = PasswordHash.hashPassword(password);

      const tenantCreated = this.tenantService.createTenant(
        {
          name,
          document,
          email,
          password: passwordHash,
          accountant_email,
          accountant_name,
          accountant_phone,
        },
        address,
      );

      return res.status(HTTP.CREATED).json(tenantCreated);
    } catch (err) {
      return next(err);
    }
  };

  public updateTenant = async (
    req: updateTenantReq,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      tenant_id,
      name,
      email,
      document,
      accountant_email,
      accountant_name,
      accountant_phone,
      address,
    } = req.body;

    let currentTenant;
    try {
      currentTenant = await this.tenantService.getTenantById(tenant_id);
    } catch (err) {
      return next(err);
    }

    try {
      if (name !== currentTenant!.name) {
        await this.tenantService.tenantWithSameNameAlreadyExists(
          tenant_id,
          name,
        );
      }

      if (email !== currentTenant!.email) {
        await this.tenantService.tenantWithSameEmailAlreadyExists(
          tenant_id,
          email,
        );
      }

      if (document !== currentTenant!.document) {
        await this.tenantService.tenantWithSameDocumentAlreadyExists(
          tenant_id,
          document,
        );
      }
    } catch (err) {
      next(err);
    }

    try {
      await this.tenantService.updateTenant({
        id: tenant_id,
        tenant: {
          name,
          email,
          document,
          accountant_email,
          accountant_name,
          accountant_phone,
          updated_at: dayjs().toDate(),
        },
        address,
      });

      return res.status(HTTP.OK).send('Tenant updated');
    } catch (err) {
      return next(err);
    }
  };

  public removeTenant = async (
    req: removeTenantReq,
    res: Response,
    next: NextFunction,
  ) => {
    const { tenant_id } = req.body;

    try {
      await this.tenantService.getTenantById(tenant_id);

      await this.tenantService.deleteTenant(tenant_id);

      return res.status(HTTP.OK).send('Tenant deleted');
    } catch (err) {
      return next(err);
    }
  };
}
