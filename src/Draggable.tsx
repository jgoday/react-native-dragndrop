import * as React from 'react';
import { Animated, PanResponder, View, PanResponderInstance } from 'react-native';
import { DragAndDropContext, dropEvent, dragOverEvent, clear, IState } from './DragAndDropContext';

export interface IProps {
    children: any;
    style?: any;
    data?: any;
}

const viewContainsPoint = (position: any, x: number, y: number) => {
    const { x: pageX, y: pageY, width, height } = position;
    const contains = pageX <= x
        && pageY <= y
        && (pageX + width) >= x
        && (pageY + height) >= y;
    return contains;
}

const findDropView = (dropPositions: any, x: number, y: number) => {
    return Object.keys(dropPositions).filter(k => {
        return viewContainsPoint(dropPositions[k], x, y);
    });
}


const createPanResponder = (state: IState, dispatch: Function, pan: Animated.ValueXY, data?: any) => PanResponder.create({
    onStartShouldSetPanResponder: (e, gesture) => true,
    onPanResponderMove: (e, gesture) => {
        const dropViews = findDropView(
            state.dropPositions,
            e.nativeEvent.pageX,
            e.nativeEvent.pageY);

        if (dropViews.length >= 1) {
            dispatch(dragOverEvent(dropViews[0], data));
        }
        else {
            dispatch(clear());
        }

        Animated.event([
            null, { dx: pan.x, dy: pan.y }
        ])(e, gesture);
    },
    onPanResponderRelease: (e, gesture) => {
        const dropViews = findDropView(
            state.dropPositions,
            e.nativeEvent.pageX,
            e.nativeEvent.pageY);

        if (dropViews.length >= 1) {
            dispatch(dropEvent(dropViews[0], data));
            dispatch(clear());
        }
        Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5
        }).start();
      }
  });;

export default function Draggable(props: IProps) {
    const [pan, _] = React.useState<Animated.ValueXY>(new Animated.ValueXY());

    const { state, dispatch } = React.useContext(DragAndDropContext);
    const [ panResponder, setPanResponder ] = React.useState<PanResponderInstance>(
        createPanResponder(state, dispatch, pan, props.data));

    React.useEffect(() => {
        setPanResponder(createPanResponder(state, dispatch, pan, props.data));
    }, [ state.dropPositions, state.dropViews ]);

    const panStyle = {
        transform: pan.getTranslateTransform()
    }

    return <Animated.View
        style={[props.style, panStyle]}
        {...panResponder.panHandlers}>
        {props.children}
    </Animated.View>;
}