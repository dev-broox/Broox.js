import Rect from './Rect';

class SkeletonBlob {
  private id: string;
  private leftHand = { x: -1, y: -1, width: 0, height: 0, id: '' };
  private rightHand = { x: -1, y: -1, width: 0, height: 0, id: '' };
  private scale: number;

  constructor(id: string) {
    this.id = id;
    this.leftHand.id = id + '_left_hand';
    this.rightHand.id = id + '_right_hand';
  }

  update(leftHand: Rect, rightHand: Rect, scale: number) {
    this.leftHand.x = leftHand.x;
    this.leftHand.y = leftHand.y;
    this.leftHand.width = leftHand.width;
    this.leftHand.height = leftHand.height;
    this.rightHand.x = rightHand.x;
    this.rightHand.y = rightHand.y;
    this.rightHand.width = rightHand.width;
    this.rightHand.height = rightHand.height;
    this.scale = scale;
  }

  get() {
    return {
      id: this.id,
      leftHand: this.leftHand,
      rightHand: this.rightHand,
      scale: this.scale
    }
  }
}

export default SkeletonBlob;