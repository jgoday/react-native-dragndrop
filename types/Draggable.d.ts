/// <reference types="react" />
export interface IProps {
    children: any;
    style?: any;
    data?: any;
    onMove?: Function;
}
export default function Draggable(props: IProps): JSX.Element;
