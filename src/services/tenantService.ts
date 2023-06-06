import { Request, Response, NextFunction } from 'express';
import {
  IcreateTenantRequest,
  IupdateTenantRequest,
} from '../interfaces/tenant';
import { TenantRepo } from '../repositories/tenantRepo';
import { Service, Inject } from 'typedi';
import { HTTP } from '../constants/http';
import { hashPassword } from '../utils/hashPassword';
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

  getTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.tenantRepo.getTenantById(1);
      if (!data) {
        throw new Api404Error('Tenant not found');
      }

      return res.status(HTTP.OK).send(data);
    } catch (err) {
      return next(err);
    }
  };

  createTenant = async (
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

    try {
      const tenantExists = await this.tenantRepo.filterTenant({
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
      if (tenantExists) {
        throw new Api400Error('Tenant already exists');
      }
    } catch (err) {
      return next(err);
    }

    let hash;
    try {
      hash = hashPassword(password);
      if (!hash) {
        throw new Api500Error('An error has ocurred. Please try again later');
      }
    } catch (err) {
      return next(err);
    }

    try {
      const createTenant = await this.tenantRepo.createTenant({
        name,
        document,
        email,
        password: hash as string,
        accountant_email,
        accountant_name,
        accountant_phone,
      });

      if (!createTenant) {
        throw new Api500Error('An error has ocurred. Please try again later');
      }
      return res.status(HTTP.CREATED).json(createTenant);
    } catch (err) {
      return next(err);
    }
  };

  updateTenant = async (
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

    let tenant;

    try {
      tenant = await this.tenantRepo.getTenantById(tenant_id);
      if (!tenant) {
        throw new Api404Error('Tenant not found');
      }
    } catch (err) {
      return next(err);
    }

    if (name !== tenant.name) {
      try {
        const nameExists = await this.tenantRepo.getTenantByName(name, {
          NOT: {
            id: {
              equals: tenant_id,
            },
          },
        });

        if (nameExists) {
          throw new Api406Error('Name already in use');
        }
      } catch (err) {
        return next(err);
      }
    }

    if (email !== tenant.email) {
      try {
        const emailExists = await this.tenantRepo.getTenantByEmail(email, {
          NOT: {
            id: {
              equals: tenant_id,
            },
          },
        });

        if (emailExists) {
          throw new Api406Error('Email already in use');
        }
      } catch (err) {
        return next(err);
      }
    }

    if (document !== tenant.document) {
      try {
        const documentExists = await this.tenantRepo.getTenantByDocument(
          document,
          {
            NOT: {
              id: {
                equals: tenant_id,
              },
            },
          },
        );

        if (documentExists) {
          throw new Api406Error('document already in use');
        }
      } catch (err) {
        return next(err);
      }
    }

    try {
      const updateTenant = await this.tenantRepo.updateTenant(tenant_id, {
        name,
        email,
        document,
        accountant_email,
        accountant_name,
        accountant_phone,
        updated_at: dayjs().toDate(),
      });

      if (!updateTenant) {
        throw new Api500Error('Error updating tenant. Try again later');
      }

      return res.status(HTTP.OK).send('Tenant updated');
    } catch (err) {
      return next(err);
    }
  };

  removeTenant = async (
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
      const tenantRemove = await this.tenantRepo.deleteTenant(tenant_id);
      if (!tenantRemove) {
        throw new Api500Error('Error deleting tenant. Try again later');
      }

      return res.status(HTTP.OK).send('Tenant deleted');
    } catch (err) {
      return next(err);
    }
  };
}
