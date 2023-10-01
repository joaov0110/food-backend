import config from 'config';
import { Request, Response, NextFunction } from 'express';
import {
  IcreateTenantRequest,
  IupdateTenantRequest,
} from '../../schemas/tenant';
import S3Actions from '../../utils/S3Actions';
import { ITenantService } from '../services/tenantService';
import { HTTP } from '../../constants/http';
import { PasswordHash } from '../../utils/hashPassword';
import dayjs from 'dayjs';
import { Api400Error } from '../../utils/errors/api400Error';

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

  updateTenantProfilePicture: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  updateTenantCoverPicture: (
    req: Request,
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
      const tenant = await this.tenantService.tenantByIdShouldExist(6);

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

    try {
      await Promise.all([
        this.tenantService.tenantByNameShouldNotExist(name),
        this.tenantService.tenantByEmailShouldNotExist(email),
        this.tenantService.tenantByDocumentShouldNotExist(document),
      ]);
    } catch (err) {
      return next(err);
    }

    try {
      const tenantCreated = await this.tenantService.createTenant(
        {
          name,
          document,
          email,
          password: PasswordHash.hashPassword(password),
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
      currentTenant = await this.tenantService.tenantByIdShouldExist(tenant_id);
    } catch (err) {
      return next(err);
    }

    try {
      if (name !== currentTenant!.name) {
        await this.tenantService.checkIfNewTenantNameIsAllowed(tenant_id, name);
      }

      if (email !== currentTenant!.email) {
        await this.tenantService.checkIfNewTenantEmailIsAllowed(
          tenant_id,
          email,
        );
      }

      if (document !== currentTenant!.document) {
        await this.tenantService.checkIfNewTenantDocumentIsAllowed(
          tenant_id,
          document,
        );
      }
    } catch (err) {
      return next(err);
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
        address: {
          ...address,
          updated_at: dayjs().toDate(),
        },
      });

      return res.status(HTTP.OK).send('Tenant updated');
    } catch (err) {
      return next(err);
    }
  };

  public updateTenantProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.tenantService.tenantByIdShouldExist(6);
    } catch (err) {
      return next(err);
    }

    try {
      const file = req.file!;
      const fileName = 'tenant-6-' + file.originalname;

      const fileUrl = await S3Actions.uploadFile({
        bucketName: config.get('aws.tenantProfilePicBucket'),
        fileName: fileName,
        fileContent: file.buffer,
      });

      await this.tenantService.updateTenantProfilePic(fileUrl, fileName, 6);

      return res.status(HTTP.OK).send('Profile image updated');
    } catch (err) {
      return next(err);
    }
  };

  public updateTenantCoverPicture = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.tenantService.tenantByIdShouldExist(6);
    } catch (err) {
      return next(err);
    }

    try {
      const file = req.file!;
      const fileName = 'tenant-6-' + file.originalname;

      const fileUrl = await S3Actions.uploadFile({
        bucketName: config.get('aws.tenantCoverPicBucker'),
        fileName: fileName,
        fileContent: file.buffer,
      });

      await this.tenantService.updateTenantCoverPic(fileUrl, fileName, 6);

      return res.status(HTTP.OK).send('Cover image updated');
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
      await this.tenantService.tenantByIdShouldExist(tenant_id);

      await this.tenantService.deleteTenant(tenant_id);

      return res.status(HTTP.OK).send('Tenant deleted');
    } catch (err) {
      return next(err);
    }
  };
}
