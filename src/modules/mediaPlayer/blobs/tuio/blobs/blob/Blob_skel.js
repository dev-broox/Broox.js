function Blob_skel(id) {
    this.id = id;
    this.hand_left = {
        id: id + "_hand_left",
        x: -1,
        y: -1
    }
    this.hand_right = {
        id: id + "_hand_right",
        x: -1,
        y: -1
    }

    this.scale = -1.0;

    this.update = (data) => {
        this.hand_left.x = data.hand_left.x;
        this.hand_left.y = data.hand_left.y;
        this.hand_left.width = data.hand_left.width;
        this.hand_left.height = data.hand_left.height;

        this.hand_right.x = data.hand_right.x;
        this.hand_right.y = data.hand_right.y;
        this.hand_right.width = data.hand_right.width;
        this.hand_right.height = data.hand_right.height;

        this.scale = data.scale;
    }

    this.isHandValid = function(hand) {
        return hand.x >= 0 && hand.y >= 0;
    }

    this.validHands = function() {
        let hands = [];
        if(this.isHandValid(this.hand_left)) {
            hands.push(this.hand_left);
        }
        if(this.isHandValid(this.hand_right)) {
            hands.push(this.hand_right);
        }

        return hands;
    }
}

export default Blob_skel;