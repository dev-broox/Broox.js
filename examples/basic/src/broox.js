function $4ffbf3df34b9aacd$export$fa3373cf5ebce5bf(video, context, destinationWidth, destinationHeight, destinationX, destinationY, mirror = false) {
    $4ffbf3df34b9aacd$export$ea631e88b0322146(video, context, video.videoWidth, video.videoHeight, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
}
function $4ffbf3df34b9aacd$export$ea631e88b0322146(element, context, sourceWidth, sourceHeight, destinationWidth, destinationHeight, destinationX, destinationY, mirror = false) {
    context.save();
    // get ratios
    const horizontalRatio = destinationWidth / sourceWidth;
    const verticalRatio = destinationHeight / sourceHeight;
    let height = 0;
    let width = 0;
    let leftOffset = 0;
    let topOffset = 0;
    // take center of element vertically or horizontally depending on ratio
    if (verticalRatio > horizontalRatio) {
        height = sourceHeight;
        width = destinationWidth / verticalRatio;
        leftOffset = (sourceWidth - width) / 2;
    } else {
        width = sourceWidth;
        height = destinationHeight / horizontalRatio;
        topOffset = (sourceHeight - height) / 2;
    }
    if (mirror) {
        context.scale(-1, 1);
        context.drawImage(element, leftOffset, topOffset, width, height, -destinationX, destinationY, -destinationWidth, destinationHeight);
    } else context.drawImage(element, leftOffset, topOffset, width, height, destinationX, destinationY, destinationWidth, destinationHeight);
    context.restore();
}


let $679b1f8aa2eb188d$var$Message;
(function(Message) {
    Message["deviceNotFound"] = 'Device not found';
    Message["forbiddenProjectName"] = 'Please use a different project name';
})($679b1f8aa2eb188d$var$Message || ($679b1f8aa2eb188d$var$Message = {
}));
var $679b1f8aa2eb188d$export$2e2bcd8739ae039 = $679b1f8aa2eb188d$var$Message;


function $0af19e6dc1be2ad2$export$13a2ac54ef3e3802() {
    return new Promise((resolve, reject)=>{
        navigator.mediaDevices.enumerateDevices().then((devices)=>{
            const result = devices.map((d)=>{
                return {
                    id: d.deviceId,
                    name: d.label
                };
            });
            resolve(result);
        }).catch((error)=>{
            reject(error.message);
        });
    });
}
function $0af19e6dc1be2ad2$export$be262d700bd1c696(name) {
    return new Promise((resolve, reject)=>{
        navigator.mediaDevices.enumerateDevices().then((devices)=>{
            for(let i = 0; i < devices.length; i++)if (devices[i].label === name) {
                resolve(devices[i].deviceId);
                return;
            }
            reject($679b1f8aa2eb188d$export$2e2bcd8739ae039.deviceNotFound);
        }).catch((error)=>{
            reject(error.message);
        });
    });
}
function $0af19e6dc1be2ad2$export$b04c27f4306c4f03(deviceId, width, height) {
    return navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: deviceId,
            width: width,
            height: height
        }
    });
}


function $c3263300ab5ba544$export$408b3c1884176160(blob) {
    return new Promise((resolve)=>{
        const image = new Image();
        image.onload = ()=>{
            URL.revokeObjectURL(image.src);
            resolve(image);
        };
        image.src = URL.createObjectURL(blob);
    });
}



class $d7e6bea30dda6116$export$d955f48b7132ae28 {
    /**
   * Generates an instance of the Composition class.
   * @param width Composition width.
   * @param height Composition height.
   * @param borderWidth Border width.
   */ constructor(width, height, borderWidth){
        this.borderWidth = borderWidth;
        this.canvas = document.createElement('canvas');
        this.scale = (width - this.borderWidth * 2) / width;
        this.canvas.width = width;
        this.canvas.height = height * this.scale + this.borderWidth * 2;
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
   * Adds an element to the composition.
   * @param element Element to add.
   * @param x Element X position.
   * @param y Element Y position.
   * @param width Element width.
   * @param height Element height.
   * @param scale Element scale.
   * @param mirror Value indicating whether to mirror the image.
   * ``` typescript
   * // example
   * const composition = new broox.media.Composition(width, height, borderWidth);
   * composition.addElement(webcam, 0, 0, webcam.videoWidth, webcam.videoHeight, 1, false);
   * composition.addElement(image, 0, 0, image.width, image.height, 1, false);
   * ```
   */ addElement(element, x, y, width, height, scale, mirror) {
        const destinationWidth = this.canvas.width * this.scale * scale;
        const destinationHeight = (this.canvas.height - 2 * this.borderWidth) * scale;
        $4ffbf3df34b9aacd$export$ea631e88b0322146(element, this.context, width, height, destinationWidth, destinationHeight, this.borderWidth + x * scale * this.scale, this.borderWidth + y * scale * this.scale, mirror);
    }
    /**
   * Clears the composition.
   */ clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
   * Gets the resulting composition.
   * @returns A promise with a blob containing the composition.
   * ``` typescript
   * // example
   * composition.get().then(blob => {
   *   image.src = URL.createObjectURL(blob);
   * )};
   * ```
   */ get() {
        return new Promise((resolve)=>{
            this.canvas.toBlob((blob)=>resolve(blob)
            , 'image/png', 1);
        });
    }
}


class $647f5b764790ed4d$export$336a011955157f9a {
    constructor(stream){
        this.stream = stream;
    }
    /**
   * Sets a stream to record.
   * @param stream Stream to record.
   */ setStream(stream) {
        this.stream = stream;
    }
    /**
   * Starts recording.
   */ start() {
        const self = this;
        this.promise = new Promise((resolve, reject)=>{
            self.resolve = resolve;
        });
        let data = [];
        this.recorder = new MediaRecorder(this.stream);
        this.recorder.ondataavailable = (e)=>data.push(e.data)
        ;
        this.recorder.onstop = ()=>{
            self.resolve(new Blob(data, {
                type: 'video/webm'
            }));
        };
        this.recorder.start();
    }
    /**
   * Stops recording.
   */ stop() {
        this.recorder.state === 'recording' && this.recorder.stop();
        return this.promise;
    }
}




let $dc7e17fc971b80b3$export$ff50662d7c6e93a2;
(function($dc7e17fc971b80b3$export$ff50662d7c6e93a2) {
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["LeftHandUp"] = 'left_hand_up';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["RightHandUp"] = 'right_hand_up';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["BothHandsUp"] = 'both_hands_up';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["PointsLeft"] = 'points_left';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["PointsRight"] = 'points_right';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["LeftHandOnChest"] = 'left_hand_on_chest';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["RightHandOnChest"] = 'right_hand_on_chest';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["BothHandsOnChest"] = 'both_hands_on_chest';
})($dc7e17fc971b80b3$export$ff50662d7c6e93a2 || ($dc7e17fc971b80b3$export$ff50662d7c6e93a2 = {
}));


class $e80f1c37eac2ba65$export$61ce360501d38a6f {
    /**
   * Creates an instance of the Gesture class.
   * @param types Gesture types.
   * @param timestamp Timestamp.
   */ constructor(types, timestamp){
        this.types = [];
        this.timestamp = 0;
        this.types = types;
        this.timestamp = timestamp;
    }
    /**
   * Gets the types.
   * @returns Gesture types.
   */ getTypes() {
        return this.types;
    }
    /**
   * Gets the timestamp.
   * @returns Timestamp.
   */ getTimestamp() {
        return this.timestamp;
    }
}



class $479e08f957450ed1$export$dfd4fa32db6567bf {
    /**
   * Creates an instance of the GestureHandler class.
   * @param time Time lapse in milliseconds before accepting a gesture as such.
   * @param delay Time lapse in seconds before listening to other gestures once a gesture is accepted.
   */ constructor(time, delay){
        this.listening = true;
        this.gestures = [];
        this.time = time;
        this.delay = delay;
        const self = this;
        // listen osc events
        window.addEventListener('message', (event)=>{
            for(let i = 0; i < event.data.length; i++)if (event.data[i].address === '/de/person') self.add(event.data[i].args);
        }, false);
    }
    /**
   * Adds a potential gesture to be processed.
   * @param args OSC event args.
   */ add(args) {
        if (this.listening) {
            if (args[0] === 'id') this.presenceCallback && this.presenceCallback();
            else if (args[0] === 'prop' && args[2] === 'poses') {
                const types = args.slice(3);
                if (types.length) {
                    const gesture = new $e80f1c37eac2ba65$export$61ce360501d38a6f(types, new Date().getTime());
                    this.gestures.push(gesture);
                    this.check();
                }
            }
        }
    }
    /**
   * Adds a callback function for the "presence" gesture.
   * @param callback Function that will be executed when the presence gesture is detected.
   */ onPresence(callback) {
        this.presenceCallback = callback;
    }
    /**
   * Adds a callback function for the "both hands up" gesture.
   * @param callback Function that will be executed when the "both hands up" gesture is detected.
   */ onBothHandsUp(callback) {
        this.bothHandsUpCallback = callback;
    }
    /**
   * Adds a callback function for the "left hand up" gesture.
   * @param callback Function that will be executed when the "left hand up" gesture is detected.
   */ onLeftHandUp(callback) {
        this.leftHandUpCallback = callback;
    }
    /**
   * Adds a callback function for the "right hand up" gesture.
   * @param callback Function that will be executed when the "right hand up" gesture is detected.
   */ onRightHandUp(callback) {
        this.rightHandUpCallback = callback;
    }
    /**
   * Adds a callback function for the "hand on chest" gesture.
   * @param callback Function that will be executed when the "hand on chest" gesture is detected.
   */ onHandOnChest(callback) {
        this.handOnChestCallback = callback;
    }
    /**
   * Checks whether a gesture was made. 
   */ check() {
        // get last gesture
        const lastIndex = this.gestures.length - 1;
        const lastGesture = this.gestures[lastIndex];
        const lastGestureTypes = lastGesture.getTypes();
        if (lastGestureTypes.length === 1) {
            const type = lastGestureTypes[0];
            // if gesture is BothHandsUp or BothHandsOnChest, send the event
            if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsUp || type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsOnChest) this.send(type);
            else if (this.gestures.length > 1) {
                const lastTimestamp = lastGesture.getTimestamp();
                let i = lastIndex;
                let gesture = null;
                // find last gesture before the time lapse defined
                while(!gesture && --i >= 0 && this.gestures[i].getTypes().indexOf(type) >= 0){
                    console.log(this.gestures[i]);
                    if (lastTimestamp - this.gestures[i].getTimestamp() > this.time) gesture = this.gestures[i];
                }
                if (gesture) this.send(type);
            }
        }
    }
    /**
   * Executes a callback function based on the gesture made.
   * @param type Gesture made.
   */ send(type) {
        console.log('Gesture ' + type + ' sent');
        this.listening = false;
        this.gestures = [];
        setTimeout(()=>{
            this.listening = true;
        }, this.delay * 1000);
        if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsUp) this.bothHandsUpCallback && this.bothHandsUpCallback();
        else if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.LeftHandUp) this.leftHandUpCallback && this.leftHandUpCallback();
        else if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.RightHandUp) this.rightHandUpCallback && this.rightHandUpCallback();
        else if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsOnChest) this.handOnChestCallback && this.handOnChestCallback();
    }
}


class $05bc0747749da3f4$export$410db1ee4b845acb {
    /**
   * 
   * @param keyValue Key value manager 
   */ constructor(keyValue){
        this.keyValue = keyValue;
    }
    /**
   * 
   * @param projectName Project name
   * @param content Json content
   */ write(projectName, content) {
        this.keyValue.write(projectName, JSON.stringify(content));
    }
    /**
    * 
    * @param projectName Project name
    */ read(projectName) {
        const content = JSON.parse(this.keyValue.read(projectName));
        return content;
    }
}


class $73385285ce406fe8$export$19fffca37ef3e106 {
    /**
   * 
   * @param projectName Project name
   * @param content Json content
   */ write(projectName, content) {
        localStorage.setItem(projectName, JSON.stringify(content));
    }
    /**
   * 
   * @param projectName Project name
   * @returns Json content for the given project
   */ read(projectName) {
        const content = localStorage.getItem(projectName);
        if (content) return JSON.parse(content);
        return null;
    }
}


class $94dc54fe1b2e5635$export$cec157cbbbaf65c9 {
    static inElectron() {
        // @ts-ignore
        return !!window.electron;
    }
    static getKeyValue() {
        // @ts-ignore
        return window.app && window.app.keyValue;
    }
    static getMediaInfo() {
        // @ts-ignore
        return window.app && window.app.media;
    }
    static getDeviceInfo() {
        // @ts-ignore
        return window.app && window.app.device;
    }
    static logAlarm(subject, text) {
        //@ts-ignore
        window.app && window.app.logAlarm(subject, text);
    }
}



class $5ed460d269917590$export$12b3cc2522c3bba5 {
    /**
   * Creates an instance of the KeyValue class.
   */ constructor(){
        this.contents = {
        };
        if ($94dc54fe1b2e5635$export$cec157cbbbaf65c9.inElectron()) this.storage = new $05bc0747749da3f4$export$410db1ee4b845acb($94dc54fe1b2e5635$export$cec157cbbbaf65c9.getKeyValue());
        else this.storage = new $73385285ce406fe8$export$19fffca37ef3e106();
    }
    /**
   * Sets a value in storage
   * @param projectName Project name
   * @param key Key assigned to the value to store
   * @param value Value to store
   * ``` typescript
   * // example
   * const user = {
   *   firstName: 'John',
   *   lastName: 'Doe'
   * };
   * const keyValue = new broox.mediaPlayer.KeyValue();
   * keyValue.set('testApp', 'profile', user);
   * ```
   */ setValue(projectName, key, value) {
        if (projectName === 'config') {
            console.error($679b1f8aa2eb188d$export$2e2bcd8739ae039.forbiddenProjectName);
            return;
        }
        // get storage
        let content = this.getContent(projectName);
        if (!content) content = {
        };
        content[key] = value;
        this.storage.write(projectName, content);
    }
    /**
   * Gets a value from a content in storage
   * @param projectName Project name
   * @param key Key
   * @returns The value for the given key
   * ``` typescript
   * // example
   * const keyValue = new broox.mediaPlayer.KeyValue();
   * const user = keyValue.get('testApp', 'profile');
   * console.log('User', user);
   * ```
   */ getValue(projectName, key) {
        const storage = this.getContent(projectName);
        return storage ? storage[key] : null;
    }
    /**
   * Gets a content from memory or storage
   * @param projectName Project name
   * @returns The content with the given name if exists, null otherwise
   */ getContent(projectName) {
        // get storage from memory
        if (this.contents[projectName]) return this.contents[projectName];
        else // get content from storage
        try {
            return this.storage.read(projectName);
        } catch (error) {
            // the content does not exist
            return null;
        }
    }
}


let $cd45431f4dea502e$var$OscMessageAddress;
(function(OscMessageAddress) {
    OscMessageAddress["object"] = '/tuio/2Dobj';
    OscMessageAddress["cursor"] = '/tuio/2Dcur';
    OscMessageAddress["blob"] = '/tuio/2Dblb';
    OscMessageAddress["marker"] = '/tuio/broox_markers';
    OscMessageAddress["skel"] = '/tuio/skel';
})($cd45431f4dea502e$var$OscMessageAddress || ($cd45431f4dea502e$var$OscMessageAddress = {
}));
var $cd45431f4dea502e$export$2e2bcd8739ae039 = $cd45431f4dea502e$var$OscMessageAddress;



function $0d246894a09de756$export$a08dd5f8ed298c02(address, args, blobsSpaceTransform) {
    var data = {
    };
    data.id = args[1].toString();
    let scale = args[6];
    let offset = blobsSpaceTransform.offset;
    let width = blobsSpaceTransform.width;
    let height = blobsSpaceTransform.height;
    data.hand_left = {
        x: args[2],
        y: args[3],
        width: scale * width,
        height: scale * height
    };
    data.hand_right = {
        x: args[4],
        y: args[5],
        width: scale * width,
        height: scale * height
    };
    data.scale = scale;
    if ($0d246894a09de756$var$isSkelJointDetected(data.hand_left)) {
        data.hand_left.x = data.hand_left.x * width + offset.x;
        data.hand_left.y = data.hand_left.y * height + offset.y;
    }
    if ($0d246894a09de756$var$isSkelJointDetected(data.hand_right)) {
        data.hand_right.x = data.hand_right.x * width + offset.x;
        data.hand_right.y = data.hand_right.y * height + offset.y;
    }
    return data;
}
function $0d246894a09de756$var$isSkelJointDetected(joint) {
    return joint.x >= 0 && joint.y >= 0;
}
function $0d246894a09de756$export$cac0078609642a76(address, args, blobsSpaceTransform) {
    const BlobData = {
        type: null,
        id: "",
        classId: "",
        x: 0,
        y: 0,
        rotation: 0,
        width: 0,
        height: 0,
        velocityX: 0,
        velocityY: 0,
        timeAlive: 0
    };
    let offset = blobsSpaceTransform.offset;
    let width = blobsSpaceTransform.width;
    let height = blobsSpaceTransform.height;
    var blobData = Object.assign({
    }, BlobData);
    blobData.id = args[1].toString();
    switch(address){
        case $cd45431f4dea502e$export$2e2bcd8739ae039.blob:
            if (!$0d246894a09de756$var$checkBlobDataFormat(args, 13)) return null;
            blobData.x = args[2];
            blobData.y = args[3];
            blobData.rotation = args[4];
            blobData.width = args[5];
            blobData.height = args[6];
            blobData.velocityX = args[8];
            blobData.velocityY = args[9];
            blobData.timeAlive = args[12];
            break;
        case $cd45431f4dea502e$export$2e2bcd8739ae039.object:
            if (!$0d246894a09de756$var$checkBlobDataFormat(args, 11)) return null;
            blobData.classId = args[2];
            blobData.x = args[3];
            blobData.y = args[4];
            blobData.rotation = args[5];
            break;
        case $cd45431f4dea502e$export$2e2bcd8739ae039.cursor:
            if (!$0d246894a09de756$var$checkBlobDataFormat(args, 7)) return null;
            blobData.x = args[2];
            blobData.y = args[3];
            blobData.width = 60 / width;
            blobData.height = blobData.width;
            break;
        case $cd45431f4dea502e$export$2e2bcd8739ae039.marker:
            blobData.classId = args[2];
            blobData.x = args[3];
            blobData.y = args[4];
            blobData.rotation = args[5];
            blobData.width = args[6];
            break;
        default:
            console.error(`decodeSet_blob does not handle ${address}`);
            break;
    }
    blobData.x = blobData.x * width + offset.x;
    blobData.y = blobData.y * height + offset.y;
    blobData.width = blobData.width * width;
    blobData.height = blobData.height * height;
    return blobData;
}
function $0d246894a09de756$var$checkBlobDataFormat(args, length) {
    if (args.length != length) {
        console.error("Wrong Tuio set format. Supposed to have length " + length + " and has length " + args.length);
        return false;
    }
    return true;
}


function $de7ee26790ee6080$var$Blob_blob(id, classId = "") {
    this.id = id;
    this.classId = classId;
    this.update = (data)=>{
        this.width = data.width ? data.width : 0;
        this.height = data.height ? data.height : 0;
        this.rotation = data.rotation ? data.rotation : 0;
        this.timeAlive = data.timeAlive ? data.timeAlive : 0;
        if (!data.velocityX && !data.velocityY && this.x && this.y && data.x && data.y) {
            this.velocityX = data.x - this.x;
            this.velocityY = data.y - this.y;
        } else {
            this.velocityX = data.velocityX ? data.velocityX : 0;
            this.velocityY = data.velocityY ? data.velocityY : 0;
        }
        this.x = data.x;
        this.y = data.y;
    };
}
var $de7ee26790ee6080$export$2e2bcd8739ae039 = $de7ee26790ee6080$var$Blob_blob;


function $2185bb877c891376$var$TouchesController(target = window) {
    let self = this;
    let activeBlobTouches = new Map(); // blob.id -> touch.id
    this.activeBlobs = new Map();
    this.target = target;
    this.update = function(blobsAdded, blobsMoved, blobsDeleted, blobsAll, extraTouchProperties = null) {
        let touchesAdded = blobsAdded.map((blob)=>{
            return touchFor(blob, extraTouchProperties);
        });
        let touchesMoved = blobsMoved.map((blob)=>{
            return touchFor(blob, extraTouchProperties);
        });
        let touchesDeleted = blobsDeleted.map((blob)=>{
            return touchFor(blob, extraTouchProperties);
        });
        let touchesAll = blobsAll.map((blob)=>{
            return touchFor(blob, extraTouchProperties);
        });
        for (let blob1 of blobsDeleted)activeBlobTouches.delete(blob1.id, extraTouchProperties);
        return {
            added: touchesAdded,
            moved: touchesMoved,
            deleted: touchesDeleted,
            all: touchesAll
        };
    };
    function touchFor(blob, extraTouchProperties) {
        let id;
        if (!activeBlobTouches.has(blob.id)) {
            id = generateTouchId();
            activeBlobTouches.set(blob.id, id);
        } else id = activeBlobTouches.get(blob.id);
        let extraProperties = extraTouchProperties ? extraTouchProperties(blob) : {
        };
        let properties = Object.assign({
            identifier: id,
            target: self.target,
            pageX: blob.x,
            pageY: blob.y,
            clientX: blob.x,
            clientY: blob.y,
            screenX: blob.x,
            screenY: blob.y
        }, extraProperties);
        return new Touch(properties);
    }
    function generateTouchId() {
        return Date.now() + Math.round(Math.random() * 1000);
    }
}
var $2185bb877c891376$export$2e2bcd8739ae039 = $2185bb877c891376$var$TouchesController;


function $23bee960faafb7e6$var$TouchesController_blob(touchTarget) {
    let self = this;
    let controller = new $2185bb877c891376$export$2e2bcd8739ae039(touchTarget);
    this.activeTouches = new Map();
    this.setTouchTarget = function(target) {
        controller.target = target;
    };
    this.update = function(blobsMap) {
        let added = [];
        let moved = [];
        let deleted = [];
        let all = [];
        for (let [id, blob] of blobsMap){
            if (!self.activeTouches.has(id)) {
                added.push(blob);
                self.activeTouches.set(id, blob);
            } else moved.push(blob);
            all.push(blob);
        }
        // check if any was deleted
        for (let [id1, blob1] of this.activeTouches)if (!blobsMap.has(id1)) // was deleted
        deleted.push(blob1);
        for (let blob2 of deleted)this.activeTouches.delete(blob2.id);
        return controller.update(added, moved, deleted, all, extraTouchProperties);
    };
    function extraTouchProperties(blob) {
        return {
            radiusX: blob.width,
            radiusY: blob.height,
            rotationAngle: blob.rotation
        };
    }
}
var $23bee960faafb7e6$export$2e2bcd8739ae039 = $23bee960faafb7e6$var$TouchesController_blob;


function $ec4cef13c9ed411d$var$BlobItemsController_blob(touchTarget, onAdded, onDeleted) {
    let self = this;
    let decodeSet = $0d246894a09de756$export$cac0078609642a76;
    let touchesController = new $23bee960faafb7e6$export$2e2bcd8739ae039(touchTarget);
    this.activeItems = new Map();
    this.setTouchTarget = function(target) {
        touchesController.setTouchTarget(target);
    };
    this.updateSet = function(address, args, blobsSpaceTransform) {
        let itemData = decodeSet(address, args, blobsSpaceTransform);
        let id = itemData.id;
        if (!id) {
            console.error("set error: every item needs to have an id");
            return;
        }
        if (!this.activeItems.has(id)) {
            let blob = new $de7ee26790ee6080$export$2e2bcd8739ae039(id, itemData.classId);
            this.activeItems.set(id, blob);
            blob.update(itemData);
            onAdded(id);
        } else {
            let blob = this.activeItems.get(id);
            blob.update(itemData);
        }
    };
    this.deleteItem = function(id) {
        this.activeItems.delete(id);
        onDeleted(id);
    };
    this.updateTouches = function() {
        return touchesController.update(self.activeItems);
    };
}
var $ec4cef13c9ed411d$export$2e2bcd8739ae039 = $ec4cef13c9ed411d$var$BlobItemsController_blob;



function $1bdbadf8ebb6bd2d$var$Blob_skel(id) {
    this.id = id;
    this.hand_left = {
        id: id + "_hand_left",
        x: -1,
        y: -1
    };
    this.hand_right = {
        id: id + "_hand_right",
        x: -1,
        y: -1
    };
    this.scale = -1;
    this.update = (data)=>{
        this.hand_left.x = data.hand_left.x;
        this.hand_left.y = data.hand_left.y;
        this.hand_left.width = data.hand_left.width;
        this.hand_left.height = data.hand_left.height;
        this.hand_right.x = data.hand_right.x;
        this.hand_right.y = data.hand_right.y;
        this.hand_right.width = data.hand_right.width;
        this.hand_right.height = data.hand_right.height;
        this.scale = data.scale;
    };
    this.isHandValid = function(hand) {
        return hand.x >= 0 && hand.y >= 0;
    };
    this.validHands = function() {
        let hands = [];
        if (this.isHandValid(this.hand_left)) hands.push(this.hand_left);
        if (this.isHandValid(this.hand_right)) hands.push(this.hand_right);
        return hands;
    };
}
var $1bdbadf8ebb6bd2d$export$2e2bcd8739ae039 = $1bdbadf8ebb6bd2d$var$Blob_skel;



function $29ec8f79d6ea5c25$var$TouchesController_skel(touchTarget) {
    let self = this;
    let controller = new $2185bb877c891376$export$2e2bcd8739ae039(touchTarget);
    this.activeTouches = new Map();
    this.setTouchTarget = function(target) {
        controller.target = target;
    };
    this.update = function(skelsMap) {
        let handsSet = new Set();
        let handsAdded = [];
        let handsMoved = [];
        let handsDeleted = [];
        let handsAll = [];
        for (let [id, skel] of skelsMap){
            let validHands = skel.validHands();
            for (let hand of validHands){
                if (!self.activeTouches.has(hand.id)) {
                    handsAdded.push(hand);
                    self.activeTouches.set(hand.id, hand);
                } else handsMoved.push(hand);
                handsSet.add(hand.id);
                handsAll.push(hand);
            }
        }
        // check if any was deleted
        for (let [id1, hand] of this.activeTouches)if (!handsSet.has(id1)) // was deleted
        handsDeleted.push(hand);
        for (let hand1 of handsDeleted)this.activeTouches.delete(hand1.id);
        return controller.update(handsAdded, handsMoved, handsDeleted, handsAll);
    };
}
var $29ec8f79d6ea5c25$export$2e2bcd8739ae039 = $29ec8f79d6ea5c25$var$TouchesController_skel;


function $2fce2ec007c862cf$var$BlobItemsController_skel(touchTarget, onAdded, onDeleted) {
    let self = this;
    let decodeSet = $0d246894a09de756$export$a08dd5f8ed298c02;
    let touchesController = new $29ec8f79d6ea5c25$export$2e2bcd8739ae039(touchTarget);
    this.activeItems = new Map();
    this.setTouchTarget = function(target) {
        touchesController.setTouchTarget(target);
    };
    this.updateSet = function(address, args, blobsSpaceTransform) {
        let itemData = decodeSet(address, args, blobsSpaceTransform);
        let id = itemData.id;
        if (!id) {
            console.error("set error: every item needs to have an id");
            return;
        }
        if (!this.activeItems.has(id)) {
            let blob = new $1bdbadf8ebb6bd2d$export$2e2bcd8739ae039(id);
            self.activeItems.set(id, blob);
            blob.update(itemData);
            onAdded(id);
        } else {
            let blob = this.activeItems.get(id);
            blob.update(itemData);
        }
    };
    this.deleteItem = function(id) {
        this.activeItems.delete(id);
        onDeleted(id);
    };
    this.updateTouches = function() {
        return touchesController.update(self.activeItems);
    };
}
var $2fce2ec007c862cf$export$2e2bcd8739ae039 = $2fce2ec007c862cf$var$BlobItemsController_skel;


function $f142ca50e961aece$var$TUIOBlobs(oscMessageAddress1) {
    let self = this;
    let messageAddress;
    this.onFrameUpdate = null;
    this.onAdded = null;
    this.onDeleted = null;
    let itemsController;
    let touchTarget = window;
    let touchEventsEnabled = true;
    let blobsSpaceTransform = {
        width: window.innerWidth,
        height: window.innerHeight,
        offset: {
            x: 0,
            y: 0
        }
    };
    init(oscMessageAddress1);
    this.setTouchTarget = function(target) {
        touchTarget = target;
        if (!itemsController) return;
        itemsController.setTouchTarget(target);
    };
    this.setTouchEventsEnabled = function(isEnabled) {
        touchEventsEnabled = isEnabled;
    };
    this.setMessageAddress = function(oscMessageAddress) {
        if (messageAddress === oscMessageAddress) return;
        if (!oscMessageAddress.includes("/tuio/")) {
            console.log(`${oscMessageAddress} is not a TUIO address`);
            return;
        }
        messageAddress = oscMessageAddress;
        switch(messageAddress){
            case $cd45431f4dea502e$export$2e2bcd8739ae039.skel:
                itemsController = new $2fce2ec007c862cf$export$2e2bcd8739ae039(touchTarget, onItemAdded, onItemDeleted);
                break;
            default:
                itemsController = new $ec4cef13c9ed411d$export$2e2bcd8739ae039(touchTarget, onItemAdded, onItemDeleted);
        }
    };
    this.setBlobsSpaceTransform = function(x, y, width, height) {
        blobsSpaceTransform.width = width;
        blobsSpaceTransform.height = height;
        blobsSpaceTransform.offset = {
            x: x,
            y: y
        };
    };
    this.getMessageAddress = function() {
        return messageAddress;
    };
    this.getActiveItems = function() {
        if (!itemsController) return new Map();
        return itemsController.activeItems;
    };
    this.onOSCMessage = function(json) {
        for(var i in json){
            var args = json[i].args;
            if (args == undefined) continue;
            var address = json[i].address;
            if (address && !messageAddress) self.setMessageAddress(address);
            else if (address !== messageAddress) continue;
            if (!itemsController) return;
            switch(args[0]){
                case "fseq":
                    if (args.length <= 1) return;
                    onNewFrame(args[1]);
                    break;
                case "set":
                    itemsController.updateSet(address, args, blobsSpaceTransform);
                    break;
                case "alive":
                    updateAlive(args);
                    break;
                default:
                    break;
            }
        }
        return messageAddress;
    };
    this.updateTouches = function() {
        if (!itemsController || !touchEventsEnabled) return null;
        return itemsController.updateTouches();
    };
    //
    // fseq
    // 
    function onNewFrame(fseq) {
        if (self.onFrameUpdate == null) return;
        self.onFrameUpdate(fseq);
    }
    //
    // alive
    //
    function updateAlive(idsAlive) {
        var idsToRemove = [];
        for (let [id, item] of itemsController.activeItems){
            let isAlive = false;
            for (var aliveItem of idsAlive){
                isAlive = aliveItem == id;
                if (isAlive) break;
            }
            if (!isAlive) {
                console.log(`${id} is not included in ${idsAlive} -> remove it`);
                idsToRemove.push(id);
            }
        }
        for (let id1 of idsToRemove)itemsController.deleteItem(id1);
    }
    function onItemAdded(id, x, y) {
        if (self.onAdded == null) return;
        self.onAdded(id, x, y);
    }
    function onItemDeleted(id) {
        if (self.onDeleted == null) return;
        self.onDeleted(id);
    }
    function init(oscMessageAddress) {
    //self.setMessageAddress(oscMessageAddress);
    }
}
var $f142ca50e961aece$export$2e2bcd8739ae039 = $f142ca50e961aece$var$TUIOBlobs;


class $29ce27527f9f9422$export$b6c32681ca39b455 {
    /**
   * Attaches listeners to window
   */ constructor(){
        this.defaultAddress = null;
        this.defaultController = new $f142ca50e961aece$export$2e2bcd8739ae039(null);
        this.controllers = new Map();
        this.touchTarget = window;
        window.addEventListener('message', this.onMessage.bind(this), false);
        window.requestAnimationFrame(this.loop.bind(this));
    }
    /**
   * Sets touch target.
   * @param target Target.
   */ setTouchTarget(target) {
        if (target) {
            this.touchTarget = target;
            this.loopControllers((controller)=>{
                controller.setTouchTarget(target);
            });
        }
    }
    /**
   * Sets input.
   * @param inputs Inputs.
   * @param touchEventsTarget Target.
   */ setInput(inputs = [], touchEventsTarget = null) {
        this.controllers = new Map();
        this.defaultAddress = null;
        this.defaultController = null;
        for (let input of inputs){
            let address = input.address;
            if (!address) continue;
            let controller = new $f142ca50e961aece$export$2e2bcd8739ae039(address);
            if (this.controllers.has(address)) continue;
            if (!this.defaultAddress) this.defaultAddress = address;
            if (input.touchEvents != null) controller.setTouchEventsEnabled(input.touchEvents);
            this.controllers.set(address, controller);
        }
        this.setTouchTarget(touchEventsTarget ? touchEventsTarget : this.touchTarget);
    }
    /**
   * Sets blobs space transform.
   * @param x X.
   * @param y Y.
   * @param width Width.
   * @param height Height.
   */ setBlobsSpaceTransform(x, y, width, height) {
        this.loopControllers((controller)=>{
            controller.setBlobsSpaceTransform(x, y, width, height);
        });
    }
    /**
   * Sets touch event as enabled or disabled.
   * @param isEnabled Value indicating whether is enabled.
   * @param address Address.
   */ setTouchEventsEnabled(isEnabled, address = null) {
        let controller = this.getController(address);
        if (controller) controller.setTouchEventsEnabled(isEnabled);
    }
    /**
   * Gets controller.
   * @param address Address.
   * @returns Controller.
   */ getController(address = null) {
        if (!address && this.defaultController) return this.defaultController;
        else if (!address && this.defaultAddress) return this.controllers.get(this.defaultAddress);
        else if (address) return this.controllers.get(address);
        return null;
    }
    /**
   * Gets active items.
   * @param address Address.
   * @returns Active items.
   */ getActiveItems(address = null) {
        let controller = this.getController(address);
        if (!controller) return new Map();
        return controller.getActiveItems();
    }
    onMessage(evt) {
        this.onOSCMessage(evt.data);
    }
    onOSCMessage(json) {
        this.loopControllers((controller)=>{
            controller.onOSCMessage(json);
        });
        if (this.defaultController) {
            const address = this.defaultController.getMessageAddress();
            if (address) {
                this.controllers.set(address, this.defaultController);
                this.defaultController = null;
                if (!this.defaultAddress) this.defaultAddress = address;
            }
        }
    }
    loopControllers(action) {
        if (this.defaultController) action(this.defaultController);
        else for (let [address, controller] of this.controllers)action(controller);
    }
    loop() {
        let touchesAdded = [];
        let touchesMoved = [];
        let touchesDeleted = [];
        let touchesAll = [];
        this.loopControllers((controller)=>{
            let touches = controller.updateTouches();
            if (touches && touches.all) {
                if (touches.added) touchesAdded = touchesAdded.concat(touches.added);
                if (touches.moved) touchesMoved = touchesMoved.concat(touches.moved);
                if (touches.deleted) touchesDeleted = touchesDeleted.concat(touches.deleted);
                touchesAll = touchesAll.concat(touches.all);
            }
        });
        this.sendTouchesAdded(touchesAdded, touchesAll);
        this.sendTouchesMoved(touchesMoved, touchesAll);
        this.sendTouchesDeleted(touchesDeleted, touchesAll);
        window.requestAnimationFrame(this.loop.bind(this));
    }
    sendTouchesAdded(touchesChanged, touchesAll) {
        if (touchesChanged.length == 0) return;
        this.touchTarget.dispatchEvent(this.event('touchstart', touchesChanged, touchesAll));
    }
    sendTouchesMoved(touchesChanged, touchesAll) {
        if (touchesChanged.length == 0) return;
        console.log(touchesAll);
        this.touchTarget.dispatchEvent(this.event('touchmove', touchesChanged, touchesAll));
    }
    sendTouchesDeleted(touchesChanged, touchesAll) {
        if (touchesChanged.length == 0) return;
        this.touchTarget.dispatchEvent(this.event('touchend', touchesChanged, touchesAll));
    }
    event(type, touchesChanged, touchesAll) {
        return new TouchEvent(type, {
            changedTouches: touchesChanged,
            targetTouches: touchesAll,
            touches: touchesAll
        });
    }
}


class $adefdebbb6d956e3$export$bf5acd943326457 {
    /**
   * Creates an instance of the OscListener class.
   */ constructor(){
        this.events = new Map();
        const self = this;
        // listen osc events
        window.addEventListener('message', (event)=>{
            for(let i = 0; i < event.data.length; i++){
                const e = event.data[i].address;
                if (self.events.has(e)) {
                    const callback = self.events.get(e);
                    callback();
                }
            }
        }, false);
    }
    /**
   * Adds a callback function to the given event.
   * @param event Event name to listen to.
   * @param callback Function to execute when the event is recieved.
   */ add(event, callback) {
        this.events.set(event, callback);
    }
}



function $0cc22e263482b346$export$498ecf32d8e5038b() {
    return $94dc54fe1b2e5635$export$cec157cbbbaf65c9.getMediaInfo();
}
function $0cc22e263482b346$export$a5202107d3e3cdb0() {
    return $94dc54fe1b2e5635$export$cec157cbbbaf65c9.getDeviceInfo();
}



function $e3bbfca4405f77b1$export$4b2634a642f10d54(subject, text) {
    return $94dc54fe1b2e5635$export$cec157cbbbaf65c9.logAlarm(subject, text);
}




const $149c1bd638913645$var$broox = {
    media: {
        getAvailableDevices: $0af19e6dc1be2ad2$export$13a2ac54ef3e3802,
        getDeviceId: $0af19e6dc1be2ad2$export$be262d700bd1c696,
        startDevice: $0af19e6dc1be2ad2$export$b04c27f4306c4f03,
        drawElement: $4ffbf3df34b9aacd$export$ea631e88b0322146,
        drawVideo: $4ffbf3df34b9aacd$export$fa3373cf5ebce5bf,
        blobToImage: $c3263300ab5ba544$export$408b3c1884176160,
        Composition: $d7e6bea30dda6116$export$d955f48b7132ae28,
        Recorder: $647f5b764790ed4d$export$336a011955157f9a
    },
    mediaPlayer: {
        Blobs: $29ce27527f9f9422$export$b6c32681ca39b455,
        KeyValue: $5ed460d269917590$export$12b3cc2522c3bba5,
        GestureHandler: $479e08f957450ed1$export$dfd4fa32db6567bf,
        GestureType: $dc7e17fc971b80b3$export$ff50662d7c6e93a2,
        OscListener: $adefdebbb6d956e3$export$bf5acd943326457,
        getMediaInfo: $0cc22e263482b346$export$498ecf32d8e5038b,
        getDeviceInfo: $0cc22e263482b346$export$a5202107d3e3cdb0,
        logAlarm: $e3bbfca4405f77b1$export$4b2634a642f10d54
    }
};
var $149c1bd638913645$export$2e2bcd8739ae039 = $149c1bd638913645$var$broox;


export {$149c1bd638913645$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=broox.js.map
