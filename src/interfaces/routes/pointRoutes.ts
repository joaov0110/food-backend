import { Router } from 'express';
import { IPointController } from '../controllers/pointController';
import createPoint from '../../utils/validations/createPointValidator';
import { uploader } from '../../services/multer';

class PointRouter {
  public router: Router;
  private pointController: IPointController;

  constructor(pointController: IPointController) {
    this.router = Router();
    this.pointController = pointController;

    this.setRoutes();
  }

  private setRoutes() {
    this.router.get('/', this.pointController.getPoints);
    this.router.get('/:point_id', this.pointController.getPoint);
    this.router.post('/point', createPoint, this.pointController.createPoint);
    this.router.put(
      '/point/profileImage',
      uploader.single('image'),
      this.pointController.updatePointProfileImage,
    );
    this.router.put(
      '/point/bgImage',
      uploader.single('image'),
      this.pointController.updatePointBgImage,
    );
  }
}

export default PointRouter;
