import { Node } from './Node';

/**
 * Gets nodes from controller.
 * @param controllerIp Controller IP address.
 * @param nodeId Node id.
 * @param nodeIp Node IP address.
 * @param nodeType Node type.
 * @returns Nodes list
 */
export const getNodes = async (controllerIp: string, nodeId: string, nodeIp: string, nodeType: string): Promise<Node[]> => {
  const url = `http://${controllerIp}:9912/config?id=${nodeId}&ip=${nodeIp}&type=${nodeType}`;
  const result = await fetch(url);
  const config: any = await result.json();
  const nodes = [];
  if(config.peers) {
    for(let [id, value] of Object.entries(config.peers)) {
      const peer: any = value;
      nodes.push({
        name: peer.name,
        ip: peer.ip,
        type: peer.type,
        mqttControlChannel: peer['mqtt-control-channel']
      });
    }
  }
  return nodes;
}