import { Property, ChildProperty, Collection, Complex } from '@syncfusion/ej2-base';import { IElement, ThumbsConstraints } from '@syncfusion/ej2-drawings';import { Container } from '@syncfusion/ej2-drawings';import { PointModel } from '@syncfusion/ej2-drawings';import { Point } from '@syncfusion/ej2-drawings';import { Size } from '@syncfusion/ej2-drawings';import { PdfAnnotationBaseModel } from './pdf-annotation-model';import { PdfAnnotationBase } from './pdf-annotation';

/**
 * Interface for a class Selector
 */
export interface SelectorModel {

    /**
     * Defines the size and position of the container

     */
    wrapper?: Container;

    /**
     * Defines the collection of selected nodes
     */

    annotations?: PdfAnnotationBaseModel[];

    /**
     * Sets/Gets the width of the container


     */
    width?: number;

    /**
     * Sets/Gets the height of the container


     */
    height?: number;

    /**
     * Sets the rotate angle of the container

     */
    rotateAngle?: number;

    /**
     * Sets the positionX of the container

     */
    offsetX?: number;

    /**
     * Sets the positionY of the container

     */
    offsetY?: number;

    /**
     * Sets the pivot of the selector

     */
    pivot?: PointModel;

}