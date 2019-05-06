var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Animated, PanResponder } from 'react-native';
import { DragAndDropContext, dropEvent } from './DragAndDropContext';
const viewContainsPoint = (position, x, y) => {
    const { x: pageX, y: pageY, width, height } = position;
    const contains = pageX <= x
        && pageY <= y
        && (pageX + width) >= x
        && (pageY + height) >= y;
    return contains;
};
const findDropView = (dropPositions, x, y) => __awaiter(this, void 0, void 0, function* () {
    return Object.keys(dropPositions).filter(k => {
        return viewContainsPoint(dropPositions[k], x, y);
    });
});
export default function Draggable(props) {
    const [pan, setPan] = React.useState(new Animated.ValueXY());
    const { state, dispatch } = React.useContext(DragAndDropContext);
    let panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gesture) => true,
        onPanResponderMove: Animated.event([
            null, { dx: pan.x, dy: pan.y }
        ]),
        onPanResponderRelease: (e, gesture) => __awaiter(this, void 0, void 0, function* () {
            const dropViews = yield findDropView(state.dropPositions, e.nativeEvent.pageX, e.nativeEvent.pageY);
            if (dropViews.length >= 1) {
                dispatch(dropEvent(dropViews[0], props.data));
            }
            Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                friction: 5
            }).start();
        })
    });
    ;
    const panStyle = {
        transform: pan.getTranslateTransform()
    };
    return <Animated.View style={[props.style, panStyle]} {...panResponder.panHandlers}>
        {props.children}
    </Animated.View>;
}
