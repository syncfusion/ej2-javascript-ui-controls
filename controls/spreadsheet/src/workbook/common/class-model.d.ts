import { ChildProperty, Property } from '@syncfusion/ej2-base';import { FontFamily, TextAlign, VerticalAlign, FontWeight, FontStyle, TextDecoration } from './enum';

/**
 * Interface for a class CellStyle
 */
export interface CellStyleModel {

    /**
     * Specifies font family to the cell.
     * @default 'Calibri'
     */
    fontFamily?: FontFamily;

    /**
     * Specifies vertical align to the cell.
     * @default 'bottom'
     */
    verticalAlign?: VerticalAlign;

    /**
     * Specifies text align style to the cell.
     * @default 'left'
     */
    textAlign?: TextAlign;

    /**
     * Specifies text indent style to the cell.
     * @default '0pt'
     */
    textIndent?: string;

    /**
     * Specifies font color to the cell.
     * @default '#000000'
     */
    color?: string;

    /**
     * Specifies background color to the cell.
     * @default '#ffffff'
     */
    backgroundColor?: string;

    /**
     * Specifies font weight to the cell.
     * @default 'normal'
     */
    fontWeight?: FontWeight;

    /**
     * Specifies font style to the cell.
     * @default 'normal'
     */
    fontStyle?: FontStyle;

    /**
     * Specifies font size to the cell.
     * @default '11pt'
     */
    fontSize?: string;

    /**
     * Specifies text decoration to the cell.
     * @default 'none'
     * @aspIgnore
     */
    textDecoration?: TextDecoration;

}

/**
 * Interface for a class DefineName
 */
export interface DefineNameModel {

    /**
     * Specifies name for the defined name, which can be used in formula.
     * @default ''
     */
    name?: string;

    /**
     * Specifies scope for the defined name.
     * @default ''
     */
    scope?: string;

    /**
     * Specifies comment for the defined name.
     * @default ''
     */
    comment?: string;

    /**
     * Specifies reference for the defined name.
     * @default ''
     */
    refersTo?: string;

}

/**
 * Interface for a class Hyperlink
 */
export interface HyperlinkModel {

    /**
     * Specifies Hyperlink Address.
     * @default ''
     */
    address?: string;

}