import { MenuItemModel, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ZoomTypes, PageOrientation, DiagramRegions, FitModes, RenderingMode } from '../../enum/enum';
import { PointModel } from '../../primitives/point-model';
import { Rect } from '../../primitives/rect';
import { MarginModel } from '../../core/appearance-model';
import { Stretch, FileFormats, ExportModes } from '../../enum/enum';
import { DiagramRenderer } from '../../rendering/renderer';
import { BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { ConnectorModel } from '../connector-model';
import { NodeModel } from '../node-model';


/**
 * Defines the context menu item model.
 */
export interface ContextMenuItemModel extends MenuItemModel {
    /**
     * Define the target to show the menu item.
     */
    target?: string;
}

export interface ZoomOptions {
    /**
     * Sets the factor by which we can zoom in or zoom out
     */
    zoomFactor?: number;
    /** Allows to read the focus value of diagram */
    focusPoint?: PointModel;
    /** Defines the zoom type as zoomIn or ZoomOut */
    type?: ZoomTypes;
}

/**
 * Defines the intensity of the color as an integer between 0 and 255.
 */
export interface ColorValue {
    /**
     * Defines the intensity of the red color as an integer between 0 and 255.
     */
    r?: number;
    /**
     * Defines the intensity of the green color as an integer between 0 and 255.
     */
    g?: number;
    /**
     * Defines the intensity of the blue color as an integer between 0 and 255.
     */
    b?: number;
}

/**
 * Defines the options to export diagrams
 */
export interface IPrintOptions {
    /**
     * Sets the width of the page to be printed
     *
     * @default null
     */
    pageWidth?: number;

    /**
     * Sets the height of the page to be printed
     *
     * @default null
     */
    pageHeight?: number;

    /**
     * Sets the margin of the page to be printed
     *
     * @default new Margin(0,0,0,0)
     */
    margin?: MarginModel;

    /**
     * Sets the orientation of the page to be printed
     *  * Landscape - Display with page Width is more than the page Height.
     *  * Portrait - Display with page Height is more than the page width.
     *
     * @default 'Landscape'
     */
    pageOrientation?: PageOrientation;

    /**
     * Defines whether the diagram has to be exported as single or multiple images
     *
     * @default false
     */
    multiplePage?: boolean;

    /**
     * Sets the region for the print settings
     * * PageSettings - The region to be exported/printed will be based on the given page settings
     * * Content - Only the content of the diagram control will be exported
     * * CustomBounds - The region to be exported will be explicitly defined
     *
     * @default 'PageSettings'
     */
    region?: DiagramRegions;

    /**
     * Sets the aspect ratio  of the exported image
     * * None - Sets the stretch type for diagram as None
     * * Stretch - Sets the stretch type for diagram as Stretch
     * * Meet - Sets the stretch type for diagram as Meet
     * * Slice - Sets the stretch type for diagram as Slice
     *
     * @default Stretch
     */
    stretch?: Stretch;
}
/* eslint-disable */
/**
 * Defines the options to export diagrams
 */
export interface IExportOptions extends IPrintOptions {
    /**
     * Sets the file name of the exported image
     *
     * @default('')
     */
    fileName?: string;

    /**
     * Sets the file format to save the file
     * * JPG - Save the file in JPG Format
     * * PNG - Saves the file in PNG Format
     * * BMP - Save the file in BMP Format
     * * SVG - save the file in SVG format
     *
     * @default('')
     */
    format?: FileFormats;
    

    /**
     * Sets the Mode for the file to be downloaded
     * * Download - Downloads the diagram as image
     * * Data - Sends the diagram as ImageUrl
     *
     * @default('Download')
     */
    mode?: ExportModes;

    /**
     * Sets the region that has to be exported
     *
     * @default (0)
     */
    bounds?: Rect;

    /**
     * Sets the printOptions that has to be printed
     *
     * @default false
     */
    printOptions?: boolean;


}
/* eslint-enable */

/** Interface to cancel the diagram context menu click event */
export interface DiagramMenuEventArgs extends MenuEventArgs {
    cancel?: boolean;
    /**
     */
    item: MenuItemModel;
}

/** Defines the event before opening the context menu */
export interface DiagramBeforeMenuOpenEventArgs extends BeforeOpenCloseMenuEventArgs {
    /**
     * Defines the hidden items of the diagram context menu
     *
     */
    hiddenItems: string[];
    /**
     */
    items: MenuItemModel[];
    /**
     */
    parentItem: MenuItemModel;
}

/**
 * Defines how the diagram has to be fit into the viewport
 */
export interface IFitOptions {
    /**
     * Defines whether the diagram has to be horizontally/vertically fit into the viewport
     */
    mode?: FitModes;
    /**
     * Defines the region that has to be fit into the viewport
     */
    region?: DiagramRegions;
    /**
     * Defines the space to be left between the viewport and the content
     */
    margin?: MarginModel;
    /**
     * Enables/Disables zooming to fit the smaller content into larger viewport
     */
    canZoomIn?: boolean;
    /**
     * Defines the custom region that has to be fit into the viewport
     */
    customBounds?: Rect;
}

/** @private */
export interface ITouches {
    pageX?: number;
    pageY?: number;
    pointerId?: number;
}

/** @private */
export interface View {
    mode: RenderingMode;
    removeDocument: Function;
    updateView: Function;
    updateHtmlLayer: Function;
    renderDocument: Function;
    element: HTMLElement;
    contentWidth?: number;
    contentHeight?: number;
    diagramLayer: HTMLCanvasElement | SVGGElement;
    id: string;
    diagramRenderer: DiagramRenderer;
}

/** @private */
export interface ActiveLabel {
    id: string;
    parentId: string;
    isGroup: boolean;
    text: string;
}

/** @private */
export interface IDataSource {
    // eslint-disable-next-line @typescript-eslint/ban-types
    dataSource: object;
    isBinding: boolean;
    nodes: NodeModel[];
    connectors: ConnectorModel[];
}

/** @private */
export interface IFields {
    id: string;
    sourceID: string;
    targetID: string;
    sourcePointX: number;
    sourcePointY: number;
    targetPointX: number;
    targetPointY: number;
    crudAction: {
        customFields: string[]
    };
}
