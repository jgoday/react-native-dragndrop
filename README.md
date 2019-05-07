# react-native-dragndrop

## Getting started
`$ npm install react-native-dragndrop --save`

## Usage
```typescript
import * as React from 'react';
import { View, Text } from 'react-native';
import { DragAndDropProvider, Draggable, DropView } from 'react-native-dragndrop';

export interface IProps {}
export default function Sample(props: IProps) {
    const [ numbers, setNumbers ] = React.useState<number[]>([1, 2, 3, 4]);
    const [ currentStyle, setCurrentStyle ] = React.useState<any>({});

    const onDrop = (currentNumber: number, selectedNumber: number) => {
        if (currentNumber == selectedNumber) {
            setCurrentStyle(styles.successMatch);
        }
        else {
            setCurrentStyle(styles.failureMatch);
        }
    }

    return (<View style={styles.container}>
        <DragAndDropProvider>
            {numbers.map((w, i) => <DropView key={i}
                onDrop={n => onDrop(n, w)}>
                <Text>{w}</Text>
            </DropView>)}

            <Draggable data={2}>
                <Text style={currentStyle}>2</Text>
            </Draggable>
        </DragAndDropProvider>
    </View>);
}
```

## Implementation
### DragAndDropProvider
Makes the use of Draggable and DropView available to any nested components.


### DropView
Wrapper to receive a drop event over an existing component.

#### Props

| Prop        | Type     | Optional | Default | Description |
| ----------  | -------- | -------- | ------- | ----------- |
| `onDrop`    | Function | Yes      |         | Called when a drop event is generated over the component. It receives the Draggable data property. |
| `style`     | any      | Yes      |         | Additional style to the DropView wrapper component.            |
| `highlight` | bool     | Yes      |         | Should the component react to a drag over event.                |
| `highlightStyle` | any | Yes      |         | Additional style when a drag event is over the component.       |


### Draggable
Wrapper to convert a component into a draggable view. It can optionally hold a `data` prop that will be passed to the drop event.

#### Props
| Prop        | Type | Optional | Default | Description |
| ----------  | ---- | -------- | ------- | ----------- |
| `data`      | any  | Yes      |         | Additional data that will be passed to the drop event.  |
| `style`     | any  | Yes      |         | Additional style to the Draggable wrapper Component.  |
