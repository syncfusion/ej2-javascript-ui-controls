import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { FontFamily, TextAlign, VerticalAlign, FontWeight, FontStyle, TextDecoration, HighlightCell, chartType, chartTheme } from './enum';
import { ValidationType, ValidationOperator, TopBottom, DataBar, ColorScale, IconSet, CFColor } from './enum';
import { CellStyleModel, FormatModel } from './class-model';
import { CellModel } from '../base';

/**
 * Represents the cell style.
 */
export class CellStyle extends ChildProperty<CellStyle> {
    /**
     * Specifies font family to the cell.
     * @default 'Calibri'
     */
    @Property('Calibri')
    public fontFamily: FontFamily;

    /**
     * Specifies vertical align to the cell.
     * @default 'bottom'
     */
    @Property('bottom')
    public verticalAlign: VerticalAlign;

    /**
     * Specifies text align style to the cell.
     * @default 'left'
     */
    @Property('left')
    public textAlign: TextAlign;

    /**
     * Specifies text indent style to the cell.
     * @default '0pt'
     */
    @Property('0pt')
    public textIndent: string;

    /**
     * Specifies font color to the cell.
     * @default '#000000'
     */
    @Property('#000000')
    public color: string;

    /**
     * Specifies background color to the cell.
     * @default '#ffffff'
     */
    @Property('#ffffff')
    public backgroundColor: string;

    /**
     * Specifies font weight to the cell.
     * @default 'normal'
     */
    @Property('normal')
    public fontWeight: FontWeight;

    /**
     * Specifies font style to the cell.
     * @default 'normal'
     */
    @Property('normal')
    public fontStyle: FontStyle;

    /**
     * Specifies font size to the cell.
     * @default '11pt'
     */
    @Property('11pt')
    public fontSize: string;

    /**
     * Specifies text decoration to the cell.
     * @default 'none'
     * @aspIgnore
     */
    @Property('none')
    public textDecoration: TextDecoration;

    /**
     * Specifies border of the cell.
     * @default ''
     */
    @Property('')
    public border: string;

    /**
     * Specifies top border of the cell.
     * @default ''
     */
    @Property('')
    public borderTop: string;

    /**
     * Specifies bottom border of the cell.
     * @default ''
     */
    @Property('')
    public borderBottom: string;

    /**
     * Specifies left border of the cell.
     * @default ''
     */
    @Property('')
    public borderLeft: string;

    /**
     * Specifies right border of the cell.
     * @default ''
     */
    @Property('')
    public borderRight: string;

    /** @hidden */
    public bottomPriority: boolean;
}

/**    
 * Represents the DefineName.
 */
export class DefineName extends ChildProperty<DefineName> {
    /**
     * Specifies name for the defined name, which can be used in formula.
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Specifies scope for the defined name.
     * @default ''
     */
    @Property('')
    public scope: string;

    /**
     * Specifies comment for the defined name.
     * @default ''
     */
    @Property('')
    public comment: string;

    /**
     * Specifies reference for the defined name.
     * @default ''
     */
    @Property('')
    public refersTo: string;
}

/**
 * Configures the Protect behavior for the spreadsheet.
 */
export class ProtectSettings extends ChildProperty<ProtectSettings> {
    /**
     * specifies to allow selection in spreadsheet.
     * @default false
     */
    @Property(false)
    public selectCells: boolean;

    /**
     * specifies to allow formating in cells.
     * @default false
     */
    @Property(false)
    public formatCells: boolean;

    /**
     * specifies to allow format rows in spreadsheet.
     * @default false
     */
    @Property(false)
    public formatRows: boolean;

    /**
     * Specifies to allow format columns in spreadsheet.
     * @default false
     */
    @Property(false)
    public formatColumns: boolean;

    /**
     * Specifies to allow insert Hyperlink in Spreadsheet.
     * @default false
     */
    @Property(false)
    public insertLink: boolean;
}


/**    
 * Represents the Hyperlink.
 */
export class Hyperlink extends ChildProperty<Hyperlink> {
    /**
     * Specifies Hyperlink Address.
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
     * @default 'WholeNumber'
     */
    @Property('WholeNumber')
    public type: ValidationType;

    /**
     * Specifies Validation Operator.
     * @default 'Between'
     */
    @Property('Between')
    public operator: ValidationOperator;

    /**
     * Specifies Validation Minimum Value.
     * @default ''
     */
    @Property('0')
    public value1: string;

    /**
     * Specifies Validation Maximum Value.
     * @default ''
     */
    @Property('0')
    public value2: string;

    /**
     * Specifies IgnoreBlank option in Data Validation.
     * @default true
     */
    @Property(true)
    public ignoreBlank: boolean;

    /**
     * Specifies InCellDropDown option in Data Validation.
     * @default true
     */
    @Property(true)
    public inCellDropDown: boolean;

    /**
     * specifies to allow Highlight Invalid Data.
     * @default false
     */
    @Property(false)
    public isHighlighted: boolean;

}

/**
 * Represents the Format.
 */
export class Format extends ChildProperty<FormatModel> {
    /**
     * Specifies the number format code to display value in specified number format.
     * @default 'General'
     */
    @Property('General')
    public format: string;

    /**
     * Specifies the cell style options.
     * @default {}
     */
    @Complex<CellStyleModel>({}, CellStyle)
    public style: CellStyleModel;

    /**
     * Specifies the range is locked or not, for allow edit range in spreadsheet protect option.
     * @default true
     */
    @Property(true)
    public isLocked: boolean;
}

/**    
 * Represents the Conditional Formatting.
 */
export class ConditionalFormat extends ChildProperty<ConditionalFormat> {
    /**
     * Specifies Conditional formatting Type.
     * @default 'GreaterThan'
     * @aspIgnore
     */
    @Property('GreaterThan')
    public type: HighlightCell | TopBottom | DataBar | ColorScale | IconSet;

    /**
     * Specifies format.
     * @default {}
     */
    @Complex<FormatModel>({}, Format)
    public format: FormatModel;

    /**
     * Specifies Conditional formatting Highlight Color.
     * @default 'RedFT'
     */
    @Property('RedFT')
    public cFColor: CFColor;

    /**
     * Specifies Conditional formatting Value.
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Specifies Conditional formatting range.
     * @default ''
     */
    @Property('')
    public range: string;
}

/**
 * Represents the Chart.
 */
export class Chart extends ChildProperty<CellModel> {
    /**
     * Specifies the type of a chart.
     * @default 'Line'
     */
    @Property('Line')
    public type: chartType;

    /**
     * Specifies the theme of a chart.
     * @default 'Material'
     */
    @Property('Material')
    public theme: chartTheme;

    /**
     * Specifies to switch the row or a column.
     * @default false
     */
    @Property(false)
    public isSeriesInRows: boolean;

    /**
     * Specifies the selected range or specified range.
     * @default ''
     */
    @Property('')
    public range: string;

    /**
     * Specifies chart element id.
     * @default ''
     */
    @Property('')
    public id: string;
}

/**
 * Represents the Image.
 */
export class Image extends ChildProperty<CellModel> {
    /**
     * Specifies the image source.
     * @default ''
     */
    @Property('')
    public src: string;

    /**
     * Specifies image element id.
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies the height of the image.
     * @default 300
     * @asptype int
     */
    @Property(300)
    public height: number;

    /**
     * Specifies the width of the image.
     * @default 400
     * @asptype int
     */
    @Property(400)
    public width: number;

    /**
     * Specifies the height of the image.
     * @default 0
     * @asptype int
     */
    @Property(0)
    public top: number;

    /**
     * Specifies the width of the image.
     * @default 0
     * @asptype int
     */
    @Property(0)
    public left: number;
}
