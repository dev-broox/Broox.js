const $583bb4294fdf28cb$export$d668e62f6e0051f4 = async (controllerIp, deviceId, deviceIp, deviceType)=>{
    const url = `http://${controllerIp}:9912/config?id=${deviceId}&ip=${deviceIp}&type=${deviceType}`;
    const result = await fetch(url);
    const config = await result.json();
    const nodes = [];
    if (config.peers) for (let [id, peer] of Object.entries(config.peers))nodes.push({
        name: peer.name,
        ip: peer.ip,
        type: peer.type,
        mqttControlChannel: peer['mqtt-control-channel']
    });
    return nodes;
};




export {$583bb4294fdf28cb$export$d668e62f6e0051f4 as getNodes};
//# sourceMappingURL=brooxController.js.map
