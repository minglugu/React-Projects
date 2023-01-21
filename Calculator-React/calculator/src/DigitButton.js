import { ACTIONS } from "./App"

// pass dispatch here to call reducer 
export default function DigitButton({ dispatch, digit}) {
    // onClick to call dispatch
    return (
        <button 
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: {digit} })}
        > 
            {digit} 
        </button>)
}