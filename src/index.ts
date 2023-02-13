import { getAvailableDevices, getDeviceId, startDevice, drawElement, drawVideo, blobToImage, Composition, Recorder, drawPartOfElement } from './modules/media/Media.module';
import { BlobsController, AddressType, KeyValue, GestureHandler, GestureType, OscListener, getMediaInfo, getDeviceInfo, logAlarm, downloadFile } from './modules/mediaPlayer/MediaPlayer.module';

const broox = {
  media: {
    getAvailableDevices: getAvailableDevices,
    getDeviceId: getDeviceId,
    startDevice: startDevice,
    drawElement: drawElement,
    drawPartOfElement: drawPartOfElement,
    drawVideo: drawVideo,
    blobToImage: blobToImage,
    Composition: Composition,
    Recorder: Recorder
  },
  mediaPlayer: {
    BlobsController: BlobsController,
    AddressType: AddressType,
    KeyValue: KeyValue,
    GestureHandler: GestureHandler,
    GestureType: GestureType,
    OscListener: OscListener,
    getMediaInfo: getMediaInfo,
    getDeviceInfo: getDeviceInfo,
    logAlarm: logAlarm,
    downloadFile: downloadFile
  }
};

export default broox;