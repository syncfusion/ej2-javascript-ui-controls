import { Component, Property } from '@syncfusion/ej2-base';import { INotifyPropertyChanged } from '@syncfusion/ej2-base';import { createSvgElement, createHtmlElement, setAttributeSvg } from '../diagram/utility/dom-util';import { Size } from '../diagram/primitives/size';import { IArrangeTickOptions } from './objects/interface/interfaces';import { PointModel } from '../diagram/primitives/point-model';import { getFunction } from '../diagram/utility/base-util';
import {RulerOrientation,TickAlignment} from "./ruler";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Ruler
 */
export interface RulerModel extends ComponentModel{

    /**
     * Defines the unique interval of the ruler.
     * @default 5
     */
    interval?: number;

    /**
     * Sets the segment width of the ruler.
     * @default 100
     */
    segmentWidth?: number;

    /**
     * Defines the orientation of the ruler.
     * @default 'Horizontal'
     */
    orientation?: RulerOrientation;

    /**
     * Defines the alignment of the tick in the ruler.
     * @default 'RightOrBottom'
     */
    tickAlignment?: TickAlignment;

    /**
     * Defines the color of the marker.
     * @default 'red'
     */
    markerColor?: string;

    /**
     * Defines the thickness of the ruler.
     * @default 25
     */
    thickness?: number;

    /**
     * Sets the segment width of the ruler.
     * @default null
     * @deprecated
     */
    arrangeTick?: Function | string;

    /**
     * Defines the length of the ruler.
     * @default 400
     */
    length?: number;

}