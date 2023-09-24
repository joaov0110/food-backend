import { Request, Response, NextFunction } from 'express';
import { IPointService } from '../services/pointService';
import { HTTP } from '../../constants/http';
import { IcreatePointRequestData } from '../../schemas/point';
import { ITenantService } from '../services/tenantService';
import dayjs from 'dayjs';

type getPointRequest = Request<{ point_id: string }, any, any>;
type getPointsRequest = Request<any, any, { tenant_id: number }>;
type createPointRequest = Request<any, any, IcreatePointRequestData>;

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
}

export default PointController;
