import { Request, Response, NextFunction } from 'express';
import {
  IcreateTenantRequest,
  IupdateTenantRequest,
} from '../interfaces/tenant';
import { TenantRepo } from '../repositories/tenantRepo';
import { Service, Inject } from 'typedi';
import { HTTP } from '../constants/http';
import { PasswordHash } from '../utils/hashPassword';
import { Api404Error } from '../utils/errors/api404Error';
import { Api400Error } from '../utils/errors/api400Error';
import { Api500Error } from '../utils/errors/api500Error';
import { Api406Error } from '../utils/errors/api406Error';
import dayjs from 'dayjs';

type createTenantReq = Request<any, any, IcreateTenantRequest>;
type updateTenantReq = Request<any, any, IupdateTenantRequest>;
type removeTenantReq = Request<any, any, { tenant_id: number }>;

interface ITenantService {
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

@Service()
export class TenantService implements ITenantService {
  tenantRepo: TenantRepo;

  constructor(@Inject() tenantRepo: TenantRepo) {
    this.tenantRepo = tenantRepo;
  }

  public getTenant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const tenant = await this.tenantRepo.getTenantById(1);

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
    } = req.body;

    let passwordHash: string;

    try {
      const tenantWithSameInfoExists = await this.tenantRepo.filterTenant({
        OR: [
          {
            name: {
              equals: name,
            },
          },
          {
            email: {
              equals: email,
            },
          },
          {
            document: {
              equals: document,
            },
          },
        ],
      });

      if (tenantWithSameInfoExists) {
        throw new Api400Error('Tenant already exists');
      }
    } catch (err) {
      return next(err);
    }

    try {
      passwordHash = PasswordHash.hashPassword(password);
    } catch (err) {
      return next(err);
    }

    try {
      const tenantCreated = await this.tenantRepo.createTenant({
        name,
        document,
        email,
        password: passwordHash,
        accountant_email,
        accountant_name,
        accountant_phone,
      });

      if (!tenantCreated) {
        throw new Api500Error('An error has ocurred. Please try again later');
      }
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
    } = req.body;

    let currentTenant;

    const differentTenantFilter = {
      NOT: {
        id: {
          equals: tenant_id,
        },
      },
    };

    try {
      currentTenant = await this.tenantRepo.getTenantById(tenant_id);
      if (!currentTenant) {
        throw new Api404Error('Tenant not found');
      }
    } catch (err) {
      return next(err);
    }

    if (name !== currentTenant.name) {
      try {
        const tenantWithSameNameExists = await this.tenantRepo.getTenantByName(
          name,
          differentTenantFilter,
        );

        if (tenantWithSameNameExists) {
          throw new Api406Error('Name already in use');
        }
      } catch (err) {
        return next(err);
      }
    }

    if (email !== currentTenant.email) {
      try {
        const tenantWithSameEmailExists =
          await this.tenantRepo.getTenantByEmail(email, differentTenantFilter);

        if (tenantWithSameEmailExists) {
          throw new Api406Error('Email already in use');
        }
      } catch (err) {
        return next(err);
      }
    }

    if (document !== currentTenant.document) {
      try {
        const tenantWithSameDocumentExists =
          await this.tenantRepo.getTenantByDocument(
            document,
            differentTenantFilter,
          );

        if (tenantWithSameDocumentExists) {
          throw new Api406Error('document already in use');
        }
      } catch (err) {
        return next(err);
      }
    }

    try {
      const tenantUpdated = await this.tenantRepo.updateTenant(tenant_id, {
        name,
        email,
        document,
        accountant_email,
        accountant_name,
        accountant_phone,
        updated_at: dayjs().toDate(),
      });

      if (!tenantUpdated) {
        throw new Api500Error('Error updating tenant. Try again later');
      }

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
      const tenant = await this.tenantRepo.getTenantById(tenant_id);
      if (!tenant) {
        throw new Api404Error('Tenant not found');
      }
    } catch (err) {
      return next(err);
    }

    try {
      const removeTenant = await this.tenantRepo.deleteTenant(tenant_id);
      if (!removeTenant) {
        throw new Api500Error('Error deleting tenant. Try again later');
      }

      return res.status(HTTP.OK).send('Tenant deleted');
    } catch (err) {
      return next(err);
    }
  };
}
