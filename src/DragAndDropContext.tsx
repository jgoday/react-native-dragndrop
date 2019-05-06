import * as React from 'react';
import { View } from 'react-native';

interface ILayoutItem {
    x: number;
    y: number;
    width: number;
    height: number;
}

type IDropPositions = { [name: string] : ILayoutItem };

export interface IState {
    dropViews: View[];

    dropPositions: IDropPositions;

    dropTarget?: string;
    dropData?: any;
}

export interface IAction<T> {
    type: string;
    payload?: T;
}

const REGISTER_DROP_AREA = 'REGISTER DROP AREA';
const UNREGISTER_DROP_AREA = 'UNREGISTER DROP AREA';
const UPDATE_DROP_AREA = 'UPDATE DROP AREA';
const DROP_EVENT = 'DROP EVENT';

export interface IProps {
    children: any;
}

let initialState: IState = {
    dropViews: [],
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
            case REGISTER_DROP_AREA:
                const viewToAdd = getPayload<View>(action);
                return { ... state, dropViews: state.dropViews.concat([viewToAdd]) };

            case UNREGISTER_DROP_AREA:
                const viewToRemove = getPayload<View>(action);
                return { ... state, dropViews: state.dropViews.filter(d => d != viewToRemove) };


            case UPDATE_DROP_AREA:
                const pos = getPayload<any>(action);
                const positions = { ... state.dropPositions, [pos.element]: pos.layout };

                return { ... state, dropPositions: positions };

            case DROP_EVENT:
                const v = getPayload<{id: string, data?: any}>(action);
                return { ... state, dropTarget: v.id, dropData: v.data };

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

export const registerDropArea = (element: View|null) => {
    if (element != null) {
        return {
            type: REGISTER_DROP_AREA,
            payload: element
        }
    }
}

export const unregisterDropArea = (element: View|null) => {
    if (element != null) {
        return {
            type: UNREGISTER_DROP_AREA,
            payload: element
        }
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

export const DragAndDropConsumer = DragAndDropContext.Consumer;

export default { DragAndDropContext, DragAndDropConsumer, DragAndDropProvider };