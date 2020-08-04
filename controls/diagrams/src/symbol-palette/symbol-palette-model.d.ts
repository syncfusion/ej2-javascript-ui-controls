import { Component, Property, Complex, CollectionFactory, ChildProperty, Event } from '@syncfusion/ej2-base';import { isBlazor, BlazorDragEventArgs } from '@syncfusion/ej2-base';import { Browser, EventHandler, Draggable, INotifyPropertyChanged, Collection, ModuleDeclaration } from '@syncfusion/ej2-base';import { remove, EmitType } from '@syncfusion/ej2-base';import { Accordion, AccordionItemModel, ExpandMode, ExpandEventArgs } from '@syncfusion/ej2-navigations';import { NodeModel, ConnectorModel, Node, Connector, Shape, Size } from '../diagram/index';import { Transform, SwimLane, PathModel, IPaletteExpandArgs } from '../diagram/index';import { DiagramRenderer, Container, StackPanel, Margin, BpmnDiagrams, ShapeStyleModel, TextStyleModel } from '../diagram/index';import { DiagramElement, TextElement, MarginModel, Canvas, PointModel, IElement } from '../diagram/index';import { TextWrap, TextOverflow, IPaletteSelectionChangeArgs, HeaderModel, SwimLaneModel } from '../diagram/index';import { SvgRenderer } from '../diagram/rendering/svg-renderer';import { parentsUntil, createSvgElement, createHtmlElement, createMeasureElements } from '../diagram/utility/dom-util';import { removeElementsByClass, applyStyleAgainstCsp } from '../diagram/utility/dom-util';import { scaleElement, arrangeChild, groupHasType, setUMLActivityDefaults, updateDefaultValues } from '../diagram/utility/diagram-util';import { getFunction, randomId, cloneObject } from '../diagram/utility/base-util';import { getOuterBounds } from '../diagram/utility/connector';import { Point } from '../diagram/primitives/point';import { CanvasRenderer } from '../diagram/rendering/canvas-renderer';import { Rect } from '../diagram/primitives/rect';import { SymbolSizeModel, SymbolPaletteInfoModel } from '../diagram/objects/preview-model';
import {SymbolInfo} from "./symbol-palette";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Palette
 */
export interface PaletteModel {

    /**
     * Defines the unique id of a symbol group
     * @default ''
     */
    id?: string;

    /**
     * Sets the height of the symbol group
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Sets whether the palette items to be expanded or not
     * @default true
     */
    expanded?: boolean;

    /**
     * Defines the content of the symbol group
     * @default ''
     */
    iconCss?: string;

    /**
     * Defines the title of the symbol group
     * @default ''
     */
    title?: string;

    /**
     * Defines the collection of predefined symbols
     * @aspType object
     */
    symbols?: (NodeModel | ConnectorModel)[];

}

/**
 * Interface for a class SymbolDragSize
 */
export interface SymbolDragSizeModel {

    /**
     * Sets the drag width of the symbols
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Sets the drag height of the symbols
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    height?: number;

}

/**
 * Interface for a class SymbolPreview
 */
export interface SymbolPreviewModel {

    /**
     * Sets the preview width of the symbols
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Sets the preview height of the symbols
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Defines the distance to be left between the cursor and symbol
     * @default {}
     */
    offset?: PointModel;

}

/**
 * Interface for a class SymbolPalette
 */
export interface SymbolPaletteModel extends ComponentModel{

    /**
     * Configures the key, when it pressed the symbol palette will be focused
     * @default 'S'
     */
    accessKey?: string;

    /**
     * Defines the width of the symbol palette
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines the height of the symbol palette
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the collection of symbol groups
     * @default []
     * @blazorType System.Collections.ObjectModel.ObservableCollection<SymbolPalettePalette>
     */
    palettes?: PaletteModel[];

    /**
     * ```html
     * <div id="symbolpalette"></div>
     *  ```
     * ```typescript
     * let palette: SymbolPalette = new SymbolPalette({
     *   expandMode: 'Multiple',
     *   palettes: [
     *       { id: 'flow', expanded: false, symbols: getFlowShapes(), title: 'Flow Shapes' },
     *   ],
     *   width: '100%', height: '100%', symbolHeight: 50, symbolWidth: 50,
     *   symbolPreview: { height: 100, width: 100 },
     *   enableSearch: true,
     *   getNodeDefaults: setPaletteNodeDefaults,
     *   symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
     *   getSymbolInfo: (symbol: NodeModel): SymbolInfo => {
     *       return { fit: true };
     *   }
     * });
     * palette.appendTo('#symbolpalette');
     * export function getFlowShapes(): NodeModel[] {
     *   let flowShapes: NodeModel[] = [
     *       { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 2 } },
     *       { id: 'Process', shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 2 } },
     *       { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 2 } }
     *   ];
     *   return flowShapes;
     * }
     * function setPaletteNodeDefaults(node: NodeModel): void {
     * if (node.id === 'Terminator' || node.id === 'Process') {
     *   node.width = 130;
     *   node.height = 65;
     * } else {
     *   node.width = 50;
     *   node.height = 50;
     * }
     * node.style.strokeColor = '#3A3A3A';
     * }
     * ```
     * @deprecated
     */
    getSymbolInfo?: Function | string;

    /**
     * Defines the size, appearance and description of a symbol
     */
    symbolInfo?: SymbolInfo;

    /**
     * Defines the symbols to be added in search palette
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    filterSymbols?: Function | string;

    /**
     * Defines the symbols to be added in search palette
     */
    ignoreSymbolsOnSearch?: string[];

    /**
     * Defines the content of a symbol
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    getSymbolTemplate?: Function | string;

    /**
     * Defines the width of the symbol
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    symbolWidth?: number;

    /**
     * Defines the height of the symbol
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    symbolHeight?: number;

    /**
     * Defines the space to be left around a symbol
     * @default {left:10,right:10,top:10,bottom:10}
     */
    symbolMargin?: MarginModel;

    /**
     * Defines whether the symbols can be dragged from palette or not
     * @default true
     */
    allowDrag?: boolean;

    /**
     * Defines the size and position of the symbol preview
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    symbolPreview?: SymbolPreviewModel;

    /**
     * Defines the size of a drop symbol
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    symbolDragSize?: SymbolDragSizeModel;

    /**
     * Enables/Disables search option in symbol palette
     * @default false
     */
    enableSearch?: boolean;

    /**
     * Enables/Disables animation when the palette header is expanded/collapsed
     */
    enableAnimation?: boolean;

    /**
     * Defines how many palettes can be at expanded mode at a time
     * @default 'Multiple'
     * @aspDefaultValueIgnore
     * @blazorType Syncfusion.Blazor.Navigations.ExpandMode
     * @blazorDefaultValue Syncfusion.Blazor.Navigations.ExpandMode.Multiple
     * @isEnumeration true
     */
    expandMode?: ExpandMode;

    /**
     * Triggers after the selection changes in the symbol palette
     * @event
     * @blazorProperty 'OnPaletteSelectionChange'
     */
    paletteSelectionChange?: EmitType<IPaletteSelectionChangeArgs>;

    /**
     * Triggers when the icon is expanded
     * @event
     * @blazorProperty 'OnPaletteExpanding'
     */
    paletteExpanding?: EmitType<IPaletteExpandArgs>;

    /**
     * Helps to return the default properties of node
     * @deprecated
     */
    getNodeDefaults?: Function | string;

    /**
     * Helps to return the default properties of node
     * @blazorType DiagramNode
     */
    nodeDefaults?: NodeModel;

    /**
     * Helps to return the default properties of connector
     * @deprecated
     */
    getConnectorDefaults?: Function | string;

    /**
     * Helps to return the default properties of connectors
     * @blazorType DiagramConnector
     */
    connectorDefaults?: ConnectorModel;

}