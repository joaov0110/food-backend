import { prisma } from '../../services/prismaClient';
import { PrismaClient } from '@prisma/client';
import {
  IcreatePoint,
  IgetPoint,
  IupdatePoint,
  pointDataToSelect,
} from '../../schemas/point';
import { Api500Error } from '../../utils/errors/api500Error';
import dayjs from 'dayjs';

export interface IPointRepo {
  getPoint: (point_id: number) => Promise<IgetPoint | null>;

  getPoints: (tenant_id: number) => Promise<IgetPoint[]>;

  getPointByName: (name: string) => Promise<IgetPoint | null>;

  getPointByPhone: (point_phone: string) => Promise<IgetPoint | null>;

  createPoint: (
    data: IcreatePoint,
    tenant_id: number,
  ) => Promise<IgetPoint | void>;

  updatePoint: (
    data: IupdatePoint,
    point_id: number,
  ) => Promise<IgetPoint | void>;

  updatePointProfilePicture: (
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

class PointRepo implements IPointRepo {
  private orm: PrismaClient;

  constructor() {
    this.orm = prisma;
  }

  public getPoint = async (point_id: number): Promise<IgetPoint | null> =>
    await this.orm.point.findUnique({
      where: {
        id: point_id,
      },
      select: pointDataToSelect,
    });

  public getPoints = async (tenant_id: number): Promise<IgetPoint[]> =>
    await this.orm.point.findMany({
      where: {
        tenant_id,
      },
      select: pointDataToSelect,
    });

  public getPointByName = async (
    point_name: string,
  ): Promise<IgetPoint | null> =>
    await this.orm.point.findFirst({
      where: {
        name: point_name,
      },
      select: pointDataToSelect,
    });

  public getPointByPhone = async (
    point_phone: string,
  ): Promise<IgetPoint | null> =>
    await this.orm.point.findUnique({
      where: {
        phone: point_phone,
      },
      select: pointDataToSelect,
    });

  public createPoint = async (
    pointData: IcreatePoint,
    tenant_id: number,
  ): Promise<IgetPoint | void> => {
    try {
      return await this.orm.point.create({
        data: {
          ...pointData,
          tenant_id,
        },
        select: pointDataToSelect,
      });
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public updatePoint = async (data: IupdatePoint, point_id: number) => {
    const { name, email, phone, pointAddress } = data;

    try {
      return await this.orm.point.update({
        data: {
          name,
          email,
          phone,
          address: {
            upsert: {
              update: {
                ...pointAddress,
              },
              create: {
                ...pointAddress,
                created_at: dayjs().toDate(),
              },
            },
          },
        },
        where: {
          id: point_id,
        },
        select: pointDataToSelect,
      });
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public updatePointProfilePicture = async (
    image_url: string,
    image_name: string,
    point_id: number,
  ) => {
    try {
      return await this.orm.point.update({
        data: {
          image_url,
          image_name,
        },
        where: {
          id: point_id,
        },
      });
    } catch (err: any) {
      throw new Error(err);
    }
  };

  public updatePointBgImage = async (
    bgImage_url: string,
    bgImage_name: string,
    point_id: number,
  ) => {
    try {
      return await this.orm.point.update({
        data: {
          bgImage_url,
          bgImage_name,
        },
        where: {
          id: point_id,
        },
      });
    } catch (err: any) {
      throw new Error(err);
    }
  };
}

export default PointRepo;
