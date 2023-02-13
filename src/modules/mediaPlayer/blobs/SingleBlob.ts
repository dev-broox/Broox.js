import Rect from './Rect';

class SingleBlob {
  private id: string;
  private classId: string;
  private rotation: number;
  private timeAlive: number;
  private velocityX: number;
  private velocityY: number;
  private rect: Rect;

  constructor(id: string, classId: string = '') {
    this.id = id;
    this.classId = classId;
  }

  update(x: number, y: number, width: number, height: number, rotation: number = 0, velocityX: number = null, velocityY: number = null, timeAlive: number = 0) {
    this.rect = { x, y, width, height };
    this.rotation = rotation;
    this.timeAlive = timeAlive;
    if(velocityX === null && velocityY === null && this.rect.x !== null && this.rect.y !== null){
      this.velocityX = x - this.rect.x;
      this.velocityY = y - this.rect.y;
    }
    else{
      this.velocityX = velocityX;
      this.velocityY = velocityY;
    }
  }

  get() {
    return {
      id: this.id,
      classId: this.classId,
      rect: this.rect,
      rotation: this.rotation,
      timeAlive: this.timeAlive,
      velocityX: this.velocityX,
      velocityY: this.velocityY
    };
  }
}

export default SingleBlob;