import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { DragAndDropContext, unregisterDropArea, updateDropArea } from './DragAndDropContext';
const useUniqueId = () => {
    const [state, _] = React.useState((new Date().getTime() * Math.random()).toString());
    return state;
};
export default function DropArea(props) {
    const id = useUniqueId();
    const wrapperEl = React.useRef(null);
    const { state, dispatch } = React.useContext(DragAndDropContext);
    const [highlight, setHighlight] = React.useState({});
    React.useEffect(() => {
        return () => dispatch(unregisterDropArea(id));
    }, []);
    React.useEffect(() => {
        if (state.dropTarget == id) {
            props.onDrop(state.dropData);
        }
        setHighlight(state.dragOverTarget == id && props.highlight
            ? props.highlightStyle || styles.highlight
            : {});
    }, [state.dropTarget, state.dragOverTarget]);
    const measure = () => {
        wrapperEl.current
            && wrapperEl.current.measureInWindow((x, y, width, height) => {
                dispatch(updateDropArea(id, { x, y, width, height }));
            });
    };
    return <View onLayout={_ => measure()} ref={wrapperEl} style={[highlight, props.style]}>
        {props.children}
    </View>;
}
const styles = StyleSheet.create({
    highlight: {
        backgroundColor: '#ddd'
    }
});
