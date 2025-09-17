/* ========= PROFILE IMAGE UPLOAD ========= */
const fileInput = document.getElementById("fileInput");
const profileImage = document.getElementById("profileImage");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => profileImage.src = ev.target.result;
  reader.readAsDataURL(file);
});

/* ========= SIZE CONTROLS ========= */
const profileSize = document.getElementById("profileSize");
const containerScale = document.getElementById("containerScale");
const baseFont = document.getElementById("baseFont");
const resetBtn = document.getElementById("resetSizes");

function applySizes(){
  document.documentElement.style.setProperty('--profile-size', `${profileSize.value}px`);
  document.documentElement.style.setProperty('--container-scale', containerScale.value);
  document.documentElement.style.setProperty('--base-font', `${baseFont.value}px`);
}
[profileSize, containerScale, baseFont].forEach(inp => inp.addEventListener('input', applySizes));
resetBtn.addEventListener('click', () => {
  profileSize.value = 150; containerScale.value = 1; baseFont.value = 16; applySizes();
});
applySizes();

/* ========= DYNAMIC INFO BINDING (live edit) ========= */
const emailField = document.getElementById("emailField");
const interestsField = document.getElementById("interestsField");

emailField.addEventListener('input', e => {
  const emailValue = e.target.value || "user@example.com";
  document.querySelectorAll('.user-info .info-row .value')[0].textContent = emailValue;
});
interestsField.addEventListener('input', e => {
  document.querySelectorAll('.user-info .info-row .value')[1].textContent = e.target.value || "—";
});

/* ========= SKILL INTERACTIVITY / CIRCULAR PROGRESS / DRAG & DROP / ADD SKILL ========= */

const skillsList = document.getElementById('skillsList');
const animateAllBtn = document.getElementById('animateAll');
const resetFavBtn = document.getElementById('resetFav');

function createSVGRingPercent(el, percent){
  // el is the .skill-item element. We find the .ring-fg circle inside svg and set stroke-dasharray.
  const ring = el.querySelector('.ring-fg');
  if(!ring) return;
  // circle circumference for r=15.9 is 2πr ≈ 100.0, that's why dasharray uses percentages easily.
  // We set the dasharray to "<value> 100"
  const val = Math.max(0, Math.min(100, Number(percent)));
  ring.style.strokeDasharray = `${val} 100`;
}

/* Initialize a single skill item (connect events, animate bars, ring) */
function initSkillItem(skillEl){
  const slider = skillEl.querySelector('.skill-slider');
  const bar = skillEl.querySelector('.skill-bar');
  const percentText = skillEl.querySelector('.skill-percent');
  const badge = skillEl.querySelector('.badge');
  const svgRing = skillEl.querySelector('.skill-ring');
  const dragHandle = skillEl; // whole item draggable

  // expose keyboard focus for draggable items
  skillEl.setAttribute('tabindex','0');

  function setLevel(v, animate=true){
    const val = Math.max(0, Math.min(100, Number(v)));
    if(animate){
      bar.style.width = val + "%";
      // update circular ring
      createSVGRingPercent(skillEl, val);
    } else {
      bar.style.transition = 'none';
      bar.style.width = val + '%';
      createSVGRingPercent(skillEl, val);
      // restore transition
      setTimeout(()=> bar.style.transition = '', 40);
    }
    percentText.textContent = `${Math.round(val)}%`;
    // visual emphasis when high
    if(val > 90) bar.style.boxShadow = "0 6px 20px rgba(0,240,255,0.12)";
    else bar.style.boxShadow = "none";
  }

  // Initialize from slider value (animate from 0)
  const initial = slider ? slider.value : 0;
  setLevel(0, false);
  setTimeout(()=> setLevel(initial, true), 120);

  // slider -> update
  if(slider){
    slider.addEventListener('input', (e) => setLevel(e.target.value, true));
  }

  // badge favorite toggle
  if(badge){
    badge.setAttribute('tabindex','0');
    badge.addEventListener('click', ()=>{
      const isFav = badge.classList.toggle('fav');
      badge.setAttribute('aria-pressed', isFav ? 'true' : 'false');
      badge.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 220 });
    });
    badge.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); badge.click(); }
    });
  }

  /* ===== Drag & drop handlers for each skill item ===== */
  dragHandle.addEventListener('dragstart', (ev) => {
    dragHandle.classList.add('dragging');
    ev.dataTransfer.effectAllowed = 'move';
    // set id or html; store outerHTML to support drop
    ev.dataTransfer.setData('text/plain', 'dragging-skill');
    // store a reference index in dataset for fallback
    dragHandle.dataset.originIndex = Array.from(skillsList.children).indexOf(dragHandle);
  });
  dragHandle.addEventListener('dragend', () => {
    dragHandle.classList.remove('dragging');
  });

  // keyboard reordering: move up/down with Ctrl+ArrowUp/ArrowDown
  dragHandle.addEventListener('keydown', (e) => {
    if(e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')){
      e.preventDefault();
      const node = dragHandle;
      if(e.key === 'ArrowUp' && node.previousElementSibling) {
        node.parentNode.insertBefore(node, node.previousElementSibling);
        node.focus();
      } else if(e.key === 'ArrowDown' && node.nextElementSibling){
        node.parentNode.insertBefore(node.nextElementSibling, node);
        node.focus();
      }
    }
  });
}

/* initialize all existing skills */
function initAllSkills(){
  document.querySelectorAll('.skill-item').forEach(initSkillItem);
}
initAllSkills();

/* SKILLS LIST Drag & Drop: handle dragover/drop insert logic */
let dragSrcEl = null;

skillsList.addEventListener('dragstart', (e) => {
  const item = e.target.closest('.skill-item');
  if(!item) return;
  dragSrcEl = item;
  e.dataTransfer.setData('text/plain', 'dragging-skill');
  setTimeout(()=> item.classList.add('dragging'), 10);
});

skillsList.addEventListener('dragend', (e) => {
  const item = e.target.closest('.skill-item');
  if(item) item.classList.remove('dragging');
});

skillsList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterEl = getDragAfterElement(skillsList, e.clientY);
  skillsList.classList.add('drag-over');
  const dragging = document.querySelector('.skill-item.dragging');
  if(!dragging) return;
  if(afterEl == null) skillsList.appendChild(dragging);
  else skillsList.insertBefore(dragging, afterEl);
});

skillsList.addEventListener('dragleave', (e) => {
  // when leaving list
  skillsList.classList.remove('drag-over');
});

skillsList.addEventListener('drop', (e) => {
  e.preventDefault();
  skillsList.classList.remove('drag-over');
  const dragging = document.querySelector('.skill-item.dragging');
  if(dragging) dragging.classList.remove('dragging');
  // reinitialize order if needed
});

/* Helper to find element to insert before based on mouse Y */
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.skill-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* Animate all bars button */
animateAllBtn.addEventListener('click', ()=>{
  document.querySelectorAll('.skill-item').forEach(item=>{
    const slider = item.querySelector('.skill-slider');
    const bar = item.querySelector('.skill-bar');
    const percent = item.querySelector('.skill-percent');
    // animate from 0 to value
    bar.style.width = '0%';
    createSVGRingPercent(item, 0);
    percent.textContent = '0%';
    setTimeout(()=> {
      const v = slider ? slider.value : 0;
      bar.style.width = v + '%';
      createSVGRingPercent(item, v);
      percent.textContent = v + '%';
    }, 80);
  });
});

/* Reset favorites */
resetFavBtn.addEventListener('click', ()=>{
  document.querySelectorAll('.badge.fav').forEach(b => {
    b.classList.remove('fav');
    b.setAttribute('aria-pressed','false');
  });
});

/* ========= ADD SKILL FORM ========= */
const addForm = document.getElementById('addSkillForm');
const newIcon = document.getElementById('newSkillIcon');
const newName = document.getElementById('newSkillName');
const newLevel = document.getElementById('newSkillLevel');

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const icon = (newIcon.value || '⭐').trim();
  const name = (newName.value || 'New Skill').trim();
  let level = Number(newLevel.value);
  if(isNaN(level)) level = 50;
  level = Math.max(0, Math.min(100, level));

  const item = createSkillItemDOM(icon, name, level);
  skillsList.appendChild(item);
  initSkillItem(item);

  // animate in
  item.style.opacity = 0;
  item.style.transform = 'translateY(8px)';
  requestAnimationFrame(()=> {
    item.style.transition = 'all 360ms ease';
    item.style.opacity = 1;
    item.style.transform = '';
  });

  // reset form
  newIcon.value = '';
  newName.value = '';
  newLevel.value = 50;
});

/* Factory: create a new skill item DOM element */
function createSkillItemDOM(icon, name, level){
  const wrapper = document.createElement('div');
  wrapper.className = 'skill-item';
  wrapper.setAttribute('draggable','true');
  wrapper.dataset.skill = name;

  wrapper.innerHTML = `
    <div class="skill-left">
      <svg class="skill-ring" viewBox="0 0 42 42" aria-hidden="true">
        <circle class="ring-bg" cx="21" cy="21" r="15.9"></circle>
        <circle class="ring-fg" cx="21" cy="21" r="15.9" stroke-dasharray="0 100"></circle>
      </svg>
      <button class="badge" aria-pressed="false">${icon} ${escapeHtml(name)}</button>
    </div>
    <div class="skill-right">
      <div class="skill-head"><span class="skill-percent">0%</span></div>
      <div class="skill-bar-outer"><div class="skill-bar" style="width:0%"></div></div>
      <input class="skill-slider" type="range" min="0" max="100" value="${level}" aria-label="${escapeHtml(name)} skill level" />
    </div>
  `;
  return wrapper;
}

/* small escape to prevent accidental markup from names */
function escapeHtml(str){
  return str.replace(/[&<>"'`=\/]/g, function(s){ return ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'
  })[s]; });
}

/* accessibility: allow using Enter in inputs in add form to submit naturally */
newName.addEventListener('keydown', (e) => { if(e.key === 'Enter' && newName.value.trim()) addForm.requestSubmit(); });

/* initialize ring appearances for items created in HTML on page load */
document.querySelectorAll('.skill-item').forEach(item => {
  // set initial ring and percent from slider value
  const slider = item.querySelector('.skill-slider');
  const level = slider ? slider.value : 0;
  const pct = item.querySelector('.skill-percent');
  pct.textContent = '0%';
  // animate in a subtle delayed way
  setTimeout(() => {
    item.querySelector('.skill-bar').style.width = level + '%';
    createSVGRingPercent(item, level);
    pct.textContent = level + '%';
  }, 120);
});
