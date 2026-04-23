// ─── STATE ────────────────────────────────────────────────────────────────────
let currentStep      = 0;
let score            = 0;
let skipNextTurn     = false;
let awaitingAnswer   = false;
let currentDecision  = null;
let answeredCorrectly = false;
let isMoving         = false;
const visitedSteps      = new Set([0]);
const answeredDecisions = new Set();
 
// ─── INIT ─────────────────────────────────────────────────────────────────────
placeCubeAt(0);
refreshAllTiles();
 
// ─── DICE ─────────────────────────────────────────────────────────────────────
const diceBtn   = document.getElementById('dice-btn');
const diceEmoji = ['1', '2', '3', '4', '5', '6'];
 
function rollDice() {
  if (awaitingAnswer) { showToast("Répondez d'abord à la question !"); return; }
  if (isMoving) return;
  diceBtn.disabled = true;
 
  if (skipNextTurn) {
    skipNextTurn = false;
    document.getElementById('stat-dice').textContent = 'Passer';
    showToast('Tour passé, pénalité de la case précédente');
    setTimeout(() => { diceBtn.disabled = false; }, 1000);
    return;
  }
 
  const roll = Math.floor(Math.random() * 6) + 1;
  document.getElementById('stat-dice').textContent = diceEmoji[roll - 1];
 
  const diceDisp = document.getElementById('dice-display');
  diceDisp.textContent = diceEmoji[roll - 1];
  diceDisp.classList.add('show');
  setTimeout(() => diceDisp.classList.remove('show'), 1500);
 
  showToast(`${roll} , Avancer de ${roll} case${roll > 1 ? 's' : ''}`);
 
  isMoving = true;
  let movesLeft = roll;
 
  function stepMove() {
    if (currentStep >= PATH.length - 1) {
      isMoving = false;
      setTimeout(showWin, 700);
      return;
    }
    const from  = currentStep;
    currentStep = Math.min(currentStep + 1, PATH.length - 1);
    visitedSteps.add(currentStep);
    document.getElementById('stat-pos').textContent = currentStep + 1;
    refreshAllTiles();
    animateHop(from, currentStep, () => {
      movesLeft--;
      if (movesLeft <= 0 || currentStep >= PATH.length - 1) {
        isMoving = false;
        if (currentStep >= PATH.length - 1) {
          setTimeout(showWin, 700);
        } else {
          const dec = DECISIONS.find(d => d.stepIdx === currentStep);
          if (dec && !answeredDecisions.has(dec.stepIdx)) setTimeout(() => openDecision(dec), 500);
          else diceBtn.disabled = false;
        }
      } else {
        stepMove();
      }
    });
  }
  stepMove();
}
 
// ─── PANEL ────────────────────────────────────────────────────────────────────
function openDecision(d) {
  currentDecision = d;
  awaitingAnswer  = true;
 
  // Illustration et label de formation
  const illuEl   = document.getElementById('p-illu');
  const headerEl = document.getElementById('p-formation-header');
  const labelEl  = document.getElementById('p-formation-label');
  const fi       = d.formation;
  if (fi) {
    if (illuEl)  { illuEl.src = fi.illu; illuEl.style.display = 'block'; }
    if (labelEl) {
      labelEl.textContent = fi.label;
      const tagClass =
        fi.label === 'Administrateur territorial'  ? 'tilt-tag-administrateur' :
        fi.label === 'Conservateur du patrimoine'  ? 'tilt-tag-patrimoine' :
        fi.label === 'Conservateur de bibliothèques' ? 'tilt-tag-bibli' : '';
      labelEl.className = 'tilt-tag ' + tagClass;
    }
    if (headerEl) {
      headerEl.style.display = 'flex';
      // Light background tint per formation theme
      const bgMap = {
        'Administrateur territorial':    'rgba(192,225,215,0.12)',
        'Conservateur du patrimoine':    'rgba(238,229,243,0.12)',
        'Conservateur de bibliothèques': 'rgba(252,230,232,0.12)',
      };
      const borderMap = {
        'Administrateur territorial':    '#68C0B5',
        'Conservateur du patrimoine':    '#B488BC',
        'Conservateur de bibliothèques': '#ED6971',
      };
      headerEl.style.background   = bgMap[fi.label]    || 'rgba(255,255,255,.04)';
      headerEl.style.borderColor  = borderMap[fi.label] || 'rgba(255,255,255,.08)';
    }
  } else {
    if (illuEl)   illuEl.style.display = 'none';
    if (labelEl)  labelEl.textContent = '';
    if (headerEl) headerEl.style.display = 'none';
  }

  document.getElementById('p-step').textContent = `Case ${d.stepIdx + 1} / ${PATH.length}`;
  document.getElementById('p-loc').textContent  = d.lieu;
  document.getElementById('p-title').textContent = `  ${d.name}`;
 
  const mod = document.getElementById('p-module');
  mod.textContent  = d.module;
  mod.style.background = d.color;
 
  const sit = document.getElementById('p-situation');
  sit.textContent           = d.situation;
  sit.style.borderLeftColor = d.color;
 
  document.getElementById('p-question').textContent = d.question;
 
  const ch = document.getElementById('p-choices');
  ch.innerHTML = '';
  d.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = c;
    btn.onclick = () => choose(i, d.correct, d.feedback, d);
    ch.appendChild(btn);
  });
 
  document.getElementById('p-feedback').className = 'feedback-box';
  document.getElementById('p-feedback').innerHTML  = '';
  document.getElementById('p-penalty').textContent  = '';
  document.getElementById('btn-next').className     = 'btn-next';
  document.getElementById('panel').classList.add('open');
}
 
function choose(chosen, correct, feedback, d) {
  document.querySelectorAll('.choice-btn').forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
    else if (i === chosen && chosen !== correct) b.classList.add('wrong');
  });
 
  const ok = chosen === correct;
  const fb = document.getElementById('p-feedback');
  fb.className = `feedback-box show ${ok ? 'good' : 'bad'}`;
  fb.innerHTML = `<strong>${ok ? 'Bonne décision !' : 'Pas tout à fait.'}</strong><br>${feedback}`;
 
  answeredCorrectly = ok;
  answeredDecisions.add(d.stepIdx);
  if (ok) {
    score += 10;
    document.getElementById('stat-score').textContent = score;
    document.getElementById('progfill').style.width =
      Math.round(currentStep / (PATH.length - 1) * 100) + '%';
  } else if (d.penalty) {
    document.getElementById('p-penalty').textContent = d.penalty.label;
  }
 
  const nb = document.getElementById('btn-next');
  nb.className    = 'btn-next show';
  nb.style.background = d.color;
}
 
function closePanel() {
  document.getElementById('panel').classList.remove('open');
 
  if (!answeredCorrectly && currentDecision?.penalty) {
    const p = currentDecision.penalty;
    if (p.type === 'reculer') {
      const target = Math.max(0, currentStep - p.cases);
      isMoving = true;
      function backStep() {
        if (currentStep <= target) {
          isMoving = false;
          diceBtn.disabled = false;
          showToast(`Reculé de ${p.cases} case${p.cases > 1 ? 's' : ''}`);
          refreshAllTiles();
          return;
        }
        const fr = currentStep;
        currentStep--;
        document.getElementById('stat-pos').textContent = currentStep + 1;
        animateHop(fr, currentStep, () => setTimeout(backStep, 80));
      }
      backStep();
    } else if (p.type === 'passer') {
      skipNextTurn = true;
      showToast('Prochain tour passé !');
      diceBtn.disabled = false;
    }
  } else {
    diceBtn.disabled = false;
  }
 
  answeredCorrectly = false;
  awaitingAnswer    = false;
  currentDecision   = null;
}
 
// ─── WIN ──────────────────────────────────────────────────────────────────────
function showWin() {
  document.getElementById('win-score-val').textContent = `Score final : ${score} pts`;
  document.getElementById('win').classList.add('show');
}
 
// ─── PAN & ZOOM ───────────────────────────────────────────────────────────────
const wrap = document.getElementById('map-wrap');
let dragging = false, startX = 0, startY = 0, baseX = 0, baseY = 0, scale = 0.85;
canvas.style.transform = `translate(${baseX}px,${baseY}px) scale(${scale})`;
 
wrap.addEventListener('mousedown', e => {
  if (e.target.closest('#panel,#dice-btn')) return;
  dragging = true;
  startX = e.clientX - baseX;
  startY = e.clientY - baseY;
});
window.addEventListener('mousemove', e => {
  if (!dragging) return;
  baseX = e.clientX - startX;
  baseY = e.clientY - startY;
  canvas.style.transform = `translate(${baseX}px,${baseY}px) scale(${scale})`;
});
window.addEventListener('mouseup', () => dragging = false);
 
wrap.addEventListener('wheel', e => {
  e.preventDefault();
  scale = Math.min(2, Math.max(0.35, scale - e.deltaY * 0.001));
  canvas.style.transform = `translate(${baseX}px,${baseY}px) scale(${scale})`;
}, { passive: false });
 
wrap.addEventListener('touchstart', e => {
  if (e.touches.length !== 1) return;
  dragging = true;
  startX = e.touches[0].clientX - baseX;
  startY = e.touches[0].clientY - baseY;
}, { passive: true });
wrap.addEventListener('touchmove', e => {
  if (!dragging || e.touches.length !== 1) return;
  baseX = e.touches[0].clientX - startX;
  baseY = e.touches[0].clientY - startY;
  canvas.style.transform = `translate(${baseX}px,${baseY}px) scale(${scale})`;
}, { passive: true });
wrap.addEventListener('touchend', () => dragging = false);
 
// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}
 
setTimeout(() => showToast('Lancez le dé pour démarrer votre parcours !'), 700);