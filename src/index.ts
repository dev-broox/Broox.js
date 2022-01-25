import Blobs from './modules/mediaPlayer/blobs/Blobs';
import Context from './modules/util/Context';
import Stream from './modules/util/Stream';

const broox = {
  util: {
    Stream: Stream,
    Context: Context
  },
  mediaPlayer: {
    blobs : {
      Blobs: Blobs
    }
  }
};

export default broox;