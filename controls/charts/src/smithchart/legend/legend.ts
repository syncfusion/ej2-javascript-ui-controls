
import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';

import { LegendTitleModel, LegendLocationModel, LegendBorderModel, LegendItemStyleModel} from '../legend/legend-model';
import { SmithchartAlignment } from '../utils/enum';
import { LegendItemStyleBorderModel} from '../legend/legend-model';
import { SmithchartFont } from '../utils/utils';
import { SmithchartFontModel} from '../utils/utils-model';
import { Theme} from '../model/theme';

export class LegendTitle extends  ChildProperty<LegendTitle> {

/**
 * visibility for legend title.
 * @default true
 */
@Property(true)
public visible: boolean;

/**
 * text for legend title.
 * @default ''
 */

@Property('')
public text: string;

/**
 * description for legend title.
 * @default ''
 */
@Property('')
public description: string;

/**
 * alignment for legend title.
 * @default Center
 */

@Property('Center')
public textAlignment: SmithchartAlignment;

/**
 *  options for customizing font
 */


   @Complex<SmithchartFontModel>(Theme.legendLabelFont, SmithchartFont)
   public textStyle: SmithchartFont;

}
export class LegendLocation extends ChildProperty<LegendLocation> {

/**
 * x location for legend.
 * @default 0
 */
@Property(0)
public x: number;

/**
 * y location for legend.
 * @default 0
 */

@Property(0)
public y: number;

}
export class LegendItemStyleBorder extends ChildProperty<LegendItemStyleBorder> {

/**
 * border width for legend item.
 * @default 1
 */
@Property(1)
public width: number;

/**
 * border color for legend item.
 * @default null
 */

@Property(null)
public color: string;

}

export class LegendItemStyle extends ChildProperty<LegendItemStyle> {

/**
 * specify the width for legend item.
 * @default 10
 */
 @Property(10)
public width: number;


/**
 * specify the height for legend item.
 * @default 10
 */
@Property(10)
public height: number;

/**
 *  options for customizing legend item style border
 */

 @Complex<LegendItemStyleBorderModel>({}, LegendItemStyleBorder)
    public border: LegendItemStyleBorderModel;

}

export class LegendBorder extends ChildProperty<LegendBorder> {
    /**
     * border width for legend.
     * @default 1
     */
@Property(1)
public width: number;

/**
 * border color for legend.
 * @default null
 */

@Property(null)
public color: string;


}



export class SmithchartLegendSettings extends ChildProperty<SmithchartLegendSettings> {

/**
 * visibility for legend.
 * @default false
 */
@Property(false)
  public visible: boolean;

  /**
   * position for legend.
   * @default bottom
   */

@Property('bottom')
  public position: string;

  /**
   * alignment for legend.
   * @default Center
   */

  @Property('Center')
  public alignment: SmithchartAlignment;

  /**
   * width for legend.
   * @default null
   */
@Property(null)
public width: number;

/**
 * height for legend.
 * @default null
 */

@Property(null)
public height: number;

  /**
   * shape for legend.
   * @default circle
   */

  @Property('circle')
  public shape: string;

  /**
   * rowCount for legend.
   * @default null
   */

  @Property(null)
  public rowCount: number;

  /**
   * columnCount for legend.
   * @default null
   */

  @Property(null)
  public columnCount: number;

/**
 * spacing between legend item.
 * @default 8
 */
  @Property(8)
  public itemPadding: number;

/**
 * Padding between the legend shape and text.
 * @default 5
 */
    @Property(5)
    public shapePadding: number;

/**
 * description for legend
 * @default ''
 */
@Property('')
public description: string;

/**
 * If set to true, series' visibility collapses based on the legend visibility.
 * @default true
 */
    @Property(true)
    public toggleVisibility: boolean;

   /**
    *  options for customizing legend title
    */


  @Complex<LegendTitleModel>({}, LegendTitle)
    public title: LegendTitleModel;

     /**
      *  options for customizing legend location
      */


    @Complex<LegendLocationModel>({}, LegendLocation)
    public location: LegendLocationModel;

     /**
      *  options for customizing legend item style
      */


    @Complex<LegendItemStyleModel>({}, LegendItemStyle)
    public itemStyle: LegendItemStyleModel;

     /**
      *  options for customizing legend border
      */


   @Complex<LegendBorderModel>({}, LegendBorder)
   public border: LegendBorderModel;

   /**
    *  options for customizing font
    */


   @Complex<SmithchartFontModel>(Theme.legendLabelFont, SmithchartFont)
   public textStyle: SmithchartFont;
}




