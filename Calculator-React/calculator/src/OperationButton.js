import { ACTIONS } from "./App"

// pass dispatch here to call reducer 
export default function OperationButton({ dispatch, operation}) {
    // onClick to call dispatch
    return (
        <button 
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: {operation} })}
        > 
            {operation} 
        </button>)
}