import * as Decoder from "../decoder/Decoder"
import Blob_blob from "./blob/Blob_blob"
import TouchesController_blob from "../touches/TouchesController_blob";

function BlobItemsController_blob(touchTarget, onAdded, onDeleted) {
    let self = this;
    let decodeSet = Decoder.decodeSet_blob;
    let touchesController = new TouchesController_blob(touchTarget);

    this.activeItems = new Map();

    this.setTouchTarget = function(target) {
        touchesController.setTouchTarget(target);
    }
   
    this.updateSet = function(address, args, blobsSpaceTransform) {
        let itemData = decodeSet(address, args, blobsSpaceTransform);
    
        let id = itemData.id;
        if(!id) {
            console.error("set error: every item needs to have an id");
            return;
        }

        if (!this.activeItems.has(id)) {
            let blob = new Blob_blob(id, itemData.classId);
            this.activeItems.set(id, blob);
            blob.update(itemData);
            onAdded(id);
        }
        else{
            let blob = this.activeItems.get(id);
            blob.update(itemData);
        }
    }

    this.deleteItem = function(id) {
        this.activeItems.delete(id);
        onDeleted(id);
    }


    this.updateTouches = function() {
        return touchesController.update(self.activeItems);
    }


}

export default BlobItemsController_blob;