import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';
import { SmithchartFont} from '../utils/utils';
import { AxisLabelPosition, SmithchartLabelIntersectAction} from '../utils/enum';
import { SmithchartFontModel} from '../utils/utils-model';
import { SmithchartMajorGridLinesModel, SmithchartMinorGridLinesModel, SmithchartAxisLineModel  } from '../axis/axis-model';
import { Theme} from '../model/theme';

/**   
 * Configures the major Grid lines in the `axis`.    
 */
export class SmithchartMajorGridLines extends ChildProperty<SmithchartMajorGridLines> {

   /**
    * width of the major grid lines

    */
    @Property(1)
    public width: number;

    /**
     * The dash array of the major grid lines.

     */

    @Property('')
    public dashArray: string;

    /**
     * visibility of  major grid lines.

     */

    @Property(true)
    public visible: boolean;

    /**
     * option for customizing the majorGridLine color

     */

    @Property(null)
    public color: string;


    /**
     * opacity of  major grid lines.

     */

    @Property(1)
    public opacity: number;
}

/**   
 * Configures the major grid lines in the `axis`.    
 */
export class SmithchartMinorGridLines extends ChildProperty<SmithchartMinorGridLines> {

    /**
     * width of the minor grid lines

     */
    @Property(1)
    public width: number;

    /**
     * The dash array of the minor grid lines.

     */

    @Property('')
    public dashArray: string;

    /**
     * visibility of  minor grid lines.

     */

    @Property(false)
    public visible: boolean;

    /**
     * option for customizing the minorGridLine color

     */

    @Property(null)
    public color: string;


    /**
     * count of  minor grid lines.

     */
    @Property(8)
    public count: number;
}

/**   
 * Configures the axis lines in the `axis`.    
 */
export class SmithchartAxisLine extends ChildProperty<SmithchartAxisLine> {
    /**
     * visibility of  axis line.

     */
   @Property(true)
   public visible: boolean;

   /**
    * width of the axis lines

    */
   @Property(1)
    public width: number;

    /**
     * option for customizing the axisLine color

     */

    @Property(null)
    public color: string;


    /**
     * The dash array of the axis line.

     */

   @Property('')
    public dashArray: string;

}

export class SmithchartAxis extends ChildProperty<SmithchartAxis> {
    /**
     * visibility of  axis.

     */
  @Property(true)
  public visible: boolean;

    /**
     * position of  axis line.

     */

  @Property('Outside')
  public labelPosition: AxisLabelPosition;

    /**
     * axis labels will be hide when overlap with each other.

     */
  @Property('Hide')
  public labelIntersectAction: SmithchartLabelIntersectAction;

    /**
     * Options for customizing major grid lines.
     */
   @Complex<SmithchartMajorGridLinesModel>({}, SmithchartMajorGridLines)
    public majorGridLines: SmithchartMajorGridLinesModel;

    /**
     * Options for customizing minor grid lines.
     */

    @Complex<SmithchartMinorGridLinesModel>({}, SmithchartMinorGridLines)
    public minorGridLines: SmithchartMinorGridLinesModel;

    /**
     * Options for customizing axis lines.
     */

    @Complex<SmithchartAxisLineModel>({}, SmithchartAxisLine)
    public axisLine: SmithchartAxisLineModel;

    /**
     * Options for customizing font.
     */

    @Complex<SmithchartFontModel>(Theme.axisLabelFont, SmithchartFont)
    public labelStyle: SmithchartFontModel;

}

 