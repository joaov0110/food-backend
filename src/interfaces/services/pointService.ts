import { IPointRepo } from '../repositories/pointRepo';
import { Api404Error } from '../../utils/errors/api404Error';
import { Api400Error } from '../../utils/errors/api400Error';
import { IcreatePoint, IgetPoint } from '../../schemas/point';
import { Api500Error } from '../../utils/errors/api500Error';

export interface IPointService {
  getPoint: (point_id: number) => Promise<any>;

  getPoints: (tenant_id: number) => Promise<any>;

  pointByNameShouldNotExist: (point_name: string) => Promise<any>;

  pointByPhoneShouldNotExist: (point_phone: string) => Promise<any>;

  pointByIdShouldExist: (point_id: number) => Promise<any>;

  createPoint: (
    pointData: IcreatePoint,
    tenant_id: number,
  ) => Promise<IgetPoint | void>;

  updatePointProfileImage: (
    image_url: string,
    image_name: string,
    point_id: number,
  ) => Promise<IgetPoint | void>;

  updatePointBgImage: (
    bgImage_url: string,
    bgImage_name: string,
    point_id: number,
  ) => Promise<IgetPoint | void>;
}

class PointService implements IPointService {
  private pointRepo: IPointRepo;

  constructor(pointRepo: IPointRepo) {
    this.pointRepo = pointRepo;
  }

  public getPoint = async (point_id: number) => {
    const point = await this.pointRepo.getPoint(point_id);

    if (!point) {
      throw new Api404Error('Point not found');
    }

    return point;
  };

  public getPoints = async (tenant_id: number) => {
    const points = await this.pointRepo.getPoints(tenant_id);

    if (!points.length) {
      throw new Api404Error('No points found');
    }

    return points;
  };

  public pointByNameShouldNotExist = async (name: string) => {
    const point = await this.pointRepo.getPointByName(name);

    if (point) {
      throw new Api400Error('Point with this name already exists');
    }
  };

  pointByPhoneShouldNotExist = async (phone: string) => {
    const point = await this.pointRepo.getPointByPhone(phone);

    if (point) {
      throw new Api400Error('Point with this phone already exists');
    }
  };

  pointByIdShouldExist = async (point_id: number) => {
    const point = await this.pointRepo.getPoint(point_id);

    if (!point) {
      throw new Api404Error('Point not found');
    }

    return point;
  };
  public createPoint = async (data: IcreatePoint, tenant_id: number) => {
    try {
      const createPoint = await this.pointRepo.createPoint(data, tenant_id);

      return createPoint;
    } catch (err) {
      console.error(err);
      throw new Api500Error('Error creating point. Try again later');
    }
  };

  public updatePointProfileImage = async (
    image_url: string,
    image_name: string,
    point_id: number,
  ) => {
    try {
      return await this.pointRepo.updatePointProfilePicture(
        image_url,
        image_name,
        point_id,
      );
    } catch (err) {
      console.error(err);
      throw new Api500Error(
        'Error updating point profile image image. Try again later',
      );
    }
  };

  public updatePointBgImage = async (
    bgImage_url: string,
    bgImage_name: string,
    point_id: number,
  ) => {
    try {
      return await this.pointRepo.updatePointBgImage(
        bgImage_url,
        bgImage_name,
        point_id,
      );
    } catch (err) {
      console.error(err);
      throw new Api500Error(
        'Error updating point background image. Try again later',
      );
    }
  };
}

export default PointService;
