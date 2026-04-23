// ─── HELPERS ──────────────────────────────────────────────────────────────────
function hexShade(hex, amt) {
  if (!hex || !hex.startsWith('#')) return '#888';
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}

// ─── TILE SVG BUILDERS ────────────────────────────────────────────────────────
function makePlatformSVG(topColor, stepLabel, icon, isCurrent, isFinal, isVisited) {
  const hw   = TW / 2;
  const svgH = TH ;
  const top  = `${hw},0 ${TW},${TH/2} ${hw},${TH} 0,${TH/2}`;

  let numSVG = '';
  if (stepLabel !== null && stepLabel !== undefined && !isFinal) {
    const n  = String(stepLabel);
    const fs = n.length > 1 ? 10 : 12;
    numSVG = `<g transform="translate(${hw},${TH/2})">
      <text transform="matrix(0.82,-0.24,0.41,0.52,0,0)" x="0" y="${fs*0.38}"
        text-anchor="middle" font-family="'TT Commons',sans-serif" font-weight="700"
        font-size="${fs}" fill="rgba(255,255,255,0.82)" style="pointer-events:none">${n}</text>
    </g>`;
  }

  let iconSVG = '';
  if (icon && !isFinal && !isVisited) {
    iconSVG = `<text x="${hw}" y="${TH/2+1}" text-anchor="middle" dominant-baseline="middle"
      font-size="15" style="pointer-events:none">${icon}</text>`;
  }

  let finalSVG = '';
  if (isFinal) {
    finalSVG = `<text x="${hw}" y="${TH/2+1}" text-anchor="middle" dominant-baseline="middle"
      font-size="18" style="pointer-events:none"></text>`;
  }

  let glowSVG = '';
  if (isCurrent) {
    glowSVG = `<polygon points="${top}" fill="none" stroke="rgba(180,136,188,0.9)" stroke-width="2">
      <animate attributeName="stroke-opacity" values="0.9;0.25;0.9" dur="1.1s" repeatCount="indefinite"/>
    </polygon>`;
  }
let visitedSVG = '';
if (isVisited && !isCurrent && !isFinal) {
  const clipId = `vc_${stepLabel || 'f'}`;
  // Mêmes rayures polygonales que le cube via buildFaceStripes
  // Coins du losange : tl=(hw,0)  tr=(TW,TH/2)  br=(hw,TH)  bl=(0,TH/2)
  const tl = { x: hw, y: 0    };
  const tr = { x: TW, y: TH/2 };
  const br = { x: hw, y: TH   };
  const bl = { x: 0,  y: TH/2 };
  const stripes = buildFaceStripes(tl, tr, br, bl, 9, '#0f1923');

  visitedSVG = `
    <defs><clipPath id="${clipId}"><polygon points="${top}"/></clipPath></defs>
    <polygon points="${top}" fill="rgba(0,0,0,0.28)"/>
    <g clip-path="url(#${clipId})">${stripes}</g>
  `;
}
  return `<svg width="${TW}" height="${svgH}" viewBox="0 0 ${TW} ${svgH}" overflow="visible" style="display:block;">
    <polygon points="${top}" fill="${topColor}" stroke="${hexShade(topColor, -100)}" stroke-width="0.8"/>
    ${glowSVG}${numSVG}${iconSVG}${finalSVG}${visitedSVG}
  </svg>`;
}

function makeGroundSVG(col, row) {
  const pal = ['#a8bc6a', '#b0c472', '#bac870', '#c2cc7a'];
  const c   = pal[(col * 3 + row * 7) % 4];
  const hw  = TW / 2;
  const svgH = TH ;
  return `<svg width="${TW}" height="${svgH}" viewBox="0 0 ${TW} ${svgH}" overflow="visible" style="display:block;">
    <polygon points="${hw},0 ${TW},${TH/2} ${hw},${TH} 0,${TH/2}"
      fill="${c}" stroke="${hexShade(c, -100)}" stroke-width="0.5"/>
  </svg>`;
}

// ─── MAP CANVAS ───────────────────────────────────────────────────────────────
const canvas = document.getElementById('map-canvas');
canvas.style.width  = '1150px';
canvas.style.height = '800px';




// ─── PATH TILES ───────────────────────────────────────────────────────────────
const pathEls = [];
PATH.forEach((p, i) => {
  const { x, y } = isoXY(p.col, p.row);
  const dec     = DECISIONS.find(d => d.stepIdx === i) || null;
  const isFinal = i === PATH.length - 1;
  const topC    = isFinal ? '#00A499' : dec ? dec.color : '#B488BC';
  const label   = null;
  const icon    = isFinal ? null : (dec ? dec.icon : null);

  const el = document.createElement('div');
  el.className  = 'tile path-tile';
  el.dataset.step = i;
  el.style.cssText = `position:absolute;left:${x+OX}px;top:${y+OY}px;width:${TW}px;z-index:${p.col+p.row+10};`;
  el.innerHTML  = `<div class="tile-body">${makePlatformSVG(topC, label, icon, i === 0, isFinal, false)}</div>
    <div class="tile-tooltip">${isFinal ? 'Arrivée' : (dec ? dec.name : 'Case')}</div>`;
  canvas.appendChild(el);
  pathEls.push(el);
});

function refreshAllTiles() {
  PATH.forEach((_, i) => {
    const dec     = DECISIONS.find(d => d.stepIdx === i) || null;
    const isFinal = i === PATH.length - 1;
    const topC    = isFinal ? '#00A499' : dec ? dec.color : '#B488BC';
    const isCur   = i === currentStep;
    const isVis   = visitedSteps.has(i) && i !== currentStep;
    const label   = null;
    const icon    = isFinal ? null : (dec ? dec.icon : null);
    pathEls[i].querySelector('.tile-body').innerHTML =
      makePlatformSVG(topC, label, icon, isCur, isFinal, isVis);
  });
}

// ─── PION ─────────────────────────────────────────────────────────────────────
const CW  = TW;
const CH  = TW / 2;
const CSH = TH * 1;   // plus grand en hauteur
const PAD = 2;
const SW  = CW + PAD * 2;
const SH  = CH + CSH + PAD;

const Ttl = { x: PAD + CW/2, y: PAD };
const Ttr = { x: PAD + CW,   y: PAD + CH/2 };
const Tbr = { x: PAD + CW/2, y: PAD + CH };
const Tbl = { x: PAD,         y: PAD + CH/2 };
const Bm  = { x: PAD + CW/2, y: PAD + CH + CSH };
const Bl  = { x: PAD,         y: PAD + CH/2 + CSH };
const Br  = { x: PAD + CW,   y: PAD + CH/2 + CSH };

function p4(a, b, c, d) {
  return `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`;
}

// ─── HELPER : 5 rayures sur n'importe quel quadrilatère iso ──────────────────
function buildFaceStripes(tl, tr, br, bl, N, color) {
  const strips = [];
  const total  = N * 2;

  // direction "haut -> bas" de la face
  const dx1 = bl.x - tl.x;
  const dy1 = bl.y - tl.y;

  // direction "haut -> haut droit"
  const dx2 = tr.x - tl.x;
  const dy2 = tr.y - tl.y;

  for (let i = 0; i < total; i++) {
    if (i % 2 === 0) continue;

    const t1 = i / total;
    const t2 = (i + 1) / total;

    const ax1 = tl.x + dx2 * t1;
    const ay1 = tl.y + dy2 * t1;

    const bx1 = tl.x + dx1 + dx2 * t1;
    const by1 = tl.y + dy1 + dy2 * t1;

    const ax2 = tl.x + dx2 * t2;
    const ay2 = tl.y + dy2 * t2;

    const bx2 = tl.x + dx1 + dx2 * t2;
    const by2 = tl.y + dy1 + dy2 * t2;

    strips.push(
      `<polygon points="
        ${ax1.toFixed(1)},${ay1.toFixed(1)}
        ${ax2.toFixed(1)},${ay2.toFixed(1)}
        ${bx2.toFixed(1)},${by2.toFixed(1)}
        ${bx1.toFixed(1)},${by1.toFixed(1)}
      " fill="${color}" opacity="0.92"/>`
    );
  }

  return strips.join('');
}

// ─── PION COULEURS ────────────────────────────────────────────────────────────
const VIOLET      = '#C9A7EB';
const VIOLET_DARK = '#8D59A0';
const VIOLET_MID  = '#B488BC';
const STRIPE_COL  = '#FF5D6B';

// ─── PION PLACEMENT ───────────────────────────────────────────────────────────
const cubeWrap = document.createElement('div');
cubeWrap.id    = 'cube-wrap';
cubeWrap.style.position = 'absolute';
canvas.appendChild(cubeWrap);

// Calcule la position du wrapper pour que la pointe gauche du cube
// coïncide avec la pointe gauche de la tuile stepIdx.
// Utilise l'état réel des coins pour éviter toute dérive cumulative.
function cubePos(stepIdx, corners) {
  const { col, row } = PATH[stepIdx];
  const { x, y }    = isoXY(col, row);
  const tileLeftX   = x + OX;
  const tileLeftY   = y + OY + TH / 2;

  // Coin au sol (minY) avec le plus petit cx-cz = pointe gauche en iso
  const minY   = Math.min(...corners.map(c => c[1]));
  const ground = corners.filter(c => Math.abs(c[1] - minY) < 0.01);
  const anchor = ground.reduce((best, c) => (c[0]-c[2]) < (best[0]-best[2]) ? c : best);
  const ap     = isoProject(anchor[0], anchor[1], anchor[2]);

  return { left: tileLeftX - ap.x, top: tileLeftY - ap.y };
}

// ─── CUBE 3D PERSISTANT ───────────────────────────────────────────────────────
// L'état 3D du cube est conservé entre chaque roulement.
// cubeCorners[8] = les 8 coins en coordonnées locales (espace tuile, 1 unité = largeur tuile).
//
// Indexation des coins (cube [0,1]^3 au repos) :
//   0=[0,0,0]  1=[1,0,0]  2=[1,0,1]  3=[0,0,1]   ← anneau bas (Y=0)
//   4=[0,1,0]  5=[1,1,0]  6=[1,1,1]  7=[0,1,1]   ← anneau haut (Y=1)
//
// Faces visibles en vue iso droit-devant :
//   top   : coins [4,5,6,7]  → face +Y
//   front : coins [3,7,6,2]  → face +Z  (gauche en iso, rayures)
//   right : coins [1,5,6,2]  → face +X  (droite en iso)
//
// Couleurs fixes attachées aux faces (pas à l'état roll) :
const FACE_COLORS = { top: null, front: null, right: VIOLET_MID };
// null = rayures STRIPE_COL

let cubeCorners = [
  [0,0,0],[1,0,0],[1,0,1],[0,0,1],
  [0,1,0],[1,1,0],[1,1,1],[0,1,1],
];

// Projection iso d'un coin 3D → coords SVG dans le cubeWrap
function isoProject(cx, cy, cz) {
  const sx = (cx - cz) * (TW / 2);
  const sy = (cx + cz) * (TH / 2) - cy * CSH;
  return { x: sx + PAD + CW / 2, y: sy + PAD + CH / 2 + CSH };
}

// Rotation de Rodrigues : fait tourner pt de (sign × frac × 90°) autour de l'axe pivotA→pivotB
function rotateAroundEdge(pt, pivotA, pivotB, sign, frac) {
  const angle = sign * frac * Math.PI / 2;
  const cosA = Math.cos(angle), sinA = Math.sin(angle);
  const ex = pivotB[0]-pivotA[0], ey = pivotB[1]-pivotA[1], ez = pivotB[2]-pivotA[2];
  const len = Math.sqrt(ex*ex + ey*ey + ez*ez) || 1;
  const ux = ex/len, uy = ey/len, uz = ez/len;
  const dx = pt[0]-pivotA[0], dy = pt[1]-pivotA[1], dz = pt[2]-pivotA[2];
  const dot = dx*ux + dy*uy + dz*uz;
  const rx = dx*cosA + (uy*dz - uz*dy)*sinA + ux*dot*(1-cosA);
  const ry = dy*cosA + (uz*dx - ux*dz)*sinA + uy*dot*(1-cosA);
  const rz = dz*cosA + (ux*dy - uy*dx)*sinA + uz*dot*(1-cosA);
  return [pivotA[0]+rx, pivotA[1]+ry, pivotA[2]+rz];
}

// Sélectionne l'arête pivot (2 coins au sol les plus avancés) et le signe correct
function getPivotEdge(corners, dc, dr) {
  const minY     = Math.min(...corners.map(c => c[1]));
  const bottomIdx = corners.map((_, i) => i).filter(i => Math.abs(corners[i][1] - minY) < 0.01);
  let sorted, sign;
  if      (dc ===  1) { sorted = bottomIdx.slice().sort((a,b) => corners[b][0]-corners[a][0]); sign = -1; }
  else if (dc === -1) { sorted = bottomIdx.slice().sort((a,b) => corners[a][0]-corners[b][0]); sign =  1; }
  else if (dr ===  1) { sorted = bottomIdx.slice().sort((a,b) => corners[b][2]-corners[a][2]); sign =  1; }
  else                { sorted = bottomIdx.slice().sort((a,b) => corners[a][2]-corners[b][2]); sign = -1; }
  // Copies pour éviter les références live
  return { pivotA: [...corners[sorted[0]]], pivotB: [...corners[sorted[1]]], sign };
}

// Construit le SVG du cube à partir de l'état courant des coins
function buildPionSVG(corners) {
  const p = corners.map(c => isoProject(c[0], c[1], c[2]));

  const faceTop   = [p[4], p[5], p[6], p[7]];
  const faceFront = [p[3], p[7], p[6], p[2]];
  const faceRight = [p[1], p[5], p[6], p[2]];

  function pts(arr) { return arr.map(v => v.x.toFixed(1) + ',' + v.y.toFixed(1)).join(' '); }
  const tp = pts(faceTop), lp = pts(faceFront), rp = pts(faceRight);

  const topC   = FACE_COLORS.top   !== null ? FACE_COLORS.top   : VIOLET_MID;
  const leftC  = FACE_COLORS.front !== null ? FACE_COLORS.front : VIOLET_DARK;
  const rightC = FACE_COLORS.right !== null ? FACE_COLORS.right : VIOLET;
  const uid    = (Math.random() * 1e9 | 0).toString(36);

  const topSt   = FACE_COLORS.top   === null ? buildFaceStripes(faceTop[0],   faceTop[1],   faceTop[2],   faceTop[3],   7, STRIPE_COL) : '';
  const leftSt  = FACE_COLORS.front === null ? buildFaceStripes(faceFront[0], faceFront[1], faceFront[2], faceFront[3], 7, STRIPE_COL) : '';
  const rightSt = FACE_COLORS.right === null ? buildFaceStripes(faceRight[0], faceRight[1], faceRight[2], faceRight[3], 7, STRIPE_COL) : '';

  const ridge = [p[4],p[5],p[6],p[7],p[3],p[0]].map(v => v.x.toFixed(1)+','+v.y.toFixed(1)).join(' ');

  return `<svg width="${SW}" height="${SH}" viewBox="0 0 ${SW} ${SH}" overflow="visible" style="display:block;">
    <defs>
      <clipPath id="cpt_${uid}"><polygon points="${tp}"/></clipPath>
      <clipPath id="cpl_${uid}"><polygon points="${lp}"/></clipPath>
      <clipPath id="cpr_${uid}"><polygon points="${rp}"/></clipPath>
    </defs>
    <polygon points="${rp}" fill="${rightC}" stroke="rgba(0,0,0,0.15)" stroke-width="0.6"/>
    <g clip-path="url(#cpr_${uid})">${rightSt}</g>
    <polygon points="${lp}" fill="${leftC}"  stroke="rgba(0,0,0,0.12)" stroke-width="0.6"/>
    <g clip-path="url(#cpl_${uid})">${leftSt}</g>
    <polygon points="${tp}" fill="${topC}"   stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
    <g clip-path="url(#cpt_${uid})">${topSt}</g>
    <polyline points="${ridge}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
  </svg>`;
}

// ─── SVG PERSISTANT ───────────────────────────────────────────────────────────
// On crée le SVG une seule fois ; les frames ne font que mettre à jour `points`.
const NS = 'http://www.w3.org/2000/svg';

function createPionSVG() {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width',  SW);
  svg.setAttribute('height', SH);
  svg.setAttribute('viewBox', `0 0 ${SW} ${SH}`);
  svg.setAttribute('overflow', 'visible');
  svg.style.display = 'block';

  const defs = document.createElementNS(NS, 'defs');
  ['cpt','cpl','cpr'].forEach(id => {
    const cp = document.createElementNS(NS, 'clipPath');
    cp.setAttribute('id', id);
    const poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('id', id + '_poly');
    cp.appendChild(poly);
    defs.appendChild(cp);
  });

  // Motion blur filter , stdDeviation mis à jour à chaque frame
  const filter = document.createElementNS(NS, 'filter');
  filter.setAttribute('id', 'motion-blur');
  filter.setAttribute('x', '-30%'); filter.setAttribute('y', '-30%');
  filter.setAttribute('width', '160%'); filter.setAttribute('height', '160%');
  const blurEl = document.createElementNS(NS, 'feGaussianBlur');
  blurEl.setAttribute('id', 'blur-kernel');
  blurEl.setAttribute('in', 'SourceGraphic');
  blurEl.setAttribute('stdDeviation', '0 0');
  filter.appendChild(blurEl);
  defs.appendChild(filter);

  svg.appendChild(defs);

  // Groupe principal avec filtre de flou
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('id', 'pion-group');
  g.setAttribute('filter', 'url(#motion-blur)');

  // ── face right : VIOLET uni ──
  const polyR = document.createElementNS(NS, 'polygon');
  polyR.setAttribute('id', 'face_right');
  polyR.setAttribute('fill', VIOLET_MID);
  polyR.setAttribute('stroke', 'rgba(0,0,0,0.15)');
  polyR.setAttribute('stroke-width', '0.6');
  g.appendChild(polyR);

  // ── face front (gauche iso) : VIOLET DARK + RAYURES ──
  const polyL = document.createElementNS(NS, 'polygon');
  polyL.setAttribute('id', 'face_front');
  polyL.setAttribute('fill', VIOLET_DARK);
  polyL.setAttribute('stroke', 'rgba(255,255,255,0.15)');
  polyL.setAttribute('stroke-width', '0.6');
  g.appendChild(polyL);

  const stripesL = document.createElementNS(NS, 'g');
  stripesL.setAttribute('id', 'stripes_front');
  stripesL.setAttribute('clip-path', 'url(#cpl)');
  g.appendChild(stripesL);

  // ── face top : VIOLET clair + RAYURES ──
  const polyT = document.createElementNS(NS, 'polygon');
  polyT.setAttribute('id', 'face_top');
  polyT.setAttribute('fill', VIOLET);
  polyT.setAttribute('stroke', 'rgba(255,255,255,0.3)');
  polyT.setAttribute('stroke-width', '0.8');
  g.appendChild(polyT);

  const stripesT = document.createElementNS(NS, 'g');
  stripesT.setAttribute('id', 'stripes_top');
  stripesT.setAttribute('clip-path', 'url(#cpt)');
  g.appendChild(stripesT);

  // ridge
  const ridge = document.createElementNS(NS, 'polyline');
  ridge.setAttribute('id', 'face_ridge');
  ridge.setAttribute('fill', 'none');
  ridge.setAttribute('stroke', 'rgba(255,255,255,0.15)');
  ridge.setAttribute('stroke-width', '0.8');
  g.appendChild(ridge);

  svg.appendChild(g);

  return svg;
}

// Construit la chaîne "x,y x,y …" depuis un tableau de {x,y}
function ptsStr(arr) {
  return arr.map(v => v.x.toFixed(1) + ',' + v.y.toFixed(1)).join(' ');
}

// Met à jour les polygones du SVG persistant depuis les coins 3D courants
function updatePionSVG(svg, corners, blurX = 0, blurY = 0) {
  const p = corners.map(c => isoProject(c[0], c[1], c[2]));

  const faceTop   = [p[4], p[5], p[6], p[7]];
  const faceFront = [p[3], p[7], p[6], p[2]];
  const faceRight = [p[1], p[5], p[6], p[2]];

  // right , violet uni
  svg.getElementById('face_right').setAttribute('points', ptsStr(faceRight));

  // front , violet dark + rayures verticales (interpoler tl→bl)
  svg.getElementById('face_front').setAttribute('points', ptsStr(faceFront));
  svg.getElementById('stripes_front').innerHTML =
    buildFaceStripes(faceFront[0], faceFront[3], faceFront[2], faceFront[1], 8, STRIPE_COL);

  // top , violet clair + rayures
  svg.getElementById('face_top').setAttribute('points', ptsStr(faceTop));
  svg.getElementById('stripes_top').innerHTML =
    buildFaceStripes(faceTop[0], faceTop[1], faceTop[2], faceTop[3], 8, STRIPE_COL);

  const ridgePts = [p[4],p[5],p[6],p[7],p[3],p[0]];
  svg.getElementById('face_ridge').setAttribute('points', ptsStr(ridgePts));

  // clip paths
  svg.getElementById('cpt_poly').setAttribute('points', ptsStr(faceTop));
  svg.getElementById('cpl_poly').setAttribute('points', ptsStr(faceFront));
  svg.getElementById('cpr_poly').setAttribute('points', ptsStr(faceRight));

  // Motion blur
  const bk = svg.getElementById('blur-kernel');
  if (bk) bk.setAttribute('stdDeviation', `${blurX.toFixed(2)} ${blurY.toFixed(2)}`);
}

// SVG unique créé une fois
const pionSVG = createPionSVG();
cubeWrap.appendChild(pionSVG);

function placeCubeAt(stepIdx) {
  const { left, top } = cubePos(stepIdx, cubeCorners);
  const { col, row }  = PATH[stepIdx];
  cubeWrap.style.left   = left + 'px';
  cubeWrap.style.top    = top  + 'px';
  cubeWrap.style.zIndex = (col + row + 10 + 1).toString();
  updatePionSVG(pionSVG, cubeCorners, 0, 0);
}

// ─── ANIMATION : GLISSEMENT ───────────────────────────────────────────────────
function animateHop(fromStep, toStep, onDone) {
  const { col: tc, row: tr2 } = PATH[toStep];

  const fromPos = cubePos(fromStep, cubeCorners);
  const toPos   = cubePos(toStep,   cubeCorners);

  const dur    = 160;
  const startT = performance.now();
  function ease(t) { return t * t * (3 - 2 * t); }

  function frame(now) {
    const t  = Math.min((now - startT) / dur, 1);
    const te = ease(t);

    // Légère arc parabolique en Y (monte puis redescend)
    const arc = -8 * te * (1 - te);

    const left = fromPos.left + (toPos.left - fromPos.left) * te;
    const top  = fromPos.top  + (toPos.top  - fromPos.top)  * te + arc;

    cubeWrap.style.left   = left + 'px';
    cubeWrap.style.top    = top  + 'px';
    cubeWrap.style.zIndex = (tc + tr2 + 10 + 1).toString();
    updatePionSVG(pionSVG, cubeCorners, 0, 0);

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      placeCubeAt(toStep);
      if (onDone) onDone();
    }
  }
  requestAnimationFrame(frame);
}