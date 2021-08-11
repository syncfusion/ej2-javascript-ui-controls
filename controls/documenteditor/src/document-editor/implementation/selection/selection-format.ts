import { Selection } from './selection';
import {
    TextAlignment, Underline, HighlightColor, BaselineAlignment, WidthType, Strikethrough, LineSpacingType,
    CellVerticalAlignment, HeightType, TableAlignment, BiDirectionalOverride, FootEndNoteNumberFormat,
    FootnoteRestartIndex
} from '../../base/types';
import {
    WSectionFormat, WCharacterFormat, WParagraphFormat, WTableFormat, WRowFormat, WCellFormat, WShading
} from '../format/index';
import { DocumentHelper } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TableWidget, ImageElementBox, ListTextElementBox } from '../viewer/page';
import { Editor } from '../index';
import { EditorHistory } from '../editor-history/index';
import { ModifiedLevel } from '../editor-history/history-helper';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WLevelOverride } from '../list/level-override';
import { Dictionary } from '../../base/dictionary';
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
        this.fontFamilyIn = value;
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
        if (!isNullOrUndefined(this.selection) && (this.selection.isCleared || (this.selection.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) ||
            !this.selection.owner.isDocumentLoaded || this.selection.owner.isPastingContent) && !this.selection.isRetrieveFormatting) {
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
    public copyFormat(format: WCharacterFormat): void {
        this.styleName = !isNullOrUndefined(format.baseCharStyle) ? format.baseCharStyle.name : 'Default Paragraph Font';
        this.fontSize = format.fontSize;
        this.fontFamily = format.fontFamily;
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
    }
    /**
     * Combines the format.
     *
     * @param {WCharacterFormat} format
     * @private
     */
    public combineFormat(format: WCharacterFormat): void {
        if (!isNullOrUndefined(this.bold) && this.bold !== format.bold) {
            this.bold = undefined;
        }
        if (!isNullOrUndefined(this.italic) && this.italic !== format.italic) {
            this.italic = undefined;
        }
        if (this.fontSize !== 0 && this.fontSize !== format.fontSize) {
            this.fontSize = 0;
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
    }
}
/**
 * Selection paragraph format implementation
 */
export class SelectionParagraphFormat {
    // Declaring the owner selection
    private selection: Selection;
    // Declaring the character format properties.
    private leftIndentIn: number = 0;
    private rightIndentIn: number = 0;
    private beforeSpacingIn: number = 0;
    private afterSpacingIn: number = 0;
    private textAlignmentIn: TextAlignment = undefined;
    private firstLineIndentIn: number = 0;
    private lineSpacingIn: number = 1;
    private lineSpacingTypeIn: LineSpacingType = undefined;
    private bidiIn: boolean = undefined;
    private keepWithNextIn: boolean = undefined;
    private keepLinesTogetherIn: boolean = undefined;
    private contextualSpacingIn: boolean = undefined;
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
        if (!isNullOrUndefined(this.selection) &&
            ((this.selection.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) || !this.selection.owner.isDocumentLoaded)
            && !this.selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            const editorModule: Editor = this.selection.owner.editorModule;
            if (propertyName === 'lineSpacing' || propertyName === 'lineSpacingType') {
                const editorHistory: EditorHistory = this.selection.owner.editorHistory;
                if (!(editorHistory && (editorHistory.isUndoing || editorHistory.isRedoing)) && this.validateLineSpacing()) {
                    this.selection.owner.editorHistory.initComplexHistory(this.selection, 'LineSpacing');
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
                    this.selection.owner.editorHistory.updateComplexHistory();
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
        this.lineSpacing = format.lineSpacing;
        this.lineSpacingType = format.lineSpacingType;
        this.textAlignment = format.textAlignment;
        this.bidi = format.bidi;
        this.keepLinesTogether = format.keepLinesTogether;
        this.keepWithNext = format.keepWithNext;
        this.contextualSpacing = format.contextualSpacing;
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

        if (!isNullOrUndefined(this.leftIndent)) {
            format.leftIndent = this.leftIndent;
        }
        if (!isNullOrUndefined(this.rightIndent)) {
            format.rightIndent = this.rightIndent;
        }
        if (!isNullOrUndefined(this.textAlignment)) {
            format.textAlignment = this.textAlignment;
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
        if (!isNullOrUndefined(this.lineSpacingType) && this.lineSpacingType !== format.lineSpacingType) {
            this.lineSpacingType = undefined;
        }
        if (!isNullOrUndefined(this.textAlignment) && this.textAlignment !== format.textAlignment) {
            this.textAlignment = undefined;
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
        if (!isNullOrUndefined(this.contextualSpacing) && this.contextualSpacing !== format.contextualSpacing) {
            this.contextualSpacing = undefined;
        }
        if (!isNullOrUndefined(this.styleName) && format.baseStyle && this.styleName !== format.baseStyle.name) {
            this.styleName = undefined;
        }
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
    public setList(listAdv: WList): void {
        if ((this.documentHelper.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) || !this.documentHelper.owner.isDocumentLoaded) {
            return;
        }
        const list: WList = this.documentHelper.getListById(this.listId);
        let collection: Dictionary<number, ModifiedLevel> = undefined;
        const currentAbstractList: WAbstractList = listAdv ? this.documentHelper.getAbstractListById(listAdv.abstractListId) : undefined;
        if (!isNullOrUndefined(list) && !isNullOrUndefined(listAdv)
            && !isNullOrUndefined(currentAbstractList) && listAdv.sourceListId === list.listId) {
            const history: EditorHistory = this.documentHelper.owner.editorHistory;
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
            // this.viewer.pages = [];
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
     * @param selection
     * @private
     */
    constructor(selection: Selection) {
        this.selection = selection;
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
    }
    private notifyPropertyChanged(propertyName: string): void {
        const selection: Selection = this.selection;
        if (!isNullOrUndefined(selection) && (selection.isCleared || selection.owner.isPastingContent
            || selection.owner.isReadOnlyMode || !selection.owner.isDocumentLoaded)
            && !selection.isRetrieveFormatting) {
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
        default:
            return undefined;
        }
    }
    private notifyPropertyChanged(propertyName: string): void {
        if (!isNullOrUndefined(this.selection) && (this.selection.isCleared
            || !this.selection.owner.isDocumentLoaded || this.selection.owner.isReadOnlyMode
            || this.selection.owner.isPastingContent) && !this.selection.isRetrieveFormatting) {
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
            if ((selection.isCleared || !selection.owner.isDocumentLoaded
                || selection.owner.isReadOnlyMode || selection.owner.isPastingContent) && !selection.isRetrieveFormatting) {
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
        if (!isNullOrUndefined(selection) && (selection.isCleared || selection.owner.isReadOnlyMode
            || !selection.owner.isDocumentLoaded || selection.owner.isPastingContent) && !selection.isRetrieveFormatting) {
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
        this.updateImageFormat(width, height);
    }
    /**
     * Update image width and height
     *
     * @param {number} width - Specified the image width
     * @param {number} height - Specifies the image height
     * @private
     * @returns {void}
     */
    public updateImageFormat(width: number, height: number): void {
        if (this.image) {
            if (this.selection.owner.editorModule) {
                this.selection.owner.editorModule.onImageFormat(this.image, width, height);
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
/* eslint-enable */
