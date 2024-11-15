import { Joint } from './Joint';
import { Skeleton } from './Skeleton';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
    this.context.font = '8px "SF Pro Display"';
  }

  getCanvas() {
    return this.canvas;
  }

  renderSkeleton(skeleton: Skeleton) {
    if(skeleton.neck && skeleton.nose) {
      this.renderBone(skeleton.neck, skeleton.nose, '#23CFEA');
    }
    if(skeleton.nose && skeleton.leftEye && skeleton.leftEar) {
      this.renderBone(skeleton.nose, skeleton.leftEye, '#23CFEA');
      this.renderBone(skeleton.leftEye, skeleton.leftEar, '#23CFEA');
    }
    if(skeleton.nose && skeleton.rightEye && skeleton.rightEar) {
      this.renderBone(skeleton.nose, skeleton.rightEye, '#23CFEA');
      this.renderBone(skeleton.rightEye, skeleton.rightEar, '#23CFEA');
    }
    if(skeleton.neck && skeleton.leftShoulder && skeleton.leftElbow && skeleton.leftWrist) {
      this.renderBone(skeleton.neck, skeleton.leftShoulder, '#23CFEA');
      this.renderBone(skeleton.leftShoulder, skeleton.leftElbow, '#23CFEA');
      this.renderBone(skeleton.leftElbow, skeleton.leftWrist, '#23CFEA');
    }
    if(skeleton.neck && skeleton.rightShoulder && skeleton.rightElbow && skeleton.rightWrist) {
      this.renderBone(skeleton.neck, skeleton.rightShoulder, '#23CFEA');
      this.renderBone(skeleton.rightShoulder, skeleton.rightElbow, '#23CFEA');
      this.renderBone(skeleton.rightElbow, skeleton.rightWrist, '#23CFEA');
    }
    if(skeleton.neck && skeleton.leftHip && skeleton.leftKnee && skeleton.leftAnkle) {
      this.renderBone(skeleton.neck, skeleton.leftHip, '#23CFEA');
      this.renderBone(skeleton.leftHip, skeleton.leftKnee, '#23CFEA');
      this.renderBone(skeleton.leftKnee, skeleton.leftAnkle, '#23CFEA');
    }
    if(skeleton.neck && skeleton.rightHip && skeleton.rightKnee && skeleton.rightAnkle) {
      this.renderBone(skeleton.neck, skeleton.rightHip, '#23CFEA');
      this.renderBone(skeleton.rightHip, skeleton.rightKnee, '#23CFEA');
      this.renderBone(skeleton.rightKnee, skeleton.rightAnkle, '#23CFEA');
    }
    skeleton.neck && this.renderJoint(skeleton.neck, '#40D77E');
    skeleton.leftHip && this.renderJoint(skeleton.leftHip, '#40D77E');
    skeleton.rightHip && this.renderJoint(skeleton.rightHip, '#40D77E');
    skeleton.nose && this.renderJoint(skeleton.nose, '#40D77E');
    skeleton.leftEye && this.renderJoint(skeleton.leftEye, '#40D77E');
    skeleton.rightEye && this.renderJoint(skeleton.rightEye, '#40D77E');
    skeleton.leftKnee && this.renderJoint(skeleton.leftKnee, '#40D77E');
    skeleton.rightKnee && this.renderJoint(skeleton.rightKnee, '#40D77E');
    skeleton.leftShoulder && this.renderJoint(skeleton.leftShoulder, '#40D77E');
    skeleton.rightShoulder && this.renderJoint(skeleton.rightShoulder, '#40D77E');
    skeleton.leftWrist && this.renderJoint(skeleton.leftWrist, '#40D77E');
    skeleton.rightWrist && this.renderJoint(skeleton.rightWrist, '#40D77E');
    skeleton.leftAnkle && this.renderJoint(skeleton.leftAnkle, '#40D77E');
    skeleton.rightAnkle && this.renderJoint(skeleton.rightAnkle, '#40D77E');
    skeleton.leftElbow && this.renderJoint(skeleton.leftElbow, '#40D77E');
    skeleton.rightElbow && this.renderJoint(skeleton.rightElbow, '#40D77E');
    skeleton.leftEar && this.renderJoint(skeleton.leftEar, '#40D77E');
    skeleton.rightEar && this.renderJoint(skeleton.rightEar, '#40D77E');
    // this.renderInfo(skeleton);
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  private renderJoint(joint: Joint, color: string) {
    this.context.beginPath();
    this.context.arc(joint.x * this.width, joint.y * this.height, 3, 0, 2 * Math.PI, false);
    this.context.fillStyle = color;
    this.context.fill();
  }

  private renderBone(start: Joint, end: Joint, color: string) {
    this.context.strokeStyle = color;
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.moveTo(start.x * this.width, start.y * this.height);
    this.context.lineTo(end.x * this.width, end.y * this.height);
    this.context.stroke();
  }

  private renderInfo(skeleton) {
    if(skeleton.box) {
      const reference = { x: skeleton.box.x * this.width, y: skeleton.box.y * this.height - skeleton.box.height * this.height / 2 };
      const width = 100;
      const height = 60;
      const space = 10;
      const circleSize = 2;
      const circleStroke = 3;
      let x = reference.x - width / 2;
      let y = reference.y - height - space;
      let circleX = x + width / 2 - circleSize;
      let circleY = y + height - circleSize;
      let lineVertical = true;
      if(reference.y - height - space < 0) {
        x = reference.x + skeleton.box.width * this.width / 2 + space;
        y = reference.y;
        circleX = x - circleSize - circleStroke;
        circleY = reference.y + height / 2 - circleSize;
        lineVertical = false;
      }
      // const head = skeleton.nose || skeleton.leftEye || skeleton.rightEye || skeleton.leftEar || skeleton.rightEar || skeleton.neck;
      // if(head && skeleton.leftShoulder && skeleton.leftElbow) {
      // let width =  Math.min(150, Math.sqrt(Math.pow((skeleton.leftElbow.x * this.width - skeleton.leftShoulder.x * this.width), 2) + Math.pow((skeleton.leftElbow.y * this.height - skeleton.leftShoulder.y * this.height), 2)));
      
      // const x = head.x * this.width - width / 2;
      // const y = head.y * this.height - height * 1.1;
      
      this.context.beginPath();
      this.context.roundRect(x, y, width, height, [5]);
      this.context.fillStyle = '#232222';
      this.context.fill();
      this.context.fillStyle = '#FFFFFF';
      this.context.font = width * 0.1 + 'px "SF Pro Display"';
      this.renderInfoLine('Zone: ', skeleton.zone || '', x + 10, y + height * 0.25, width - 20);
      this.renderInfoLine('Actor: ', skeleton.id || '', x + 10, y + height * 0.55, width - 20);
      // this.renderInfoLine('Action: ', '', x + 10, y + height * 0.65, width - 20);
      this.renderInfoLine('Dwell time: ', skeleton.dwellTime ? skeleton.dwellTime + 's' : '', x + 10, y + height * 0.85, width - 20);
      // draw line circle
      this.context.beginPath();
      this.context.arc(circleX, circleY, circleSize, 0, 2 * Math.PI, false);
      this.context.fillStyle = '#C99EFF';
      this.context.fill();
      this.context.lineWidth = circleStroke;
      this.context.strokeStyle = '#A162F7';
      // draw line
      this.context.stroke();
      this.context.strokeStyle = '#FFFFFF';
      this.context.lineWidth = 2;
      this.context.beginPath();
      if(lineVertical) {
        this.context.moveTo(circleX + circleSize / 2 - 1, circleY + circleSize + circleStroke);
        this.context.lineTo(circleX + circleSize / 2 - 1, circleY + space);
      }
      else {
        this.context.moveTo(circleX - circleSize - circleStroke, circleY + circleSize / 2 - 1);
        this.context.lineTo(circleX - space, circleY + circleSize / 2 - 1);
      }
      this.context.stroke();

      // this.context.beginPath();
      // this.context.arc(x, y, 5, 0, 2 * Math.PI, false);
      // this.context.fillStyle = 'red';
      // this.context.fill();
    }
  }

  private renderInfoLine(label: string, value: string, x: number, y: number, maxWidth: number) {
    this.context.fillStyle = '#FFFFFF';
    this.context.fillText(label, x, y, maxWidth);
    const w = this.context.measureText(label).width;
    this.context.fillStyle = '#C99EFF';
    this.context.fillText(value, x + w, y, maxWidth - w);
  }
}