import { useEffect, useRef, useState } from 'react';

function CanvasDodger({ hp, maxHp, onHit, onComplete }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let startTime = Date.now();
    let isInvulnerable = false;
    let invulnTimer = 0;
    
    const GAME_DURATION = 8000;
    const patternType = Math.random() > 0.5 ? 1 : 2; // 1: Rain, 2: Heavy Droplets
    
    // Player State
    const player = {
      x: 300, y: 300, width: 20, height: 20, speed: 4,
      image: new Image()
    };
    player.image.src = '/assets/Sprites/heart.png';

    // Tears State
    let tears = [];
    const tearImage = new Image();
    tearImage.src = '/assets/Sprites/tear.png';
    const bigTearImage = new Image();
    bigTearImage.src = '/assets/Sprites/bigger_tear.png';
    
    // Input State
    const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
    
    const handleKeyDown = (e) => { if(keys.hasOwnProperty(e.key)) keys[e.key] = true; };
    const handleKeyUp = (e) => { if(keys.hasOwnProperty(e.key)) keys[e.key] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    let spawnTimer = 0;

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed > GAME_DURATION) {
        onComplete();
        return;
      }
      
      // Update Player
      if (keys.ArrowUp) player.y -= player.speed;
      if (keys.ArrowDown) player.y += player.speed;
      if (keys.ArrowLeft) player.x -= player.speed;
      if (keys.ArrowRight) player.x += player.speed;
      
      // Clamp bounds
      player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
      player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
      
      // Spawning
      spawnTimer++;
      if (patternType === 1) {
        if (spawnTimer > 10) {
          spawnTimer = 0;
          tears.push({
            x: Math.random() * canvas.width,
            y: -20,
            width: 10, height: 20,
            vy: 2 + Math.random() * 2,
            type: 'normal',
            startX: Math.random() * canvas.width,
            time: 0,
            image: tearImage
          });
        }
      } else {
        if (spawnTimer > 40) {
          spawnTimer = 0;
          tears.push({
            x: Math.random() * canvas.width,
            y: -30,
            width: 20, height: 30,
            vy: 0.9,
            type: 'heavy',
            image: bigTearImage
          });
        }
      }
      
      // Update Tears
      for (let i = tears.length - 1; i >= 0; i--) {
        const t = tears[i];
        if (t.type === 'normal') {
          t.time += 0.05;
          t.y += t.vy;
          t.vy += 0.05; // gravity
          t.x = t.startX + Math.sin(t.time) * 30;
        } else if (t.type === 'heavy') {
          t.y += t.vy;
          if (t.y > canvas.height - 100) {
            // Split
            tears.push({ x: t.x, y: t.y, width: 10, height: 20, vx: -3, vy: -1, type: 'split', image: tearImage });
            tears.push({ x: t.x, y: t.y, width: 10, height: 20, vx: 3, vy: -1, type: 'split', image: tearImage });
            tears.splice(i, 1);
            continue;
          }
        } else if (t.type === 'split') {
          t.x += t.vx;
          t.y += t.vy;
          t.vy += 0.1; // gravity
        }
        
        // Bounds cleanup
        if (t.y > canvas.height + 50 || t.x < -50 || t.x > canvas.width + 50) {
          tears.splice(i, 1);
        }
      }
      
      // Collision
      if (!isInvulnerable) {
        for (const t of tears) {
          if (
            player.x < t.x + t.width &&
            player.x + player.width > t.x &&
            player.y < t.y + t.height &&
            player.y + player.height > t.y
          ) {
            onHit();
            isInvulnerable = true;
            invulnTimer = now + 1000;
            break;
          }
        }
      } else {
        if (now > invulnTimer) {
          isInvulnerable = false;
        }
      }
      
      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Player
      if (!isInvulnerable || Math.floor(now / 50) % 2 === 0) {
        if (player.image.complete) {
          ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
        } else {
          ctx.fillStyle = 'red';
          ctx.fillRect(player.x, player.y, player.width, player.height);
        }
      }
      
      // Draw Tears
      for (const t of tears) {
        if (t.image && t.image.complete) {
          ctx.drawImage(t.image, t.x, t.y, t.width, t.height);
        } else {
          ctx.fillStyle = 'white';
          ctx.fillRect(t.x, t.y, t.width, t.height);
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Removed onHit and onComplete to prevent reset

  return (
    <div className="screen-container">
      <div className="bg-overlay"></div>
      <div className="content-layer canvas-container">
        <div className="canvas-header" style={{display: 'flex', justifyContent: 'space-between', width: '600px'}}>
          <span>SURVIVE!</span>
          <div className="hp-bar-container">
            <span>HP</span>
            <div className="hp-bar-bg" style={{width: '150px', height: '20px', backgroundColor: 'red', border: '2px solid white', display: 'flex'}}>
              <div className="hp-bar-fill" style={{ width: `${(hp / maxHp) * 100}%`, height: '100%', backgroundColor: '#00ff00', transition: 'width 0.1s' }}></div>
            </div>
            <span>{hp} / {maxHp}</span>
          </div>
        </div>
        <canvas ref={canvasRef} width={600} height={400}></canvas>
      </div>
    </div>
  );
}

export default CanvasDodger;
