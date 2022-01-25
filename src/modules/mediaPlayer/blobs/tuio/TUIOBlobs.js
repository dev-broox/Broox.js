import OSCMessageAddress from "../OSCMessageAddress";
import BlobItemsController_blob from "./blobs/BlobItemsController_blob";
import BlobItemsController_skel from "./blobs/BlobItemsController_skel";

function TUIOBlobs(oscMessageAddress) {
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
        offset: {x: 0, y: 0}
    }

    init(oscMessageAddress);

    this.setTouchTarget = function(target) {
        touchTarget = target;
        if(!itemsController){return;}
        itemsController.setTouchTarget(target);
    }

    this.setTouchEventsEnabled = function(isEnabled) {
        touchEventsEnabled = isEnabled;
    }

    this.setMessageAddress = function(oscMessageAddress) {
        if(messageAddress === oscMessageAddress) {return;}

        if(!oscMessageAddress.includes("/tuio/")) {
            console.log(`${oscMessageAddress} is not a TUIO address`);
            return;
        }

        messageAddress = oscMessageAddress;

        switch(messageAddress) {
            case OSCMessageAddress.skel:
                itemsController = new BlobItemsController_skel(touchTarget, onItemAdded, onItemDeleted);
                break;
            default:
                itemsController = new BlobItemsController_blob(touchTarget, onItemAdded, onItemDeleted);
        }
    }

    this.setBlobsSpaceTransform = function(x, y, width, height) {
        blobsSpaceTransform.width = width;
        blobsSpaceTransform.height = height;
        blobsSpaceTransform.offset = {x, y};
    }

    this.getMessageAddress = function() {
        return messageAddress;
    }

    this.getActiveItems = function() {
        if(!itemsController) {
            return new Map();
        }
        return itemsController.activeItems;
    }
    
    this.onOSCMessage = function(json){
        
        for(var i in json){
            var args = json[i].args
            if(args == undefined){continue;}
            var address = json[i].address;

            if(address && !messageAddress) {
                self.setMessageAddress(address);
            }
            else if(address !== messageAddress ){continue;}

            if(!itemsController) {return;}

            switch(args[0]){
                case "fseq":
                    if(args.length <= 1) {return;}
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
    }

    this.updateTouches = function() {
        if(!itemsController || !touchEventsEnabled){return null;}
        return itemsController.updateTouches();
    }

    //
    // fseq
    // 
    function onNewFrame(fseq){
        if(self.onFrameUpdate == null){return;}
        self.onFrameUpdate(fseq);
    }

    //
    // alive
    //

    function updateAlive(idsAlive){
        var idsToRemove = [];

        for(let [id, item] of itemsController.activeItems) {
            let isAlive = false;
            for(var aliveItem of idsAlive){
                isAlive = aliveItem == id;
                if(isAlive){
                    break;
                }
            }

            if(!isAlive) {
                console.log(`${id} is not included in ${idsAlive} -> remove it`);
                idsToRemove.push(id);
            }
        }

        for(let id of idsToRemove) {
            itemsController.deleteItem(id);
        }
    }

    function onItemAdded(id, x, y){
        if(self.onAdded == null){return;}
        self.onAdded(id, x, y);
    }

    function onItemDeleted(id){
        if(self.onDeleted == null){return;}
        self.onDeleted(id);
    }


    function init(oscMessageAddress) {
        //self.setMessageAddress(oscMessageAddress);
    }


}

export default TUIOBlobs;