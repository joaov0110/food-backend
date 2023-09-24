import { prisma } from '../../config/prismaClient';
import { PrismaClient } from '@prisma/client';
import {
  IcreatePoint,
  IgetPoint,
  pointDataToSelect,
} from '../../schemas/point';
import { Api500Error } from '../../utils/errors/api500Error';

export interface IPointRepo {
  getPoint: (point_id: number) => Promise<IgetPoint | null>;

  getPoints: (tenant_id: number) => Promise<IgetPoint[]>;

  getPointByName: (name: string) => Promise<IgetPoint | null>;

  getPointByPhone: (point_phone: string) => Promise<IgetPoint | null>;

  createPoint: (
    data: IcreatePoint,
    tenant_id: number,
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
      await this.orm.point.create({
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
}

export default PointRepo;
