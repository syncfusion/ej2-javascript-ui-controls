import { Property, ChildProperty, Collection, getEnumValue, compile, DateFormatOptions, NumberFormatOptions } from '@syncfusion/ej2-base';
import { Internationalization } from '@syncfusion/ej2-base';
import { AggregateColumnModel } from './summary-model';
import { CustomSummaryType, AggregateType, CellType } from '@syncfusion/ej2-grids';
/**
 * Configures the TreeGrid's aggregate column.
 */
export class AggregateColumn extends ChildProperty<AggregateColumn> {

  private formatFn: Function;

  private intl: Internationalization = new Internationalization();

  private templateFn: { [x: string]: { fn: Function, property: string } } = {};
  /**
   * Defines the aggregate type of a particular column.
   * To use multiple aggregates for single column, specify the `type` as array.
   * Types of aggregate are,
   * * sum
   * * average
   * * max
   * * min
   * * count
   * * falsecount
   * * truecount
   * * custom  
   * > Specify the `type` value as `custom` to use custom aggregation.
   * @aspType string
   * @default null
   */
  @Property()
  public type: AggregateType | AggregateType[] | string;
  /**
   * Defines the footer cell template as a string for the aggregate column.
   * The `type` name should be used to access aggregate values inside the template.
   * 
   * {% codeBlock src="grid/footer-template-api/index.ts" %}{% endcodeBlock %}
   * @default null
   */
  @Property()
  public footerTemplate: string;
  /**
   * Defines the column name to perform aggregation.
   * @default null
   */
  @Property()
  public field: string;
  /**    
   * Format is applied to a calculated value before it is displayed.
   * Gets the format from the user, which can be standard or custom
   * [`number`](../common/intl.html#number-formatter-and-parser)
   * and [`date`](../common/intl.html#date-formatter-and-parser) formats.
   * @aspType string
   * @default null    
   */
  @Property()
    public format: string | NumberFormatOptions | DateFormatOptions;
  /**
   * Defines the column name to display the aggregate value. If `columnName` is not defined,
   * then `field` name value will be assigned to the `columnName` property.
   * @default null
   */
  @Property()
  public columnName: string;
  /**
   * Defines a function to calculate custom aggregate value. The `type` value should be set to `custom`.
   * To use custom aggregate value in the template, use the key as `${custom}`.
   * **Total aggregation**: The custom function will be called with the whole data and the current `AggregateColumn` object.
   * **Group aggregation**: This will be called with the current group details and the `AggregateColumn` object.
   * 
   * @default null
   */
   @Property()
   public customAggregate: CustomSummaryType | string;

   /**
    * @hidden
    */
   public setFormatter(cultureName: string): void {
     if (this.format && ((<DateFormatOptions>this.format).skeleton || (<DateFormatOptions>this.format).format)) {
        this.formatFn = this.getFormatFunction(this.format as DateFormatOptions);
     }
   }

  /**
   * @hidden
   */
   public getFormatFunction(format: NumberFormatOptions | DateFormatOptions): Function {
     if ((<DateFormatOptions>format).type) {
         return this.intl.getDateFormat(<DateFormatOptions>format);
     } else {
        return this.intl.getNumberFormat(<DateFormatOptions>format);
     }
  }

/**
 * @hidden
 */
   public getFormatter(): Function {
     return this.formatFn;
   }

   /**
    * @hidden
    */
   public setTemplate(helper: Object = {}): void {
    if (this.footerTemplate !== undefined) {
        this.templateFn[getEnumValue(CellType, CellType.Summary)] = { fn: compile(this.footerTemplate, helper),
            property: 'footerTemplate' };

    }
  }
  /**
   * @hidden
   */
  public getTemplate(type: CellType): { fn: Function, property: string } {
    return this.templateFn[getEnumValue(CellType, type)];
  }

  /**
   * @hidden
   */
  public setPropertiesSilent(prop: Object): void {
    this.setProperties(prop, true);
  }

}


export class AggregateRow extends ChildProperty<AggregateRow> {

  /**
   * Configures the aggregate columns. 
   * @default []
   */
  @Collection<AggregateColumnModel>([], AggregateColumn)
  public columns: AggregateColumnModel[];

  /**
   * Display the childSummary for each parent.
   */
  @Property(true)
  public showChildSummary: boolean;
}





