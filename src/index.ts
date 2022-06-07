import Blobs from './modules/mediaPlayer/blobs/Blobs';
import Context from './modules/media/Context';
import Stream from './modules/media/Stream';
import KeyValue from './modules/mediaPlayer/keyValue/KeyValue';
import Composition from './modules/media/Composition';

const broox = {
  media: {
    Stream: Stream,
    Context: Context,
    Composition: Composition
  },
  mediaPlayer: {
    Blobs: Blobs,
    KeyValue: KeyValue
  }
};

export default broox;