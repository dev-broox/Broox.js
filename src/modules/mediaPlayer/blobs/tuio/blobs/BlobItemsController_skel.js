import * as Decoder from "../decoder/Decoder"
import Blob_skel from "./blob/Blob_skel"
import TouchesController_skel from "../touches/TouchesController_skel";

function BlobItemsController_skel(touchTarget, onAdded, onDeleted) {
    let self = this;
    let decodeSet = Decoder.decodeSet_skel;
    let touchesController = new TouchesController_skel(touchTarget);

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
            let blob = new Blob_skel(id);
            self.activeItems.set(id, blob);
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

export default BlobItemsController_skel;