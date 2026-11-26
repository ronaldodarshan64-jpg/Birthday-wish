const screens = [...document.querySelectorAll('.screen')];
function showScreen(id) {
  screens.forEach(section => section.classList.toggle('active', section.id === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.getElementById('beginBtn').addEventListener('click', () => { showScreen('birthday'); burst(); });
document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => {
  showScreen(button.dataset.next); if (button.dataset.next === 'memories') burst();
}));
document.getElementById('replayBtn').addEventListener('click', () => {
  const pass = document.getElementById('adventurePass');
  pass.hidden = true;
  document.getElementById('giftButton').disabled = false;
  document.getElementById('giftButton').innerHTML = '<span>✦</span> UNLOCK YOUR NEXT ADVENTURE <span>✦</span>';
  document.getElementById('giftMessage').textContent = 'Keep collecting moments, not maps. Happy Birthday, Bhoomi! ✨';
  showScreen('welcome');
});
document.getElementById('giftButton').addEventListener('click', () => {
  const pass = document.getElementById('adventurePass');
  pass.hidden = false;
  pass.classList.remove('pass-reveal');
  void pass.offsetWidth;
  pass.classList.add('pass-reveal');
  document.getElementById('giftButton').disabled = true;
  document.getElementById('giftButton').innerHTML = '<span>✦</span> ADVENTURE UNLOCKED <span>✦</span>';
  document.getElementById('giftMessage').textContent = 'No itinerary. No limits. Just you, the open road and a thousand new stories. ✨';
  burst(190);
  setTimeout(() => pass.scrollIntoView({behavior:'smooth',block:'center'}), 350);
});

// One-at-a-time hanging photo reel: supports arrows, dots and touch swipes.
const track = document.getElementById('hangingTrack');
const slides = [...document.querySelectorAll('.hanging-photo')];
const count = document.getElementById('memoryCount');
const dots = document.getElementById('memoryDots');
let current = 0;
slides.forEach((_, i) => {
  const dot = document.createElement('button'); dot.type = 'button'; dot.setAttribute('aria-label', `Show memory ${i + 1}`);
  dot.addEventListener('click', () => goTo(i)); dots.appendChild(dot);
});
function goTo(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  count.textContent = `${String(current + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === current));
}
document.getElementById('memoryPrev').addEventListener('click', () => goTo(current - 1));
document.getElementById('memoryNext').addEventListener('click', () => goTo(current + 1));
goTo(0);
const hangingWindow = document.getElementById('hangingWindow');
let touchStart = 0;
hangingWindow.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, {passive:true});
hangingWindow.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStart;
  if (Math.abs(delta) > 45) goTo(current + (delta < 0 ? 1 : -1));
}, {passive:true});

// The comic-photo surprise box opens only when clicked.
const funnyBox = document.getElementById('funnyBox');
const funnyReveal = document.getElementById('funnyReveal');
funnyBox.addEventListener('click', () => {
  const opened = funnyBox.classList.toggle('open');
  funnyBox.setAttribute('aria-expanded', String(opened));
  funnyReveal.hidden = !opened;
  funnyBox.querySelector('strong').textContent = opened ? 'SURPRISE OPENED!' : 'DO NOT OPEN…';
  if (opened) { burst(65); setTimeout(() => funnyReveal.scrollIntoView({behavior:'smooth',block:'center'}), 180); }
});

// Floating golden star particles.
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d'); let stars = [];
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio; canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  stars = Array.from({length:Math.min(100,Math.floor(window.innerWidth/12))},()=>({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:Math.random()*1.5+.3,a:Math.random()*.55+.15,speed:Math.random()*.25+.05,phase:Math.random()*Math.PI*2}));
}
function drawStars(time=0) {
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  stars.forEach(s=>{const alpha=s.a*(.65+.35*Math.sin(time*.001+s.phase));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(236,207,147,${alpha})`;ctx.shadowBlur=8;ctx.shadowColor='#d8b878';ctx.fill();s.y-=s.speed;if(s.y<-5){s.y=window.innerHeight+5;s.x=Math.random()*window.innerWidth;}});
  requestAnimationFrame(drawStars);
}
window.addEventListener('resize',resizeCanvas); resizeCanvas(); requestAnimationFrame(drawStars);
function burst(amount=90) {
  const symbols=['✦','✧','•','✶'];
  for(let i=0;i<amount;i++){
    const particle=document.createElement('span');particle.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    Object.assign(particle.style,{position:'fixed',left:`${Math.random()*100}vw`,top:'-25px',color:Math.random()>.5?'#f4dfad':'#d8b878',fontSize:`${Math.random()*13+8}px`,pointerEvents:'none',zIndex:'8',textShadow:'0 0 12px #d8b878'});
    document.body.appendChild(particle);const duration=Math.random()*2200+1800;
    particle.animate([{transform:'translateY(0) rotate(0deg)',opacity:0},{opacity:1,offset:.12},{transform:`translateY(${window.innerHeight+70}px) rotate(${Math.random()*400-200}deg)`,opacity:0}],{duration,easing:'ease-in'});
    setTimeout(()=>particle.remove(),duration);
  }
}
