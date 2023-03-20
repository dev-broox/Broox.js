import Rect from './Rect';
import { AddressType } from './AddressType';
import SingleBlob from './SingleBlob';
import SkeletonBlob from './SkeletonBlob';

const mouseBlobId = 'mouse';
const randomBlobId = 'random';

export class Blobs {
  private type: string;
  private onUpdateCallback: () => void;
  private onBlobAddedCallback: (id: string, x: number, y: number) => void;
  private onBlobDeletedCallback: (id: string) => void;
  private onFrameUpdatedCallback: (fseq: any) => void;
  private blobs: Map<string, any> = new Map();
  private mouseEnabled: boolean = false;
  private calculateBlobTimeAlive: boolean = true;
  private randomBlobsEnabled: boolean = false;
  private randomBlobsTimeout = null;
  private randomBlobsCounter: number = 0;
  private activeArea: Rect;
  private scale: number = 1;

  constructor(type: string, width: number, height: number, scale: number, onUpdate: () => void, onBlobAdded: (id: string, x: number, y: number) => void, onBlobDeleted: (id: string) => void, onFrameUpdated: (fseq: any) => void) {
    this.type = type;
    this.activeArea = { x: 0, y: 0, width: width, height: height };
    this.scale = scale;
    this.onUpdateCallback = onUpdate;
    this.onBlobAddedCallback = onBlobAdded;
    this.onBlobDeletedCallback = onBlobDeleted;
    this.onFrameUpdatedCallback = onFrameUpdated;
  }

  getBlobs() {
    return this.blobs;
  }

  setScale(scale: number) {
    this.scale = scale;
  }

  setActiveArea(x: number, y: number, width: number, height: number) {
    this.activeArea = { x: x, y: y, width: width, height: height };
  }

  enableMouseBlob(enabled: boolean) {
    this.mouseEnabled = enabled;
    const f = (evt: any) => {
      const blobData = {
        x: evt.pageX / document.body.clientWidth * this.activeArea.width + this.activeArea.x,
        y: evt.pageY / document.body.clientHeight * this.activeArea.height + this.activeArea.y,
        width: 20,
        height: 20
      };
      this.updateBlob(mouseBlobId, blobData.x, blobData.y, blobData.width, blobData.height, 0, 0, 0, 0, '');
    };
    if(enabled) {
      window.addEventListener('mousemove', f, false);
    }
    else {
      this.updateBlobsAlive([]);
      window.removeEventListener('mousemove', f, false);
    }
  }

  enableRandomBlobs(enabled: boolean) {
    this.randomBlobsEnabled = enabled;
    if(this.randomBlobsTimeout !== null){
      clearTimeout(this.randomBlobsTimeout);
      this.randomBlobsTimeout = null;
    }
    this.randomBlobsCounter = 0;
    enabled && this.createRandomBlob();
  }

  isMouseEnabled() {
    return this.mouseEnabled;
  }

  areRandomBlobsEnabled() {
    return this.randomBlobsEnabled;
  }

  killBlobs() {
    this.updateBlobsAlive([]);
  }

  update() {
    if(this.randomBlobsEnabled) {
      let idsToRemove = [];
      for(let [id, blob] of this.blobs) {
        if(id.includes(randomBlobId)) {
          if(this.isBlobInBounds(blob)){
            const b = blob.get();
            blob.update(b.x + b.velocityX, b.y + b.velocityY, 10, 10, 0, b.velocityX, b.velocityY);
          }
          else{
            this.onBlobDeletedCallback(id);
            idsToRemove.push(id);
          }
        }
      }
      for(let id of idsToRemove){
        this.blobs.delete(id);
      }
    }
  }
 
  onOSCMessage(json: any) {
    for(var i in json){
      var args = json[i].args;
      if(args == undefined) {
        continue;
      }
      var address = json[i].address;
      if(address !== this.type ) {
        continue;
      }
      switch(args[0]) {
        case 'fseq':
          if(args.length > 1) {
            this.onFrameUpdatedCallback && this.onFrameUpdatedCallback(args[1]);
          }
          break;
        case 'set':
          const blobData = this.parseBlobData(json[i].address, args);
          if(blobData == null) {
            continue;
          }
          this.updateBlobWithData(address, blobData);
          this.onUpdateCallback && this.onUpdateCallback();
          break;

        case 'alive':
          this.updateBlobsAlive(args);
          this.onUpdateCallback && this.onUpdateCallback();
          break;
        default:
        break;
      }
    }
  }

  private parseBlobData(address: string, args: any[]) {
    if(address === AddressType.skel){
      return this.parseBlobSkeletonData(address, args);
    }
    var blobData: any = {};
    blobData.id = args[1].toString();
    switch(address) {
      case AddressType.blob:
        if(!this.checkBlobDataFormat(args, 13)) {
          return null;
        }
        blobData.x = args[2];
        blobData.y = args[3];
        blobData.rotation = args[4];
        blobData.width = args[5];
        blobData.height = args[6];
        blobData.velocityX = args[8];
        blobData.velocityY = args[9];
        blobData.timeAlive = args[12];
        break;
      case AddressType.object:
        if(!this.checkBlobDataFormat(args, 11)) {
          return null;
        }
        blobData.classId = args[2];
        blobData.x = args[3];
        blobData.y = args[4];
        blobData.rotation = args[5];
        break;
      case AddressType.cursor:
        if(!this.checkBlobDataFormat(args, 7)) {
          return null;
        }
        blobData.x = args[2];
        blobData.y = args[3];
        blobData.width = 60 / this.activeArea.width;
        blobData.height = blobData.width;
        break;
      case AddressType.marker:
        blobData.classId = args[2];
        blobData.x = args[3];
        blobData.y = args[4];
        blobData.rotation = args[5];
        blobData.width = args[6];
        break;
    }
    let corrected = blobData;
    blobData.x = corrected.x * this.activeArea.width + this.activeArea.x;
    blobData.y = corrected.y * this.activeArea.height + this.activeArea.y;
    blobData.width *= this.activeArea.width * this.scale;
    blobData.height *= this.activeArea.height * this.scale;
    return blobData;
  }

  private parseBlobSkeletonData(address: string, args: any[]) {
    if(address !== AddressType.skel) {
      console.log('Wrong address, expected ' + AddressType.skel + ' but got ' + address);
      return null;
    }
    let blobData: any = {};
    blobData.id = args[1].toString();
    const scale = args[6];
    blobData.leftHand = {
      x: args[2],
      y: args[3],
      width: scale * this.activeArea.width * this.scale,
      height: scale * this.activeArea.height * this.scale
    };
    blobData.rightHand = {
      x: args[4],
      y: args[5],
      width: scale * this.activeArea.width * this.scale,
      height: scale * this.activeArea.height * this.scale
    }
    blobData.scale = scale;
    if(this.isSkeletonJointDetected(blobData.leftHand)) {
      blobData.leftHand.x = blobData.leftHand.x * this.activeArea.width + this.activeArea.x;
      blobData.leftHand.y = blobData.leftHand.y * this.activeArea.height + this.activeArea.y;
    }
    if(this.isSkeletonJointDetected(blobData.rightHand)) {
      blobData.rightHand.x = blobData.rightHand.x * this.activeArea.width + this.activeArea.x;
      blobData.rightHand.y = blobData.rightHand.y * this.activeArea.height + this.activeArea.y;
    }
    return blobData;
  }

  private isSkeletonJointDetected(joint: Rect) {
    return joint.x >= 0 && joint.y >= 0;
  }

  private checkBlobDataFormat(args: any[], length: number) {
    if(args.length !== length){
      console.log('Wrong Tuio set format. Supposed to have length ' + length + ' and has length ' + args.length);
      return false;
    }
    return true;
  }

  private updateBlobWithData(type: string, blobData: any) {
    switch(type) {
      case AddressType.skel:
        let id = blobData.id;
        if(!this.blobs.has(id)) {
          const blob = new SkeletonBlob(id);
          this.blobs.set(id, blob);
          blob.update(blobData.leftHand, blobData.rightHand, blobData.scale);
          this.onBlobAddedCallback && this.onBlobAddedCallback(id, 0, 0);
        }
        else {
          const blob = this.blobs.get(id);
          blob.update(blobData.leftHand, blobData.rightHand, blobData.scale);
        }
        break;
      default:
        this.updateBlob(blobData.id, blobData.x, blobData.y, blobData.width, blobData.height, blobData.rotation, blobData.velocityX, blobData.velocityY, blobData.timeAlive, blobData.classId);
    }
  }

  private updateBlob(id: string, x: number, y: number, width: number, height: number, rotation: number, velocityX: number, velocityY: number, timeAlive: number = 0, classId: string = '') {
    if(!this.blobs.has(id)) {
      const blob = new SingleBlob(id, classId);
      this.blobs.set(id, blob);
      blob.update(x, y, width, height, rotation, velocityX, velocityY, timeAlive);
      this.onBlobAddedCallback && this.onBlobAddedCallback(id, x, y);
    }
    else {
      const blob = this.blobs.get(id);
      let blobTimeAlive = timeAlive;
      if(this.calculateBlobTimeAlive && blobTimeAlive <= 0){
        blobTimeAlive = blob.timeAlive + 0.01;
      }
      blob.update(x, y, width, height, rotation, velocityX, velocityY, blobTimeAlive);
    }
    this.onUpdateCallback && this.onUpdateCallback();
  }

  private updateBlobsAlive(idsAlive: any[]) {
    const idsToRemove = [];
    if(!idsAlive || idsAlive.length === 0) {
      this.blobs.clear();
    }
    else {
      for (let [id, blob] of this.blobs) {
        let isAlive = false
        for(let aliveItem of idsAlive) {
          isAlive = aliveItem === id;
          if (isAlive) {
            break;
          }
        }
        if(!isAlive) {
          this.onBlobDeletedCallback && this.onBlobDeletedCallback(id);
          idsToRemove.push(id);
        }
      }
      for(let id of idsToRemove) {
        this.blobs.delete(id);
      }
    }
  }

  private createRandomBlob() {
    if(!this.randomBlobsEnabled) {
      return;
    }
    const fromTopOrBottom = Math.random() <= 0.5;
    const dirX = Math.random() <= 0.5 ? 1 : -1;
    const dirY = Math.random() <= 0.5 ? 1 : -1;
    const minVelX = fromTopOrBottom ? 0 : 0.5;
    const minVelY = fromTopOrBottom ? 0.5 : 0;
    const velocityX = (Math.random() * 2 + minVelX) * dirX;
    const velocityY = (Math.random() * 2 + minVelY) * dirY;
    const x = fromTopOrBottom ? this.activeArea.width * Math.random() + this.activeArea.x : (velocityX > 0 ? this.activeArea.x : this.activeArea.width + this.activeArea.x);
    const y = fromTopOrBottom ? (velocityY > 0 ? this.activeArea.y : this.activeArea.height + this.activeArea.y) : this.activeArea.height * Math.random() + this.activeArea.y;
    this.updateBlob('random_' + this.randomBlobsCounter, x, y, 10, 10, 0, velocityX, velocityY);
    this.randomBlobsCounter++;
    this.randomBlobsTimeout = setTimeout(() => {
      this.createRandomBlob();
    }, Math.random() * 3000 + 1000);   
  }

  private isBlobInBounds(blob: Rect) {
    return !(blob.x < -9 + this.activeArea.x || blob.x > this.activeArea.width + this.activeArea.x || blob.y < -this.activeArea.height * 0.5 + this.activeArea.y || blob.y > this.activeArea.height + this.activeArea.y);
  }
}