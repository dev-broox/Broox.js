import TouchesController from './TouchesController'

function TouchesController_blob(touchTarget) {
    let self = this;
    let controller = new TouchesController(touchTarget);

    this.activeTouches = new Map();

    this.setTouchTarget = function(target) {
        controller.target = target;
    }

    this.update = function(blobsMap) {
        let added = [];
        let moved = [];
        let deleted = [];
        let all = [];

        for(let [id, blob] of blobsMap) {

            if(!self.activeTouches.has(id)) {
                added.push(blob);
                self.activeTouches.set(id, blob);
            }
            else {
                moved.push(blob);
            }
            all.push(blob);
        }

        // check if any was deleted
        for(let [id, blob] of this.activeTouches) {
            if(!blobsMap.has(id)) {
                // was deleted
                deleted.push(blob);
            }
        }

        for (let blob of deleted) {
            this.activeTouches.delete(blob.id);
        }

        return controller.update(added, moved, deleted, all, extraTouchProperties);
    }

    function extraTouchProperties(blob) {
        return {
            radiusX: blob.width,
            radiusY: blob.height,
            rotationAngle: blob.rotation
        }
    }
}

export default TouchesController_blob;