import OSCMessageAddress from "../../OSCMessageAddress";

export function decodeSet_skel(address, args, blobsSpaceTransform) {
    var data = {};
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
    }

    data.hand_right = {
        x: args[4],
        y: args[5],
        width: scale * width,
        height: scale * height
    }
    data.scale = scale;

    if(isSkelJointDetected(data.hand_left)){
        data.hand_left.x = data.hand_left.x * width + offset.x;
        data.hand_left.y = data.hand_left.y * height + offset.y;
    }
    
    if(isSkelJointDetected(data.hand_right)){
        data.hand_right.x = data.hand_right.x * width + offset.x;
        data.hand_right.y = data.hand_right.y * height + offset.y;
    }

    return data;
}

function isSkelJointDetected(joint){
    return joint.x >= 0 && joint.y >= 0
}



export function decodeSet_blob(address, args, blobsSpaceTransform) {
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
    }

    let offset = blobsSpaceTransform.offset;
    let width = blobsSpaceTransform.width;
    let height = blobsSpaceTransform.height;

    var blobData = Object.assign({}, BlobData);
    blobData.id = args[1].toString();

    switch(address){
        case OSCMessageAddress.blob:
            if(!checkBlobDataFormat(args, 13)){return null;}
            blobData.x = args[2];
            blobData.y = args[3];
            blobData.rotation = args[4];
            blobData.width = args[5];
            blobData.height = args[6];
            blobData.velocityX = args[8];
            blobData.velocityY = args[9];
            blobData.timeAlive = args[12];
            break;
        case OSCMessageAddress.object:
            if(!checkBlobDataFormat(args, 11)){return null;}
            blobData.classId = args[2];
            blobData.x = args[3];
            blobData.y = args[4];
            blobData.rotation = args[5];
            break;
        case OSCMessageAddress.cursor:
            if(!checkBlobDataFormat(args, 7)){return null;}
            blobData.x = args[2];
            blobData.y = args[3];
            blobData.width = 60 / width;
            blobData.height = blobData.width;
           break;
        case OSCMessageAddress.marker:
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

function checkBlobDataFormat(args, length){
    if(args.length != length){
        console.error("Wrong Tuio set format. Supposed to have length "+ length + " and has length "+ args.length);
        return false;
    }
    return true;
}