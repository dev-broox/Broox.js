// import { OscClient } from './OscClient';
import { OscClient } from './brooxVisionNode';
import { Parser } from './model/Parser';
import { Renderer } from './model/Renderer';
import { Zone } from './model/Zone';

const parser = new Parser();
const container = document.getElementById('container');
const renderer = new Renderer(container.clientWidth, container.clientHeight);
const canvas = renderer.getCanvas();
container.appendChild(canvas);
const client = new OscClient('http://localhost:5000/webrtc');
client.connect();

client.onMessage((event) => {
  for(const data of event) {
    const args = data.args.map(d => d.value);
    if(data.address == '/tuio/2Dblb') {
      args[0] === 'alive' && parser.checkAlive(args.slice(1));
      args[0] === 'set' && parser.setBox(args);
    }
    if(data.address === '/tuio/joint') {
      parser.setJoint(args);
    }
    else if(data.address === '/tuio/feature') {
      parser.setFeature(args);
    }
  }
  const skeletons = parser.getSkeletons();
  renderer.clear();
  const zones = new Map<string, Zone>();
  for(const skeleton of skeletons) {
    if(skeleton.zone) {
      let zone = zones.get(skeleton.zone);
      if(!zone) {
        zone = { name: skeleton.zone, count: 0 };
        zones.set(skeleton.zone, zone);
      }
      zone.count += 1;
    }
    renderer.renderSkeleton(skeleton);
  }
});