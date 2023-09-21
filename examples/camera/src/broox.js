const $0fc4256b6f990a00$export$fa3373cf5ebce5bf = (video, context, destinationWidth, destinationHeight, destinationX, destinationY, mirror = false)=>{
    $0fc4256b6f990a00$export$ea631e88b0322146(video, context, video.videoWidth, video.videoHeight, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
};
const $0fc4256b6f990a00$export$ea631e88b0322146 = (element, context, sourceWidth, sourceHeight, destinationWidth, destinationHeight, destinationX, destinationY, mirror = false)=>{
    $0fc4256b6f990a00$export$586746d88f07c896(element, context, false, sourceWidth, sourceHeight, 0, 0, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
};
const $0fc4256b6f990a00$export$586746d88f07c896 = (element, context, cutToScale, sourceWidth, sourceHeight, sourceX, sourceY, destinationWidth, destinationHeight, destinationX, destinationY, mirror = false)=>{
    // get ratios
    const horizontalRatio = Math.round(destinationWidth / sourceWidth * 100) / 100;
    const verticalRatio = Math.round(destinationHeight / sourceHeight * 100) / 100;
    let height = 0;
    let width = 0;
    let leftOffset = 0;
    let topOffset = 0;
    // take center of element vertically or horizontally depending on ratio
    if (verticalRatio === horizontalRatio) {
        width = sourceWidth;
        height = sourceHeight;
        leftOffset = 0;
        topOffset = 0;
    } else if (verticalRatio > horizontalRatio && cutToScale || verticalRatio < horizontalRatio && !cutToScale) {
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
        context.drawImage(element, sourceX + leftOffset, sourceY + topOffset, width, height, -destinationX, destinationY, -destinationWidth, destinationHeight);
    } else context.drawImage(element, sourceX + leftOffset, sourceY + topOffset, width, height, destinationX, destinationY, destinationWidth, destinationHeight);
};


let $bdd15a8450b5991c$var$Message;
(function(Message) {
    Message["deviceNotFound"] = 'Device not found';
    Message["forbiddenProjectName"] = 'Please use a different project name';
})($bdd15a8450b5991c$var$Message || ($bdd15a8450b5991c$var$Message = {
}));
var $bdd15a8450b5991c$export$2e2bcd8739ae039 = $bdd15a8450b5991c$var$Message;


const $2e840864c1780a35$export$13a2ac54ef3e3802 = ()=>{
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
};
const $2e840864c1780a35$export$be262d700bd1c696 = (name)=>{
    return new Promise((resolve, reject)=>{
        navigator.mediaDevices.enumerateDevices().then((devices)=>{
            for(let i = 0; i < devices.length; i++)if (devices[i].label === name) {
                resolve(devices[i].deviceId);
                return;
            }
            reject($bdd15a8450b5991c$export$2e2bcd8739ae039.deviceNotFound);
        }).catch((error)=>{
            reject(error.message);
        });
    });
};
const $2e840864c1780a35$export$b04c27f4306c4f03 = (deviceId, width, height)=>{
    return navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: deviceId,
            width: width,
            height: height
        }
    });
};


const $059c0856fe58e2bf$export$408b3c1884176160 = (blob)=>{
    return new Promise((resolve)=>{
        const image = new Image();
        image.onload = ()=>{
            URL.revokeObjectURL(image.src);
            resolve(image);
        };
        image.src = URL.createObjectURL(blob);
    });
};



class $4f2a169968c7adf0$export$d955f48b7132ae28 {
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
        const destinationWidth = width * this.scale * scale;
        const destinationHeight = height * this.scale * scale;
        const destinationX = this.borderWidth + x * scale * this.scale;
        const destinationY = this.borderWidth + y * scale * this.scale;
        $0fc4256b6f990a00$export$ea631e88b0322146(element, this.context, width, height, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
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
            , 'image/jpeg', 1);
        });
    }
}


class $58e589c3f3dd3888$export$336a011955157f9a {
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
   */ start(options) {
        const self = this;
        this.promise = new Promise((resolve, reject)=>{
            self.resolve = resolve;
        });
        let data = [];
        this.recorder = new MediaRecorder(this.stream, options || {
        });
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




export {$0fc4256b6f990a00$export$ea631e88b0322146 as drawElement, $0fc4256b6f990a00$export$586746d88f07c896 as drawPartOfElement, $0fc4256b6f990a00$export$fa3373cf5ebce5bf as drawVideo, $2e840864c1780a35$export$13a2ac54ef3e3802 as getAvailableDevices, $2e840864c1780a35$export$be262d700bd1c696 as getDeviceId, $2e840864c1780a35$export$b04c27f4306c4f03 as startDevice, $059c0856fe58e2bf$export$408b3c1884176160 as blobToImage, $4f2a169968c7adf0$export$d955f48b7132ae28 as Composition, $58e589c3f3dd3888$export$336a011955157f9a as Recorder};
//# sourceMappingURL=broox.js.map
