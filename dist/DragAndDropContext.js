import * as React from 'react';
const UNREGISTER_DROP_AREA = 'UNREGISTER DROP AREA';
const UPDATE_DROP_AREA = 'UPDATE DROP AREA';
const DROP_EVENT = 'DROP EVENT';
const DRAG_OVER_EVENT = 'DRAG OVER EVENT';
const CLEAR = 'CLEAR';
const CLEAR_DRAG_EVENTS = 'CLEAR DRAG EVENTS';
let initialState = {
    dropPositions: {}
};
function getPayload(action) {
    return action.payload;
}
export const DragAndDropContext = React.createContext({
    state: initialState,
    dispatch: console.log
});
const reducer = (state, action) => {
    if (action) {
        switch (action.type) {
            case UNREGISTER_DROP_AREA:
                const viewToRemove = getPayload(action);
                const newPositions = state.dropPositions;
                delete newPositions[viewToRemove];
                return Object.assign({}, state, { dropPositions: newPositions });
            case UPDATE_DROP_AREA:
                const pos = getPayload(action);
                const positions = Object.assign({}, state.dropPositions, { [pos.element]: pos.layout });
                return Object.assign({}, state, { dropPositions: positions });
            case DROP_EVENT:
                const v = getPayload(action);
                return Object.assign({}, state, { dropTarget: v.id, dropData: v.data });
            case DRAG_OVER_EVENT:
                const d = getPayload(action);
                return Object.assign({}, state, { dragOverTarget: d.id });
            case CLEAR_DRAG_EVENTS:
                return Object.assign({}, state, { dragOverTarget: undefined });
            case CLEAR:
                return Object.assign({}, state, { dropTarget: undefined, dropData: undefined, dragOverTarget: undefined });
            default: return state;
        }
    }
    else {
        return state;
    }
};
export function DragAndDropProvider(props) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const value = { state, dispatch };
    return (<DragAndDropContext.Provider value={value}>{props.children}</DragAndDropContext.Provider>);
}
export const unregisterDropArea = (id) => {
    return {
        type: UNREGISTER_DROP_AREA,
        payload: id
    };
};
export const updateDropArea = (id, layout) => {
    return {
        type: UPDATE_DROP_AREA,
        payload: {
            element: id,
            layout
        }
    };
};
export const dropEvent = (id, data) => {
    return {
        type: DROP_EVENT,
        payload: {
            id,
            data
        }
    };
};
export const dragOverEvent = (id, data) => {
    return {
        type: DRAG_OVER_EVENT,
        payload: {
            id, data
        }
    };
};
export const clearDragEvents = () => {
    return {
        type: CLEAR_DRAG_EVENTS
    };
};
export const clear = () => {
    return {
        type: CLEAR
    };
};
export const DragAndDropConsumer = DragAndDropContext.Consumer;
export default { DragAndDropContext, DragAndDropConsumer, DragAndDropProvider };
