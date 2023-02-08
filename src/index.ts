import { getAvailableDevices, getDeviceId, startDevice, drawElement, drawVideo, blobToImage, Composition, Recorder, drawPartOfElement } from './modules/media/Media.module';
import { Blobs, KeyValue, GestureHandler, GestureType, OscListener, getMediaInfo, getDeviceInfo, logAlarm, downloadFile } from './modules/mediaPlayer/MediaPlayer.module';
import { AnimatedCountdown, AnimatedQr, AnimatedText, Color, Countdown, Image, MediaEdition, Preview, Qr, RollingNumber, Text, Video, Webcam } from './modules/react/React.module';

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
    Blobs: Blobs,
    KeyValue: KeyValue,
    GestureHandler: GestureHandler,
    GestureType: GestureType,
    OscListener: OscListener,
    getMediaInfo: getMediaInfo,
    getDeviceInfo: getDeviceInfo,
    logAlarm: logAlarm,
    downloadFile: downloadFile
  },
  react: {
    AnimatedCountdown: AnimatedCountdown,
    AnimatedQr: AnimatedQr,
    AnimatedText: AnimatedText,
    Color: Color,
    Countdown: Countdown,
    Image: Image,
    MediaEdition: MediaEdition,
    Preview: Preview,
    Qr: Qr,
    RollingNumber: RollingNumber,
    Text: Text,
    Video: Video,
    Webcam: Webcam
  }
};

export default broox;