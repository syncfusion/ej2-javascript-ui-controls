import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { TextStyle, Margin } from '../core/appearance';import { Point } from '../primitives/point';import { TextStyleModel, MarginModel } from '../core/appearance-model';import { PointModel } from '../primitives/point-model';import { HorizontalAlignment, VerticalAlignment, AnnotationAlignment, AnnotationTypes, TextDecoration } from '../enum/enum';import { AnnotationConstraints } from '../enum/enum';import { randomId } from '../utility/base-util';

/**
 * Interface for a class Hyperlink
 */
export interface HyperlinkModel {

    /**
     * Sets the fill color of the hyperlink

     */
    color?: string;

    /**
     * Defines the content for hyperlink

     */
    content?: string;

    /**
     * Defines the link for hyperlink

     */
    link?: string;

    /**
     * Defines how the link should be decorated. For example, with underline/over line
     * * Overline - Decorates the text with a line above the text
     * * Underline - Decorates the text with an underline
     * * LineThrough - Decorates the text by striking it with a line
     * * None - Text will not have any specific decoration

     */
    textDecoration?: TextDecoration;

}

/**
 * Interface for a class Annotation
 */
export interface AnnotationModel {

    /**
     * Sets the textual description of the node/connector

     */
    content?: string;

    /**
     * Sets the textual description of the node/connector

     */
    template?: string | HTMLElement;

    /**
     * Defines the visibility of the label

     */
    visibility?: boolean;

    /**
     * Enables or disables the default behaviors of the label.
     * * ReadOnly - Enables/Disables the ReadOnly Constraints
     * * InheritReadOnly - Enables/Disables the InheritReadOnly Constraints



     */
    constraints?: AnnotationConstraints;

    /**
     * Sets the hyperlink of the label
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     * annotations: [{ id: 'label1',
     * content: 'Default Shape', style: { color: 'red' },
     * hyperlink: { link: 'https://www.google.com', color : 'blue', textDecoration : 'Overline', content : 'google' }
     * }, {content: 'text', constraints: ~AnnotationConstraints.InheritReadOnly
     * }],
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```



     */
    hyperlink?: HyperlinkModel;

    /**
     * Defines the unique id of the annotation

     */
    id?: string;

    /**
     * Sets the width of the text



     */
    width?: number;

    /**
     * Sets the height of the text



     */
    height?: number;

    /**
     * Sets the rotate angle of the text

     */
    rotateAngle?: number;

    /**
     * Defines the appearance of the text

     */
    style?: TextStyleModel;

    /**
     * Sets the horizontal alignment of the text with respect to the parent node/connector
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent

     */
    horizontalAlignment?: HorizontalAlignment;

    /**
     * Sets the vertical alignment of the text with respect to the parent node/connector
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent

     */
    verticalAlignment?: VerticalAlignment;

    /**
     * Sets the space to be left between an annotation and its parent node/connector

     */
    margin?: MarginModel;

    /**
     * Sets the space to be left between an annotation and its parent node/connector

     */
    dragLimit?: MarginModel;

    /**
     * Sets the type of the annotation
     *  * Shape - Sets the annotation type as Shape
     *  * Path - Sets the annotation type as Path

     */
    type?: AnnotationTypes;

    /**
     * Allows the user to save custom information/data about an annotation
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let addInfo: {}  = { content: 'label' };
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     * annotations: [{ id: 'label1', 
     * content: 'text', constraints: ~AnnotationConstraints.InheritReadOnly, addInfo: addInfo
     * }],
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```



     */
    addInfo?: Object;

}

/**
 * Interface for a class ShapeAnnotation
 */
export interface ShapeAnnotationModel extends AnnotationModel{

    /**
     * Sets the position of the annotation with respect to its parent bounds

     */
    offset?: PointModel;

}

/**
 * Interface for a class PathAnnotation
 */
export interface PathAnnotationModel extends AnnotationModel{

    /**
     * Sets the segment offset of annotation

     */
    offset?: number;

    /**
     * Sets the displacement of an annotation from its actual position



     */
    displacement?: PointModel;

    /**
     * Sets the segment alignment of annotation
     *  * Center - Aligns the annotation at the center of a connector segment
     *  * Before - Aligns the annotation before a connector segment
     *  * After - Aligns the annotation after a connector segment

     */
    alignment?: AnnotationAlignment;

    /**
     * Enable/Disable the angle based on the connector segment

     */
    segmentAngle?: boolean;

}