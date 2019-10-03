import { Component, Property } from '@syncfusion/ej2-base';import { INotifyPropertyChanged } from '@syncfusion/ej2-base';import { createSvgElement, createHtmlElement, setAttributeSvg } from '../diagram/utility/dom-util';import { Size } from '../diagram/primitives/size';import { IArrangeTickOptions } from './objects/interface/interfaces';import { PointModel } from '../diagram/primitives/point-model';import { getFunction } from '../diagram/utility/base-util';
import {RulerOrientation,TickAlignment} from "./ruler";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Ruler
 */
export interface RulerModel extends ComponentModel{

    /**
     * Defines the unique interval of the ruler.

     */
    interval?: number;

    /**
     * Sets the segment width of the ruler.

     */
    segmentWidth?: number;

    /**
     * Defines the orientation of the ruler.

     */
    orientation?: RulerOrientation;

    /**
     * Defines the alignment of the tick in the ruler.

     */
    tickAlignment?: TickAlignment;

    /**
     * Defines the color of the marker.

     */
    markerColor?: string;

    /**
     * Defines the thickness of the ruler.

     */
    thickness?: number;

    /**
     * Sets the segment width of the ruler.


     */
    arrangeTick?: Function | string;

    /**
     * Defines the length of the ruler.

     */
    length?: number;

}