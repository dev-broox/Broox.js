import { getAvailableDevices, getDeviceId, startDevice, drawElement, drawVideo, blobToImage, Composition, Recorder } from './modules/media/Media.module';
import { Blobs, KeyValue, GestureHandler, GestureType, OscListener, getMediaInfo, getDeviceInfo, logAlarm } from './modules/mediaPlayer/MediaPlayer.module';

const broox = {
  media: {
    getAvailableDevices: getAvailableDevices,
    getDeviceId: getDeviceId,
    startDevice: startDevice,
    drawElement: drawElement,
    drawVideo: drawVideo,
    blobToImage: blobToImage,
    Composition: Composition,
    Recorder: Recorder
  },
  mediaPlayer: {
    Blobs: Blobs,
    KeyValue: KeyValue,
    GestureHandler: GestureHandler,
    GestureType: GestureType,
    OscListener: OscListener,
    getMediaInfo: getMediaInfo,
    getDeviceInfo: getDeviceInfo,
    logAlarm: logAlarm
  }
};

export default broox;