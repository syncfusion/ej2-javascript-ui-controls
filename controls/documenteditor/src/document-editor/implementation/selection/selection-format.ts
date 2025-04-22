import { Selection } from './selection';
import {
    TextAlignment, Underline, HighlightColor, BaselineAlignment, WidthType, Strikethrough, LineSpacingType,
    CellVerticalAlignment, HeightType, TableAlignment, BiDirectionalOverride, FootEndNoteNumberFormat,
    FootnoteRestartIndex,
    FontScriptType,
    HeaderFooterType,
    OutlineLevel
} from '../../base/types';
import {
    WSectionFormat, WCharacterFormat, WParagraphFormat, WTableFormat, WRowFormat, WCellFormat, WShading, WColumnFormat
} from '../format/index';
import { DocumentHelper, HelperMethods, PageLayoutViewer } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TableWidget, ImageElementBox, ListTextElementBox, HeaderFooterWidget, HeaderFooters } from '../viewer/page';
import { Editor } from '../index';
import { EditorHistory } from '../editor-history/index';
import { ModifiedLevel } from '../editor-history/history-helper';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WLevelOverride } from '../list/level-override';
import { Dictionary } from '../../base/dictionary';
import { LineStyle } from '../../base/types';
import { WBorder, WBorders } from '../../implementation/format';
/* eslint-disable */
/**
 * Selection character format implementation
 */
export class SelectionCharacterFormat {
    /**
     * @private
     */
    public selection: Selection;
    private boldIn: boolean = undefined;
    private italicIn: boolean = undefined;
    private underlineIn: Underline = undefined;
    private strikeThroughIn: Strikethrough = undefined;
    private baselineAlignmentIn: BaselineAlignment = undefined;
    private highlightColorIn: HighlightColor = undefined;
    private fontSizeIn: number = 0;
    private fontFamilyIn: string;
    private scriptType: FontScriptType =  FontScriptType.English;
    private renderedFontFamilyIn: string;
    private fontColorIn: string = undefined;
    private allCapsIn: boolean = undefined;
    /**
     * @private
     */
    public boldBidi: boolean = undefined;
    /**
     * @private
     */
    public italicBidi: boolean = undefined;
    /**
     * @private
     */
    public complexScript: boolean = undefined;
    /**
     * @private
     */
    public fontSizeBidi: number = 0;
    /**
     * @private
     */
    public fontFamilyBidi: string;
    /**
     * @private
     */
    public bidi: boolean = undefined;
    /**
     * @private
     */
    private bdo: BiDirectionalOverride = undefined;
    /**
     * @private
     */
    public styleName: string;
    /**
     * Gets the font size of selected contents.
     *
     * @aspType int
     */
    public get fontSize(): number {
        return this.fontSizeIn;
    }
    /**
     * Sets the font size of selected contents.
     *
     * @aspType int
     */
    public set fontSize(value: number) {
        if (value === this.fontSizeIn) {
            return;
        }
        this.fontSizeIn = value;
        this.notifyPropertyChanged('fontSize');
    }
    public get renderedFontFamily(): string {
        return this.renderedFontFamilyIn;
    }
    /**
     * Gets or sets the font family of selected contents.
     *
     * @aspType string
     */
    public get fontFamily(): string {
        return this.fontFamilyIn;
    }
    /**
     * Sets the font family of selected contents.
     *
     * @aspType string
     */
    public set fontFamily(value: string) {
        if (value === this.fontFamilyIn) {
            return;
        }
        this.fontFamilyIn = this.renderedFontFamilyIn = value;
        this.notifyPropertyChanged('fontFamily');
    }
    /**
     * Gets or sets the font color of selected contents.
     *
     * @aspType string
     */
    public get fontColor(): string {
        return this.fontColorIn;
    }
    /**
     * Sets the font color of selected contents.
     *
     * @aspType string
     */
    public set fontColor(value: string) {
        if (value === this.fontColorIn) {
            return;
        }
        this.fontColorIn = value;
        this.notifyPropertyChanged('fontColor');
    }
    /**
     * Gets or sets the bold formatting of selected contents.
     *
     * @aspType bool
     */
    public get bold(): boolean {
        return this.boldIn;
    }
    /**
     * Sets the bold formatting of selected contents.
     *
     * @aspType bool
     */
    public set bold(value: boolean) {
        if (value === this.boldIn) {
            return;
        }
        this.boldIn = value;
        this.notifyPropertyChanged('bold');
    }
    /**
     * Gets or sets the italic formatting of selected contents.
     *
     * @aspType bool
     */
    public get italic(): boolean {
        return this.italicIn;
    }
    /**
     * Sets the italic formatting of selected contents.
     *
     * @aspType bool
     */
    public set italic(value: boolean) {
        if (value === this.italic) {
            return;
        }
        this.italicIn = value;
        this.notifyPropertyChanged('italic');
    }
    /**
     * Gets or sets the strikethrough property of selected contents.
     */
    public get strikethrough(): Strikethrough {
        return this.strikeThroughIn;
    }
    /**
     * Sets the strikethrough property of selected contents.
     */
    public set strikethrough(value: Strikethrough) {
        if (value === this.strikeThroughIn) {
            return;
        }
        this.strikeThroughIn = value;
        this.notifyPropertyChanged('strikethrough');
    }
    /**
     * Gets or sets the baseline alignment property of selected contents.
     */
    public get baselineAlignment(): BaselineAlignment {
        return this.baselineAlignmentIn;
    }
    /**
     * Sets the baseline alignment property of selected contents.
     */
    public set baselineAlignment(value: BaselineAlignment) {
        if (value === this.baselineAlignmentIn) {
            return;
        }
        this.baselineAlignmentIn = value;
        this.notifyPropertyChanged('baselineAlignment');
    }
    /**
     * Gets or sets the underline style of selected contents.
     */
    public get underline(): Underline {
        return this.underlineIn;
    }
    /**
     * Sets the underline style of selected contents.
     */
    public set underline(value: Underline) {
        if (value === this.underlineIn) {
            return;
        }
        this.underlineIn = value;
        this.notifyPropertyChanged('underline');
    }
    /**
     * Gets or sets the highlight color of selected contents.
     */
    public get highlightColor(): HighlightColor {
        return this.highlightColorIn;
    }
    /**
     * Sets the highlight color of selected contents.
     */
    public set highlightColor(value: HighlightColor) {
        if (value === this.highlightColorIn && value !== "NoColor") {
            return;
        }
        this.highlightColorIn = value;
        this.notifyPropertyChanged('highlightColor');
    }
    /**
     * Gets or sets the allCaps formatting of selected contents.
     *
     * @aspType bool
     */
    public get allCaps(): boolean {
        return this.allCapsIn;
    }
    /**
     * Sets the allCaps formatting of selected contents.
     *
     * @aspType bool
     */
    public set allCaps(value: boolean) {
        if (value === this.allCapsIn) {
            return;
        }
        this.allCapsIn = value;
        this.notifyPropertyChanged('allCaps');
    }
    /**
     * @param selection
     * @private
     */
    constructor(selection: Selection) {
        this.selection = selection;
    }
    private getPropertyValue(property: string): Object {
        switch (property) {
            case 'bold':
                return this.bold;
            case 'italic':
                return this.italic;
            case 'fontSize':
                if (this.fontSize >= 1) {
                    return this.fontSize;
                }
                return undefined;
            case 'fontFamily':
                return this.fontFamily;
            case 'strikethrough':
                return this.strikethrough;
            case 'baselineAlignment':
                return this.baselineAlignment;
            case 'highlightColor':
                return this.highlightColor;
            case 'underline':
                return this.underline;
            case 'fontColor':
                return this.fontColor;
            case 'allCaps':
                return this.allCaps;
            default:
                return undefined;
        }
    }
    /**
     * Notifies whenever property gets changed.
     *
     * @param {string} propertyName
     */
    private notifyPropertyChanged(propertyName: string): void {
        if (!isNullOrUndefined(this.selection) && !this.selection.isRetrieveFormatting && (this.selection.isCleared || (this.selection.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) ||
            !this.selection.owner.isDocumentLoaded || this.selection.owner.isPastingContent)) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            const propertyValue: Object = this.getPropertyValue(propertyName);
            if (!isNullOrUndefined(propertyValue)) {
                this.selection.owner.editorModule.onApplyCharacterFormat(propertyName, propertyValue);
            }
        }
    }
    /**
     * Copies the source format.
     *
     * @param {WCharacterFormat} format
     * @returns {void}
     * @private
     */
    public copyFormat(format: WCharacterFormat, renderFontFamily?: string): void {
        this.styleName = !isNullOrUndefined(format.baseCharStyle) ? format.baseCharStyle.name : 'Default Paragraph Font';
        this.fontSize = format.fontSize;
        this.fontFamily = format.fontFamily;
        this.renderedFontFamilyIn = renderFontFamily;
        this.bold = format.bold;
        this.italic = format.italic;
        this.baselineAlignment = format.baselineAlignment;
        this.underline = format.underline;
        this.fontColor = format.fontColor;
        this.highlightColor = format.highlightColor;
        this.strikethrough = format.strikethrough;
        this.bidi = format.bidi;
        this.bdo = format.bdo;
        this.boldBidi = format.boldBidi;
        this.italicBidi = format.italicBidi;
        this.fontFamilyBidi = format.fontFamilyBidi;
        this.fontSizeBidi = format.fontSizeBidi;
        this.allCaps = format.allCaps;
        this.complexScript = format.complexScript;
    }
    /**
     * Combines the format.
     *
     * @param {WCharacterFormat} format
     * @private
     */
    public combineFormat(format: WCharacterFormat, renderFontFamily?: string): void {
        if (!isNullOrUndefined(this.bold) && this.bold !== format.bold) {
            this.bold = undefined;
        }
        if (!isNullOrUndefined(this.italic) && this.italic !== format.italic) {
            this.italic = undefined;
        }
        if (this.fontSize !== 0 && this.fontSize !== format.fontSize) {
            this.fontSize = 0;
        }
        if (!isNullOrUndefined(this.renderedFontFamily) && this.renderedFontFamily !== renderFontFamily) {
            this.renderedFontFamilyIn = undefined;
        }
        if (!isNullOrUndefined(this.fontFamily) && this.fontFamily !== format.fontFamily) {
            this.fontFamily = undefined;
        }
        if (!isNullOrUndefined(this.highlightColor) && this.highlightColor !== format.highlightColor) {
            this.highlightColor = undefined;
        }
        if (!isNullOrUndefined(this.baselineAlignment) && this.baselineAlignment !== format.baselineAlignment) {
            this.baselineAlignment = undefined;
        }
        if (!isNullOrUndefined(this.fontColor) && (this.fontColor !== format.fontColor)) {
            this.fontColor = undefined;
        }
        if (!isNullOrUndefined(this.underline) && this.underline !== format.underline) {
            this.underline = undefined;
        }
        if (!isNullOrUndefined(this.strikethrough) && this.strikethrough !== format.strikethrough) {
            this.strikethrough = undefined;
        }
        if (!isNullOrUndefined(this.boldBidi) && this.boldBidi !== format.boldBidi) {
            this.boldBidi = undefined;
        }
        if (!isNullOrUndefined(this.italicBidi) && this.italicBidi !== format.italicBidi) {
            this.italicBidi = undefined;
        }
        if (this.fontSizeBidi !== 0 && this.fontSizeBidi !== format.fontSizeBidi) {
            this.fontSizeBidi = 0;
        }
        if (!isNullOrUndefined(this.fontFamilyBidi) && this.fontFamilyBidi !== format.fontFamilyBidi) {
            this.fontFamilyBidi = undefined;
        }
        if (!isNullOrUndefined(this.bidi) && this.bidi !== format.bidi) {
            this.bidi = undefined;
        }
        if (!isNullOrUndefined(this.bdo) && this.bdo !== format.bdo) {
            this.bdo = undefined;
        }
        if (!isNullOrUndefined(this.allCaps) && this.allCaps !== format.allCaps) {
            this.allCaps = undefined;
        }
        if (!isNullOrUndefined(this.complexScript) && this.complexScript !== format.complexScript) {
            this.complexScript = undefined;
        }
    }
    /**
     * @private
     */
    public canRetrieveNextCharacterFormat(): boolean {
        if (isNullOrUndefined(this.bold) && isNullOrUndefined(this.italic) && this.fontSize === 0 && isNullOrUndefined(this.fontFamily) && isNullOrUndefined(this.highlightColor)
            && isNullOrUndefined(this.baselineAlignment) && isNullOrUndefined(this.fontColor) && isNullOrUndefined(this.underline) && isNullOrUndefined(this.strikethrough) && isNullOrUndefined(this.boldBidi)
            && isNullOrUndefined(this.italicBidi) && this.fontSizeBidi === 0 && isNullOrUndefined(this.fontFamilyBidi) && isNullOrUndefined(this.bdo) && isNullOrUndefined(this.allCaps)) {
            return false;
        }
        return true;
    }
    /**
     * Clones the format.
     *
     * @param {SelectionCharacterFormat} selectionCharacterFormat
     * @returns {void}
     * @private
     */
    public cloneFormat(selectionCharacterFormat: SelectionCharacterFormat): void {
        this.bold = selectionCharacterFormat.bold;
        this.italic = selectionCharacterFormat.italic;
        this.underline = selectionCharacterFormat.underline;
        this.strikethrough = selectionCharacterFormat.strikethrough;
        this.baselineAlignment = selectionCharacterFormat.baselineAlignment;
        this.highlightColor = selectionCharacterFormat.highlightColor;
        this.fontSize = selectionCharacterFormat.fontSize;
        this.fontFamily = selectionCharacterFormat.fontFamily;
        this.fontColor = selectionCharacterFormat.fontColor;
        this.styleName = selectionCharacterFormat.styleName;
        this.bidi = selectionCharacterFormat.bidi;
        this.bdo = selectionCharacterFormat.bdo;
        this.boldBidi = selectionCharacterFormat.boldBidi;
        this.italicBidi = selectionCharacterFormat.italicBidi;
        this.fontSizeBidi = selectionCharacterFormat.fontSizeBidi;
        this.fontFamilyBidi = selectionCharacterFormat.fontFamilyBidi;
        this.allCaps = selectionCharacterFormat.allCaps;
        this.complexScript = selectionCharacterFormat.complexScript;
    }
    /**
     * Checks whether current format is equal to the source format or not.
     *
     * @param {SelectionCharacterFormat} format
     * @returns boolean
     * @private
     */
    public isEqualFormat(format: SelectionCharacterFormat): boolean {
        return (this.fontSize === format.fontSize
            && this.strikethrough === format.strikethrough
            && this.bold === format.bold
            && this.fontFamily === format.fontFamily
            && this.underline === format.underline
            && this.highlightColor === format.highlightColor
            && this.italic === format.italic
            && this.baselineAlignment === format.baselineAlignment
            && this.fontColor === format.fontColor
            && this.allCaps === format.allCaps);

    }
    /**
     * Clears the format.
     *
     * @returns {void}
     * @private
     */
    public clearFormat(): void {
        this.fontSizeIn = 0;
        this.boldIn = undefined;
        this.italicIn = undefined;
        this.fontFamilyIn = undefined;
        this.fontColorIn = undefined;
        this.underlineIn = undefined;
        this.strikeThroughIn = undefined;
        this.highlightColorIn = undefined;
        this.baselineAlignmentIn = undefined;
        this.styleName = undefined;
        this.bidi = undefined;
        this.bdo = undefined;
        this.boldBidi = undefined;
        this.italicBidi = undefined;
        this.fontFamilyBidi = undefined;
        this.fontSizeBidi = undefined;
        this.allCapsIn = undefined;
        this.complexScript = undefined;
    }
    /**
     * Destroys the maintained resources.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.fontSizeIn = undefined;
        this.boldIn = undefined;
        this.italicIn = undefined;
        this.fontFamilyIn = undefined;
        this.fontColorIn = undefined;
        this.underlineIn = undefined;
        this.strikeThroughIn = undefined;
        this.baselineAlignmentIn = undefined;
        this.highlightColorIn = undefined;
        this.selection = undefined;
        this.styleName = undefined;
        this.bidi = undefined;
        this.bdo = undefined;
        this.boldBidi = undefined;
        this.italicBidi = undefined;
        this.fontFamilyBidi = undefined;
        this.fontSizeBidi = undefined;
        this.allCapsIn = undefined;
        this.complexScript = undefined;
    }
}
/**
 * Selection Border implementation
 */
export class SelectionBorder {
    //Declaring the owner selection
    private selection: Selection;
    private colorIn: string = undefined;
    private lineStyleIn: LineStyle = undefined;
    private lineWidthIn: number = undefined;
    private shadowIn: boolean = undefined;
    private spaceIn: number = undefined;
    private ownerBase: SelectionBorders;
    private borderType: string;
    /**
     * Gets or sets the color for selected paragraph borders.
     *
     * @default undefined
     * @aspType string
     */
    public get color(): string {
        return this.colorIn;
    }
    /**
     * Sets the color for selected paragraph borders.
     *
     * @default undefined
     * @aspType string
     */
    public set color(value: string) {
        if (value === this.colorIn) {
            return;
        }
        this.colorIn = value;
        this.notifyPropertyChanged("color");
    }
    /**
     * Gets or sets the lineStyle for selected paragraph borders.
     *
     * @default undefined
     * @aspType LineStyle
     */
    public get lineStyle(): LineStyle {
        return this.lineStyleIn;
    }
    /**
     * Sets the lineStyle for selected paragraph borders.
     *
     * @default undefined
     * @aspType LineStyle
     */
    public set lineStyle(value: LineStyle) {
        if (value === this.lineStyleIn) {
            return;
        }
        this.lineStyleIn = value;
        this.notifyPropertyChanged("lineStyle");
    }
    /**
     * Gets or sets the lineWidth for selected paragraph borders.
     *
     * @default undefined
     * @aspType number
     */
    public get lineWidth(): number {
        return this.lineWidthIn;
    }
    /**
     * Sets the lineWidth for selected paragraphs borders.
     *
     * @default undefined
     * @aspType number
     */
    public set lineWidth(value: number) {
        if (value === this.lineWidthIn) {
            return;
        }
        this.lineWidthIn = value;
        this.notifyPropertyChanged("lineWidth");
    }
    /**
     * Gets or sets the shadow for selected paragraph borders.
     *
     * @default undefined
     * @aspType boolean
     */
    public get shadow(): boolean {
        return this.shadowIn;
    }
    /**
     * Sets the shadow for selected paragraphs borders.
     *
     * @default undefined
     * @aspType boolean
     */
    public set shadow(value: boolean) {
        if (value === this.shadowIn) {
            return;
        }
        this.shadowIn = value;
        this.notifyPropertyChanged("shadow");
    }
    /**
     * Gets or sets the space for selected paragraphs borders.
     *
     * @default undefined
     * @aspType number
     */
    public get space(): number {
        return this.spaceIn;
    }
    /**
     * Sets the space for selected paragraphs borders.
     *
     * @default undefined
     * @aspType number
     */
    public set space(value: number) {
        if (value === this.spaceIn) {
            return;
        }
        this.spaceIn = value;
        this.notifyPropertyChanged('space');
    }

    /**
     * @param SelectionBorders
     * @private
     */
    public constructor(selection?: Selection, borderType?: string, node?: SelectionBorders) {
        this.borderType = borderType;
        this.ownerBase = node;
        this.selection = selection;
    }
   /**
    *Copies the format.
    *
    * @param {WBorder} border
    * @returns {void}
    * @private
    */
    public copyFormat(border: WBorder): void {
        this.color = border.color;
        this.lineStyle = border.lineStyle;
        this.lineWidth = border.lineWidth;
        this.shadow = border.shadow;
        this.space = border.space;
    }
   /**
    * Combines the format.
    *
    * @param {WBorder} border
    * @returns {void}
    * @private
    */
    public combineFormat(border: WBorder): void {
        if (!isNullOrUndefined(this.color) && this.color !== border.color) {
            this.color = undefined;
        }
        if (!isNullOrUndefined(this.lineStyle) && this.lineStyle !== border.lineStyle) {
            this.lineStyle = undefined;
        }
        if (!isNullOrUndefined(this.lineWidth) && this.lineWidth !== border.lineWidth) {
            this.lineWidth = undefined;
        }
        if (!isNullOrUndefined(this.shadow) && this.shadow !== border.shadow) {
            this.shadow = undefined;
        }
        if (!isNullOrUndefined(this.space) && this.space !== border.space) {
            this.space = undefined;
        }
    }
    private getPropertyValue(property: string): Object {
        switch (property) {
            case 'color':
                return this.color;
            case 'lineStyle':
                return this.lineStyle;
            case 'lineWidth':
                return this.lineWidth;
            case 'space':
                return this.space;
            case 'shadow':
                return this.shadow;
        }
        return undefined;
    }
    /**
     * Notifies whenever the property gets changed.
     * @param {string} propertyName 
     * @returns {void}
     */
    private notifyPropertyChanged(propertyName: string): void {
        if (!isNullOrUndefined(this.selection) && !this.selection.isRetrieveFormatting &&
            ((this.selection.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) || !this.selection.owner.isDocumentLoaded)) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            const editor: Editor = this.selection.owner.editorModule;
            const propertyValue: Object = this.getPropertyValue(propertyName);
            if (!isNullOrUndefined(propertyValue)) {
                editor.applyParagraphBorders(propertyName, this.borderType, propertyValue);
            }
        }
    }
    /**
     * Destroys the managed resources.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.colorIn)) {
            this.colorIn = undefined;
        }
        if (!isNullOrUndefined(this.lineStyleIn)) {
            this.lineStyleIn = undefined;
        }
        if (!isNullOrUndefined(this.lineWidthIn)) {
            this.lineWidthIn = undefined;
        }
        if (!isNullOrUndefined(this.spaceIn)) {
            this.spaceIn = undefined;
        }
        if (!isNullOrUndefined(this.shadowIn)) {
            this.shadowIn = undefined;
        }
    }
}
/**
 * Selection Borders implementation
 */
export class SelectionBorders {
    private selection: Selection;
    private topIn: SelectionBorder;
    private bottomIn: SelectionBorder;
    private leftIn: SelectionBorder;
    private rightIn: SelectionBorder;
    private horizontalIn: SelectionBorder;
    private verticalIn: SelectionBorder;
    private ownerBase: Object = undefined;

    /**
     * Gets the top Border for selected paragraphs.
     *
     * @default undefined
     * @aspType SelectionBorder
     */
    public get top(): SelectionBorder {
        return this.topIn as SelectionBorder;
    }
    /**
     * Gets the bottom Border for selected paragraphs.
     *
     * @default undefined
     * @aspType SelectionBorder
     */
    public get bottom(): SelectionBorder {
        return this.bottomIn as SelectionBorder;
    }
    /**
     * Gets the left Border for selected paragraphs.
     *
     * @default undefined
     * @aspType SelectionBorder
     */
    public get left(): SelectionBorder {
        return this.leftIn as SelectionBorder;
    }
    /**
     * Gets the right Border for selected paragraphs.
     *
     * @default undefined
     * @aspType SelectionBorder
     */
    public get right(): SelectionBorder {
        return this.rightIn as SelectionBorder;
    }
    /**
     * Gets the horizontal Border for selected paragraphs.
     *
     * @default undefined
     * @aspType SelectionBorder
     */
    public get horizontal(): SelectionBorder {
        return this.horizontalIn as SelectionBorder;
    }
    /**
     * Gets the vertical Border for selected paragraphs.
     *
     * @default undefined
     * @aspType SelectionBorder
     */
    public get vertical(): SelectionBorder {
        return this.verticalIn as SelectionBorder;
    }
    /**
     * @param Object
     * @private
     */
    public constructor(selection: Selection, node?: Object) {
        this.ownerBase = node;
        this.selection = selection;
        this.topIn = new SelectionBorder(this.selection, 'topBorder', this);
        this.bottomIn = new SelectionBorder(this.selection, 'bottomBorder', this);
        this.rightIn = new SelectionBorder(this.selection, 'rightBorder', this);
        this.leftIn = new SelectionBorder(this.selection, 'leftBorder', this);
        this.horizontalIn = new SelectionBorder(this.selection, 'horizontalBorder', this);
        this.verticalIn = new SelectionBorder(this.selection, 'verticalBorder', this);
    }

    /**
     * Copies the format.
     *
     * @param {WBorders} borders
     * @returns {void}
     * @private
     */
    public copyFormat(borders: WBorders): void {
        this.top.copyFormat(borders.top);
        this.bottom.copyFormat(borders.bottom);
        this.left.copyFormat(borders.left);
        this.right.copyFormat(borders.right);
        this.horizontal.copyFormat(borders.horizontal);
        this.vertical.copyFormat(borders.vertical);
    }
    /**
     * Combines the format.
     *
     * @param {WBorders} borders
     * @private
     */
    public combineFormat(borders: WBorders) {
        this.top.combineFormat(borders.top);
        this.bottom.combineFormat(borders.bottom);
        this.left.combineFormat(borders.left);
        this.right.combineFormat(borders.right);
        this.vertical.combineFormat(borders.vertical);
        this.horizontal.combineFormat(borders.horizontal);
    }

    /**
     * Destroys the managed resources.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.topIn)) {
            this.topIn.destroy();
            this.topIn = undefined;
        }
        if (!isNullOrUndefined(this.topIn)) {
            this.bottomIn.destroy();
            this.bottomIn = undefined;
        }
        if (!isNullOrUndefined(this.leftIn)) {
            this.leftIn.destroy();
            this.leftIn = undefined;
        }
        if (!isNullOrUndefined(this.rightIn)) {
            this.rightIn.destroy();
            this.rightIn = undefined;
        }
        if (!isNullOrUndefined(this.horizontalIn)) {
            this.horizontalIn.destroy();
            this.horizontalIn = undefined;
        }
        if (!isNullOrUndefined(this.verticalIn)) {
            this.verticalIn.destroy();
            this.verticalIn = undefined;
        }
    }

   
}
/**
 * Selection paragraph format implementation
 */
export class SelectionParagraphFormat {
    //Declaring the owner selection
    private selection: Selection;
    // Declaring the character format properties.
    private leftIndentIn: number = 0;
    private rightIndentIn: number = 0;
    private beforeSpacingIn: number = 0;
    private afterSpacingIn: number = 0;
    private spaceAfterAutoIn: boolean = undefined;
    private spaceBeforeAutoIn: boolean = undefined;
    private textAlignmentIn: TextAlignment = undefined;
    private outlineLevelIn: OutlineLevel = undefined;
    private firstLineIndentIn: number = 0;
    private lineSpacingIn: number = 1;
    private lineSpacingTypeIn: LineSpacingType = undefined;
    private bidiIn: boolean = undefined;
    private keepWithNextIn: boolean = undefined;
    private keepLinesTogetherIn: boolean = undefined;
    private widowControlIn: boolean = undefined;
    private contextualSpacingIn: boolean = undefined;
    private bordersIn: SelectionBorders;
    /**
     * Gets the borders for selected paragraphs.
     *
     * @default undefined
     * @aspType SelectionBorders
     */
    public get borders(): SelectionBorders {
        return this.bordersIn;
    }
    /**
     * @private
     */
    public listId: number;
    private listLevelNumberIn: number = -1;
    private documentHelper: DocumentHelper;
    /**
     * @private
     */
    public styleName: string;
    /**
     * Gets or Sets the left indent for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public get leftIndent(): number {
        return this.leftIndentIn;
    }
    /**
     * Sets the left indent for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public set leftIndent(value: number) {
        if (value === this.leftIndentIn) {
            return;
        }
        this.leftIndentIn = value;
        this.notifyPropertyChanged('leftIndent');
    }
    /**
     * Gets or Sets the right indent for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public get rightIndent(): number {
        return this.rightIndentIn;
    }
    /**
     * Sets the right indent for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public set rightIndent(value: number) {
        if (value === this.rightIndentIn) {
            return;
        }
        this.rightIndentIn = value;
        this.notifyPropertyChanged('rightIndent');
    }
    /**
     * Gets or Sets the first line indent for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public get firstLineIndent(): number {
        return this.firstLineIndentIn;
    }
    /**
     * Sets the first line indent for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public set firstLineIndent(value: number) {
        if (value === this.firstLineIndentIn) {
            return;
        }
        this.firstLineIndentIn = value;
        this.notifyPropertyChanged('firstLineIndent');
    }
    /**
     * Gets or Sets the text alignment for selected paragraphs.
     *
     * @default undefined
     */
    public get textAlignment(): TextAlignment {
        return this.textAlignmentIn;
    }
    /**
     * Sets the text alignment for selected paragraphs.
     *
     * @default undefined
     */
    public set textAlignment(value: TextAlignment) {
        if (value === this.textAlignmentIn) {
            return;
        }
        this.textAlignmentIn = value;
        this.notifyPropertyChanged('textAlignment');
    }
    /**
     * Gets or Sets the outline level for selected paragraphs.
     *
     * @default undefined
     */
    public get outlineLevel(): OutlineLevel {
        return this.outlineLevelIn;
    }
    /**
     * Sets the outline level for selected paragraphs.
     *
     * @default undefined
     */
    public set outlineLevel(value: OutlineLevel) {
        if (value === this.outlineLevelIn) {
            return;
        }
        this.outlineLevelIn = value;
        this.notifyPropertyChanged('outlineLevel');
    }
    /**
     * Sets the after spacing for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public get afterSpacing(): number {
        return this.afterSpacingIn;
    }
    /**
     * Gets or Sets the after spacing for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public set afterSpacing(value: number) {
        if (value === this.afterSpacingIn) {
            return;
        }
        this.afterSpacingIn = value;
        this.notifyPropertyChanged('afterSpacing');
    }
    /**
     * Gets or Sets the before spacing for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public get beforeSpacing(): number {
        return this.beforeSpacingIn;
    }
    /**
     * Sets the before spacing for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public set beforeSpacing(value: number) {
        if (value === this.beforeSpacingIn) {
            return;
        }
        this.beforeSpacingIn = value;
        this.notifyPropertyChanged('beforeSpacing');
    }
    /**
     * Gets or Sets the space after auto for selected paragraphs.
     *
     * @default false
     * @aspType bool
     */
    public get spaceAfterAuto(): boolean {
        return this.spaceAfterAutoIn
    }
    /**
     *  Sets the space after auto for selected paragraphs.
     *
     * @aspType bool
     * @blazorType bool
     */
    public set spaceAfterAuto(value: boolean) {
        if (value === this.spaceAfterAutoIn) {
            return;
        }
        this.spaceAfterAutoIn = value;
        this.notifyPropertyChanged('spaceAfterAuto');
    }
    /**
     * Gets or Sets the space before auto for selected paragraphs.
     *
     * @default false
     * @aspType bool
     */
    public get spaceBeforeAuto(): boolean {
        return this.spaceBeforeAutoIn
    }
    /**
     *  Sets the space before auto for selected paragraphs.
     *
     * @aspType bool
     * @blazorType bool
     */
    public set spaceBeforeAuto(value: boolean) {
        if (value === this.spaceBeforeAutoIn) {
            return;
        }
        this.spaceBeforeAutoIn = value;
        this.notifyPropertyChanged('spaceBeforeAuto');
    }
    /**
     * Gets or Sets the line spacing for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public get lineSpacing(): number {
        return this.lineSpacingIn;
    }
    /**
     * Sets the line spacing for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public set lineSpacing(value: number) {
        if (value === this.lineSpacingIn) {
            return;
        }
        this.lineSpacingIn = value;
        this.notifyPropertyChanged('lineSpacing');
    }
    /**
     * Gets or Sets the line spacing type for selected paragraphs.
     *
     * @default undefined
     */
    public get lineSpacingType(): LineSpacingType {
        return this.lineSpacingTypeIn;
    }
    /**
     * Gets or Sets the line spacing type for selected paragraphs.
     *
     * @default undefined
     */
    public set lineSpacingType(value: LineSpacingType) {
        if (value === this.lineSpacingTypeIn) {
            return;
        }
        this.lineSpacingTypeIn = value;
        this.notifyPropertyChanged('lineSpacingType');
    }
    /**
     * Sets the list level number for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public get listLevelNumber(): number {
        return this.listLevelNumberIn;
    }
    /**
     * Gets or Sets the list level number for selected paragraphs.
     *
     * @default undefined
     * @aspType int
     */
    public set listLevelNumber(value: number) {
        if (value === this.listLevelNumberIn) {
            return;
        }
        this.listLevelNumberIn = value;
        this.notifyPropertyChanged('listLevelNumber');
    }
    /**
     * Gets or Sets the bidirectional property for selected paragraphs
     *
     * @aspType bool
     */
    public get bidi(): boolean {
        return this.bidiIn;
    }
    /**
     * Sets the bidirectional property for selected paragraphs
     *
     * @aspType bool
     */
    public set bidi(value: boolean) {
        this.bidiIn = value;
        this.notifyPropertyChanged('bidi');
    }

    /**
     * Gets or sets a value indicating whether the specified paragraph remains on the same page as the paragraph that follows it while paginating the document.
     *
     * @default false
     * @aspType bool
     * @returns {boolean} - `true` if the specified paragraph remains on the same page as the paragraph that follows it; otherwise, `false`.
     */
    public get keepWithNext(): boolean {
        return this.keepWithNextIn;
    }
    /**
     * Sets a value indicating whether the specified paragraph remains on the same page as the paragraph that follows it while paginating the document.
     *
     * @aspType bool
     * @blazorType bool
     */
    public set keepWithNext(value: boolean) {
        this.keepWithNextIn = value;
        this.notifyPropertyChanged('keepWithNext');
    }

    /**
     * Gets or sets a value indicating whether all lines in the specified paragraphs remain on the same page while paginating the document.
     *
     * @default false
     * @aspType bool
     * @returns {boolean} - `true` if all lines in the specified paragraphs remain on the same page; otherwise, `false`.
     */
    public get keepLinesTogether(): boolean {
        return this.keepLinesTogetherIn;
    }
    /**
     * Sets a value indicating whether all lines in the specified paragraphs remain on the same page while paginating the document.
     *
     * @aspType bool
     * @blazorType bool
     */
    public set keepLinesTogether(value: boolean) {
        this.keepLinesTogetherIn = value;
        this.notifyPropertyChanged('keepLinesTogether');
    }

    /**
     * Gets or sets a value indicating whether the first and last lines of the paragraph are to remain on the same page as the rest of the paragraph when paginating the document. 
     *
     * @default true
     * @aspType bool
     * @returns {boolean} - `true` if the first and last lines of the paragraph are to remain on the same page; otherwise, `false`.
     */
    public get widowControl(): boolean {
        return this.widowControlIn;
    }
    /**
     * Sets a value indicating whether the first and last lines of the paragraph are to remain on the same page as the rest of the paragraph when paginating the document. 
     *
     * @default true
     * @aspType bool
     */
    public set widowControl(value: boolean) {
        this.widowControlIn = value;
        this.notifyPropertyChanged('widowControl');
    }

    /**
     * Gets or sets a value indicating whether to add space between the paragraphs of same style.
     *
     * @aspType bool
     */
    public get contextualSpacing(): boolean {
        return this.contextualSpacingIn;
    }
    /**
     * Sets a value indicating whether to add space between the paragraphs of same style.
     *
     * @aspType bool
     */
    public set contextualSpacing(value: boolean) {
        this.contextualSpacingIn = value;
        this.notifyPropertyChanged('contextualSpacing');
    }
    private validateLineSpacing(): boolean {
        if (this.lineSpacingType !== 'Multiple' && this.lineSpacingIn < 12) {
            return true;
        }
        return false;
    }

    /**
     * Gets the list text for selected paragraphs.
     *
     * @aspType string
     */
    public get listText(): string {
        let listFormat: string = undefined;
        const list: WList = this.documentHelper.getListById(this.listId);
        if (list instanceof WList && this.listLevelNumberIn > -1 && this.listLevelNumberIn < 9) {
            const listLevel: WListLevel = list.getListLevel(this.listLevelNumber);
            if (listLevel instanceof WListLevel) {
                if (listLevel.listLevelPattern === 'Bullet') {
                    listFormat = listLevel.numberFormat;
                } else {
                    listFormat = listLevel.numberFormat;
                    for (let i: number = 0; i < 9; i++) {
                        const levelPattern: string = '%' + (i + 1);
                        if (listFormat.indexOf(levelPattern) > -1) {
                            const level: WListLevel = i === this.listLevelNumberIn ? listLevel : list.getListLevel(i);
                            const listTextElement: ListTextElementBox = this.selection.getListTextElementBox(this.selection.start.paragraph);
                            const listText: string = listTextElement ? listTextElement.text : '';
                            listFormat = listText;
                        }
                    }
                }
            }
        }
        return listFormat;
    }
    /**
     * @param selection
     * @param documentHelper
     * @private
     */
    constructor(selection: Selection, documentHelper: DocumentHelper) {
        this.selection = selection;
        this.documentHelper = documentHelper;
        this.bordersIn = new SelectionBorders(this.selection, this);
    }

    private getPropertyValue(property: string): Object {
        switch (property) {
            case 'leftIndent':
                return this.leftIndent;
            case 'rightIndent':
                return this.rightIndent;
            case 'firstLineIndent':
                return this.firstLineIndent;
            case 'beforeSpacing':
                return this.beforeSpacing;
            case 'afterSpacing':
                return this.afterSpacing;
            case 'spaceAfterAuto':
                return this.spaceAfterAuto;
            case 'spaceBeforeAuto':
                return this.spaceBeforeAuto;
            case 'textAlignment':
                return this.textAlignment;
            case 'lineSpacing':
                return this.lineSpacing;
            case 'lineSpacingType':
                return this.lineSpacingType;
            case 'bidi':
                return this.bidi;
            case 'contextualSpacing':
                return this.contextualSpacing;
            case 'keepWithNext':
                return this.keepWithNext;
            case 'keepLinesTogether':
                return this.keepLinesTogether;
            case 'widowControl':
                return this.widowControl;
            case 'outlineLevel':
                return this.outlineLevel;
            default:
                return undefined;
        }
    }
    /**
     * Notifies whenever the property gets changed.
     *
     * @param {string} propertyName
     */
    private notifyPropertyChanged(propertyName: string): void {
        if (!isNullOrUndefined(this.selection) && !this.selection.isRetrieveFormatting &&
            ((this.selection.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) || !this.selection.owner.isDocumentLoaded)) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            const editorModule: Editor = this.selection.owner.editorModule;
            if (propertyName === 'lineSpacing' || propertyName === 'lineSpacingType') {
                const editorHistory: EditorHistory = this.selection.owner.editorHistoryModule;
                if (!(editorHistory && (editorHistory.isUndoing || editorHistory.isRedoing)) && this.validateLineSpacing()) {
                    this.selection.owner.editorHistoryModule.initComplexHistory(this.selection, 'LineSpacing');
                    if (propertyName === 'lineSpacing') {
                        this.lineSpacingTypeIn = 'Multiple';
                        const value: Object = this.getPropertyValue('lineSpacingType');
                        editorModule.onApplyParagraphFormat('lineSpacingType', value, false, false);
                        editorModule.onApplyParagraphFormat(propertyName, this.getPropertyValue(propertyName), false, false);
                    } else {
                        editorModule.onApplyParagraphFormat(propertyName, this.getPropertyValue(propertyName), false, false);
                        this.lineSpacingIn = 12;
                        editorModule.onApplyParagraphFormat('lineSpacing', this.getPropertyValue('lineSpacing'), false, false);
                    }
                    this.selection.owner.editorHistoryModule.updateComplexHistory();
                    return;
                }
            }
            const value: Object = this.getPropertyValue(propertyName);
            if ((propertyName === 'leftIndent' || propertyName === 'rightIndent' || propertyName === 'firstLineIndent')
                && !(value >= -1056 && value < 1056)) {
                return;
            }
            if (propertyName === 'listLevelNumber') {
                editorModule.onApplyListInternal(this.documentHelper.getListById(this.listId), this.listLevelNumber);
            } else {
                editorModule.onApplyParagraphFormat(propertyName, value, propertyName === 'textAlignment' ? true : false, false);
            }
        }
    }
    /**
     * Copies the format.
     *
     * @param {WParagraphFormat} format
     * @returns {void}
     * @private
     */
    public copyFormat(format: WParagraphFormat): void {
        this.styleName = !isNullOrUndefined(format.baseStyle) ? format.baseStyle.name : 'Normal';
        this.leftIndent = format.leftIndent;
        this.rightIndent = format.rightIndent;
        this.firstLineIndent = format.firstLineIndent;
        this.afterSpacing = format.afterSpacing;
        this.beforeSpacing = format.beforeSpacing;
        this.spaceAfterAuto = format.spaceAfterAuto;
        this.spaceBeforeAuto = format.spaceBeforeAuto;
        this.lineSpacing = format.lineSpacing;
        this.lineSpacingType = format.lineSpacingType;
        this.textAlignment = format.textAlignment;
        this.outlineLevel = format.outlineLevel;
        this.bidi = format.bidi;
        this.keepLinesTogether = format.keepLinesTogether;
        this.keepWithNext = format.keepWithNext;
        this.widowControl = format.widowControl;
        this.contextualSpacing = format.contextualSpacing;
        this.borders.copyFormat(format.borders);
        if (!isNullOrUndefined(format.listFormat) && !isNullOrUndefined(format.listFormat.listId)) {
            this.listId = format.listFormat.listId;
            this.listLevelNumber = format.listFormat.listLevelNumber;
        } else {
            this.listId = undefined;
            this.listLevelNumber = 0;
        }
    }
    /**
     * Copies to format.
     *
     * @param {WParagraphFormat} format
     * @private
     */
    public copyToFormat(format: WParagraphFormat): void {
        if (isNullOrUndefined(format)) {
            return;
        }
        if (!isNullOrUndefined(this.afterSpacing)) {
            format.afterSpacing = this.afterSpacing;
        }
        if (!isNullOrUndefined(this.beforeSpacing)) {
            format.beforeSpacing = this.beforeSpacing;
        }
        if (!isNullOrUndefined(this.spaceAfterAuto)) {
            format.spaceAfterAuto = this.spaceAfterAuto;
        }
        if (!isNullOrUndefined(this.spaceBeforeAuto)) {
            format.spaceBeforeAuto = this.spaceBeforeAuto;
        }
        if (!isNullOrUndefined(this.leftIndent)) {
            format.leftIndent = this.leftIndent;
        }
        if (!isNullOrUndefined(this.rightIndent)) {
            format.rightIndent = this.rightIndent;
        }
        if (!isNullOrUndefined(this.textAlignment)) {
            format.textAlignment = this.textAlignment;
        }
        if (!isNullOrUndefined(this.outlineLevel)) {
            format.outlineLevel = this.outlineLevel;
        }
        if (!isNullOrUndefined(this.lineSpacing)) {
            format.lineSpacing = this.lineSpacing;
        }
        if (!isNullOrUndefined(this.lineSpacingType)) {
            format.lineSpacingType = this.lineSpacingType;
        }
        if (!isNullOrUndefined(this.firstLineIndent)) {
            format.firstLineIndent = this.firstLineIndent;
        }
        if (!isNullOrUndefined(this.bidi)) {
            format.bidi = this.bidi;
        }
        if (!isNullOrUndefined(this.keepWithNext)) {
            format.keepWithNext = this.keepWithNext;
        }
        if (!isNullOrUndefined(this.keepLinesTogether)) {
            format.keepLinesTogether = this.keepLinesTogether;
        }
        if (!isNullOrUndefined(this.widowControl)) {
            format.widowControl = this.widowControl;
        }
        if (!isNullOrUndefined(this.contextualSpacing)) {
            format.contextualSpacing = this.contextualSpacing;
        }
    }
    /**
     * Combines the format.
     *
     * @param {WParagraphFormat} format
     * @private
     */
    public combineFormat(format: WParagraphFormat): void {
        if (!isNullOrUndefined(this.leftIndent) && this.leftIndent !== format.leftIndent) {
            this.leftIndent = undefined;
        }
        if (!isNullOrUndefined(this.rightIndent) && this.rightIndent !== format.rightIndent) {
            this.rightIndent = undefined;
        }
        if (!isNullOrUndefined(this.firstLineIndent) && this.firstLineIndent !== format.firstLineIndent) {
            this.firstLineIndent = undefined;
        }
        if (this.lineSpacing !== 0 && this.lineSpacing !== format.lineSpacing) {
            this.lineSpacing = 0;
        }
        if (this.beforeSpacing !== -1 && this.beforeSpacing !== format.beforeSpacing) {
            this.beforeSpacing = -1;
        }
        if (this.afterSpacing !== -1 && this.afterSpacing !== format.afterSpacing) {
            this.afterSpacing = -1;
        }
        if (!isNullOrUndefined(this.spaceAfterAuto) && this.spaceAfterAuto !== format.spaceAfterAuto) {
            this.spaceAfterAuto = undefined;
        }
        if (!isNullOrUndefined(this.spaceBeforeAuto) && this.spaceBeforeAuto !== format.spaceBeforeAuto) {
            this.spaceBeforeAuto = undefined;
        }
        if (!isNullOrUndefined(this.lineSpacingType) && this.lineSpacingType !== format.lineSpacingType) {
            this.lineSpacingType = undefined;
        }
        if (!isNullOrUndefined(this.textAlignment) && this.textAlignment !== format.textAlignment) {
            this.textAlignment = undefined;
        }
        if (!isNullOrUndefined(this.outlineLevel) && this.outlineLevel !== format.outlineLevel) {
            this.outlineLevel = undefined;
        }
        if (this.listLevelNumber >= 0 && !isNullOrUndefined(this.listId) && (isNullOrUndefined(format.listFormat) || format.listFormat.listLevelNumber !== this.listLevelNumber)) {
            this.listLevelNumber = -1;
        }
        if (isNullOrUndefined(format.listFormat) || isNullOrUndefined(format.listFormat.listId) || (!isNullOrUndefined(this.listId) && this.listId !== format.listFormat.listId)) {
            this.listId = undefined;
        }
        if (!isNullOrUndefined(this.bidi) && this.bidi !== format.bidi) {
            this.bidi = undefined;
        }
        if (!isNullOrUndefined(this.keepLinesTogether) && this.keepLinesTogether !== format.keepLinesTogether) {
            this.keepLinesTogether = undefined;
        }
        if (!isNullOrUndefined(this.keepWithNext) && this.keepWithNext !== format.keepWithNext) {
            this.keepWithNext = undefined;
        }
        if (!isNullOrUndefined(this.widowControl) && this.widowControl !== format.widowControl) {
            this.widowControl = undefined;
        }
        if (!isNullOrUndefined(this.contextualSpacing) && this.contextualSpacing !== format.contextualSpacing) {
            this.contextualSpacing = undefined;
        }
        if (!isNullOrUndefined(this.styleName) && format.baseStyle && this.styleName !== format.baseStyle.name) {
            this.styleName = undefined;
        }
        this.borders.combineFormat(format.borders);
    }
    /**
     * Clears the format.
     *
     * @returns {void}
     * @private
     */
    public clearFormat(): void {
        this.leftIndent = 0;
        this.rightIndent = 0;
        this.beforeSpacing = 0;
        this.afterSpacing = 0;
        this.spaceAfterAuto = undefined;
        this.spaceBeforeAuto = undefined;
        this.firstLineIndent = 0;
        this.lineSpacing = 1;
        this.textAlignment = undefined;
        this.lineSpacingType = undefined;
        this.listId = undefined;
        this.listLevelNumber = -1;
        this.styleName = undefined;
        this.bidi = undefined;
        this.contextualSpacing = undefined;
     
    }
    /**
     * Gets the clone of list at current selection.
     *
     * @returns WList
     * @private
     */
    public getList(): WList {
        const list: WList = this.documentHelper.getListById(this.listId);
        if (!isNullOrUndefined(list)) {
            const listAdv: WList = new WList();
            const abstractList: WAbstractList = new WAbstractList();
            const currentAbstractList: WAbstractList = this.documentHelper.getAbstractListById(list.abstractListId);
            const editor: Editor = this.selection.owner.editorModule;
            if (!isNullOrUndefined(currentAbstractList)) {
                for (let i: number = 0; i < currentAbstractList.levels.length; i++) {
                    const level: WListLevel = editor.cloneListLevel(currentAbstractList.levels[i]);
                    abstractList.levels.push(level);
                    level.ownerBase = abstractList;
                }
            } else {
                abstractList.levels.push(new WListLevel(abstractList));
            }
            if (!isNullOrUndefined(list.levelOverrides)) {
                for (let i: number = 0; i < list.levelOverrides.length; i++) {
                    const levelOverride: WLevelOverride = editor.cloneLevelOverride(list.levelOverrides[i]);
                    listAdv.levelOverrides.push(levelOverride);
                }
            }
            listAdv.abstractList = abstractList;
            listAdv.abstractListId = abstractList.abstractListId;
            listAdv.sourceListId = list.listId;
            return listAdv;
        }
        return undefined;
    }
    /**
     * Modifies the list at current selection.
     *
     * @param {WList} listAdv
     * @private
     */
    public setList(listAdv: WList, isListDialog?: boolean): void {
        if ((this.documentHelper.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) || !this.documentHelper.owner.isDocumentLoaded || (!isNullOrUndefined(this.selection) && this.selection.checkContentControlLocked(true))) {
            return;
        }
        const list: WList = this.documentHelper.getListById(this.listId);
        let collection: Dictionary<number, ModifiedLevel> = undefined;
        const currentAbstractList: WAbstractList = listAdv ? this.documentHelper.getAbstractListById(listAdv.abstractListId) : undefined;
        if (!isNullOrUndefined(list) && !isNullOrUndefined(listAdv)
            && !isNullOrUndefined(currentAbstractList) && listAdv.sourceListId === list.listId) {
            const history: EditorHistory = this.documentHelper.owner.editorHistoryModule;
            const listLevel: WListLevel = this.documentHelper.layout.getListLevel(list, 1);
            this.selection.owner.isLayoutEnabled = false;
            this.documentHelper.owner.editorModule.setOffsetValue(this.selection);
            if (history) {
                collection = history.updateListChangesInHistory(currentAbstractList, list);
            }
            this.documentHelper.owner.editorModule.updateListParagraphs();
            if (history) {
                history.applyListChanges(this.selection, collection);
            }
            this.selection.owner.isLayoutEnabled = true;
            this.documentHelper.renderedLists.clear();
            this.documentHelper.renderedLevelOverrides = [];
            if (isListDialog) {
                this.documentHelper.layout.clearInvalidList(listAdv);
            }
            this.documentHelper.owner.editorModule.layoutWholeDocument();
            this.documentHelper.owner.editorModule.updateSelectionTextPosition(false);
            if (history && history.currentBaseHistoryInfo) {
                if (history.currentBaseHistoryInfo.modifiedProperties.length > 0) {
                    history.currentBaseHistoryInfo.updateSelection();
                }
                history.updateHistory();
            }
            this.documentHelper.owner.editorModule.fireContentChange();
        } else if (!isNullOrUndefined(listAdv)) {
            this.selection.owner.isLayoutEnabled = false;
            if (!isNullOrUndefined(currentAbstractList) && this.documentHelper.abstractLists.indexOf(currentAbstractList) === -1) {
                this.documentHelper.abstractLists.push(currentAbstractList);
            }
            if (this.documentHelper.lists.indexOf(listAdv) === -1) {
                this.documentHelper.lists.push(listAdv);
            }
            //currentAbstractList.listType = 'Numbering';
            this.selection.owner.isLayoutEnabled = true;
            this.selection.owner.editorModule.onApplyList(listAdv);
        } else {
            this.selection.owner.editorModule.onApplyList(undefined);
        }
    }
    /**
     * Destroys the managed resources.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.leftIndentIn = undefined;
        this.rightIndentIn = undefined;
        this.beforeSpacingIn = undefined;
        this.afterSpacingIn = undefined;
        this.spaceBeforeAutoIn = undefined;
        this.spaceAfterAutoIn = undefined;
        this.firstLineIndentIn = undefined;
        this.lineSpacingIn = undefined;
        this.textAlignmentIn = undefined;
        this.lineSpacingTypeIn = undefined;
        this.listId = undefined;
        this.listLevelNumberIn = undefined;
        this.documentHelper = undefined;
        this.selection = undefined;
        this.styleName = undefined;
        this.bidi = undefined;
        this.contextualSpacing = undefined;
        if (!isNullOrUndefined(this.bordersIn)) {
            this.bordersIn.destroy();
            this.bordersIn = undefined;
        }
    }
}
export class SelectionHeaderFooter {

    private linkToPreviousIn: boolean = true;
    private selection: Selection;
    /**
     * Gets or sets a value indicating whether this header footer is linked to the previous section header footer in the document.
     *
     * @default true
     * @aspType bool
     * @returns {boolean} Returns `true` if the header footer is linked to the previous section header footer; Otherwise `false`.
     */
    public set linkToPrevious (value: boolean) {
        this.linkToPreviousIn = value;
        this.notifyPropertyChanged('linkToPrevious');
    }

    public get linkToPrevious (): boolean {
        return this.linkToPreviousIn;
    }


    constructor(selection?: Selection) {
        this.selection = selection;
    }

    private notifyPropertyChanged(propertyName: string): void {
        const selection: Selection = this.selection;
        if (!isNullOrUndefined(selection) && !selection.isRetrieveFormatting && (selection.isCleared || selection.owner.isPastingContent
            || selection.owner.isReadOnlyMode || !selection.owner.isDocumentLoaded)) {
            return;
        }
        if (!isNullOrUndefined(selection) && !isNullOrUndefined(selection.start) && !selection.isRetrieveFormatting) {
            const value: Object = this.getPropertyvalue(propertyName);
            if (!isNullOrUndefined(value)) {
                const headerFooterWidget: HeaderFooterWidget = selection.start.paragraph.bodyWidget as HeaderFooterWidget;
                let sectionIndex: number = headerFooterWidget.sectionIndex; 
                let headerFooterType: HeaderFooterType = headerFooterWidget.headerFooterType;
                selection.owner.editorModule.removeInlineHeaderFooterWidget(sectionIndex, headerFooterType, propertyName, value);
            }
        }
    }


    private getPropertyvalue(propertyName: string): Object {
        if (propertyName == "linkToPrevious") {
            if (!isNullOrUndefined(this.linkToPrevious)) {
                return this.linkToPrevious;
            }
        }
        return undefined;
    }
}
/**
 * Selection section format implementation
 */
export class SelectionSectionFormat {
    private selection: Selection;
    private differentFirstPageIn: boolean = undefined;
    private differentOddAndEvenPagesIn: boolean = undefined;
    private headerDistanceIn: number;
    private footerDistanceIn: number;
    private pageHeightIn: number;
    private pageWidthIn: number;
    private leftMarginIn: number;
    private topMarginIn: number;
    private rightMarginIn: number;
    private bottomMarginIn: number;
    private restartPageNumberingIn: boolean;
    private pageStartingNumberIn: number;
    private endnoteNumberFormatIn: FootEndNoteNumberFormat;
    private footNoteNumberFormatIn: FootEndNoteNumberFormat;
    private restartIndexForFootnotesIn: FootnoteRestartIndex;
    private restartIndexForEndnotesIn: FootnoteRestartIndex;
    private initialFootNoteNumberIn: number;
    private initialEndNoteNumberIn: number;
    private equalWidthIn: boolean;
    private lineBetweenColumnsIn: boolean;
    private columnsIn: SelectionColumnFormat[];
    private breakCodeIn: string;
    private firstPageHeaderIn: SelectionHeaderFooter;
    private firstPageFooterIn: SelectionHeaderFooter;
    private oddPageHeaderIn: SelectionHeaderFooter;
    private oddPageFooterIn: SelectionHeaderFooter;
    private evenPageHeaderIn: SelectionHeaderFooter;
    private evenPageFooterIn: SelectionHeaderFooter;

    /**
     * private
     */
    public bidi: boolean = undefined;
    /**
     * Gets or sets the page height.
     *
     * @aspType int
     */
    public get pageHeight(): number {
        return this.pageHeightIn;
    }
    /**
     * Gets or sets the page height.
     *
     * @aspType int
     */
    public set pageHeight(value: number) {
        this.pageHeightIn = value;
        this.notifyPropertyChanged('pageHeight');
    }
    /**
     * Gets or sets the page width.
     *
     * @aspType int
     */
    public get pageWidth(): number {
        return this.pageWidthIn;
    }
    /**
     * Gets or sets the page width.
     *
     * @aspType int
     */
    public set pageWidth(value: number) {
        this.pageWidthIn = value;
        this.notifyPropertyChanged('pageWidth');
    }
    /**
     * Gets or sets the page left margin.
     *
     * @aspType int
     */
    public get leftMargin(): number {
        return this.leftMarginIn;
    }
    /**
     * Gets or sets the page left margin.
     *
     * @aspType int
     */
    public set leftMargin(value: number) {
        this.leftMarginIn = value;
        this.notifyPropertyChanged('leftMargin');
    }
    /**
     * Gets or sets the page bottom margin.
     *
     * @aspType int
     */
    public get bottomMargin(): number {
        return this.bottomMarginIn;
    }
    /**
     * Gets or sets the page bottom margin.
     *
     * @aspType int
     */
    public set bottomMargin(value: number) {
        this.bottomMarginIn = value;
        this.notifyPropertyChanged('bottomMargin');
    }
    /**
     * Gets or sets the page top margin.
     *
     * @aspType int
     */
    public get topMargin(): number {
        return this.topMarginIn;
    }
    /**
     * Gets or sets the page top margin.
     *
     * @aspType int
     */
    public set topMargin(value: number) {
        this.topMarginIn = value;
        this.notifyPropertyChanged('topMargin');
    }
    /**
     * Gets or sets the page right margin.
     *
     * @aspType int
     */
    public get rightMargin(): number {
        return this.rightMarginIn;
    }
    /**
     * Gets or sets the page right margin.
     *
     * @aspType int
     */
    public set rightMargin(value: number) {
        this.rightMarginIn = value;
        this.notifyPropertyChanged('rightMargin');
    }
    /**
     * Gets or sets the header distance.
     *
     * @aspType int
     */
    public get headerDistance(): number {
        return this.headerDistanceIn;
    }
    /**
     * Gets or sets the header distance.
     *
     * @aspType int
     */
    public set headerDistance(value: number) {
        this.headerDistanceIn = value;
        this.notifyPropertyChanged('headerDistance');
    }
    /**
     * Gets the first page header of the section.
     *
     * @aspType SelectionHeaderFooter
     */

    public set firstPageHeader(value: SelectionHeaderFooter) {
        this.firstPageHeaderIn = value;
    }

    public get firstPageHeader():SelectionHeaderFooter {
        return this.firstPageHeaderIn;
    }
    /**
     * Gets the first page footer of the section.
     *
     * @aspType SelectionHeaderFooter
     */

    public set firstPageFooter(value: SelectionHeaderFooter) {
        this.firstPageFooterIn = value;
    }
    public get firstPageFooter():SelectionHeaderFooter {
        return this.firstPageFooterIn;
    }
    /**
     * Gets the odd page header of the section.
     *
     * @aspType SelectionHeaderFooter
     */
    public set oddPageHeader(value: SelectionHeaderFooter) {
        this.oddPageHeaderIn = value;
    }
    public get oddPageHeader():SelectionHeaderFooter {
        return this.oddPageHeaderIn;
    }
    /**
     * Gets the odd page footer of the section.
     *
     * @aspType SelectionHeaderFooter
     */
    public set oddPageFooter(value: SelectionHeaderFooter) {
        this.oddPageFooterIn = value;
    }
    public get oddPageFooter():SelectionHeaderFooter {
        return this.oddPageFooterIn;
    }
    /**
     * Gets the even page header of the section.
     *
     * @aspType SelectionHeaderFooter
     */
    public set evenPageHeader(value: SelectionHeaderFooter) {
        this.evenPageHeaderIn = value;
    }
    public get evenPageHeader():SelectionHeaderFooter {
        return this.evenPageHeaderIn;
    }
    /**
     * Gets the even page footer of the section.
     *
     * @aspType SelectionHeaderFooter
     */
    public set evenPageFooter(value: SelectionHeaderFooter) {
        this.evenPageFooterIn = value;
    }
    public get evenPageFooter():SelectionHeaderFooter {
        return this.evenPageFooterIn;
    }
    /**
     * Gets or sets the starting page number.
     *
     * @aspType int
     */
    public get pageStartingNumber(): number {
        return this.pageStartingNumberIn;
    }
    /**
     * Gets or sets the starting page number.
     *
     * @aspType int
     */
    public set pageStartingNumber(value: number) {
        this.pageStartingNumberIn = value;
        this.notifyPropertyChanged('pageStartingNumber');
    }
    /**
     * Gets or sets a value indicating whether to restart page numbering.
     *
     * @aspType bool
     */
    public get restartPageNumbering(): boolean {
        return this.restartPageNumberingIn;
    }
    /**
     * Gets or sets a value indicating whether to restart page numbering.
     *
     * @aspType bool
     */
    public set restartPageNumbering(value: boolean) {
        this.restartPageNumberingIn = value;
        this.notifyPropertyChanged('restartPageNumbering');
    }
    /**
     * Gets or sets the footer distance.
     *
     * @aspType int
     */
    public get footerDistance(): number {
        return this.footerDistanceIn;
    }
    /**
     * Gets or sets the footer distance.
     *
     * @aspType int
     */
    public set footerDistance(value: number) {
        this.footerDistanceIn = value;
        this.notifyPropertyChanged('footerDistance');
    }
    /**
     * Gets or sets a value indicating whether the section has different first page.
     *
     * @aspType bool
     */
    public get differentFirstPage(): boolean {
        return this.differentFirstPageIn;
    }
    /**
     * Gets or sets a value indicating whether the section has different first page.
     *
     * @aspType bool
     */
    public set differentFirstPage(value: boolean) {
        this.differentFirstPageIn = value;
        this.notifyPropertyChanged('differentFirstPage');
    }
    /**
     * Gets or sets a value indicating whether the section has different odd and even page.
     *
     * @aspType bool
     */
    public get differentOddAndEvenPages(): boolean {
        return this.differentOddAndEvenPagesIn;
    }
    /**
     * Gets or sets a value indicating whether the section has different odd and even page.
     *
     * @aspType bool
     */
    public set differentOddAndEvenPages(value: boolean) {
        this.differentOddAndEvenPagesIn = value;
        this.notifyPropertyChanged('differentOddAndEvenPages');
    }
    /**
     * Gets or sets the number format of endnote.
     */
    public get endnoteNumberFormat(): FootEndNoteNumberFormat {
        return this.endnoteNumberFormatIn;
    }
    /**
     * Gets or sets the number format of endnote.
     */
    public set endnoteNumberFormat(value: FootEndNoteNumberFormat) {
        this.endnoteNumberFormatIn = value;
        this.notifyPropertyChanged('endnoteNumberFormat');
    }
    /**
     * Gets or sets the number format of footnote.
     */
    public get footNoteNumberFormat(): FootEndNoteNumberFormat {
        return this.footNoteNumberFormatIn;
    }
    /**
     * Gets or sets the number format of footnote.
     */
    public set footNoteNumberFormat(value: FootEndNoteNumberFormat) {
        this.footNoteNumberFormatIn = value;
        this.notifyPropertyChanged('footNoteNumberFormat');
    }
    /**
     * Gets or sets the number format of footnote.
     */
    public get initialFootNoteNumber(): number {
        return this.initialFootNoteNumberIn;
    }
    /**
     * Gets or sets the number format of footnote.
     */
    public set initialFootNoteNumber(value: number) {
        this.initialFootNoteNumberIn = value;
        this.notifyPropertyChanged('initialFootNoteNumber');
    }
    /**
     * Gets or sets the number format of footnote.
     */
    public get initialEndNoteNumber(): number {
        return this.initialEndNoteNumberIn;
    }
    /**
     * Gets or sets the number format of footnote.
     */
    public set initialEndNoteNumber(value: number) {
        this.initialEndNoteNumberIn = value;
        this.notifyPropertyChanged('initialEndNoteNumber');
    }

    /**
     * Gets or sets the restart index of footnote
     */
    public get restartIndexForFootnotes(): FootnoteRestartIndex {
        return this.restartIndexForFootnotesIn;
    }
    /**
     * Gets or sets the restart index of footnote
     */
    public set restartIndexForFootnotes(value: FootnoteRestartIndex) {
        this.restartIndexForFootnotesIn = value;
        this.notifyPropertyChanged('restartIndexForFootnotes');
    }
    /**
     * Gets or sets the restart index of endnote
     */
    public get restartIndexForEndnotes(): FootnoteRestartIndex {
        return this.restartIndexForEndnotesIn;
    }
    /**
     * Gets or sets the restart index of endnote
     */
    public set restartIndexForEndnotes(value: FootnoteRestartIndex) {
        this.restartIndexForEndnotesIn = value;
        this.notifyPropertyChanged('restartIndexForEndnotes');
    }
    /**
     * Gets the number of columns on a page.
     */
    public get numberOfColumns(): number {
        return this.columns.length == 0 ? 1 : this.columns.length;
    }
    /**
     * Gets or sets a value indicating whether all the columns on a page has even width and space.
     */
    public get equalWidth(): boolean {
        return this.equalWidthIn;
    }
    /**
     * Gets or sets a value indicating whether all the columns on a page has even width and space.
     */
    public set equalWidth(value: boolean) {
        this.equalWidthIn = value;
        this.notifyPropertyChanged('equalWidth');
    }
    /**
     * Gets or sets a value indicating whether the vertical lines appear between all the columns.
     */
    public get lineBetweenColumns(): boolean {
        return this.lineBetweenColumnsIn;
    }
    /**
     * Gets or sets a value indicating whether the vertical lines appear between all the columns.
     */
    public set lineBetweenColumns(value: boolean) {
        this.lineBetweenColumnsIn = value;
        this.notifyPropertyChanged('lineBetweenColumns');
    }
    /**
     * Gets or sets the columns.
     */
    public set columns(value: SelectionColumnFormat[]) {
        this.columnsIn = value;
        const selection: Selection = this.selection;
        if (!isNullOrUndefined(selection) && (selection.isCleared || selection.owner.isPastingContent
            || selection.owner.isReadOnlyMode || !selection.owner.isDocumentLoaded)
            && !selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(selection) && !isNullOrUndefined(selection.start) && !selection.isRetrieveFormatting) {                           
            this.selection.owner.editorModule.onApplyColumnFormat('columns', value);
        }        
    }
    /**
     * Gets or sets the columns.
     */
     public get columns(): SelectionColumnFormat[] {
        return this.columnsIn;
    }
    /**
     * Gets or sets the breakCode.
     *
     * @aspType int
     */
    public get breakCode(): string {
        return this.breakCodeIn;
    }
    /**
     * Gets or sets the breakCode.
     *
     * @aspType int
     */
    public set breakCode(value: string) {
        this.breakCodeIn = value;
        this.notifyPropertyChanged('breakCode');
    }

    /**
     * @param selection
     * @private
     */
    constructor(selection: Selection) {
        this.selection = selection;
        this.firstPageHeaderIn = new SelectionHeaderFooter(selection);
        this.firstPageFooterIn = new SelectionHeaderFooter(selection);
        this.oddPageHeaderIn = new SelectionHeaderFooter(selection);
        this.oddPageFooterIn = new SelectionHeaderFooter(selection);
        this.evenPageHeaderIn = new SelectionHeaderFooter(selection);
        this.evenPageFooterIn = new SelectionHeaderFooter(selection); 
    }
    /**
     * Copies the format.
     *
     * @param {WSectionFormat} format
     * @returns {void}
     * @private
     */
    public copyFormat(format: WSectionFormat): void {
        this.pageHeight = format.pageHeight;
        this.pageWidth = format.pageWidth;
        this.leftMargin = format.leftMargin;
        this.topMargin = format.topMargin;
        this.rightMargin = format.rightMargin;
        this.bottomMargin = format.bottomMargin;
        this.headerDistance = format.headerDistance;
        this.footerDistance = format.footerDistance;
        this.differentFirstPage = format.differentFirstPage;
        this.differentOddAndEvenPages = format.differentOddAndEvenPages;
        this.bidi = format.bidi;
        this.pageStartingNumber = format.pageStartingNumber;
        this.restartPageNumbering = format.restartPageNumbering;
        this.endnoteNumberFormat = format.endnoteNumberFormat;
        this.footNoteNumberFormat = format.footNoteNumberFormat;
        this.restartIndexForEndnotes = format.restartIndexForEndnotes;
        this.restartIndexForFootnotes = format.restartIndexForFootnotes;
        this.initialEndNoteNumber = format.initialEndNoteNumber;
        this.initialFootNoteNumber = format.initialFootNoteNumber;
        this.equalWidth = format.equalWidth;
        this.lineBetweenColumns = format.lineBetweenColumns;
        this.columns = [];
        for (let col of format.columns) {
            let selectCol: SelectionColumnFormat = new SelectionColumnFormat(this.selection);
            selectCol.width = HelperMethods.convertPixelToPoint((col as WColumnFormat).width);
            selectCol.space = HelperMethods.convertPixelToPoint((col as WColumnFormat).space);
            this.columns.push(selectCol);
        }
        this.breakCode = format.breakCode;
        if (this.selection.owner.enableHeaderAndFooter) {
            let headerFootersColletion: HeaderFooters[] = this.selection.documentHelper.headersFooters;
            const headerFooterWidget: HeaderFooterWidget = this.selection.start.paragraph.containerWidget as HeaderFooterWidget;
            let sectionIndex: number = headerFooterWidget.sectionIndex;
            let headerFooterType: HeaderFooterType = headerFooterWidget.headerFooterType;
            let isLinkedToPrevious: boolean = false;
            if (sectionIndex == 0) {
                this.oddPageHeader.linkToPrevious = false;
                this.oddPageFooter.linkToPrevious = false;
                this.evenPageHeader.linkToPrevious = false;
                this.evenPageFooter.linkToPrevious = false;
                this.firstPageHeader.linkToPrevious = false;
                this.firstPageFooter.linkToPrevious = false;
            }
            else if (headerFootersColletion[sectionIndex]) {
                let index: number = (this.selection.viewer as PageLayoutViewer).getHeaderFooter(headerFooterType);
                let headerFooterWidget: HeaderFooterWidget = headerFootersColletion[sectionIndex][index];
                if (isNullOrUndefined(headerFooterWidget)) {
                    isLinkedToPrevious = true;
                }
                if (!isNullOrUndefined(headerFooterWidget) || isLinkedToPrevious) {
                    switch (headerFooterType) {
                        case "OddHeader":
                            if (isLinkedToPrevious) {
                                this.oddPageHeader.linkToPrevious = true;
                            } else {
                                this.oddPageHeader.linkToPrevious = false;
                            }
                            break;
                        case "OddFooter":
                            if (isLinkedToPrevious) {
                                this.oddPageFooter.linkToPrevious = true;
                            } else {
                                this.oddPageFooter.linkToPrevious = false;
                            }
                            break;
                        case "EvenHeader":
                            if (isLinkedToPrevious) {
                                this.evenPageHeader.linkToPrevious = true;
                            } else {
                                this.evenPageHeader.linkToPrevious = false;
                            }
                            break;
                        case "EvenFooter":
                            if (isLinkedToPrevious) {
                                this.evenPageFooter.linkToPrevious = true;
                            } else {
                                this.evenPageFooter.linkToPrevious = false;
                            }
                            break;
                        case "FirstPageHeader":
                            if (isLinkedToPrevious) {
                                this.firstPageHeader.linkToPrevious = true;
                            } else {
                                this.firstPageHeader.linkToPrevious = false;
                            }
                            break;
                        case "FirstPageFooter":
                            if (isLinkedToPrevious) {
                                this.firstPageFooter.linkToPrevious = true;
                            } else {
                                this.firstPageFooter.linkToPrevious = false;
                            }
                            break;
                    }
                }
            }
        }
    }
    private applyColumnFormat(): void {

    }
    private notifyPropertyChanged(propertyName: string): void {
        const selection: Selection = this.selection;
        if (!isNullOrUndefined(selection) && !selection.isRetrieveFormatting && (selection.isCleared || selection.owner.isPastingContent
            || selection.owner.isReadOnlyMode || !selection.owner.isDocumentLoaded)) {
            return;
        }
        if (!isNullOrUndefined(selection) && !isNullOrUndefined(selection.start) && !selection.isRetrieveFormatting) {
            const value: Object = this.getPropertyvalue(propertyName);
            if (!isNullOrUndefined(value)) {
                selection.owner.editorModule.onApplySectionFormat(propertyName, value);
            }
        }
    }
    private getPropertyvalue(propertyName: string): Object {
        switch (propertyName) {
            case 'pageHeight':
                if (this.pageHeight > 0) {
                    return this.pageHeight;
                }
                return undefined;
            case 'pageWidth':
                if (this.pageWidth > 0) {
                    return this.pageWidth;
                }
                return undefined;
            case 'leftMargin':
                if (this.leftMargin >= 0) {
                    return this.leftMargin;
                }
                return undefined;
            case 'rightMargin':
                if (this.rightMargin >= 0) {
                    return this.rightMargin;
                }
                return undefined;
            case 'topMargin':
                if (this.topMargin >= 0) {
                    return this.topMargin;
                }
                return undefined;
            case 'bottomMargin':
                if (this.bottomMargin >= 0) {
                    return this.bottomMargin;
                }
                return undefined;
            case 'differentFirstPage':
                if (!isNullOrUndefined(this.differentFirstPage)) {
                    return this.differentFirstPage;
                }
                return undefined;
            case 'differentOddAndEvenPages':
                if (!isNullOrUndefined(this.differentOddAndEvenPages)) {
                    return this.differentOddAndEvenPages;
                }
                return undefined;
            case 'headerDistance':
                return this.headerDistanceIn;
            case 'footerDistance':
                return this.footerDistance;
            case 'pageStartingNumber':
                if (!isNullOrUndefined(this.pageStartingNumber)) {
                    return this.pageStartingNumber;
                }
                return undefined;
            case 'restartPageNumbering':
                if (!isNullOrUndefined(this.restartPageNumbering)) {
                    return this.restartPageNumbering;
                }
                return undefined;
            case 'endnoteNumberFormat':
                return this.endnoteNumberFormatIn;
            case 'restartIndexForEndnotes':
                return this.restartIndexForEndnotesIn;
            case 'restartIndexForFootnotes':
                return this.restartIndexForFootnotesIn;
            case 'footNoteNumberFormat':
                return this.footNoteNumberFormatIn;
            case 'initialFootNoteNumber':
                return this.initialFootNoteNumber;
            case 'initialEndNoteNumber':
                return this.initialEndNoteNumber;
            case 'equalWidth':
                return this.equalWidthIn;
            case 'lineBetweenColumns':
                return this.lineBetweenColumnsIn;
            case 'columns':
                return this.columnsIn;
            case 'breakCode':
                return this.breakCodeIn;
            default:
                return undefined;
        }
    }
    /**
     * Combines the format.
     *
     * @param {WSectionFormat} format
     * @private
     */
    public combineFormat(format: WSectionFormat): void {
        if (this.pageHeight > 0 && this.pageHeight !== format.pageHeight) {
            this.pageHeight = 0;
        }
        if (this.pageWidth > 0 && this.pageWidth !== format.pageWidth) {
            this.pageWidth = 0;
        }
        if (this.leftMargin > -1 && this.leftMargin !== format.leftMargin) {
            this.leftMargin = - 1;
        }
        if (this.topMargin > -1 && this.topMargin !== format.topMargin) {
            this.topMargin = -1;
        }
        if (this.rightMargin > -1 && this.rightMargin !== format.rightMargin) {
            this.rightMargin = -1;
        }
        if (this.bottomMargin > -1 && this.bottomMargin !== format.bottomMargin) {
            this.bottomMargin = -1;
        }
        if (this.headerDistance !== 0 && this.headerDistance !== format.headerDistance) {
            this.headerDistance = 0;
        }
        if (this.footerDistance !== 0 && this.footerDistance !== format.footerDistance) {
            this.footerDistance = 0;
        }
        if (!isNullOrUndefined(this.differentFirstPage) && this.differentFirstPage !== format.differentFirstPage) {
            this.differentFirstPage = undefined;
        }
        if (!isNullOrUndefined(this.pageStartingNumber) && this.pageStartingNumber !== format.pageStartingNumber) {
            this.pageStartingNumber = undefined;
        }
        if (!isNullOrUndefined(this.restartPageNumbering) && this.restartPageNumbering !== format.restartPageNumbering) {
            this.restartPageNumbering = undefined;
        }
        if (!isNullOrUndefined(this.differentOddAndEvenPages) && this.differentOddAndEvenPages !== format.differentOddAndEvenPages) {
            this.differentOddAndEvenPages = undefined;
        }
        if (!isNullOrUndefined(this.bidi) && this.bidi !== format.bidi) {
            this.bidi = undefined;
        }
        if (!isNullOrUndefined(this.endnoteNumberFormat) && this.endnoteNumberFormat !== format.endnoteNumberFormat) {
            this.endnoteNumberFormat = undefined;
        }
        if (!isNullOrUndefined(this.restartIndexForEndnotes) && this.restartIndexForEndnotes !== format.restartIndexForEndnotes) {
            this.restartIndexForEndnotes = undefined;
        }
        if (!isNullOrUndefined(this.restartIndexForFootnotes) && this.restartIndexForFootnotes !== format.restartIndexForFootnotes) {
            this.restartIndexForFootnotes = undefined;
        }
        if (!isNullOrUndefined(this.footNoteNumberFormat) && this.footNoteNumberFormat !== format.footNoteNumberFormat) {
            this.footNoteNumberFormat = undefined;
        }
        if (!isNullOrUndefined(this.initialFootNoteNumber) && this.initialFootNoteNumber !== format.initialFootNoteNumber) {
            this.initialFootNoteNumber = undefined;
        }
        if (!isNullOrUndefined(this.initialEndNoteNumber) && this.initialEndNoteNumber !== format.initialEndNoteNumber) {
            this.initialEndNoteNumber = undefined;
        }
    }
    /**
     * Clears the format.
     *
     * @returns {void}
     * @private
     */
    public clearFormat(): void {
        this.headerDistance = 0;
        this.footerDistance = 0;
        this.pageHeight = 0;
        this.pageWidth = 0;
        this.leftMargin = -1;
        this.rightMargin = -1;
        this.topMargin = -1;
        this.bottomMargin = -1;
        this.differentFirstPage = undefined;
        this.differentOddAndEvenPages = undefined;
        this.bidi = undefined;
        this.pageStartingNumber = undefined;
        this.restartPageNumbering = undefined;
        this.endnoteNumberFormat = undefined;
        this.footNoteNumberFormat = undefined;
        this.restartIndexForFootnotes = undefined;
        this.restartIndexForEndnotes = undefined;
        this.initialFootNoteNumber = 1;
        this.initialEndNoteNumber = 1;
    }
    /**
     * Destroys the managed resources.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.headerDistanceIn = undefined;
        this.footerDistanceIn = undefined;
        this.pageHeightIn = undefined;
        this.pageWidthIn = undefined;
        this.leftMarginIn = undefined;
        this.rightMarginIn = undefined;
        this.topMarginIn = undefined;
        this.bottomMarginIn = undefined;
        this.differentFirstPageIn = undefined;
        this.differentOddAndEvenPagesIn = undefined;
        this.selection = undefined;
        this.bidi = undefined;
        this.pageStartingNumberIn = undefined;
        this.restartPageNumberingIn = undefined;
        this.endnoteNumberFormatIn = undefined;
        this.footNoteNumberFormatIn = undefined;
        this.restartIndexForFootnotesIn = undefined;
        this.restartIndexForEndnotesIn = undefined;
        this.initialEndNoteNumber = undefined;
        this.initialFootNoteNumber = undefined;
        this.firstPageHeaderIn = undefined;
        this.firstPageFooterIn = undefined;
        this.oddPageHeaderIn = undefined;
        this.oddPageFooterIn = undefined;
        this.evenPageHeaderIn = undefined;
        this.evenPageFooterIn = undefined;
    }
}
/**
 * Selection table format implementation
 */
export class SelectionTableFormat {
    private selection: Selection;
    private tableIn: TableWidget;
    private leftIndentIn: number = 0;
    private backgroundIn: string = undefined;
    private tableAlignmentIn: TableAlignment = undefined;
    private cellSpacingIn: number = 0;
    private leftMarginIn: number = 0;
    private rightMarginIn: number = 0;
    private topMarginIn: number = 0;
    private bottomMarginIn: number = 0;
    private preferredWidthIn: number = 0;
    private preferredWidthTypeIn: WidthType;
    private bidiIn: boolean = undefined;
    private titleIn: string;
    private descriptionIn: string;
    /**
     * Gets or sets the table.
     *
     * @private
     */
    get table(): TableWidget {
        return this.tableIn;
    }
    set table(value: TableWidget) {
        this.tableIn = value;
    }
    /**
     * Gets or sets the title of the selected table.
     *
     * @aspType string
     */
    public get title(): string {
        return this.titleIn;
    }
    /**
     * Gets or sets the title of the selected table.
     *
     * @aspType string
     */
    public set title(value: string)
    {
        if(isNullOrUndefined(this.table))
        {
            return;
        }
        this.titleIn = value;
        this.notifyPropertyChanged('title');
    }
    /**
     * Gets or sets the description of the selected table.
     *
     * @aspType string
     */
    public get description(): string 
    {
        return this.descriptionIn;
    }
    /**
     * Gets or sets the description of the selected table.
     *
     * @aspType string
     */
    public set description(value: string)
    {
        if(isNullOrUndefined(this.table))
        {
            return;
        }
        this.descriptionIn = value;
        this.notifyPropertyChanged('description');
    }
    /**
     * Gets or Sets the left indent for selected table.
     *
     * @aspType int
     */
    public get leftIndent(): number {
        return this.leftIndentIn;
    }
    /**
     * Gets or Sets the left indent for selected table.
     *
     * @aspType int
     */
    public set leftIndent(value: number) {
        if (value === this.leftIndentIn) {
            return;
        }
        this.leftIndentIn = value;
        this.notifyPropertyChanged('leftIndent');
    }
    /**
     * Gets or Sets the default top margin of cell for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public get topMargin(): number {
        return this.topMarginIn;
    }
    /**
     * Gets or Sets the default top margin of cell for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public set topMargin(value: number) {
        if (value === this.topMarginIn) {
            return;
        }
        this.topMarginIn = value;
        this.notifyPropertyChanged('topMargin');
    }
    /**
     * Gets or Sets the background for selected table.
     *
     * @default undefined
     * @aspType string
     */
    public get background(): string {
        return this.backgroundIn;
    }
    /**
     * Gets or Sets the background for selected table.
     *
     * @default undefined
     * @aspType string
     */
    public set background(value: string) {
        if (value === this.backgroundIn) {
            return;
        }
        this.backgroundIn = value;
        this.notifyPropertyChanged('background');
    }
    /**
     * Gets or Sets the table alignment for selected table.
     *
     * @default undefined
     */
    public get tableAlignment(): TableAlignment {
        return this.tableAlignmentIn;
    }
    /**
     * Gets or Sets the table alignment for selected table.
     *
     * @default undefined
     */
    public set tableAlignment(value: TableAlignment) {
        if (value === this.tableAlignmentIn) {
            return;
        }
        this.tableAlignmentIn = value;
        this.notifyPropertyChanged('tableAlignment');
    }
    /**
     * Gets or Sets the default left margin of cell for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public get leftMargin(): number {
        return this.leftMarginIn;
    }
    /**
     * Gets or Sets the default left margin of cell for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public set leftMargin(value: number) {
        if (value === this.leftMarginIn) {
            return;
        }
        this.leftMarginIn = value;
        this.notifyPropertyChanged('leftMargin');
    }
    /**
     * Gets or Sets the default bottom margin of cell for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public get bottomMargin(): number {
        return this.bottomMarginIn;
    }
    /**
     * Gets or Sets the default bottom margin of cell for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public set bottomMargin(value: number) {
        if (value === this.bottomMarginIn) {
            return;
        }
        this.bottomMarginIn = value;
        this.notifyPropertyChanged('bottomMargin');
    }
    /**
     * Gets or Sets the cell spacing for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public get cellSpacing(): number {
        return this.cellSpacingIn;
    }
    /**
     * Gets or Sets the cell spacing for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public set cellSpacing(value: number) {
        if (value === this.cellSpacingIn) {
            return;
        }
        this.cellSpacingIn = value;
        this.notifyPropertyChanged('cellSpacing');
    }
    /**
     * Gets or Sets the default right margin of cell for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public get rightMargin(): number {
        return this.rightMarginIn;
    }
    /**
     * Gets or Sets the default right margin of cell for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public set rightMargin(value: number) {
        if (value === this.rightMarginIn) {
            return;
        }
        this.rightMarginIn = value;
        this.notifyPropertyChanged('rightMargin');
    }
    /**
     * Gets or Sets the preferred width for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public get preferredWidth(): number {
        return this.preferredWidthIn;
    }
    /**
     * Gets or Sets the preferred width for selected table.
     *
     * @default undefined
     * @aspType int
     */
    public set preferredWidth(value: number) {
        if (value === this.preferredWidthIn) {
            return;
        }
        this.preferredWidthIn = value;
        this.notifyPropertyChanged('preferredWidth');
    }
    /**
     * Gets or Sets the preferred width type for selected table.
     *
     * @default undefined
     */
    public get preferredWidthType(): WidthType {
        return this.preferredWidthTypeIn;
    }
    /**
     * Gets or Sets the preferred width type for selected table.
     *
     * @default undefined
     */
    public set preferredWidthType(value: WidthType) {
        if (value === this.preferredWidthTypeIn) {
            return;
        }
        this.preferredWidthTypeIn = value;
        this.notifyPropertyChanged('preferredWidthType');
    }
    /**
     * Gets or sets the bidi property
     *
     * @aspType bool
     */
    public get bidi(): boolean {
        return this.bidiIn;
    }
    /**
     * Gets or sets the bidi property
     *
     * @aspType bool
     */
    public set bidi(value: boolean) {
        this.bidiIn = value;
        this.notifyPropertyChanged('bidi');
    }
    /**
     * @param selection
     * @private
     */
    constructor(selection: Selection) {
        this.selection = selection;
    }
    private getPropertyValue(propertyName: string): Object {
        switch (propertyName) {
            case 'tableAlignment':
                return this.tableAlignment;
            case 'leftIndent':
                return this.leftIndent;
            case 'cellSpacing':
                return this.cellSpacing;
            case 'leftMargin':
                return this.leftMargin;
            case 'rightMargin':
                return this.rightMargin;
            case 'topMargin':
                return this.topMargin;
            case 'bottomMargin':
                return this.bottomMargin;
            case 'background':
                const shading: WShading = new WShading();
                shading.backgroundColor = this.background;
                return shading;
            case 'preferredWidth':
                return this.preferredWidth;
            case 'preferredWidthType':
                return this.preferredWidthType;
            case 'bidi':
                return this.bidi;
            case 'title':
                return this.title;
            case 'description':
                return this.description;
            default:
                return undefined;
        }
    }
    private notifyPropertyChanged(propertyName: string): void {
        if (!isNullOrUndefined(this.selection) && !this.selection.isRetrieveFormatting && (this.selection.isCleared
            || !this.selection.owner.isDocumentLoaded || this.selection.owner.isReadOnlyMode
            || this.selection.owner.isPastingContent)) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            const value: Object = this.getPropertyValue(propertyName);
            if (propertyName === 'background') {
                propertyName = 'shading';
            }
            if (!isNullOrUndefined(value)) {
                this.selection.owner.editorModule.onApplyTableFormat(propertyName, value);
            }
        }
    }
    /**
     * Copies the format.
     *
     * @param {WTableFormat} format Format to copy.
     * @returns {void}
     * @private
     */
    public copyFormat(format: WTableFormat): void {
        this.leftIndent = format.leftIndent;
        this.background = format.shading.backgroundColor;
        this.tableAlignment = format.tableAlignment;
        this.leftMargin = format.leftMargin;
        this.rightMargin = format.rightMargin;
        this.topMargin = format.topMargin;
        this.bottomMargin = format.bottomMargin;
        this.cellSpacing = format.cellSpacing;
        this.preferredWidth = format.preferredWidth;
        this.preferredWidthType = format.preferredWidthType;
        this.bidi = format.bidi;
        this.title = format.title;
        this.description = format.description;
    }
    /**
     * Clears the format.
     *
     * @returns {void}
     * @private
     */
    public clearFormat(): void {
        this.table = undefined;
        this.leftIndent = 0;
        this.background = undefined;
        this.leftIndent = 0;
        this.leftMargin = 0;
        this.rightMargin = 0;
        this.topMargin = 0;
        this.bottomMargin = 0;
        this.cellSpacing = 0;
        this.tableAlignment = undefined;
        this.bidi = undefined;
    }
    /**
     * Destroys the managed resources.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.leftIndentIn = undefined;
        this.backgroundIn = undefined;
        this.leftIndentIn = undefined;
        this.leftMarginIn = undefined;
        this.rightMarginIn = undefined;
        this.topMarginIn = undefined;
        this.bottomMarginIn = undefined;
        this.cellSpacingIn = undefined;
        this.tableAlignmentIn = undefined;
        this.tableIn = undefined;
        this.selection = undefined;
        this.bidi = undefined;
    }
}
/**
 * Selection cell format implementation
 */
export class SelectionCellFormat {
    private selection: Selection;
    private verticalAlignmentIn: CellVerticalAlignment = undefined;
    private leftMarginIn: number = 0;
    private rightMarginIn: number = 0;
    private topMarginIn: number = 0;
    private bottomMarginIn: number = 0;
    private backgroundIn: string = undefined;
    private preferredWidthIn: number;
    private preferredWidthTypeIn: WidthType = undefined;
    /**
     * Gets or sets the vertical alignment of the selected cells.
     *
     * @default undefined
     */
    public get verticalAlignment(): CellVerticalAlignment {
        return this.verticalAlignmentIn;
    }
    /**
     * Gets or sets the vertical alignment of the selected cells.
     *
     * @default undefined
     */
    public set verticalAlignment(value: CellVerticalAlignment) {
        if (value === this.verticalAlignmentIn) {
            return;
        }
        this.verticalAlignmentIn = value;
        this.notifyPropertyChanged('verticalAlignment');
    }
    /**
     * Gets or Sets the left margin for selected cells.
     *
     * @default undefined
     * @aspType int
     */
    /* eslint-disable */
    public get leftMargin(): number {
        return this.leftMarginIn;
    }
    /**
     * Gets or Sets the left margin for selected cells.
     * @default undefined
     * @aspType int
     */
    public set leftMargin(value: number) {
        if (value === this.leftMarginIn) {
            return;
        }
        this.leftMarginIn = value;
        this.notifyPropertyChanged('leftMargin');
    }
    /**
     * Gets or Sets the right margin for selected cells.
     * @default undefined
     * @aspType int
     */
    public get rightMargin(): number {
        return this.rightMarginIn;
    }
    /**
     * Gets or Sets the right margin for selected cells.
     * @default undefined
     * @aspType int
     */
    public set rightMargin(value: number) {
        if (value === this.rightMarginIn) {
            return;
        }
        this.rightMarginIn = value;
        this.notifyPropertyChanged('rightMargin');
    }
    /**
     * Gets or Sets the top margin for selected cells.
     * @default undefined
     * @aspType int
     */
    public get topMargin(): number {
        return this.topMarginIn;
    }
    /**
     * Gets or Sets the top margin for selected cells.
     * @default undefined
     * @aspType int
     */
    public set topMargin(value: number) {
        if (value === this.topMarginIn) {
            return;
        }
        this.topMarginIn = value;
        this.notifyPropertyChanged('topMargin');
    }
    /**
     * Gets or Sets the bottom margin for selected cells.
     * @default undefined
     * @aspType int
     */
    public get bottomMargin(): number {
        return this.bottomMarginIn;
    }
    /**
     * Gets or Sets the bottom margin for selected cells.
     * @default undefined
     * @aspType int
     */
    public set bottomMargin(value: number) {
        if (value === this.bottomMarginIn) {
            return;
        }
        this.bottomMarginIn = value;
        this.notifyPropertyChanged('bottomMargin');
    }
    /**
     * Gets or Sets the background for selected cells.
     * @default undefined
     * @aspType string
     */
    public get background(): string {
        return this.backgroundIn;
    }
    /**
     * Gets or Sets the background for selected cells.
     * @default undefined
     * @aspType string
     */

    public set background(value: string) {
        if (value === this.backgroundIn) {
            return;
        }
        this.backgroundIn = value;
        this.notifyPropertyChanged('background');
    }
    /**
     * Gets or Sets the preferred width type for selected cells.
     * @default undefined
     */
    public get preferredWidthType(): WidthType {
        return this.preferredWidthTypeIn;
    }
    /**
     * Gets or Sets the preferred width type for selected cells.
     * @default undefined
     */
    public set preferredWidthType(value: WidthType) {
        if (value === this.preferredWidthTypeIn) {
            return;
        }
        this.preferredWidthTypeIn = value;
        this.notifyPropertyChanged('preferredWidthType');
    }
    /**
     * Gets or Sets the preferred width  for selected cells.
     * @default undefined
     * @aspType int
     */
    public get preferredWidth(): number {
        return this.preferredWidthIn;
    }
    /**
     * Gets or Sets the preferred width  for selected cells.
     * @default undefined
     * @aspType int
     */
    public set preferredWidth(value: number) {
        if (value === this.preferredWidthIn) {
            return;
        }
        this.preferredWidthIn = value;
        this.notifyPropertyChanged('preferredWidth');
    }
    /**
     * @private
     */
    constructor(selection: Selection) {
        this.selection = selection;
    }

    private notifyPropertyChanged(propertyName: string): void {
        const selection: Selection = this.selection;
        if (!isNullOrUndefined(selection)) {
            if (!selection.isRetrieveFormatting && (selection.isCleared || !selection.owner.isDocumentLoaded
                || selection.owner.isReadOnlyMode || selection.owner.isPastingContent)) {
                return;
            }
            if (!isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
                const value: Object = this.getPropertyValue(propertyName);
                if (propertyName === 'background') {
                    propertyName = 'shading';
                }
                if (!isNullOrUndefined(value)) {
                    this.selection.owner.editorModule.onApplyTableCellFormat(propertyName, value);
                }
            }
        }
    }
    private getPropertyValue(propertyName: string): Object {
        switch (propertyName) {
            case 'verticalAlignment':
                return this.verticalAlignment;
            case 'leftMargin':
                return this.leftMargin;
            case 'rightMargin':
                return this.rightMargin;
            case 'topMargin':
                return this.topMargin;
            case 'bottomMargin':
                return this.bottomMargin;
            case 'preferredWidth':
                return this.preferredWidth;
            case 'preferredWidthType':
                return this.preferredWidthType;
            case 'background':
                const shading: WShading = new WShading();
                shading.backgroundColor = this.background;
                return shading;
            default:
                return undefined;
        }
    }
    /**
     * Copies the format.
     *
     * @private
     * @param {WCellFormat} format - Source Format to copy.
     * @returns {void}
     */
    public copyFormat(format: WCellFormat): void {
        this.leftMargin = format.leftMargin;
        this.rightMargin = format.rightMargin;
        this.topMargin = format.topMargin;
        this.bottomMargin = format.bottomMargin;
        this.background = format.shading.backgroundColor;
        if (format.shading.hasValue('foregroundColor') && format.shading.textureStyle !== 'TextureNone') {
            this.background = format.shading.foregroundColor;
        }
        this.verticalAlignment = format.verticalAlignment;
        this.preferredWidth = format.preferredWidth;
        this.preferredWidthType = format.preferredWidthType;
    }
    /**
     * Clears the format.
     *
     * @private
     * @returns {void}
     */
    public clearCellFormat(): void {
        this.leftMargin = undefined;
        this.rightMargin = undefined;
        this.topMargin = undefined;
        this.bottomMargin = undefined;
        this.background = undefined;
        this.verticalAlignment = undefined;
    }
    /**
     * Combines the format.
     *
     * @param {WCellFormat} format - Returns cell format
     * @private
     */
    public combineFormat(format: WCellFormat): void {
        if (!isNullOrUndefined(this.leftMargin) && this.leftMargin !== format.leftMargin) {
            this.leftMargin = undefined;
        }
        if (!isNullOrUndefined(this.topMargin) && this.topMargin !== format.topMargin) {
            this.topMargin = undefined;
        }
        if (!isNullOrUndefined(this.rightMargin) && this.rightMargin !== format.rightMargin) {
            this.rightMargin = undefined;
        }
        if (!isNullOrUndefined(this.bottomMargin) && this.bottomMargin !== format.bottomMargin) {
            this.bottomMargin = undefined;
        }
        if (!isNullOrUndefined(this.background) && this.background !== format.shading.backgroundColor) {
            this.background = undefined;
        }
        if (!isNullOrUndefined(this.verticalAlignment) && this.verticalAlignment !== format.verticalAlignment) {
            this.verticalAlignment = undefined;
        }
        if (!isNullOrUndefined(this.preferredWidth) && this.preferredWidth !== format.preferredWidth) {
            this.preferredWidth = undefined;
        }
        if (!isNullOrUndefined(this.preferredWidthType) && this.preferredWidthType !== format.preferredWidthType) {
            this.preferredWidthType = undefined;
        }
    }
    /**
     * Clears the format.
     *
     * @private
     * @returns {void}
     */
    public clearFormat(): void {
        this.background = undefined;
        this.bottomMargin = 0;
        this.leftMargin = 0;
        this.rightMargin = 0;
        this.topMargin = 0;
        this.verticalAlignment = undefined;
    }
    /**
     * Destroys the manages resources.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.backgroundIn = undefined;
        this.verticalAlignmentIn = undefined;
        this.bottomMarginIn = undefined;
        this.leftMarginIn = undefined;
        this.rightMarginIn = undefined;
        this.topMarginIn = undefined;
        this.selection = undefined;
    }
}
/**
 * Selection row format implementation
 */
export class SelectionRowFormat {
    private selection: Selection;
    private heightIn: number = undefined;
    private heightTypeIn: HeightType = undefined;
    private isHeaderIn: boolean = undefined;
    private allowRowBreakAcrossPagesIn: boolean = undefined;
    /**
     * Gets or Sets the height for selected rows.
     *
     * @default undefined
     * @aspType int
     * @returns {number} - Returns the height
     */
    public get height(): number {
        return this.heightIn;
    }
    /**
     * Gets or Sets the height for selected rows.
     *
     * @default undefined
     * @aspType int
     * @param {number} value - Specified the value
     */
    public set height(value: number) {
        if (value === this.heightIn) {
            return;
        }
        this.heightIn = value;
        this.notifyPropertyChanged('height');
    }
    /**
     * Gets or Sets the height type for selected rows.
     *
     * @default undefined
     * @returns {HeightType} - Returns height type
     */
    public get heightType(): HeightType {
        return this.heightTypeIn;
    }
    /**
     * Gets or Sets the height type for selected rows.
     *
     * @default undefined
     * @param {HeightType} value - Specified the value
     */
    public set heightType(value: HeightType) {
        if (value === this.heightTypeIn) {
            return;
        }
        this.heightTypeIn = value;
        this.notifyPropertyChanged('heightType');
    }
    /**
     * Gets or Sets a value indicating whether the selected rows are header rows or not.
     *
     * @default undefined
     * @aspType bool
     * @returns {boolean} - Returns the is header
     */
    public get isHeader(): boolean {
        return this.isHeaderIn;
    }
    /**
     * Gets or Sets a value indicating whether the selected rows are header rows or not.
     *
     * @default undefined
     * @aspType bool
     * @param {boolean} value - Specified the value
     */
    public set isHeader(value: boolean) {
        if (value === this.isHeaderIn) {
            return;
        }
        this.isHeaderIn = value;
        this.notifyPropertyChanged('isHeader');
    }
    /**
     * Gets or Sets a value indicating whether to allow break across pages for selected rows.
     *
     * @default undefined
     * @aspType bool
     * @returns {boolean} - Returns the allow break across page
     */
    public get allowBreakAcrossPages(): boolean {
        return this.allowRowBreakAcrossPagesIn;
    }
    /**
     * Gets or Sets a value indicating whether to allow break across pages for selected rows.
     *
     * @default undefined
     * @param {boolean} value - Specified the value
     * @aspType bool
     */
    public set allowBreakAcrossPages(value: boolean) {
        if (value === this.allowRowBreakAcrossPagesIn) {
            return;
        }
        this.allowRowBreakAcrossPagesIn = value;
        this.notifyPropertyChanged('allowBreakAcrossPages');
    }
    /**
     * @param {Selection} selection - Specifies the selection
     * @private
     */
    public constructor(selection: Selection) {
        this.selection = selection;
    }
    private notifyPropertyChanged(propertyName: string): void {
        const selection: Selection = this.selection;
        if (!isNullOrUndefined(selection) && !selection.isRetrieveFormatting && (selection.isCleared || selection.owner.isReadOnlyMode
            || !selection.owner.isDocumentLoaded || selection.owner.isPastingContent)) {
            return;
        }
        if (!isNullOrUndefined(selection) && !isNullOrUndefined(selection.start) && !selection.isRetrieveFormatting) {
            const value: Object = this.getPropertyValue(propertyName);
            if (!isNullOrUndefined(value)) {
                selection.owner.editorModule.onApplyTableRowFormat(propertyName, value);
            }
        }
    }
    private getPropertyValue(propertyName: string): Object {
        switch (propertyName) {
            case 'height':
                return this.height;
            case 'heightType':
                return this.heightType;
            case 'isHeader':
                return this.isHeader;
            case 'allowBreakAcrossPages':
                return this.allowBreakAcrossPages;
            default:
                return undefined;
        }
    }
    /**
     * Copies the format.
     *
     * @param {WRowFormat} format - Specified row format
     * @private
     * @returns {void} 
     */
    public copyFormat(format: WRowFormat): void {
        this.height = format.height;
        this.heightType = format.heightType;
        this.allowBreakAcrossPages = format.allowBreakAcrossPages;
        this.isHeader = format.isHeader;
    }
    /**
     * Combines the format.
     *
     * @param {WRowFormat} format - Secifies row format
     * @private
     */
    public combineFormat(format: WRowFormat): void {
        if (!isNullOrUndefined(this.height) && this.height !== format.height) {
            this.height = undefined;
        }
        if (!isNullOrUndefined(this.heightType) && this.heightType !== format.heightType) {
            this.heightType = undefined;
        }
        if (!isNullOrUndefined(this.allowBreakAcrossPages) && this.allowBreakAcrossPages !== format.allowBreakAcrossPages) {
            this.allowBreakAcrossPages = undefined;
        }
        if (!isNullOrUndefined(this.isHeader) && this.isHeader !== format.isHeader) {
            this.isHeader = undefined;
        }
    }
    /**
     * Clears the row format.
     *
     * @private
     * @returns {void}
     */
    public clearRowFormat(): void {
        this.height = undefined;
        this.heightType = undefined;
        this.allowBreakAcrossPages = undefined;
        this.isHeader = undefined;
    }
    /**
     * Clears the format.
     *
     * @private
     * @returns {void}
     */
    public clearFormat(): void {
        this.height = 0;
        this.heightType = undefined;
        this.allowBreakAcrossPages = undefined;
        this.isHeader = undefined;
    }
    /**
     * Destroys the managed resources.
     *
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.heightIn = undefined;
        this.heightTypeIn = undefined;
        this.allowRowBreakAcrossPagesIn = undefined;
        this.isHeaderIn = undefined;
        this.selection = undefined;
    }
}
/**
 * Selection image format implementation
 */
export class SelectionImageFormat {
    /**
     * @private
     */
    public image: ImageElementBox;
    /**
     * @private
     */
    public selection: Selection;
    /**
     * Gets the width of the image.
     *
     * @aspType int
     * @returns {number} - Returns image width
     */
    public get width(): number {
        if (this.image) {
            return this.image.width;
        }
        return 0;
    }
    /**
     * Gets the height of the image.
     *
     * @aspType int
     * @returns {number} - Returns image height
     */
    public get height(): number {
        if (this.image) {
            return this.image.height;
        }
        return 0;
    }
    /**
     * Gets the alternateText of the image.
     *
     * @aspType string
     * @returns {string} - Returns image alternateText
     */
    public get alternateText(): string {
        if (this.image) {
            return this.image.alternateText;
        }
        return null;
    }
    /**
     * Sets the alternateText of the image.
     *
     * @aspType string
     * @returns {string} - Returns image alternateText
     */
    public set alternateText(value: string) {
        if (value === this.alternateText) {
            return;
        }
        this.image.alternateText = value;
    }
    /**
     * @param {Selection} selection - Specifies selecion module
     * @private
     */
    public constructor(selection: Selection) {
        this.selection = selection;
    }
    /**
     * Resizes the image based on given size.
     *
     * @param {number} width - Specified the image width
     * @param {number} height - Specifies the image height
     * @private
     * @returns {void}
     */
    public resize(width: number, height: number): void {
        this.updateImageFormat(width, height,this.alternateText);
    }
    /**
     * update the image based on given alternateText.
     *
     * @param {string} alternateText - Specified the image alternateText
     * @private
     * @returns {void}
     */
    public applyImageAlternativeText(alternateText: string): void {
        this.updateImageFormat(this.width,this.height,alternateText);
    }
    /**
     * Update image width and height
     *
     * @param {number} width - Specified the image width
     * @param {number} height - Specifies the image height
     * @param {string} alternateText - Specofies the image alternateText
     * @private
     * @returns {void}
     */
    public updateImageFormat(width: number, height: number,alternateText: string): void {
        if (this.image) {
            if (this.selection.owner.editorModule) {
                this.selection.owner.editorModule.onImageFormat(this.image, width, height,alternateText);
            }
        }
    }
    /**
     * @param {ImageElementBox} image - Specifies image element box
     * @private
     * @returns {void}
     */
    public copyImageFormat(image: ImageElementBox): void {
        this.image = image;
    }
    /**
     * @private
     * @returns {void}
     */
    public clearImageFormat(): void {
        this.image = undefined;
    }
}
/**
 * Selection column format
 */
export class SelectionColumnFormat {
    private selection: Selection;
    private widthIn: number = 0;
    private spaceIn: number = 0;
    /**
     * @param selection
     * @private
     */
    constructor(selection: Selection) {
        this.selection = selection;
    }
    /**
     * Copies the format.
     *
     * @private
     * @param {WColumnFormat} format - Source Format to copy.
     * @returns {void}
     */
     public copyFormat(format: WColumnFormat): void {
        this.width = format.width
        this.space = format.space;
    }
    /**
     * Gets or sets the width of the column.
     */
    public get width(): number {
        return this.widthIn;
    }
    /**
     * Gets or sets the width of the column.
     */
    public set width(value: number) {
        if (value === this.widthIn) {
            return;
        }
        this.widthIn = value;
        //this.notifyPropertyChanged('width');
    }
    /**
     * Gets or sets the space in between this column and next column.
     */
    public get space(): number {
        return this.spaceIn;
    }
    /**
     * Gets or sets the space in between this column and next column.
     */
    public set space(value: number) {
        if (value === this.spaceIn) {
            return;
        }
        this.spaceIn = value;
        //this.notifyPropertyChanged('space');
    }
    private getPropertyValue(property: string): Object {
        switch (property) {
            case 'space':
                return this.space;
            case 'width':
                return this.width;
            default:
                return undefined;
        }
    }
    private notifyPropertyChanged(propertyName: string): void {
        const selection: Selection = this.selection;
        if (!isNullOrUndefined(selection)) {
            this.selection.owner.editorModule.onApplyColumnFormat('columns', this.selection.sectionFormat.columns);
        }
    }
    /**
     * Clears the format.
     *
     * @private
     * @returns {void}
     */
     public clearFormat(): void {
        this.widthIn = 0;
        this.spaceIn = 0;
    }
    /**
     * Destroys the manages resources.
     * 
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.widthIn = undefined;
        this.spaceIn = undefined;
    }
}
/* eslint-enable */
