import * as React from 'react';
import { Animated, PanResponder } from 'react-native';
import { DragAndDropContext, dropEvent, dragOverEvent, clearDragEvents, clear } from './DragAndDropContext';
const viewContainsPoint = (position, x, y) => {
    const { x: pageX, y: pageY, width, height } = position;
    const contains = pageX <= x
        && pageY <= y
        && (pageX + width) >= x
        && (pageY + height) >= y;
    return contains;
};
const findDropView = (dropPositions, x, y) => {
    return Object.keys(dropPositions).filter(k => {
        return viewContainsPoint(dropPositions[k], x, y);
    });
};
export default function Draggable(props) {
    const [pan, _] = React.useState(new Animated.ValueXY());
    const { state, dispatch } = React.useContext(DragAndDropContext);
    const [panResponder, setPanResponder] = React.useState({});
    React.useEffect(() => {
        setPanResponder(PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderMove: (e, gesture) => {
                if (state.dropTarget) {
                    dispatch(clear());
                }
                if (props.onMove) {
                    props.onMove(e.nativeEvent.pageX, e.nativeEvent.pageY);
                }
                const dropViews = findDropView(state.dropPositions, e.nativeEvent.pageX, e.nativeEvent.pageY);
                if (dropViews.length >= 1) {
                    dispatch(dragOverEvent(dropViews[0], props.data));
                }
                else {
                    dispatch(clearDragEvents());
                }
                Animated.event([
                    null, { dx: pan.x, dy: pan.y }
                ])(e, gesture);
            },
            onPanResponderRelease: (e, gesture) => {
                const dropViews = findDropView(state.dropPositions, e.nativeEvent.pageX, e.nativeEvent.pageY);
                if (dropViews.length >= 1) {
                    dispatch(dropEvent(dropViews[0], props.data));
                    dispatch(clearDragEvents());
                }
                else {
                    dispatch(clear());
                }
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    friction: 5
                }).start();
            }
        }));
    }, [props.data, state.dropPositions, state.dropTarget]);
    const panStyle = {
        transform: pan.getTranslateTransform()
    };
    return <Animated.View style={[props.style, panStyle]} {...panResponder.panHandlers}>
        {props.children}
    </Animated.View>;
}
