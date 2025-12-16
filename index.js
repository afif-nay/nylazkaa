var heartStarted = false;

var S = {
  init() {
    S.Drawing.init('.canvas');
    S.UI.simulate("|#countdown 3||YOU||ARE||MY||LOVE||#rectangle|");

    S.Drawing.loop(() => {
      S.Shape.render();
    });
  }
};

S.Drawing = (() => {
  let canvas, ctx;
  const raf = window.requestAnimationFrame;

  return {
    init(el){
      canvas = document.querySelector(el);
      ctx = canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize',()=>this.resize());
    },
    loop(fn){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      fn();
      raf(()=>this.loop(fn));
    },
    resize(){
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    },
    draw(p){
      ctx.fillStyle='rgba(255,91,165,1)';
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.z,0,Math.PI*2);
      ctx.fill();
    },
    area(){
      return {w:canvas.width,h:canvas.height};
    }
  }
})();

S.Dot = function(x,y){
  this.x=x; this.y=y;
  this.tx=x; this.ty=y;
  this.z=3;
};
S.Dot.prototype.render=function(){
  this.x+=(this.tx-this.x)*0.1;
  this.y+=(this.ty-this.y)*0.1;
  S.Drawing.draw(this);
};

S.Shape={
  dots:[],
  switchShape(shape){
    const a=S.Drawing.area();
    while(this.dots.length<shape.length)
      this.dots.push(new S.Dot(a.w/2,a.h/2));

    shape.forEach((p,i)=>{
      this.dots[i].tx=p.x;
      this.dots[i].ty=p.y;
    });

    if(!heartStarted){
      heartStarted=true;
      document.querySelector('.namebox').style.opacity=1;
      startHeart();
    }
  },
  render(){
    this.dots.forEach(d=>d.render());
  }
};

S.ShapeBuilder={
  letter(txt){
    const c=document.createElement('canvas');
    const x=c.getContext('2d');
    c.width=innerWidth; c.height=innerHeight;
    x.fillStyle='white';
    x.font='bold 120px Arial';
    x.textAlign='center';
    x.textBaseline='middle';
    x.fillText(txt,c.width/2,c.height/2);

    const d=x.getImageData(0,0,c.width,c.height).data;
    let dots=[];
    for(let y=0;y<c.height;y+=10)
      for(let x2=0;x2<c.width;x2+=10){
        if(d[(y*c.width+x2)*4+3]>0)
          dots.push({x:x2,y:y});
      }
    return dots;
  }
};

S.UI={
  simulate(seq){
    const arr=seq.split('|').filter(Boolean);
    let i=0;
    const run=()=>{
      if(i>=arr.length) return;
      const v=arr[i++];
      if(v.startsWith('#countdown')){
        let n=3;
        const t=setInterval(()=>{
          S.Shape.switchShape(S.ShapeBuilder.letter(n));
          n--;
          if(n<0){clearInterval(t);run();}
        },1000);
      }else{
        S.Shape.switchShape(S.ShapeBuilder.letter(v));
        setTimeout(run,1200);
      }
    };
    run();
  }
};

function startHeart(){
  const c=document.getElementById('pinkboard');
  const ctx=c.getContext('2d');
  c.width=innerWidth; c.height=innerHeight;

  function heart(t){
    return {
      x:16*Math.pow(Math.sin(t),3),
      y:-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))
    };
  }

  function loop(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle='#ff30c5';
    for(let i=0;i<300;i++){
      const t=Math.random()*Math.PI*2;
      const p=heart(t);
      ctx.beginPath();
      ctx.arc(
        c.width/2+p.x*10,
        c.height/2+p.y*10,
        2,0,Math.PI*2
      );
      ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();
}

S.init();
