import { Diagram } from '../diagram/diagram';import { RenderingMode, RealAction } from '../diagram/enum/enum';import { DiagramRenderer } from '../diagram/rendering/renderer';import { CanvasRenderer } from '../diagram/rendering/canvas-renderer';import { INotifyPropertyChanged, Component, Property, Browser, EventHandler, Event, EmitType, isBlazor } from '@syncfusion/ej2-base';import { setAttributeHtml, setAttributeSvg, createHtmlElement, getHTMLLayer } from '../diagram/utility/dom-util';import { createSvgElement, getNativeLayer, hasClass } from '../diagram/utility/dom-util';import { Rect } from '../diagram/primitives/rect';import { Size } from '../diagram/primitives/size';import { PointModel } from '../diagram/primitives/point-model';import { SvgRenderer } from '../diagram/rendering/svg-renderer';import { TransformFactor } from '../diagram/interaction/scroller';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Overview
 */
export interface OverviewModel extends ComponentModel{

    /**
     * Defines the width of the overview
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines the height of the overview
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the ID of the overview
     *
     * @default ''
     */
    sourceID?: string;

    /**
     * Triggers after render the diagram elements
     *
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Object>;

}