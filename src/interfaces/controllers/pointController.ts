import config from 'config';
import { Request, Response, NextFunction } from 'express';
import { IPointService } from '../services/pointService';
import { HTTP } from '../../constants/http';
import {
  IcreatePointRequestData,
  IupdatePointRequest,
} from '../../schemas/point';
import { ITenantService } from '../services/tenantService';
import dayjs from 'dayjs';
import S3Actions from '../../utils/S3Actions';

type getPointRequest = Request<{ point_id: string }, any, any>;
type getPointsRequest = Request<any, any, { tenant_id: number }>;
type createPointRequest = Request<any, any, IcreatePointRequestData>;
type updatePointRequest = Request<any, any, IupdatePointRequest>;
type updatePointProfileImageRequest = Request<any, any, { point_id: string }>;
type updatePointBgImage = Request<any, any, { point_id: string }>;

export interface IPointController {
  getPoint: (
    req: getPointRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  getPoints: (
    req: getPointsRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  createPoint: (
    req: createPointRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  updatePoint: (
    req: updatePointRequest,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  updatePointProfileImage: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  updatePointBgImage: (
    req: updatePointBgImage,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

class PointController implements IPointController {
  private pointService: IPointService;
  private tenantService: ITenantService;

  constructor(pointService: IPointService, tenantService: ITenantService) {
    this.pointService = pointService;
    this.tenantService = tenantService;
  }

  public getPoint = async (
    req: getPointRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { point_id } = req.params;

    try {
      const point = await this.pointService.getPoint(parseInt(point_id, 10));

      return res.status(HTTP.OK).json(point);
    } catch (err) {
      return next(err);
    }
  };

  public getPoints = async (
    req: getPointsRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { tenant_id } = req.body;

    try {
      const points = await this.pointService.getPoints(tenant_id);

      return res.status(HTTP.OK).json(points);
    } catch (err) {
      return next(err);
    }
  };

  public createPoint = async (
    req: createPointRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { tenant_id, name, email, phone } = req.body;

    try {
      Promise.all([
        await this.tenantService.tenantByIdShouldExist(tenant_id),
        await this.pointService.pointByNameShouldNotExist(name),
        await this.pointService.pointByPhoneShouldNotExist(phone),
      ]);
    } catch (err) {
      return next(err);
    }

    try {
      await this.pointService.createPoint(
        {
          name,
          email,
          phone,
          created_at: dayjs().toDate(),
        },
        tenant_id,
      );

      return res.status(HTTP.CREATED).send('Point created successfully');
    } catch (err) {
      return next(err);
    }
  };

  public updatePoint = async (
    req: updatePointRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const point_id = parseInt(req.body.point_id, 10);
    const { name, email, phone, address } = req.body;

    console.log('sdfsdfsdfsdfsdf', req.body);

    try {
      Promise.all([
        await this.tenantService.tenantByIdShouldExist(6),
        await this.pointService.getPoint(point_id),
      ]);
    } catch (err) {
      next(err);
    }

    try {
      await this.pointService.updatePoint(
        {
          name,
          email,
          phone,
          pointAddress: {
            ...address,
            updated_at: dayjs().toDate(),
          },
        },
        point_id,
      );

      return res.status(HTTP.OK).send('Point updated');
    } catch (err) {
      return next(err);
    }
  };

  public updatePointProfileImage = async (
    req: updatePointProfileImageRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const point_id = parseInt(req.body.point_id, 10);

    try {
      Promise.all([
        await this.tenantService.tenantByIdShouldExist(6),
        await this.pointService.pointByIdShouldExist(point_id),
      ]);
    } catch (err) {
      return next(err);
    }

    try {
      const file = req.file!;
      const fileName = `point-${point_id}-` + file.originalname;

      const fileUrl = await S3Actions.uploadFile({
        bucketName: config.get('aws.pointProfilePicBucket'),
        fileName,
        fileContent: file.buffer,
      });

      await this.pointService.updatePointProfileImage(
        fileUrl,
        fileName,
        point_id,
      );

      return res.status(HTTP.OK).send('Point profile image updated');
    } catch (err) {
      return next(err);
    }
  };

  public updatePointBgImage = async (
    req: updatePointBgImage,
    res: Response,
    next: NextFunction,
  ) => {
    const point_id = parseInt(req.body.point_id, 10);

    try {
      await Promise.all([
        await this.tenantService.tenantByIdShouldExist(6),
        await this.pointService.pointByIdShouldExist(point_id),
      ]);
    } catch (err) {
      return next(err);
    }

    try {
      const file = req.file!;
      const fileName = `point-${point_id}-` + file.originalname;

      const fileUrl = await S3Actions.uploadFile({
        bucketName: config.get('aws.pointBgImageBucket'),
        fileName,
        fileContent: file.buffer,
      });

      await this.pointService.updatePointBgImage(fileUrl, fileName, point_id);

      return res.status(HTTP.OK).send('Point background image updated');
    } catch (err) {
      return next(err);
    }
  };
}

export default PointController;
