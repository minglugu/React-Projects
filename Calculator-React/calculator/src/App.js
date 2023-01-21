import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./app.css"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

// The reducer function that specifies how the state gets updated. 
// It must be pure, should take the state and action as arguments, 
// and should return the next state. State and action can be of any types.
// different types of operation(type) and passing different params(payload)
function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      // if (true), overwrite the previous value.
      if (state.overwrite) {
        return {
          ...state,
          // replace the entire operand into the newly input digit
          currentOperand: payload.digit,
          // then override changes to false
          overwrite: false
        }
      }
      // if typing 00000 first, edge cases. only shows up one 0.
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      // check if the number has a "." already
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state, 
        // the number that we currently type in. String interpolation `${}`. payload.digit is the numbers that are passed
        // to the reducer.
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }
    
    case ACTIONS.CHOOSE_OPERATION:
      // if no state for cur and prev operands, then no operation happens.
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }  

      // override the previous operation, update to the current operation
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      // if there is only 1 operand which means that previousOperand does not exist (null)
      // make prev operand value equals to cur operand and set cur into null, and set operation
      if (state.previousOperand == null) {
        return {
          ...state,
          // the operation that we pass in
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      // continuous operation
      
      // default action, in this situation, previousOperand is the evaluation
      return {
        ...state,
        previousOperand: evaluate(state),
        // operation is the clicked one on the calculator
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR:
      // return an initial/empty state to remove everything
      return {}
    
    case ACTIONS.DELETE_DIGIT:
      // if overwrite is true, clear everything
      if (state.overwrite) {
        return {
          ...state,
          overwrite:false,
          currentOperand: null
        }
      }
      // if we do not have any operant, we can't delete anything to it.
      // otherwise, hit DEL button will show undefined.
      if (state.currentOperand == null) {
        return state
      }
      // only 1 digit in the input window, completely remove it to reset value to null instead of empty string
      if (state.currentOperand.length === 1) {
        return { 
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
         currentOperand: state.currentOperand.slice(0,-1)
      }
    
    case ACTIONS.EVALUATE:
      // we do not have all the info for calculation
      if (state.operation == null 
          || state.currentOperand == null 
          || state.previousOperand == null) {
        return state
      }

      return {
        ...state,
        // putting a new number will override the previous calculated result
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
} 

function evaluate({previousOperand, currentOperand, operation}) {
  // convert strings into numbers
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)

  // validation: check if prev and current numbers are a number. 
  if (isNaN(prev) || isNaN(current)) {
    return ""
  }

  let res = ""
  switch(operation) {
    case "+":
      res = prev + current
      break
    case "-":
      res = prev - current
      break
    case "*":
      res = prev * current
      break
    case "÷":
      res = prev / current
      break  
  }
  
  return res.toString()
}

// format the input large number
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  // split by ".", and assign values to integer and decimal individually
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  // reducers to manage the state: previous-operand, current-operand and operations
  // in useReducer(), 2nd param is the initial state which is null
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="calculator-grid">
      <div className="output">
        {/* It shows the previous result and operand */}
        <div className="previous-operand"> {formatOperand(previousOperand)} {operation}</div>
        {/* It shows the current typed in number */}
        <div className="current-operand"> {formatOperand(currentOperand)} </div>
      </div>
      
      {/* show the buttons of the calculator */}
      {/* in dispatch, because it is clear the digits, there is no payload key */}
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR})}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>
        DEL
      </button>
      {/* <button>÷</button> */}
      {/* <OperationButton digit="÷" dispatch={dispatch} /> */}
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      {/* <button>*</button> */}
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      {/* <button>+</button> */}
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      {/* <button>-</button> */}
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
        =
      </button>  

    </div>
  );
}

export default App;
