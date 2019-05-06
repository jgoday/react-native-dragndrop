import * as React from 'react';
const REGISTER_DROP_AREA = 'REGISTER DROP AREA';
const UNREGISTER_DROP_AREA = 'UNREGISTER DROP AREA';
const UPDATE_DROP_AREA = 'UPDATE DROP AREA';
const DROP_EVENT = 'DROP EVENT';
let initialState = {
    dropViews: [],
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
            case REGISTER_DROP_AREA:
                const viewToAdd = getPayload(action);
                return Object.assign({}, state, { dropViews: state.dropViews.concat([viewToAdd]) });
            case UNREGISTER_DROP_AREA:
                const viewToRemove = getPayload(action);
                return Object.assign({}, state, { dropViews: state.dropViews.filter(d => d != viewToRemove) });
            case UPDATE_DROP_AREA:
                const pos = getPayload(action);
                const positions = Object.assign({}, state.dropPositions, { [pos.element]: pos.layout });
                return Object.assign({}, state, { dropPositions: positions });
            case DROP_EVENT:
                const v = getPayload(action);
                return Object.assign({}, state, { dropTarget: v.id, dropData: v.data });
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
export const registerDropArea = (element) => {
    if (element != null) {
        return {
            type: REGISTER_DROP_AREA,
            payload: element
        };
    }
};
export const unregisterDropArea = (element) => {
    if (element != null) {
        return {
            type: UNREGISTER_DROP_AREA,
            payload: element
        };
    }
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
export const DragAndDropConsumer = DragAndDropContext.Consumer;
export default { DragAndDropContext, DragAndDropConsumer, DragAndDropProvider };
