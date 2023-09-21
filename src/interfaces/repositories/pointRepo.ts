import { prisma } from '../../config/prismaClient';
import { PrismaClient } from '@prisma/client';
import {
  IcreatePoint,
  IgetPoint,
  pointDataToSelect,
} from '../../schemas/point';

export interface IPointRepo {
  getPoint: (point_id: number) => Promise<any>;

  getPoints: (tenant_id: number) => Promise<any>;

  getPointByName: (name: string) => Promise<any>;

  createPoint: (data: IcreatePoint, tenant_id: number) => Promise<IgetPoint>;

  //   updatePoint: (data: any) => Promise<any>;

  //   deletePoint: (point_id: number) => Promise<any>;
}

class PointRepo implements IPointRepo {
  private orm: PrismaClient;

  constructor() {
    this.orm = prisma;
  }

  public getPoint = async (point_id: number) =>
    await this.orm.point.findUnique({
      where: {
        id: point_id,
      },
      select: pointDataToSelect,
    });

  public getPoints = async (tenant_id: number) =>
    await this.orm.point.findMany({
      where: {
        tenant_id,
      },
      select: pointDataToSelect,
    });

  public getPointByName = async (point_name: string) =>
    await this.orm.point.findFirst({
      where: {
        name: point_name,
      },
    });

  public createPoint = async (pointData: IcreatePoint, tenant_id: number) =>
    await this.orm.point.create({
      data: {
        ...pointData,
        tenant_id,
      },
    });
}

export default PointRepo;
