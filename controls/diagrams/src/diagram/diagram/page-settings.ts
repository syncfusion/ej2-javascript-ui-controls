import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { PageOrientation, BoundaryConstraints, ImageAlignment, ScrollLimit, Scale } from '../enum/enum';
import { FitModes, DiagramRegions } from '../enum/enum';
import { MarginModel } from '../core/appearance-model';
import { Margin } from '../core/appearance';
import { Rect } from '../primitives/rect';
import { BackgroundModel, FitOptionsModel } from './page-settings-model';


/**
 * Defines the size and appearance of the diagram page
 */
export class Background extends ChildProperty<Background> {
    /**
     * Defines the source of the background image
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let background: BackgroundModel = { source: 'https://www.w3schools.com/images/w3schools_green.jpg',
     * scale: 'Slice', align: 'XMinYMin' };
     * let diagram: Diagram = new Diagram({
     * ...
     * pageSettings: {  width: 800, height: 600, orientation: 'Landscape',
     * background: background },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    @Property('')
    public source: string;
    /**
     * Defines the background color of diagram
     * @default 'transparent'
     */
    @Property('transparent')
    public color: string;
    /**
     * Defines how the background image should be scaled/stretched
     * * None - Scale value will be set as None for the image
     * * Meet - Scale value Meet will be set for the image
     * * Slice - Scale value Slice will be set for the image
     * @default 'None'
     */
    @Property('None')
    public scale: Scale;
    /**
     * Defines how to align the background image over the diagram area.
     * * None - Alignment value will be set as none
     * * XMinYMin - smallest X value of the view port and  smallest Y value of the view port
     * * XMidYMin - midpoint X value of the view port and  smallest Y value of the view port
     * * XMaxYMin - maximum X value of the view port and  smallest Y value of the view port
     * * XMinYMid - smallest X value of the view port and midpoint Y value of the view port
     * * XMidYMid - midpoint X value of the view port and midpoint Y value of the view port
     * * XMaxYMid - maximum X value of the view port and midpoint Y value of the view port
     * * XMinYMax - smallest X value of the view port and maximum Y value of the view port
     * * XMidYMax - midpoint X value of the view port and maximum Y value of the view port
     * * XMaxYMax - maximum X value of the view port and maximum Y value of the view port
     * @default 'None'
     */
    @Property('None')
    public align: ImageAlignment;
}
export class FitOptions extends ChildProperty<FitOptions> {
    /**
     * Defines whether the diagram has to be horizontally/vertically fit into the viewport
     * @default 'Page'
     */
    @Property('Page')
    public mode: FitModes;
    /**
     * Defines the region that has to be fit into the viewport
     * @default 'PageSettings'
     */
    @Property('PageSettings')
    public region: DiagramRegions;
    /**
     * Defines the space to be left between the viewport and the content
     *  @default { left: 25, right: 25, top: 25, bottom: 25 }
     */
    @Complex<MarginModel>({top: 25, bottom: 25, left: 25, right: 25}, Margin)
    public margin: MarginModel;
    /**
     * Enables/Disables zooming to fit the smaller content into larger viewport
     * @default false
     */
    @Property(false)
    public canZoomIn: boolean;
    /**
     * Defines the custom region that has to be fit into the viewport
     * @default undefined
     */
    @Property(undefined)
    public customBounds: Rect;
    /**
     * Enables/Disables  fit while render
     * @default false
     */
    @Property(false)
    public canFit: boolean;

}
/**
 * Defines the size and appearance of diagram page
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let diagram: Diagram = new Diagram({
 * ...
 * pageSettings: {  width: 800, height: 600, orientation: 'Landscape',
 * background: { color: 'blue' }, boundaryConstraints: 'Infinity',
 * multiplePage: true, showPageBreaks: true, },
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 * @default {}
 */
export class PageSettings extends ChildProperty<PageSettings> {
    /**
     * Sets the width of a diagram Page
     *
     * @default null
     */
    @Property(null)
    public width: number;

    /**
     * Sets the height of a diagram Page
     *
     * @default null
     */
    @Property(null)
    public height: number;

    /**
     * Sets the margin of a diagram page
     *
     * @default new Margin(0,0,0,0)
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Sets the orientation of the pages in a diagram
     *  * Landscape - Display with page Width is more than the page Height.
     *  * Portrait - Display with page Height is more than the page width.
     *
     * @default 'Landscape'
     */
    @Property('Landscape')
    public orientation: PageOrientation;

    /**
     * Defines the editable region of the diagram
     * * Infinity - Allow the interactions to take place at the infinite height and width
     * * Diagram - Allow the interactions to take place around the diagram height and width
     * * Page - Allow the interactions to take place around the page height and width
     *
     * @default 'Infinity'
     */
    @Property('Infinity')
    public boundaryConstraints: BoundaryConstraints;

    /**
     * Defines the background color and image of diagram
     *
     * @default 'transparent'
     */
    @Complex<BackgroundModel>({}, Background)
    public background: BackgroundModel;

    /**
     * Sets whether multiple pages can be created to fit all nodes and connectors
     *
     * @default false
     */
    @Property(false)
    public multiplePage: boolean;
    /**
     * Enables or disables the page break lines
     *
     * @default false
     */
    @Property(false)
    public showPageBreaks: boolean;
    /**
     * set the fit options
     *
     * @default new FitOptions()
     * @aspType object
     */
    @Complex<FitOptionsModel>({}, FitOptions)
    public fitOptions: FitOptionsModel;
}

/**
 * Diagram ScrollSettings module handles the scroller properties of the diagram
 */
export class ScrollSettings extends ChildProperty<ScrollSettings> {
    /**
     * Defines horizontal offset of the scroller
     *
     * @default 0
     */
    @Property(0)
    public horizontalOffset: number;

    /**
     * Defines vertical offset of the scroller
     *
     * @default 0
     */
    @Property(0)
    public verticalOffset: number;

    /**
     * Defines the currentZoom value of diagram
     *
     * @default 1
     */
    @Property(1)
    public currentZoom: number;
    /**
     * Allows to read the viewport width of the diagram
     *
     * @default 0
     */
    @Property(0)
    public viewPortWidth: number;

    /**
     * Allows to read the viewport height of the diagram
     *
     * @default 0
     */
    @Property(0)
    public viewPortHeight: number;

    /**
     * Defines the minimum zoom value of the diagram
     *
     * @default 0.2
     */
    @Property(0.2)
    public minZoom: number;

    /**
     * Defines the maximum zoom value of the scroller
     *
     * @default 30
     */
    @Property(30)
    public maxZoom: number;

    /**
     * Defines the scrollable region of diagram.
     * * Diagram - Enables scrolling to view the diagram content
     * * Infinity - Diagram will be extended, when we try to scroll the diagram
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     *     scrollSettings: { canAutoScroll: true, scrollLimit: 'Infinity',
     *        scrollableArea : new Rect(0, 0, 300, 300), horizontalOffset : 0
     *                     },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default 'Diagram'
     */
    @Property('Diagram')
    public scrollLimit: ScrollLimit;

    /**
     * Defines the scrollable area of diagram. Applicable, if the scroll limit is “limited”.
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public scrollableArea: Rect;

    /**
     * Enables or Disables the auto scroll option
     *
     * @default false
     */
    @Property(false)
    public canAutoScroll: boolean;

    /**
     * Defines the maximum distance to be left between the object and the scroll bar to trigger auto scrolling
     *
     * @default { left: 15, right: 15, top: 15, bottom: 15 }
     */
    @Complex<MarginModel>({ left: 15, right: 15, top: 15, bottom: 15 }, Margin)
    public autoScrollBorder: MarginModel;

    /**
     * Defines the maximum distance to be left between the object and the edge of the page.
     *
     * @default { left: 0, right: 0, top: 0, bottom: 0 }
     */
    @Complex<MarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    public padding: MarginModel;

    /**
     * Specifies the percentage of scale value for each ZoomIn or ZoomOut functionality.
     * @default 0.2
     */
     @Property(0.2)
     public zoomFactor: number;
}




