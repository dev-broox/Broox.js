import { getAvailableDevices, getDeviceId, startDevice, drawElement, drawVideo, Composition } from './modules/media/Media.module';
import { Blobs, KeyValue, GestureHandler, GestureType, getMediaInfo, getDeviceInfo } from './modules/mediaPlayer/MediaPlayer.module';

const broox = {
  media: {
    getAvailableDevices: getAvailableDevices,
    getDeviceId: getDeviceId,
    startDevice: startDevice,
    drawElement: drawElement,
    drawVideo: drawVideo,
    Composition: Composition
  },
  mediaPlayer: {
    Blobs: Blobs,
    KeyValue: KeyValue,
    GestureHandler: GestureHandler,
    GestureType: GestureType,
    getMediaInfo: getMediaInfo,
    getDeviceInfo: getDeviceInfo
  }
};

export default broox;