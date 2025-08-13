// O resto do seu código para os papéis continua abaixo
let highestZ = 1;
class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // --- EVENTOS DE MOUSE (JÁ EXISTENTES) ---
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }
      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translate(calc(-50% + ${this.currentPaperX}px), calc(-50% + ${this.currentPaperY}px)) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    //--- EVENTOS DE TOQUE (ADICIONADOS PARA CELULAR) ---
    paper.addEventListener('touchstart', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      const touch = e.touches[0];
      this.mouseTouchX = touch.clientX;
      this.mouseTouchY = touch.clientY;
      this.prevMouseX = touch.clientX;
      this.prevMouseY = touch.clientY;
    });

    document.addEventListener('touchmove', (e) => {
      if (this.holdingPaper) {
        const touch = e.touches[0];
        this.mouseX = touch.clientX;
        this.mouseY = touch.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;

        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translate(calc(-50% + ${this.currentPaperX}px), calc(-50% + ${this.currentPaperY}px)) rotateZ(${this.rotation}deg)`;
      }
    });

    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

// Função para ajustar posições dos papéis em dispositivos móveis
function adjustPaperPositions() {
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  
  papers.forEach((paper, index) => {
    if (isMobile) {
      // Ajusta posições para dispositivos móveis
      const baseX = (index % 3) * 30 - 30;
      const baseY = Math.floor(index / 3) * 40 - 40;
      
      if (isSmallMobile) {
        // Ajustes específicos para celulares pequenos
        paper.style.left = `${baseX * 0.7}px`;
        paper.style.top = `${baseY * 0.7}px`;
      } else {
        paper.style.left = `${baseX}px`;
        paper.style.top = `${baseY}px`;
      }
    } else {
      // Posições originais para desktop
      const baseX = (index % 3) * 40 - 40;
      const baseY = Math.floor(index / 3) * 50 - 50;
      paper.style.left = `${baseX}px`;
      paper.style.top = `${baseY}px`;
    }
  });
}

// Função para detectar dispositivo móvel e mostrar instruções
function detectMobileAndShowInstructions() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;
  
  const mobileInstructions = document.querySelector('.mobile-instructions');
  
  if (isMobile && mobileInstructions) {
    mobileInstructions.style.display = 'block';
    
    // Oculta as instruções após 5 segundos
    setTimeout(() => {
      mobileInstructions.style.opacity = '0';
      setTimeout(() => {
        mobileInstructions.style.display = 'none';
      }, 500);
    }, 5000);
  }
}

// Função para melhorar a experiência em dispositivos touch
function enhanceTouchExperience() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isTouchDevice) {
    // Adiciona classes CSS para dispositivos touch
    document.body.classList.add('touch-device');
    
    // Melhora o scroll em dispositivos iOS
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Previne zoom em dispositivos móveis
    document.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, { passive: false });
    
    // Previne zoom com gestos de pinça
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
}

// Chama a função quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  detectMobileAndShowInstructions();
  enhanceTouchExperience();
});

// Chama a função quando a tela é redimensionada

// Chama a função quando a orientação da tela muda
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    detectMobileAndShowInstructions();
  }, 100);
});

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Variáveis Globais
var background = document.getElementById("bgCanvas"),
    bgCtx = background.getContext("2d"),
    width,
    height,
    entities = [];

// --- CLASSES DOS ELEMENTOS ANIMADOS ---

class Terrain {
    constructor(options) {
        options = options || {};
        this.scrollDelay = options.scrollDelay || 90;
        this.lastScroll = new Date().getTime();
        this.fillStyle = options.fillStyle || "#191D4C";
        this.mHeight = options.mHeight || height;
        this.points = [];

        var displacement = options.displacement || 140,
            power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

        this.points[0] = this.mHeight;
        this.points[power] = this.points[0];

        for (var i = 1; i < power; i *= 2) {
            for (var j = (power / i) / 2; j < power; j += power / i) {
                this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
            }
            displacement *= 0.6;
        }
    }

    update() {
        // Esta função agora desenha no CONTEXTO PRINCIPAL (bgCtx)
        bgCtx.fillStyle = this.fillStyle;

        if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
            this.lastScroll = new Date().getTime();
            this.points.push(this.points.shift());
        }

        bgCtx.beginPath();
        for (var i = 0; i <= width; i++) {
            if (i === 0) {
                bgCtx.moveTo(0, this.points[0]);
            } else if (this.points[i] !== undefined) {
                bgCtx.lineTo(i, this.points[i]);
            }
        }

        bgCtx.lineTo(width, height);
        bgCtx.lineTo(0, height);
        bgCtx.lineTo(0, this.points[0]);
        bgCtx.fill();
    }
}

class Star {
    constructor(options) {
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.05;
        this.x = options.x;
        this.y = options.y;
    }

    reset() {
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.05;
        this.x = width;
        this.y = Math.random() * height;
    }

    update() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.reset();
        } else {
            bgCtx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = 0;
        this.len = (Math.random() * 80) + 10;
        this.speed = (Math.random() * 10) + 6;
        this.size = (Math.random() * 1) + 0.1;
        this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
        this.active = false;
    }

    update() {
        if (this.active) {
            this.x -= this.speed;
            this.y += this.speed;
            if (this.x < 0 || this.y >= height) {
                this.reset();
            } else {
                bgCtx.lineWidth = this.size;
                bgCtx.beginPath();
                bgCtx.moveTo(this.x, this.y);
                bgCtx.lineTo(this.x + this.len, this.y - this.len);
                bgCtx.stroke();
            }
        } else {
            if (this.waitTime < new Date().getTime()) {
                this.active = true;
            }
        }
    }
}


// --- FUNÇÃO RESPONSIVA E DE INICIALIZAÇÃO ---

function resizeCanvas() {
    width = window.innerWidth;
    height = document.body.offsetHeight;
    (height < 400) ? height = 400: height;

    background.width = width;
    background.height = height;

    entities = []; // Esvazia o array para recriar tudo

    // Ajusta o número de estrelas baseado no tamanho da tela
    const starCount = Math.min(Math.floor(height / 1.2), 3000);
    
    // Inicializa as estrelas
    for (var i = 0; i < starCount; i++) {
        entities.push(new Star({
            x: Math.random() * width,
            y: Math.random() * height
        }));
    }

    // Inicializa as estrelas cadentes (menos em telas pequenas)
    const shootingStarCount = width > 768 ? 2 : 1;
    for (var i = 0; i < shootingStarCount; i++) {
        entities.push(new ShootingStar());
    }
    
    // Para reativar o terreno, descomente as linhas abaixo
    // entities.push(new Terrain({mHeight : (height/2)-120, fillStyle: 'rgb(17,20,40)' }));
    // entities.push(new Terrain({displacement : 120, scrollDelay : 50, fillStyle : "rgb(17,20,40)", mHeight : (height/2)-60}));
    // entities.push(new Terrain({displacement : 100, scrollDelay : 20, fillStyle : "rgb(10,10,5)", mHeight : height/2}));
}


// --- LOOP DE ANIMAÇÃO ---

function animate() {
    bgCtx.fillStyle = '#110E19';
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.fillStyle = '#ffffff';
    bgCtx.strokeStyle = '#ffffff';

    var entLen = entities.length;

    while (entLen--) {
        entities[entLen].update();
    }
    requestAnimationFrame(animate);
}

// --- INICIALIZAÇÃO ---

resizeCanvas(); // Chama para configurar o estado inicial
window.addEventListener('resize', resizeCanvas); // Adiciona o listener para responsividade
animate(); // Inicia o loop da animação
