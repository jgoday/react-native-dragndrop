import * as React from 'react';
import { Animated, PanResponder, View } from 'react-native';
import { DragAndDropContext, dropEvent } from './DragAndDropContext';

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

const findDropView = async (dropPositions: any, x: number, y: number) => {
    return Object.keys(dropPositions).filter(k => {
        return viewContainsPoint(dropPositions[k], x, y);
    });
}

export default function Draggable(props: IProps) {
    const [pan, setPan] = React.useState<Animated.ValueXY>(new Animated.ValueXY());

    const { state, dispatch } = React.useContext(DragAndDropContext);

    let panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gesture) => true,
        onPanResponderMove: Animated.event([
          null, { dx: pan.x, dy: pan.y }
        ]),
        onPanResponderRelease: async (e, gesture) => {
            const dropViews = await findDropView(
                state.dropPositions,
                e.nativeEvent.pageX,
                e.nativeEvent.pageY);

            if (dropViews.length >= 1) {
                dispatch(dropEvent(dropViews[0], props.data));
            }
            Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                friction: 5
            }).start();
          }
      });;

    const panStyle = {
        transform: pan.getTranslateTransform()
    }

    return <Animated.View
        style={[props.style, panStyle]}
        {...panResponder.panHandlers}>
        {props.children}
    </Animated.View>;
}