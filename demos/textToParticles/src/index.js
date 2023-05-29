import broox from './lib/index';

(async () => {
  const response = await fetch('./config/config.json');
  const config = await response.json();
  var canvas = document.querySelector("#scene"),
  ctx = canvas.getContext("2d"),
  particles = [],
  amount = 0,
  mouse = {x:0,y:0},
  hands = [{x:0,y:0}, {x:0,y:0}],
  radius = 1;

  var ww = canvas.width = window.innerWidth;
  var wh = canvas.height = window.innerHeight;

  const onUpdate = () => {
    for(let [id, value] of blobsController.getSkeletons()) {
      const skel = value.get();
      if(skel.leftHand.x > 0 && skel.leftHand.y > 0) {
        hands[0] = skel.leftHand;
      }
      if(skel.rightHand.x > 0 && skel.rightHand.y > 0) {
        hands[1] = skel.rightHand;
        mouse.x = skel.rightHand.x;
        mouse.y = skel.rightHand.y;
        radius = skel.rightHand.width;
      }
    }
  }
  const onSettingsChanged = (settings) => {
    console.log('settings changed', settings);
    keyValue.setValue('blobs', 'settings', settings);
  };
  const blobsController = new broox.mediaPlayer.BlobsController(document.body.clientWidth, document.body.clientHeight, false, onUpdate, () => {}, () => {}, () => {}, onSettingsChanged);
  blobsController.setKeyToOpenSettings('d');
  const keyValue = new broox.mediaPlayer.KeyValue();
  const settings = keyValue.getValue('blobs', 'settings');
  console.log('stored settings', settings);
  if(settings && settings !== {}) {
    blobsController.setActiveArea(settings.activeArea.x, settings.activeArea.y, settings.activeArea.width, settings.activeArea.height);
    blobsController.setBlobsScale(settings.handScale, settings.blobScale);
    blobsController.setBlobsColor(settings.handColor, settings.blobColor);
    blobsController.setSimulate(settings.simulate);
  }

  function Particle(x,y){
    this.x =  Math.random()*ww;
    this.y =  Math.random()*wh;
    this.dest = {
      x : x,
      y: y
    };
    this.r =  Math.random()*5 + 2;
    this.vx = (Math.random()-0.5)*20;
    this.vy = (Math.random()-0.5)*20;
    this.accX = 0;
    this.accY = 0;
    this.friction = Math.random()*0.05 + 0.94;
    this.color = config.colors[Math.floor(Math.random()*6)];
  }

  Particle.prototype.render = function() {
    this.accX = (this.dest.x - this.x)/1000;
    this.accY = (this.dest.y - this.y)/1000;
    this.vx += this.accX;
    this.vy += this.accY;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y +=  this.vy;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
    ctx.fill();
    for(let hand of hands) {
      var a = this.x - hand.x;
      var b = this.y - hand.y;
      var distance = Math.sqrt( a*a + b*b );
      if(distance<(hand.width)){
        this.accX = (this.x - hand.x)/100;
        this.accY = (this.y - hand.y)/100;
        this.vx += this.accX;
        this.vy += this.accY;
      }
    }
  }

  function initScene(){
    ww = canvas.width = window.innerWidth;
    wh = canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold " + (ww/10) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(config.text, ww/2, wh/2);
    var data  = ctx.getImageData(0, 0, ww, wh).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "screen";
    particles = [];
    for(var i=0;i<ww;i+=Math.round(ww/150)){
      for(var j=0;j<wh;j+=Math.round(ww/150)){
        if(data[ ((i + j*ww)*4) + 3] > 150){
          particles.push(new Particle(i,j));
        }
      }
    }
    amount = particles.length;
  }

  function render(a) {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < amount; i++) {
      particles[i].render();
    }
  };

  window.addEventListener("resize", initScene);
  initScene();
  requestAnimationFrame(render);  
})()
  .catch(e => {
    console.log(e);
  });


