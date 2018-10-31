import { Property, Complex, ChildProperty} from '@syncfusion/ej2-base';

import { SeriesMarkerModel, SeriesMarkerBorderModel} from '../series/series-model';
import { SeriesMarkerDataLabelModel, SeriesMarkerDataLabelBorderModel} from '../series/series-model';
import {SeriesMarkerDataLabelConnectorLineModel} from '../series/series-model';
import {SeriesTooltipBorderModel, SeriesTooltipModel} from '../series/series-model';

import { SmithchartFont} from '../utils/utils';
import { SmithchartFontModel} from '../utils/utils-model';
import { Theme } from '../model/theme';

export class SeriesTooltipBorder extends ChildProperty<SeriesTooltipBorder> {

/**
 * border width  for tooltip.
 * @default 1
 */
  @Property(1)
public width: number;

/**
 * border color for tooltip
 * @default null
 */
@Property(null)
public color: string;

}
export class SeriesTooltip extends ChildProperty<SeriesTooltip> {


/**
 * visibility of tooltip.
 * @default false
 */
@Property(false)
public visible: boolean;

/**
 * color for tooltip .
 * @default null
 */
 @Property(null)
    public fill: string;
/**
 * opacity for tooltip.
 * @default 0.95
 */
     @Property(0.95)
    public opacity: number;

 /**
  * template for tooltip
  * @default ''
  */
    @Property('')
    public template: string;

    /**
     *  options for customizing tooltip border
     */

    @Complex<SeriesTooltipBorderModel>({}, SeriesTooltipBorder)
    public border: SeriesTooltipBorderModel;

}
export class SeriesMarkerBorder extends ChildProperty<SeriesMarkerBorder> {
/**
 * border width for marker border.
 * @default 3
 */
  @Property(3)
public width: number;

/**
 * border color for marker border.
 * @default white
 */
@Property('white')
public color: string;

}

export class SeriesMarkerDataLabelBorder extends ChildProperty <SeriesMarkerDataLabelBorder> {

/**
 * border width for data label border.
 * @default 0.1
 */
 @Property(0.1)
public width: number;
/**
 * border color for data label color.
 * @default white
 */
@Property('white')
public color: string;

}
export class SeriesMarkerDataLabelConnectorLine extends ChildProperty <SeriesMarkerDataLabelConnectorLine> {
/**
 * border width for data label connector line.
 * @default 1
 */
 @Property(1)
public width: number;
/**
 * border color for data label connector line.
 * @default null
 */
@Property(null)
public color: string;

}

export class SeriesMarkerDataLabel extends ChildProperty<SeriesMarkerDataLabel> {
/**
 * visibility for data label.
 * @default false
 */
@Property(false)
public visible: boolean;

/**
 * showing template for data label template
 * @default ''
 */
@Property('')
public template: string;
/**
 * color for data label.
 * @default null
 */
 @Property(null)
    public fill: string;
/**
 * opacity for data label.
 * @default 1
 */
     @Property(1)
    public opacity: number;
/**
 *  options for customizing data label border
 */
    @Complex<SeriesMarkerDataLabelBorderModel>({}, SeriesMarkerDataLabelBorder)
    public border: SeriesMarkerDataLabelBorderModel;
/**
 *  options for customizing data label connector line
 */
     @Complex<SeriesMarkerDataLabelConnectorLineModel>({}, SeriesMarkerDataLabelConnectorLine)
    public connectorLine: SeriesMarkerDataLabelConnectorLineModel;
/**
 *  options for customizing font
 */


   @Complex<SmithchartFontModel>(Theme.dataLabelFont, SmithchartFont)
   public textStyle: SmithchartFontModel;

}
export class SeriesMarker extends ChildProperty<SeriesMarker> {

/**
 * visibility for marker.
 * @default false
 */
@Property(false)
public visible: boolean;

/**
 * shape for marker.
 * @default circle
 */
@Property('circle')
    public shape: string;

/**
 * width for marker.
 * @default 6
 */
@Property(6)
public width: number;

/**
 * height for marker.
 * @default 6
 */
@Property(6)
public height: number;
/**
 * Url for the image that is to be displayed as marker
 * @default ''
 */

    @Property('')
    public imageUrl: string;
/**
 * color for marker.
 * @default ''
 */
    @Property('')
    public fill: string;
/**
 * opacity for marker.
 * @default 1
 */
     @Property(1)
    public opacity: number;


    /**
     *  options for customizing marker border
     */

 @Complex<SeriesMarkerBorderModel>({}, SeriesMarkerBorder)
    public border: SeriesMarkerBorderModel;
/**
 *  options for customizing marker data label 
 */
@Complex<SeriesMarkerDataLabelModel>({}, SeriesMarkerDataLabel)
    public dataLabel: SeriesMarkerDataLabelModel;

}
export class SmithchartSeries extends ChildProperty<SmithchartSeries> {
/**
 * visibility for series.
 * @default visible
 */
 @Property('visible')
    public visibility: string;
/**
 * points for series.
 * @default []
 */
@Property([])
public points: { resistance: number,  reactance: number}[];

/**
 * resistance name for dataSource
 * @default ''
 */

@Property('')
public resistance: string;

/**
 * reactance name for dataSource
 * @default ''
 */

@Property('')
public reactance: string;
/**
 *  Specifies the dataSource
 * @default null
 */

@Property(null)
public dataSource: Object;

/**
 * The name of the series visible in legend.
 * @default ''
 */

    @Property('')
    public name: string;
/**
 * color for series.
 * @default null
 */
@Property(null)
    public fill: string;

/**
 * enable or disable the animation of series.
 * @default false
 */
    @Property(false)
    public enableAnimation: boolean;

/**
 * perform animation of series based on animation duration.
 * @default 2000ms
 */
    @Property('2000ms')
    public animationDuration: string;
/**
 * avoid the overlap of dataLabels.
 * @default false
 */
    @Property(false)
    public enableSmartLabels: boolean;
/**
 * width for series.
 * @default 1
 */
     @Property(1)
    public width: number;
/**
 * opacity for series.
 * @default 1
 */
     @Property(1)
    public opacity: number;

/**
 *  options for customizing marker
 */
     @Complex<SeriesMarkerModel>({}, SeriesMarker)
    public marker: SeriesMarkerModel;

/**
 *  options for customizing tooltip
 */
   @Complex<SeriesTooltipModel>({}, SeriesTooltip)
    public tooltip: SeriesTooltipModel;

}