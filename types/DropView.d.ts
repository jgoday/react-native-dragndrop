/// <reference types="react" />
export interface IProps {
    children: any;
    style?: any;
    highlight?: boolean;
    highlightStyle?: any;
    onDrop: Function;
}
export default function DropArea(props: IProps): JSX.Element;
