import Blobs from './modules/mediaPlayer/blobs/Blobs';
import Context from './modules/util/Context';
import Stream from './modules/util/Stream';
import KeyValue from './modules/mediaPlayer/keyValue/KeyValue';

const broox = {
  util: {
    Stream: Stream,
    Context: Context
  },
  mediaPlayer: {
    blobs : {
      Blobs: Blobs
    },
    KeyValue: KeyValue
  }
};

export default broox;