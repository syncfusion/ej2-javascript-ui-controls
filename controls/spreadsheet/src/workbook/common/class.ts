import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';
import { FontFamily, TextAlign, VerticalAlign, FontWeight, FontStyle, TextDecoration, HighlightCell } from './enum';
import { ValidationType, ValidationOperator, TopBottom, DataBar, ColorScale, IconSet, CFColor } from './enum';
import { FormatModel, Format } from '../base/index';

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
     * @default []
     */
    @Collection([], Format)
    public format: FormatModel[];

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
