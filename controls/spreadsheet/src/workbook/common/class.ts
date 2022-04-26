import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { FontFamily, TextAlign, VerticalAlign, FontWeight, FontStyle, TextDecoration, HighlightCell, ChartType, ChartTheme, AutoFillType } from './enum';
import { ValidationType, ValidationOperator, TopBottom, DataBar, ColorScale, IconSet, CFColor } from './enum';
import { CellStyleModel, FormatModel, LegendSettingsModel, AxisModel, DataLabelSettingsModel, ChartModel } from './class-model';
import { CellModel } from '../base';
import { LabelPosition, LegendPosition } from './enum';
import { MajorGridLinesModel, MinorGridLinesModel } from './class-model';

/**
 * Represents the cell style.
 */
export class CellStyle extends ChildProperty<CellStyle> {
    /**
     * Specifies font family to the cell.
     *
     * @default 'Calibri'
     * @hidden
     */
    @Property('Calibri')
    public fontFamily: FontFamily;

    /**
     * Specifies vertical align to the cell.
     *
     * @default 'bottom'
     */
    @Property('bottom')
    public verticalAlign: VerticalAlign;

    /**
     * Specifies text align style to the cell.
     *
     * @default 'left'
     */
    @Property('left')
    public textAlign: TextAlign;

    /**
     * Specifies text indent style to the cell.
     *
     * @default '0pt'
     */
    @Property('0pt')
    public textIndent: string;

    /**
     * Specifies font color to the cell.
     *
     * @default '#000000'
     */
    @Property('#000000')
    public color: string;

    /**
     * Specifies background color to the cell.
     *
     * @default '#ffffff'
     */
    @Property('#ffffff')
    public backgroundColor: string;

    /**
     * Specifies font weight to the cell.
     *
     * @default 'normal'
     */
    @Property('normal')
    public fontWeight: FontWeight;

    /**
     * Specifies font style to the cell.
     *
     * @default 'normal'
     */
    @Property('normal')
    public fontStyle: FontStyle;

    /**
     * Specifies font size to the cell.
     *
     * @default '11pt'
     */
    @Property('11pt')
    public fontSize: string;

    /**
     * Specifies text decoration to the cell.
     *
     * @default 'none'
     * @aspIgnore
     */
    @Property('none')
    public textDecoration: TextDecoration;

    /**
     * Specifies border of the cell.
     *
     * @default ''
     */
    @Property('')
    public border: string;

    /**
     * Specifies top border of the cell.
     *
     * @default ''
     */
    @Property('')
    public borderTop: string;

    /**
     * Specifies bottom border of the cell.
     *
     * @default ''
     */
    @Property('')
    public borderBottom: string;

    /**
     * Specifies left border of the cell.
     *
     * @default ''
     */
    @Property('')
    public borderLeft: string;

    /**
     * Specifies right border of the cell.
     *
     * @default ''
     */
    @Property('')
    public borderRight: string;

    /** @hidden */
    public bottomPriority: boolean;
}

/**
 * Represents the Filter Collection.
 *
 */
export class FilterCollection extends ChildProperty<FilterCollection> {
    /**
     * Specifies the sheet index of the filter collection.
     *
     * @default null
     */
    @Property()
    public sheetIndex: number;

    /**
     * Specifies the range of the filter collection.
     *
     * @default []
     */
    @Property()
    public filterRange: string;

    /**
     * Specifies the sheet has filter or not.
     *
     * @default false
     */
    @Property(false)
    public hasFilter: boolean;

    /**
     * Specifies the filtered column collection.
     *
     * @default []
     */
    @Property()
    public column: number[];

    /**
     * Specifies the condition for column filtering.
     *
     * @default []
     */
    @Property()
    public criteria: string[];

    /**
     * Specifies the value for column filtering.
     *
     * @default []
     */
    @Property()
    public value: (string | number | boolean | Date)[];

    /**
     * Specifies the data type of column filtering.
     *
     * @default []
     */
    @Property()
    public dataType: string[];

    /**
     * Specifies the predicate type of column filtering.
     *
     * @default []
     */
    @Property()
    public predicates: string[];
}

/**
 * Represents the sort Collection.
 *
 */
export class SortCollection extends ChildProperty<SortCollection> {

    /**
     * Specifies the range of the sort collection.
     *
     */
    @Property()
    public sortRange: string;

    /**
     * Specifies the sorted column collection.
     *
     */
    @Property()
    public columnIndex: number;

    /**
     * Specifies the order for sorting.
     *
     */
    @Property()
    public order: string;

    /**
     * Specifies the order for sorting.
     *
     */
    @Property()
    public sheetIndex: number;

}

/**
 * Represents the DefineName.
 */
export class DefineName extends ChildProperty<DefineName> {
    /**
     * Specifies name for the defined name, which can be used in formula.
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Specifies scope for the defined name.
     *
     * @default ''
     */
    @Property('')
    public scope: string;

    /**
     * Specifies comment for the defined name.
     *
     * @default ''
     */
    @Property('')
    public comment: string;

    /**
     * Specifies reference for the defined name.
     *
     * @default ''
     */
    @Property('')
    public refersTo: string;
}

/**
 * Configures the Protect behavior for the spreadsheet.
 *
 */
export class ProtectSettings extends ChildProperty<ProtectSettings> {
    /**
     * Specifies to allow selection in spreadsheet.
     *
     * @default false
     */
    @Property(false)
    public selectCells: boolean;

    /**
     * Specifies to allow selection only for unlocked cells in spreadsheet.
     *
     * @default false
     */
    @Property(false)
    public selectUnLockedCells: boolean;

    /**
     * specifies to allow formating in cells.
     *
     * @default false
     */
    @Property(false)
    public formatCells: boolean;

    /**
     * Specifies to allow format rows in spreadsheet.
     *
     * @default false
     */
    @Property(false)
    public formatRows: boolean;

    /**
     * Specifies to allow format columns in spreadsheet.
     *
     * @default false
     */
    @Property(false)
    public formatColumns: boolean;

    /**
     * Specifies to allow insert Hyperlink in Spreadsheet.
     *
     * @default false
     */
    @Property(false)
    public insertLink: boolean;
}


/**
 * Represents the Hyperlink.
 *
 */
export class Hyperlink extends ChildProperty<Hyperlink> {
    /**
     * Specifies Hyperlink Address.
     *
     * @default ''
     */
    @Property('')
    public address: string;

}

/**
 * Represents the DataValidation.
 */
export class Validation extends ChildProperty<Validation> {
    /**
     * Specifies Validation Type.
     *
     * @default 'WholeNumber'
     */
    @Property('WholeNumber')
    public type: ValidationType;

    /**
     * Specifies Validation Operator.
     *
     * @default 'Between'
     */
    @Property('Between')
    public operator: ValidationOperator;

    /**
     * Specifies Validation Minimum Value.
     *
     * @default ''
     */
    @Property('0')
    public value1: string;

    /**
     * Specifies Validation Maximum Value.
     *
     * @default ''
     */
    @Property('0')
    public value2: string;

    /**
     * Specifies IgnoreBlank option in Data Validation.
     *
     * @default true
     */
    @Property(true)
    public ignoreBlank: boolean;

    /**
     * Specifies InCellDropDown option in Data Validation.
     *
     * @default true
     */
    @Property(true)
    public inCellDropDown: boolean;

    /**
     * specifies to allow Highlight Invalid Data.
     *
     * @default false
     */
    @Property(false)
    public isHighlighted: boolean;

    /**
     * Specifies address for validation within the same column.
     *
     * @default ''
     * @hidden
     */
    @Property('')
    public address: string;
}

/**
 * Represents the Format.
 */
export class Format extends ChildProperty<FormatModel> {
    /**
     * Specifies the number format code to display value in specified number format.
     *
     * @default 'General'
     */
    @Property('General')
    public format: string;

    /**
     * Specifies the cell style options.
     *
     * @default {}
     */
    @Complex<CellStyleModel>({}, CellStyle)
    public style: CellStyleModel;

    /**
     * Specifies the range is locked or not, for allow edit range in spreadsheet protect option.
     *
     * @default true
     */
    @Property(true)
    public isLocked: boolean;
}

/**
 * Represents the Conditional Formatting.
 *
 */
export class ConditionalFormat extends ChildProperty<ConditionalFormat> {
    /**
     * Specifies Conditional formatting Type.
     *
     * @default 'GreaterThan'
     * @aspIgnore
     */
    @Property('GreaterThan')
    public type: HighlightCell | TopBottom | DataBar | ColorScale | IconSet;

    /**
     * Specifies format.
     *
     * @default {}
     */
    @Complex<FormatModel>({}, Format)
    public format: FormatModel;

    /**
     * Specifies Conditional formatting Highlight Color.
     *
     * @default 'RedFT'
     */
    @Property('RedFT')
    public cFColor: CFColor;

    /**
     * Specifies Conditional formatting Value.
     *
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Specifies Conditional formatting range.
     *
     * @default ''
     */
    @Property('')
    public range: string;
}

/**
 * Represents the Legend.
 *
 */
export class LegendSettings extends ChildProperty<ChartModel> {
    /**
     * If set to true, legend will be visible.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Position of the legend in the chart are,
     * * Auto: Places the legend based on area type.
     * * Top: Displays the legend at the top of the chart.
     * * Left: Displays the legend at the left of the chart.
     * * Bottom: Displays the legend at the bottom of the chart.
     * * Right: Displays the legend at the right of the chart.
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public position: LegendPosition;

}

/**
 * Represents the DataLabelSettings.
 *
 */
export class DataLabelSettings extends ChildProperty<ChartModel> {
    /**
     * If set true, data label for series renders.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Specifies the position of the data label. They are,
     * * Outer: Positions the label outside the point.
     * * top: Positions the label on top of the point.
     * * Bottom: Positions the label at the bottom of the point.
     * * Middle: Positions the label to the middle of the point.
     * * Auto: Positions the label based on series.
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public position: LabelPosition;
}

/**
 * Specifies the major grid lines in the `axis`.
 *
 */
export class MajorGridLines extends ChildProperty<AxisModel> {

    /**
     * The width of the line in pixels.
     *
     * @default 0
     */
    @Property(0)
    public width: number;

}

/**
 * Specifies the minor grid lines in the `axis`.
 *
 */
export class MinorGridLines extends ChildProperty<AxisModel> {

    /**
     * The width of the line in pixels.
     *
     * @default 0
     */
    @Property(0)
    public width: number;

}


/**
 * Represents the axis.
 *
 */
export class Axis extends ChildProperty<ChartModel> {

    /**
     * Specifies the title of an axis.
     *
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Options for customizing major grid lines.
     *
     * @default {}
     */
    @Complex<MajorGridLinesModel>({}, MajorGridLines)
    public majorGridLines: MajorGridLinesModel;

    /**
     * Options for customizing minor grid lines.
     *
     * @default {}
     */
    @Complex<MinorGridLinesModel>({}, MinorGridLines)
    public minorGridLines: MinorGridLinesModel;

    /**
     * If set to true, axis label will be visible.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
}


/**
 * Represents the Chart.
 */
export class Chart extends ChildProperty<CellModel> {
    /**
     * Specifies the type of a chart.
     *
     * @default 'Line'
     */
    @Property('Line')
    public type: ChartType;

    /**
     * Specifies the theme of a chart.
     *
     * @default 'Material'
     */
    @Property('Material')
    public theme: ChartTheme;

    /**
     * Specifies to switch the row or a column.
     *
     * @default false
     */
    @Property(false)
    public isSeriesInRows: boolean;

    /**
     * Specifies the selected range or specified range.
     *
     * @default ''
     */
    @Property('')
    public range: string;

    /**
     * Specifies chart element id.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Title of the chart
     *
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Specifies the height of the chart.
     *
     * @default 290
     */
    @Property(290)
    public height: number;

    /**
     * Specifies the width of the chart.
     *
     * @default 480
     */
    @Property(480)
    public width: number;

    /**
     * Specifies the top position of the chart.
     *
     * @default 0
     * @hidden
     */
    @Property(0)
    protected top: number;

    /**
     * Specifies the left side of the chart.
     *
     * @default 0
     * @hidden
     */
    @Property(0)
    protected left: number;

    /**
     * Options for customizing the legend of the chart.
     *
     * @default {}
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;

    /**
     * Options to configure the horizontal axis.
     *
     * @default {}
     */
    @Complex<AxisModel>({}, Axis)
    public primaryXAxis: AxisModel;

    /**
     * Options to configure the vertical axis.
     *
     * @default {}
     */
    @Complex<AxisModel>({}, Axis)
    public primaryYAxis: AxisModel;

    /**
     * The data label for the series.
     *
     * @default {}
     */
    @Complex<DataLabelSettingsModel>({}, DataLabelSettings)
    public dataLabelSettings: DataLabelSettingsModel;

}

/**
 * Represents the Image.
 */
export class Image extends ChildProperty<CellModel> {
    /**
     * Specifies the image source.
     *
     * @default ''
     */
    @Property('')
    public src: string;

    /**
     * Specifies image element id.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies the height of the image.
     *
     * @default 300
     * @asptype int
     */
    @Property(300)
    public height: number;

    /**
     * Specifies the width of the image.
     *
     * @default 400
     * @asptype int
     */
    @Property(400)
    public width: number;

    /**
     * Specifies the height of the image.
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public top: number;

    /**
     * Specifies the width of the image.
     *
     * @default 0
     * @asptype int
     */
    @Property(0)
    public left: number;
}

/**
 * Represents the AutoFillSettings.
 */
export class AutoFillSettings extends ChildProperty<AutoFillSettings> {
    /**
     * Specifies the auto fill settings. The possible values are
     *
     * * CopyCells: To update the copied cells of the selected range.
     * * FillSeries: To update the filled series of the selected range.
     * * FillFormattingOnly: To fill the formats only for the selected range.
     * * FillWithoutFormatting: To fill without the format of the selected range.
     *
     * @default 'FillSeries'
     */
    @Property('FillSeries')
    public fillType: AutoFillType;

    /**
     * Specifies whether fill options need to shown or not.
     *
     * @default true
     */
    @Property(true)
    public showFillOptions: boolean;
}

