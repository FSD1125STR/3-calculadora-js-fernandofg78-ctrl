

const calculator = document.querySelector('.calculator');
let buttonsDiv;//variable declarada al inico porque al crear su appendchild desde la funcion correspondiente no existia y daba error.


const createDisplay = () => {
    const display = document.createElement('div');
    display.className = 'display';

    const resultDisplay = document.createElement('div');
    resultDisplay.id = 'resultDisplay'
    resultDisplay.textContent = 0;;
    const operationDisplay = document.createElement('div')
    operationDisplay.id = 'operationDisplay'
    
    display.appendChild(resultDisplay)
    display.appendChild(operationDisplay)

    calculator.insertBefore(display, calculator.firstChild);

}

const createButtonsDiv = () =>{
    buttonsDiv = document.createElement('div')
    buttonsDiv.className = 'buttons'

    calculator.appendChild(buttonsDiv)
}


const createButtons = () => {
    const buttonsText = [
        'C', 'DEL', '÷', '×',
        '7', '8', '9', '-',
        '4', '5', '6', '+',
        '1', '2', '3', '=',
        '0', '.'
    ];

    buttonsText.forEach(btn => {
        const buttonInput = document.createElement('button');

        const span = document.createElement('span');
        span.textContent = btn;
        buttonInput.appendChild(span);
        
        const numberArr = ['0','1','2','3','4','5','6','7','8','9','.'];
        const operationArr = ['×','÷','+','-'];

        // Limpio SIEMPRE inicio con btn
        buttonInput.className = 'btn';

        if (numberArr.includes(btn))
            buttonInput.classList.add('num');

        if (btn === '0')
            buttonInput.classList.add('zero');

        if (operationArr.includes(btn))
            buttonInput.classList.add('op');

        if (btn === '=')
            buttonInput.classList.add('equal');

        if (btn === 'C') {
            buttonInput.id = 'clear';
            buttonInput.classList.add('op');
        }

        if (btn === 'DEL') {
            buttonInput.id = 'del';
            buttonInput.classList.add('op');
        }
        // FIN DE CREACION DE BOTONES/////////

        buttonsDiv.appendChild(buttonInput);
    });// <- fin del forEach de creacion de botones
};


createDisplay();
createButtonsDiv();
createButtons();

////////////////////////////////////////////////////////////////////////////////////////

// hasta aqui la creacion y pintado de la estrucctura asignando clases e ids necesarios

////////////////////////////////////////////////////////////////////////////////////////

const resultDisplay = document.getElementById('resultDisplay');
const operationDisplay = document.getElementById('operationDisplay');
let currentNum = '';
let fullOperation = '';
let equalSwitch = false;
let lastExpression = '';

buttonsDiv.addEventListener('click', (Event)=>{ //se captura el clic de donde venga no hay que poner oncliclk en cada boton
    const btn = Event.target.closest('button');
    if(!btn) return; //si el clink es en algun sitio que no es un boton, se corta la funcion

    const spanValue = btn.querySelector('span').textContent;// se coge el valor dentro del span y lo  guarda en una variable que se pasa a la funcion como parametro

    handleInput(spanValue); //se pinta el valor del span llamando a la funcion y pasándole el parametro capturado
})



function handleInput(value) {
    const numberArr = ['0','1','2','3','4','5','6','7','8','9','.'];

    //reseteamos tras cliklar en el = 
    if(equalSwitch && !isNaN(value)){ 
        currentNum ='';
        fullOperation = '';
        equalSwitch = false;

    }

    // NÚMEROS
    if (!isNaN(value)) {
        currentNum += value;
        fullOperation += value;

        resultDisplay.textContent = currentNum;      // display principal
        operationDisplay.textContent = fullOperation;       // display inferior
        return;
    }

    //PUNTO
    if(value === '.'){
        if(currentNum.includes('.')) return

        currentNum += '.';
        fullOperation += '.';

        resultDisplay.textContent = currentNum;
        operationDisplay.textContent = fullOperation;
        return
    }

    
    // CLEAR
    if (value === 'C') {
        currentNum = '';
        fullOperation = '';
        operationDisplay.textContent = '';
        resultDisplay.textContent = '0';
        return;
    }

    // DEL
    if (value === 'DEL') {
        currentNum = currentNum.slice(0, -1);
        fullOperation = fullOperation.slice(0, -1);

        resultDisplay.textContent = currentNum || '0';
        operationDisplay.textContent = fullOperation;
        return;
    }
    
    // OPERADORES
    const operationArr = ['+','-','×','÷'];

    if (operationArr.includes(value)) {
       if(currentNum === ''  && fullOperation === '')return;

       //Evitamos mas de un operador
       const repet = fullOperation.slice(-1);
       if(operationArr.includes(repet)) return;


        fullOperation += value;
        currentNum = '';
        operationDisplay.textContent = fullOperation;

        return;
    }


    // IGUAL
    if (value === '=') {
        if(!fullOperation) return;

        calculate(fullOperation);
        equalSwitch = true;
        return;
    }
}

function calculate(expression) {

    const safeExp = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

    try {
        let result = Function("return " + safeExp)();
        result = formatResult(result);

        resultDisplay.textContent = result;
        currentNum = String(result);
        fullOperation = String(result);

    } catch {
        resultDisplay.textContent = "Error";
    }
}

function formatResult(num) {
    // si es entero, lo devolvemos tal cual
    if (Number.isInteger(num)) return num;

    // limitar a 10 decimales máximo
    return parseFloat(num.toFixed(10));
}



const createTitle = () => {
    const head = document.createElement('div');
    head.className = 'calc-title'; // clase para dar estilo

    const title = document.createElement('div');
    title.className = 'title-header';
    title.innerHTML = `<h1>Calculadora desde JS </h1><span class = 'arrow'>▼<span>`;

    const text = document.createElement('div');
    text.className = 'title-content';
    text.innerHTML = `
        Esta calculadora está completamente generada desde <strong>JavaScript</strong>, sin HTML escrito previamente.
        </br>Toda la interfaz —pantalla, botones y contenedores— se crea dinámicamente mediante funciones JS.</br>
        Incluye un sistema de captura de eventos basado en delegación, donde la función
        <strong>handleInput()</strong> interpreta cada clic y construye la expresión matemática en tiempo real.</br>
        La función <strong>calculate()</strong> convierte los símbolos de operación (<strong>×</strong>, <strong>÷</strong>) a operadores reales
        y evalúa la expresión mediante el constructor <strong>Function()</strong>, permitiendo realizar cálculos
        encadenados con prioridad de operadores estándar.</br>
        El resultado se formatea automáticamente gracias a <strong>formatResult()</strong> y la calculadora permite
        seguir operando partiendo del valor obtenido tras el "=". `;

    head.appendChild(title);
    head.appendChild(text);

  
    calculator.parentNode.insertBefore(head, calculator);

    title.addEventListener('click', () =>{
        text.classList.toggle('open');
        head.classList.toggle('active');
    })
};


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
createTitle();