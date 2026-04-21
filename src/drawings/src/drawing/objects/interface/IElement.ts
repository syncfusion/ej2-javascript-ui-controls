import { Container } from '../../core/containers/container';
/**
 * IElement interface defines the base of the diagram objects (node/connector)
 */
export interface IElement {
    /** returns the wrapper of the diagram element */
    wrapper: Container;
    init(diagram: Container, getDescription?: Function): void;
}




/**
 * IRotateValue interface Rotated label values
 */
export interface IRotateValue {
    /** returns the x position of the label */
    x?: number;
    /** returns the y position of the label */
    y?: number;
    /** returns the angle of the label */
    angle?: number;
}
