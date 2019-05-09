import * as React from 'react';

interface ILayoutItem {
    x: number;
    y: number;
    width: number;
    height: number;
}

type IDropPositions = { [name: string] : ILayoutItem };

export interface IState {
    dropPositions: IDropPositions;

    dragOverTarget?: string;

    dropTarget?: string;
    dropData?: any;
}

export interface IAction<T> {
    type: string;
    payload?: T;
}

const UNREGISTER_DROP_AREA = 'UNREGISTER DROP AREA';
const UPDATE_DROP_AREA = 'UPDATE DROP AREA';
const DROP_EVENT = 'DROP EVENT';
const DRAG_OVER_EVENT = 'DRAG OVER EVENT';
const CLEAR = 'CLEAR';
const CLEAR_DRAG_EVENTS = 'CLEAR DRAG EVENTS';

export interface IProps {
    children: any;
}

let initialState: IState = {
    dropPositions: {}
};

function getPayload<T>(action: IAction<T>) {
    return action.payload!;
}

interface IDragAndDropContext {
    state: IState;
    dispatch: React.Dispatch<any>;
}

export const DragAndDropContext = React.createContext<IDragAndDropContext>({
    state: initialState,
    dispatch: console.log
});

const reducer = (state: IState, action: IAction<any>) => {
    if (action) {
        switch (action.type) {
            case UNREGISTER_DROP_AREA:
                const viewToRemove = getPayload<string>(action);
                const newPositions = state.dropPositions;
                delete newPositions[viewToRemove];

                return {
                    ... state,
                    dropPositions: newPositions
                };

            case UPDATE_DROP_AREA:
                const pos = getPayload<any>(action);
                const positions = { ... state.dropPositions, [pos.element]: pos.layout };

                return { ... state, dropPositions: positions };

            case DROP_EVENT:
                const v = getPayload<{id: string, data?: any}>(action);
                return { ... state, dropTarget: v.id, dropData: v.data };

            case DRAG_OVER_EVENT:
                const d = getPayload<{id: string, data?: any}>(action);
                return { ... state, dragOverTarget: d.id }

            case CLEAR_DRAG_EVENTS:
                return { ... state, dragOverTarget: undefined };

            case CLEAR:
                return { ... state, dropTarget: undefined, dropData: undefined, dragOverTarget: undefined  };

            default: return state;
        }
    }
    else {
        return state;
    }
}

export function DragAndDropProvider(props: IProps) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const value = { state, dispatch };

    return (<DragAndDropContext.Provider value={value}>{props.children}</DragAndDropContext.Provider>);
}

export const unregisterDropArea = (id: string) => {
    return {
        type: UNREGISTER_DROP_AREA,
        payload: id
    }
}

export const updateDropArea =  (id: string, layout: {x: number, y: number, width: number, height: number}) => {
    return {
        type: UPDATE_DROP_AREA,
        payload: {
            element: id,
            layout
        }
    }
}

export const dropEvent = (id: string, data?: any) => {
    return {
        type: DROP_EVENT,
        payload: {
            id,
            data
        }
    }
}

export const dragOverEvent = (id: string, data?: any) => {
    return {
        type: DRAG_OVER_EVENT,
        payload: {
            id, data
        }
    }
}

export const clearDragEvents = () => {
    return {
        type: CLEAR_DRAG_EVENTS
    }
}

export const clear = () => {
    return {
        type: CLEAR
    }
}

export const DragAndDropConsumer = DragAndDropContext.Consumer;

export default { DragAndDropContext, DragAndDropConsumer, DragAndDropProvider };