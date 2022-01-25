function TouchesController(target = window) {
    let self = this;
    let activeBlobTouches = new Map(); // blob.id -> touch.id
    
    this.activeBlobs = new Map();
    this.target = target;

    this.update = function(blobsAdded, blobsMoved, blobsDeleted, blobsAll, extraTouchProperties = null) {
        let touchesAdded = blobsAdded.map(blob => {
            return touchFor(blob, extraTouchProperties);
        });

        let touchesMoved = blobsMoved.map(blob => {
            return touchFor(blob, extraTouchProperties);
        })

        let touchesDeleted = blobsDeleted.map(blob => {
            return touchFor(blob, extraTouchProperties);
        })

        let touchesAll = blobsAll.map(blob => {
            return touchFor(blob, extraTouchProperties);
        })

        for (let blob of blobsDeleted) {
            activeBlobTouches.delete(blob.id, extraTouchProperties);
        }

        return {
            added: touchesAdded,
            moved: touchesMoved,
            deleted: touchesDeleted,
            all: touchesAll
        }
    }

    function touchFor(blob, extraTouchProperties) {
        let id;

        if(!activeBlobTouches.has(blob.id)) {
            id = generateTouchId();
            activeBlobTouches.set(blob.id, id);
        }
        else{
            id = activeBlobTouches.get(blob.id);
        }

        let extraProperties = extraTouchProperties ? extraTouchProperties(blob) : {};
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


export default TouchesController;