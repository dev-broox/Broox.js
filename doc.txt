# Broox library

## {@link mediaPlayer | Media Player}

Provides context to the apps executed within the Media Player.

#### {@link Blobs}

Parses tuio events recieved by apps and keep track of the blobs.

``` typescript
// example
const blobs = new broox.mediaPlayer.Blobs();
const activeItems = blobs.getActiveItems();
```
<br/>

#### {@link KeyValue}

Allows apps to store json values associated to a project and a key in the file system.

``` typescript
// example
const user = {
  firstName: 'John',
  lastName: 'Doe'
};
const keyValue = new broox.mediaPlayer.KeyValue();
keyValue.set('testApp', 'profile', user);
const profile = keyValue.get('testApp', 'profile');
```
<br/>

#### {@link GestureHandler}

Parses OSC events recieved by apps and allows to handle the different gestures.

``` typescript
// example
const gestureHandler = new broox.mediaPlayer.GestureHandler(500, 2);
gestureHandler.onPresence(() => console.log('Presence'));
```
 
## {@link media | Media}

Provides classes and functions related to the rendering process of different media.

#### {@link Composition}

Allows to create an image based on many media objects (images, videos, etc.).

``` typescript
// example
const composition = new broox.media.Composition(width, height, borderWidth);
composition.addElement(webcam, 0, 0, webcam.videoWidth, webcam.videoHeight, 1, false);
composition.addElement(image, 0, 0, image.width, image.height, 1, false);
```
<br/>

#### Functions
- {@link getAvailableDevices}
- {@link getDeviceId}
- {@link startDevice}
- {@link drawElement}
- {@link drawVideo}

