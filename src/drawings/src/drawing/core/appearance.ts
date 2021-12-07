import { Property, ChildProperty, Collection, ComplexFactory } from '@syncfusion/ej2-base';
import { GradientModel, RadialGradientModel, LinearGradientModel, StopModel } from './appearance-model';
import { TextDecoration, TextWrap, TextAlign, GradientType, TextOverflow, WhiteSpace } from '../enum/enum';

/**   @private  */
let getGradientType: Function = (obj: Gradient): Object => {
    switch (obj.type) {
        case 'Linear':
            return LinearGradient;
        case 'Radial':
            return RadialGradient;
        default:
            return LinearGradient;
    }
};

/**
 * Layout Model module defines the styles and types to arrange objects in containers
 */
export class Thickness {

    /**
     * Sets the left value of the thickness
     * @default 0
     */
    public left: number;

    /**
     * Sets the right value of the thickness
     * @default 0
     */
    public right: number;

    /**
     * Sets the top value of the thickness
     * @default 0
     */
    public top: number;

    /**
     * Sets the bottom value of the thickness
     * @default 0
     */
    public bottom: number;

    constructor(left: number, right: number, top: number, bottom: number) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
}

/**
 * Defines the space to be left between an object and its immediate parent
 */
export class Margin extends ChildProperty<Margin> {
    /**
     * Sets the space to be left from the left side of the immediate parent of an element
     * @default 0
     */
    @Property(0)
    public left: number;

    /**
     * Sets the space to be left from the right side of the immediate parent of an element
     * @default 0
     */
    @Property(0)
    public right: number;

    /**
     * Sets the space to be left from the top side of the immediate parent of an element
     * @default 0
     */
    @Property(0)
    public top: number;

    /**
     * Sets the space to be left from the bottom side of the immediate parent of an element
     * @default 0
     */
    @Property(0)
    public bottom: number;
}


/**
 * Defines the different colors and the region of color transitions
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let stopscol: StopModel[] = [];
 * let stops1: StopModel = { color: 'white', offset: 0, opacity: 0.7 };
 * stopscol.push(stops1);
 * let stops2: StopModel = { color: 'red', offset: 0, opacity: 0.3 };
 * stopscol.push(stops2);
 * let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };
 * let nodes: NodeModel[] = [{ id: 'node1', width: 100, height: 100,
 * style: { gradient: gradient }
 * }];
 * let diagram: Diagram = new Diagram({
 * ...
 *   nodes: nodes,
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 */

export class Stop extends ChildProperty<Stop> {
    /**
     * Sets the color to be filled over the specified region
     * @default ''
     */
    @Property('')
    public color: string;
    /**
     * Sets the position where the previous color transition ends and a new color transition starts
     * @default 0
     */
    @Property(0)
    public offset: number;
    /**
     * Describes the transparency level of the region
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * @private
     * Returns the name of class Stop
     */
    public getClassName(): string {
        return 'Stop';
    }
}

/**                                                                                                        
 * Paints the node with a smooth transition from one color to another color
 */
export class Gradient extends ChildProperty<Gradient> {
    /**
     * Defines the stop collection of gradient
     * @default []
     */
    @Collection<StopModel>([], Stop)
    public stops: StopModel[];
    /**
     * Defines the type of gradient
     * * Linear - Sets the type of the gradient as Linear
     * * Radial - Sets the type of the gradient as Radial
     * @default 'None'
     */
    @Property('None')
    public type: GradientType;

    /**
     * Defines the id of gradient
     * @default ''
     */
    @Property('')
    public id: string;

}

/**
 * Defines the linear gradient of styles
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let stopscol: StopModel[] = [];
 * let stops1: StopModel = { color: 'white', offset: 0, opacity: 0.7 };
 * stopscol.push(stops1);
 * let stops2: StopModel = { color: 'red', offset: 0, opacity: 0.3 };
 * stopscol.push(stops2);
 * let gradient: LinearGradientModel = { x1: 0, x2: 50, y1: 0, y2: 50, stops: stopscol, type: 'Linear' };
 * let nodes: NodeModel[] = [{ id: 'node1', width: 100, height: 100,
 * style: { gradient: gradient }
 * }];
 * let diagram: Diagram = new Diagram({
 * ...
 *   nodes: nodes,
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 */

/**                
 * Paints the node with linear color transitions
 */
export class LinearGradient extends Gradient {
    /**
     * Defines the x1 value of linear gradient
     * @default 0
     */
    @Property(0)
    public x1: number;
    /**
     * Defines the x2 value of linear gradient
     * @default 0
     */
    @Property(0)
    public x2: number;
    /**
     * Defines the y1 value of linear gradient
     * @default 0
     */
    @Property(0)
    public y1: number;
    /**
     * Defines the y2 value of linear gradient
     * @default 0
     */
    @Property(0)
    public y2: number;
}

/**
 * A focal point defines the beginning of the gradient, and a circle defines the end point of the gradient
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let stopscol: StopModel[] = [];
 * let stops1: StopModel = { color: 'white', offset: 0, opacity: 0.7 };
 * stopscol.push(stops1);
 * let stops2: StopModel = { color: 'red', offset: 0, opacity: 0.3 };
 * stopscol.push(stops2);
 * let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stopscol, type: 'Radial' };
 * let nodes: NodeModel[] = [{ id: 'node1', width: 100, height: 100,
 * style: { gradient: gradient }
 * }];
 * let diagram: Diagram = new Diagram({
 * ...
 *   nodes: nodes,
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 */

export class RadialGradient extends Gradient {
    /**
     * Defines the cx value of radial gradient
     * @default 0
     */
    @Property(0)
    public cx: number;
    /**
     * Defines the cy value of radial gradient
     * @default cy
     */
    @Property(0)
    public cy: number;
    /**
     * Defines the fx value of radial gradient
     * @default 0
     */
    @Property(0)
    public fx: number;
    /**
     * Defines the fy value of radial gradient
     * @default fy
     */
    @Property(0)
    public fy: number;
    /**
     * Defines the r value of radial gradient
     * @default 50
     */
    @Property(50)
    public r: number;
}
/**      
 * Defines the style of shape/path
 */
export class ShapeStyle extends ChildProperty<ShapeStyle> {
    /**
     * Sets the fill color of a shape/path
     * @default 'white'
     */
    @Property('white')
    public fill: string;

    /**
     * Sets the stroke color of a shape/path
     * @default 'black'
     */
    @Property('black')
    public strokeColor: string;

    /**
     * Defines the pattern of dashes and spaces to stroke the path/shape
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```
     *  let nodes: NodeModel[] = [{  id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     * style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5, 
     * strokeDashArray: '2 2', opacity: 0.6 } as ShapeStyleModel,
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     *   nodes: nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    @Property('')
    public strokeDashArray: string;

    /**
     * Defines the stroke width of the path/shape
     * @default 1
     */
    @Property(1)
    public strokeWidth: number;

    /**
     * Sets the opacity of a shape/path
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Defines the gradient of a shape/path
     * @default null
     * @aspType object
     */
    @ComplexFactory(getGradientType)
    public gradient: GradientModel | LinearGradientModel | RadialGradientModel;
}


/**
 * Defines the stroke style of a path 
 */
export class StrokeStyle extends ShapeStyle {
    /**
     * Sets the fill color of a shape/path
     * @default 'transparent'
     */
    @Property('transparent')
    public fill: string;
}

/**
 * Defines the appearance of text
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let style: TextStyleModel = { strokeColor: 'black', opacity: 0.5, strokeWidth: 1 };
 * let node: NodeModel;
 * node = {
 * ...
 * id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
 * annotations : [{
 * content: 'text', style: style }];
 * ...
 * };
 * let diagram: Diagram = new Diagram({
 * ...
 *   nodes: [node],
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 */
export class TextStyle extends ShapeStyle {

    /**
     * Sets the font color of a text
     * @default 'black'
     */
    @Property('black')
    public color: string;

    /**
     * Sets the font type of a text
     * @default 'Arial'
     */
    @Property('Arial')
    public fontFamily: string;

    /**
     * Defines the font size of a text
     * @default 12
     */
    @Property(12)
    public fontSize: number;

    /**
     * Enables/disables the italic style of text
     * @default false
     */
    @Property(false)
    public italic: boolean;

    /**
     * Enables/disables the bold style of text
     * @default false
     */
    @Property(false)
    public bold: boolean;

    /**
     * Defines how the white space and new line characters have to be handled
     * * PreserveAll - Preserves all empty spaces and empty lines
     * * CollapseSpace - Collapses the consequent spaces into one
     * * CollapseAll - Collapses all consequent empty spaces and empty lines
     * @default 'CollapseSpace'
     */
    @Property('CollapseSpace')
    public whiteSpace: WhiteSpace;
    /**
     * Defines how the text should be wrapped, when the text size exceeds some specific bounds
     * * WrapWithOverflow - Wraps the text so that no word is broken
     * * Wrap - Wraps the text and breaks the word, if necessary
     * * NoWrap - Text will no be wrapped
     * @default  'WrapWithOverflow'
     */
    @Property('WrapWithOverflow')
    public textWrapping: TextWrap;

    /**
     * Defines how the text should be aligned within its bounds
     * * Left - Aligns the text at the left of the text bounds
     * * Right - Aligns the text at the right of the text bounds
     * * Center - Aligns the text at the center of the text bounds
     * * Justify - Aligns the text in a justified manner
     * @default 'Center'
     */
    @Property('Center')
    public textAlign: TextAlign;

    /**
     * Defines how the text should be decorated. For example, with underline/over line
     * * Overline - Decorates the text with a line above the text
     * * Underline - Decorates the text with an underline
     * * LineThrough - Decorates the text by striking it with a line
     * * None - Text will not have any specific decoration
     * @default 'None'
     */
    @Property('None')
    public textDecoration: TextDecoration;

    /**
     * Defines how to handle the text when it exceeds the given size.
     * * Wrap - Wraps the text to next line, when it exceeds its bounds
     * * Ellipsis - It truncates the overflown text and represents the clipping with an ellipsis
     * * Clip - It clips the overflow text
     * @default 'Wrap'
     */
    @Property('Wrap')
    public textOverflow: TextOverflow;

    /**
     * Sets the fill color of a shape/path
     * @default 'transparent'
     */
    @Property('transparent')
    public fill: string;
}
