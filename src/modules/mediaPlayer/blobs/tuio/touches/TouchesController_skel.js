import TouchesController from './TouchesController'

function TouchesController_skel(touchTarget) {
    let self = this;
    let controller = new TouchesController(touchTarget);

    this.activeTouches = new Map();

    this.setTouchTarget = function(target) {
       controller.target = target;
    }

    this.update = function(skelsMap) {
        let handsSet = new Set();

        let handsAdded = [];
        let handsMoved = [];
        let handsDeleted = [];
        let handsAll = [];

        for(let [id, skel] of skelsMap) {
            let validHands = skel.validHands();

            for(let hand of validHands) {
                if(!self.activeTouches.has(hand.id)) {
                    handsAdded.push(hand);
                    self.activeTouches.set(hand.id, hand);
                }
                else {
                    handsMoved.push(hand);
                }

                handsSet.add(hand.id);
                handsAll.push(hand);
            }
        }

        // check if any was deleted
        for(let [id, hand] of this.activeTouches) {
            if(!handsSet.has(id)) {
                // was deleted
                handsDeleted.push(hand);
            }
        }

        for (let hand of handsDeleted) {
            this.activeTouches.delete(hand.id);
        }

        return controller.update(handsAdded, handsMoved, handsDeleted, handsAll);
    }
}

export default TouchesController_skel;