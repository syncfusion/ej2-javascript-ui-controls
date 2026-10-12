import { Property, ChildProperty, Collection, Complex, isNullOrUndefined } from '@syncfusion/ej2-base';import { Point, PointModel, Container, IElement, ThumbsConstraints } from './../ej2-drawings/index';import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './pdf-annotation-model';import { PdfAnnotationBase, PdfFormFieldBase } from './pdf-annotation';

/**
 * Interface for a class Selector
 */
export interface SelectorModel {

    /**
     * Defines the size and position of the container
     *
     * @default null
     */
    wrapper?: Container;

    /**
     * Defines the collection of selected nodes
     */

    annotations?: PdfAnnotationBaseModel[];

    /**
     * Defines the collection of selected form Fields
     */
    formFields?: PdfFormFieldBaseModel[];

    /**
     * Sets/Gets the width of the container
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Sets/Gets the height of the container
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Sets the rotate angle of the container
     *
     * @default 0
     */
    rotateAngle?: number;

    /**
     * Sets the positionX of the container
     *
     * @default 0
     */
    offsetX?: number;

    /**
     * Sets the positionY of the container
     *
     * @default 0
     */
    offsetY?: number;

    /**
     * Sets the pivot of the selector
     *
     * @default { x: 0.5, y: 0.5 }
     */
    pivot?: PointModel;

}