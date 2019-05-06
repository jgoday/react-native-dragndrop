import * as React from 'react';
import { View } from 'react-native';

import {
    DragAndDropContext, registerDropArea, unregisterDropArea, updateDropArea
} from './DragAndDropContext';

export interface IProps {
    children: any;
    style?: any;

    onDrop: Function;
}

const useUniqueId = () => {
    const [state, _] = React.useState<string>((new Date().getTime() * Math.random()).toString());

    return state;
}

export default function DropArea(props: IProps) {
    const id = useUniqueId();
    const wrapperEl = React.useRef<View>(null);
    const { state, dispatch } = React.useContext(DragAndDropContext);

    React.useEffect(() => {
        dispatch(registerDropArea(wrapperEl.current));

        return () => dispatch(unregisterDropArea(wrapperEl.current));
    }, []);

    React.useEffect(() => {
        if (state.dropTarget == id) {
            props.onDrop(state.dropData);
        }
    }, [ state.dropTarget ]);

    return <View
        onLayout={e => dispatch(updateDropArea(id, e.nativeEvent.layout))}
        ref={wrapperEl}
        style={[props.style]}>
        {props.children}
    </View>;
}
