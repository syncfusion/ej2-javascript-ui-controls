import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { TextStyle, Margin } from '../core/appearance';
import { Point } from '../primitives/point';
import { TextStyleModel, MarginModel } from '../core/appearance-model';
import { PointModel } from '../primitives/point-model';
import { HyperlinkModel } from '../objects/annotation-model';
import { HorizontalAlignment, VerticalAlignment, AnnotationAlignment, AnnotationTypes, TextDecoration } from '../enum/enum';
import { AnnotationConstraints } from '../enum/enum';

/**
 * Defines the hyperlink for the annotations in the nodes/connectors
 */
export class Hyperlink extends ChildProperty<Hyperlink> {
    /**
     * Sets the fill color of the hyperlink
     * @default 'blue'
     */
    @Property('blue')
    public color: string;

    /**
     * Defines the content for hyperlink
     * @default ''
     */
    @Property('')
    public content: string;
    /**
     * Defines the link for hyperlink
     * @default ''
     */
    @Property('')
    public link: string;

    /**
     * Defines how the link should be decorated. For example, with underline/over line
     * * Overline - Decorates the text with a line above the text
     * * Underline - Decorates the text with an underline
     * * LineThrough - Decorates the text by striking it with a line
     * * None - Text will not have any specific decoration
     * @default 'None'
     */
    @Property('None')
    public textDecoration: TextDecoration;
}
/**
 * Defines the textual description of nodes/connectors
 */
export class Annotation extends ChildProperty<Annotation> {
    /**
     * Sets the textual description of the node/connector
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines the visibility of the label
     * @default true
     */
    @Property(true)
    public visibility: boolean;

    /**
     * Enables or disables the default behaviors of the label.
     * * ReadOnly - Enables/Disables the ReadOnly Constraints
     * * InheritReadOnly - Enables/Disables the InheritReadOnly Constraints
     * @default 'InheritReadOnly'
     * @aspNumberEnum 
     */
    @Property(AnnotationConstraints.InheritReadOnly)
    public constraints: AnnotationConstraints;

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
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<HyperlinkModel>(undefined, Hyperlink)
    public hyperlink: HyperlinkModel;

    /**
     * Defines the unique id of the annotation
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Sets the width of the text
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the height of the text
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets the rotate angle of the text
     * @default 0
     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Defines the appearance of the text
     * @default new TextStyle()
     */
    @Complex<TextStyleModel>({ strokeWidth: 0, strokeColor: 'transparent', fill: 'transparent' }, TextStyle)
    public style: TextStyleModel;

    /**
     * Sets the horizontal alignment of the text with respect to the parent node/connector
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    @Property('Center')
    public horizontalAlignment: HorizontalAlignment;

    /**
     * Sets the vertical alignment of the text with respect to the parent node/connector
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    @Property('Center')
    public verticalAlignment: VerticalAlignment;

    /**
     * Sets the space to be left between an annotation and its parent node/connector
     * @default new Margin(0,0,0,0)
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Sets the type of the annotation
     *  * Shape - Sets the annotation type as Shape
     *  * Path - Sets the annotation type as Path
     * @default 'Shape'
     */
    @Property('Shape')
    public type: AnnotationTypes;

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
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public addInfo: Object;
}

/**
 * Defines the textual description of nodes/connectors with respect to bounds
 */
export class ShapeAnnotation extends Annotation {
    /**
     * Sets the position of the annotation with respect to its parent bounds
     * @default { x: 0.5, y: 0.5 }
     */
    @Complex<PointModel>({ x: 0.5, y: 0.5 }, Point)
    public offset: PointModel;

    // tslint:disable-next-line:no-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }
}
/**   
 * Defines the connector annotation 
 */
export class PathAnnotation extends Annotation {
    /**
     * Sets the segment offset of annotation
     * @default 0.5
     */
    @Property(0.5)
    public offset: number;
    /**
     * Sets the displacement of an annotation from its actual position
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<PointModel>({ x: 0, y: 0 }, Point)
    public displacement: PointModel;

    /**
     * Sets the segment alignment of annotation
     *  * Center - Aligns the annotation at the center of a connector segment
     *  * Before - Aligns the annotation before a connector segment
     *  * After - Aligns the annotation after a connector segment
     * @default Center
     */
    @Property('Center')
    public alignment: AnnotationAlignment;

    /**
     * Enable/Disable the angle based on the connector segment
     * @default false
     */
    @Property(false)
    public segmentAngle: boolean;

    // tslint:disable-next-line:no-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }
}