const display = document.getElementById('pantalla');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operador');
const equal = document.getElementById('igual');
const del = document.getElementById('borrarTodo');
const delLastNumber = document.getElementById('borrarUltimo');
const displayOperation = document.getElementById('displayOperation');

let currentNum = ''; 
let firstOp = null;
let operation = '';
let textDisplayOperation = ''
let newOperation = false;

// Actualizar pantalla
function updateDisplay() {
    display.textContent = currentNum || '0';
}

//actualizar pantalla de operaciones
function updateOperationsDisplay() {
      if(displayOperation.textContent === ''){
         displayOperation.textContent = `${firstOp} ${operation}`;
      }
      else{
        displayOperation.textContent = `${firstOp} ${operation} ${currentNum}`;
      }
      
}

delLastNumber.addEventListener('click',() =>{
    currentNum = currentNum.slice(0, -1)
    updateDisplay();
    }
);

// Capturar y mostrar números. se van mostrando los numeros, al pulsar en una operacion, se guarda el valor en una variable y el operador en otra

numbers.forEach(num => {
    num.addEventListener('click', () => {
        if(newOperation){
            currentNum = ''; 
            firstOp = null;
            operation = '';           
            displayOperation.textContent = '';           
            newOperation=false;
        }
        if(num.textContent === '.' && currentNum.includes('.')) return; //si se pulsa el punto, pero este ya está  incluido, se detiene e impide añadir otro
        currentNum += num.textContent;
        updateDisplay();
    });    
});


operators.forEach(op => {
    op.addEventListener('click', () =>{
        operation = op.textContent;
        firstOp = currentNum;
        updateOperationsDisplay();
        currentNum = '';     

    })
})

equal.addEventListener('click', ()=>{
    let result = calcular(parseFloat(firstOp), parseFloat(currentNum),operation);
    updateOperationsDisplay();
    currentNum = result;
    updateDisplay();
    newOperation = true;
   
    
   
})

del.addEventListener('click',() =>{
    currentNum = '';
    firstOp = null;
    operation = '';
    displayOperation.textContent='';
    updateDisplay();
    
});



function calcular(num1,num2,op){
    switch(op){
        case '+':return num1+num2;
        case '−': return num1-num2;
        case '×':return num1*num2;
        case '÷':return num2 ===  0 ?  'Error' :  num1/num2;
        default: return num2;
    }
}

const scientificButtons = document.querySelectorAll('.scientific');

scientificButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        let func = btn.textContent;

        if(currentNum === "") currentNum = display.textContent; // Usa pantalla si vacío

        let num = parseFloat(currentNum);

        switch(func){
            case "sin":
                currentNum = Math.sin(num).toString();
                break;
            case "cos":
                currentNum = Math.cos(num).toString();
                break;
            case "tan":
                currentNum = Math.tan(num).toString();
                break;
            case "√":
                currentNum = num < 0 ? "Error" : Math.sqrt(num).toString();
                break;
            case "x²":
                currentNum = Math.pow(num, 2).toString();
                break;
            case "π":
                currentNum = Math.PI.toString();
                break;
            default:
                return;
        }

        updateDisplay();
        newOperation = true; // Permite nueva operación tras cálculo
    });
});


document.getElementById("btnSci").addEventListener("click", () => {
    const panel = document.getElementById("scientificPanel");
    panel.classList.toggle("hidden");
});
