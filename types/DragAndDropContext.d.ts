import * as React from 'react';
interface ILayoutItem {
    x: number;
    y: number;
    width: number;
    height: number;
}
declare type IDropPositions = {
    [name: string]: ILayoutItem;
};
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
export interface IProps {
    children: any;
}
interface IDragAndDropContext {
    state: IState;
    dispatch: React.Dispatch<any>;
}
export declare const DragAndDropContext: React.Context<IDragAndDropContext>;
export declare function DragAndDropProvider(props: IProps): JSX.Element;
export declare const unregisterDropArea: (id: string) => {
    type: string;
    payload: string;
};
export declare const updateDropArea: (id: string, layout: {
    x: number;
    y: number;
    width: number;
    height: number;
}) => {
    type: string;
    payload: {
        element: string;
        layout: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
};
export declare const dropEvent: (id: string, data?: any) => {
    type: string;
    payload: {
        id: string;
        data: any;
    };
};
export declare const dragOverEvent: (id: string, data?: any) => {
    type: string;
    payload: {
        id: string;
        data: any;
    };
};
export declare const clearDragEvents: () => {
    type: string;
};
export declare const clear: () => {
    type: string;
};
export declare const DragAndDropConsumer: React.ExoticComponent<React.ConsumerProps<IDragAndDropContext>>;
declare const _default: {
    DragAndDropContext: React.Context<IDragAndDropContext>;
    DragAndDropConsumer: React.ExoticComponent<React.ConsumerProps<IDragAndDropContext>>;
    DragAndDropProvider: typeof DragAndDropProvider;
};
export default _default;
