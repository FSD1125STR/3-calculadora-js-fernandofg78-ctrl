document.addEventListener('DOMContentLoaded', () => {

  // --- SELECTORES 
  const display = document.getElementById('pantalla');
  const displayOperation = document.getElementById('displayOperation');

  const numbers = document.querySelectorAll('.number');
  const operators = document.querySelectorAll('.operador');
  const equalBtn = document.getElementById('igual');
  const clearBtn = document.getElementById('borrarTodo');
  const delLastBtn = document.getElementById('borrarUltimo');

  const sciBtn = document.getElementById('btnSci');
  const mathBtn = document.getElementById('btnMath');

  const scientificPanel = document.getElementById('scientificPanel');
  const sciButtons = Array.from(scientificPanel.querySelectorAll('button'));

  // --- ESTADO ---
  let current = '';
  let first = null;
  let op = '';
  let justComputed = false;

  // --- MODOS ---
  const MODES = {
    sci: ['sin', 'cos', 'tan', '√', 'x²', 'π'],
    math: ['log', 'ln', 'x³', '1/x', '|x|', 'e']
  };

  // --- Inicial ---
  function resetScientificButtons() {
    sciButtons.forEach(btn => {
      btn.textContent = '';
      btn.dataset.fn = '';
    });
  }
  
  // --- Displays ---
  function refreshMainDisplay() {
    display.textContent = current || '0';
  }

  function refreshOperationDisplay() {
    if (first === null && !op) {
      displayOperation.textContent = '';
      return;
    }
    if (first !== null && op && current !== '') {
      displayOperation.textContent = `${first} ${op} ${current}`;
    } else if (first !== null && op && current === '') {
      displayOperation.textContent = `${first} ${op}`;
    } else if (first !== null && !op) {
      displayOperation.textContent = `${first}`;
    } else {
      displayOperation.textContent = '';
    }
  }

  // --- Números ---
  numbers.forEach(btn => {
    btn.addEventListener('click', () => {
      if (justComputed) {
        current = '';
        first = null;
        op = '';
        displayOperation.textContent = '';
        justComputed = false;
      }
      const t = btn.textContent;
      if (t === '.' && current.includes('.')) return;
      if (current === '0' && t !== '.') current = t;
      else current += t;

      refreshMainDisplay();
      refreshOperationDisplay();
    });
  });

  // --- Borrar último ---
  delLastBtn.addEventListener('click', () => {
    if (current.length > 0) current = current.slice(0, -1);
    refreshMainDisplay();
    refreshOperationDisplay();
  });

  // --- Operadores ---
  function computePending() {
    if (first === null || op === '') return;
    const a = parseFloat(first);
    const b = parseFloat(current === '' ? first : current);
    if (isNaN(a) || isNaN(b)) return;

    let res;
    switch (op) {
      case '+': res = a + b; break;
      case '−': res = a - b; break;
      case '×': res = a * b; break;
      case '÷': res = (b === 0 ? 'Error' : a / b); break;
      default: res = b; break;
    }
    return res;
  }

  operators.forEach(btn => {
    btn.addEventListener('click', () => {
      const clicked = btn.textContent;

      if (current === '' && first !== null) {
        op = clicked;
        refreshOperationDisplay();
        return;
      }

      if (first === null) {
        if (current === '') return;
        first = current;
        op = clicked;
        current = '';
        refreshMainDisplay();
        refreshOperationDisplay();
        return;
      }

      if (first !== null && op && current !== '') {
        const inter = computePending();
        first = String(inter);
        op = clicked;
        current = '';
        refreshMainDisplay();
        refreshOperationDisplay();
        return;
      }

      op = clicked;
      refreshOperationDisplay();
    });
  });

  // --- Igual ---
  equalBtn.addEventListener('click', () => {
    if (first === null || !op) return;

    const bStr = current === '' ? first : current;
    const a = parseFloat(first);
    const b = parseFloat(bStr);

    if (isNaN(a) || isNaN(b)) return;

    let result;
    switch (op) {
      case '+': result = a + b; break;
      case '−': result = a - b; break;
      case '×': result = a * b; break;
      case '÷': result = (b === 0 ? 'Error' : a / b); break;
      default: result = b; break;
    }

    displayOperation.textContent = `${first} ${op} ${bStr} = ${result}`;
    current = String(result);
    first = null;
    op = '';
    refreshMainDisplay();
    justComputed = true;
  });

  // --- Clear ---
  clearBtn.addEventListener('click', () => {
    current = '';
    first = null;
    op = '';
    refreshMainDisplay();
    refreshOperationDisplay();
  });

  // --- FUNCIONES CIENTÍFICAS ---
  resetScientificButtons();
  setMode('sci');
  if (scientificPanel.classList.contains('hiddenn')) scientificPanel.classList.remove('hiddenn');
  if (scientificPanel.classList.contains('hidden')) scientificPanel.classList.remove('hidden');
  
  function setMode(mode) {
    resetScientificButtons();
    if (MODES[mode]) {
      MODES[mode].forEach((txt, i) => {
        const b = sciButtons[i];
        if (!b) return;
        b.textContent = txt;
        b.dataset.fn = txt;
      });
    }
    document.querySelectorAll('.btn.especial.sci').forEach(x => x.classList.remove('active'));
    if (mode === 'sci') sciBtn.classList.add('active');
    if (mode === 'math') mathBtn.classList.add('active');
  }

  sciBtn.addEventListener('click', () => setMode('sci'));
  mathBtn.addEventListener('click', () => setMode('math'));

  // Handler común
  sciButtons.forEach(b => {
    b.addEventListener('click', () => {
      const fn = b.dataset.fn;
      if (!fn) return;

      const valStr = (current !== '') ? current : display.textContent;
      const val = parseFloat(valStr);

      // Constantes
      if (fn === 'π') { current = String(Math.PI); refreshMainDisplay(); justComputed = true; return; }
      if (fn === 'e')  { current = String(Math.E); refreshMainDisplay(); justComputed = true; return; }

      if (isNaN(val)) return;

      switch (fn) {
        case 'sin': current = String(Math.sin(val)); break;
        case 'cos': current = String(Math.cos(val)); break;
        case 'tan': current = String(Math.tan(val)); break;
        case '√':  current = (val < 0) ? 'Error' : String(Math.sqrt(val)); break;
        case 'x²': current = String(Math.pow(val,2)); break;
        case 'log': current = (val>0)?String(Math.log10(val)):'Error'; break;
        case 'ln': current = (val>0)?String(Math.log(val)):'Error'; break;
        case 'x³': current = String(Math.pow(val,3)); break;
        case '1/x': current = (val===0)?'Error':String(1/val); break;
        case '|x|': current = String(Math.abs(val)); break;
      }

      refreshMainDisplay();
      refreshOperationDisplay();
      justComputed = true;
    });
  });
});

const calculator = document.querySelector('.calculator')
const createTitle = () => {
    const head = document.createElement('div');
    head.className = 'calc-title'; 

    const title = document.createElement('div');
    title.className = 'title-header';
    title.innerHTML = `<h1>Calculadora desde HTML </h1><span class = 'arrow'>▼<span>`;

    const text = document.createElement('div');
    text.className = 'title-content';
    text.innerHTML = `
        Esta calculadora incluye un <strong>display principal</strong> que muestra el número actual y un 
        <strong>display secundario</strong> que refleja la operación en curso, permitiendo visualizar 
        claramente cada paso del cálculo.<br><br>

        Ofrece funciones <strong>básicas</strong> como suma, resta, multiplicación y división, además de un sistema 
        de borrado parcial y total para un control total sobre la expresión.<br><br>

        Incorpora un panel <strong>científico</strong> con funciones como sin, cos, tan, raíz cuadrada, potencias, 
        valor absoluto, inverso, logaritmos, π y e.<br><br>

        Cuenta con <strong>modos configurables</strong> que permiten alternar entre distintos grupos de funciones 
        científicas, actualizando los botones dinámicamente.<br><br>

        Todo el comportamiento se gestiona mediante eventos y lógica interna que construye y evalúa 
        cada operación paso a paso. `;

    head.appendChild(title);
    head.appendChild(text);

  
    calculator.parentNode.insertBefore(head, calculator);

    title.addEventListener('click', () =>{
        text.classList.toggle('open');
        head.classList.toggle('active');
    })
};
createTitle();


const documentBody = document.body;
documentBody.addEventListener('click', (event) => {
  const title = document.querySelector('.calc-title'); // contenedor del título
  const text = document.querySelector('.title-content'); // contenido que se abre/cierra
  const head = title;

  // Solo actúa si el título está activo
  if (title.classList.contains('active')) {
    // Evita cerrar si el clic fue sobre el título mismo
    if (!title.contains(event.target)) {
      text.classList.remove('open');
      title.classList.remove('active');
    }
  }
});
