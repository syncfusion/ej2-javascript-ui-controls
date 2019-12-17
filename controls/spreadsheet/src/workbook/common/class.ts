import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { FontFamily, TextAlign, VerticalAlign, FontWeight, FontStyle, TextDecoration } from './enum';


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
