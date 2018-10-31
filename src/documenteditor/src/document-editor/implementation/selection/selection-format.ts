import { Selection } from './selection';
import {
    TextAlignment, Underline, HighlightColor, BaselineAlignment, WidthType, Strikethrough, LineSpacingType,
    CellVerticalAlignment, HeightType, TableAlignment
} from '../../base/types';
import {
    WSectionFormat, WCharacterFormat, WParagraphFormat, WTableFormat, WRowFormat, WCellFormat, WShading
} from '../format/index';
import { LayoutViewer } from '../index';
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
    /**
     * @private
     */
    public styleName: string;
    /**
     * Gets or sets the font size of selected contents.
     */
    get fontSize(): number {
        return this.fontSizeIn;
    }
    set fontSize(value: number) {
        if (value === this.fontSizeIn) {
            return;
        }
        this.fontSizeIn = value;
        this.notifyPropertyChanged('fontSize');
    }
    /**
     * Gets or sets the font family of selected contents.
     */
    get fontFamily(): string {
        return this.fontFamilyIn;
    }
    set fontFamily(value: string) {
        if (value === this.fontFamilyIn) {
            return;
        }
        this.fontFamilyIn = value;
        this.notifyPropertyChanged('fontFamily');
    }
    /**
     * Gets or sets the font color of selected contents.
     */
    get fontColor(): string {
        return this.fontColorIn;
    }
    set fontColor(value: string) {
        if (value === this.fontColorIn) {
            return;
        }
        this.fontColorIn = value;
        this.notifyPropertyChanged('fontColor');
    }
    /**
     * Gets or sets the bold formatting of selected contents.
     */
    get bold(): boolean {
        return this.boldIn;
    }
    set bold(value: boolean) {
        if (value === this.boldIn) {
            return;
        }
        this.boldIn = value;
        this.notifyPropertyChanged('bold');
    }
    /**
     * Gets or sets the italic formatting of selected contents.
     */
    get italic(): boolean {
        return this.italicIn;
    }
    set italic(value: boolean) {
        if (value === this.italic) {
            return;
        }
        this.italicIn = value;
        this.notifyPropertyChanged('italic');
    }
    /**
     * Gets or sets the strikethrough property of selected contents.
     */
    get strikethrough(): Strikethrough {
        return this.strikeThroughIn;
    }
    set strikethrough(value: Strikethrough) {
        if (value === this.strikeThroughIn) {
            return;
        }
        this.strikeThroughIn = value;
        this.notifyPropertyChanged('strikethrough');
    }
    /**
     * Gets or sets the baseline alignment property of selected contents.
     */
    get baselineAlignment(): BaselineAlignment {
        return this.baselineAlignmentIn;
    }
    set baselineAlignment(value: BaselineAlignment) {
        if (value === this.baselineAlignmentIn) {
            return;
        }
        this.baselineAlignmentIn = value;
        this.notifyPropertyChanged('baselineAlignment');
    }
    /**
     * Gets or sets the underline style of selected contents.
     */
    get underline(): Underline {
        return this.underlineIn;
    }
    set underline(value: Underline) {
        if (value === this.underlineIn) {
            return;
        }
        this.underlineIn = value;
        this.notifyPropertyChanged('underline');
    }
    /**
     * Gets or sets the highlight color of selected contents.
     */
    get highlightColor(): HighlightColor {
        return this.highlightColorIn;
    }
    set highlightColor(value: HighlightColor) {
        if (value === this.highlightColorIn) {
            return;
        }
        this.highlightColorIn = value;
        this.notifyPropertyChanged('highlightColor');
    }
    /**
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
            default:
                return undefined;
        }
    }
    /**
     * Notifies whenever property gets changed.
     * @param  {string} propertyName
     */
    private notifyPropertyChanged(propertyName: string): void {
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(this.selection) && (this.selection.isCleared || this.selection.owner.isReadOnlyMode || !this.selection.owner.isDocumentLoaded || this.selection.owner.isPastingContent) && !this.selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            let propertyValue: Object = this.getPropertyValue(propertyName);
            if (!isNullOrUndefined(propertyValue)) {
                this.selection.owner.editorModule.onApplyCharacterFormat(propertyName, propertyValue);
            }
        }
    }
    /**
     * Copies the source format.
     * @param  {WCharacterFormat} format
     * @returns void
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
    }
    /**
     * Combines the format.
     * @param  {WCharacterFormat} format
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
    }
    /**
     * Clones the format.
     * @param  {SelectionCharacterFormat} selectionCharacterFormat
     * @returns void
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
    }
    /**
     * Checks whether current format is equal to the source format or not.
     * @param  {SelectionCharacterFormat} format
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
            && this.fontColor === format.fontColor);

    }
    /**
     * Clears the format.
     * @returns void
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
    }
    /**
     * Destroys the maintained resources.
     * @returns void
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
    /**
     * @private
     */
    public listId: number;
    private listLevelNumberIn: number = -1;
    private viewer: LayoutViewer;
    /**
     * @private
     */
    public styleName: string;
    /**
     * Gets or Sets the left indent for selected paragraphs.
     * @default undefined
     */
    get leftIndent(): number {
        return this.leftIndentIn;
    }
    set leftIndent(value: number) {
        if (value === this.leftIndentIn) {
            return;
        }
        this.leftIndentIn = value;
        this.notifyPropertyChanged('leftIndent');
    }
    /**
     * Gets or Sets the right indent for selected paragraphs.
     * @default undefined
     */
    get rightIndent(): number {
        return this.rightIndentIn;
    }
    set rightIndent(value: number) {
        if (value === this.rightIndentIn) {
            return;
        }
        this.rightIndentIn = value;
        this.notifyPropertyChanged('rightIndent');
    }
    /**
     * Gets or Sets the first line indent for selected paragraphs.
     * @default undefined
     */
    get firstLineIndent(): number {
        return this.firstLineIndentIn;
    }
    set firstLineIndent(value: number) {
        if (value === this.firstLineIndentIn) {
            return;
        }
        this.firstLineIndentIn = value;
        this.notifyPropertyChanged('firstLineIndent');
    }
    /**
     * Gets or Sets the text alignment for selected paragraphs.
     * @default undefined
     */
    get textAlignment(): TextAlignment {
        return this.textAlignmentIn;
    }
    set textAlignment(value: TextAlignment) {
        if (value === this.textAlignmentIn) {
            return;
        }
        this.textAlignmentIn = value;
        this.notifyPropertyChanged('textAlignment');
    }
    /**
     * Gets or Sets the after spacing for selected paragraphs.
     * @default undefined
     */
    get afterSpacing(): number {
        return this.afterSpacingIn;
    }
    set afterSpacing(value: number) {
        if (value === this.afterSpacingIn) {
            return;
        }
        this.afterSpacingIn = value;
        this.notifyPropertyChanged('afterSpacing');
    }
    /**
     * Gets or Sets the before spacing for selected paragraphs.
     * @default undefined
     */
    get beforeSpacing(): number {
        return this.beforeSpacingIn;
    }
    set beforeSpacing(value: number) {
        if (value === this.beforeSpacingIn) {
            return;
        }
        this.beforeSpacingIn = value;
        this.notifyPropertyChanged('beforeSpacing');
    }
    /**
     * Gets or Sets the line spacing for selected paragraphs.
     * @default undefined
     */
    get lineSpacing(): number {
        return this.lineSpacingIn;
    }
    set lineSpacing(value: number) {
        if (value === this.lineSpacingIn) {
            return;
        }
        this.lineSpacingIn = value;
        this.notifyPropertyChanged('lineSpacing');
    }
    /**
     * Gets or Sets the line spacing type for selected paragraphs.
     * @default undefined
     */
    get lineSpacingType(): LineSpacingType {
        return this.lineSpacingTypeIn;
    }
    set lineSpacingType(value: LineSpacingType) {
        if (value === this.lineSpacingTypeIn) {
            return;
        }
        this.lineSpacingTypeIn = value;
        this.notifyPropertyChanged('lineSpacingType');
    }
    /**
     * Gets or Sets the list level number for selected paragraphs.
     * @default undefined
     */
    get listLevelNumber(): number {
        return this.listLevelNumberIn;
    }
    set listLevelNumber(value: number) {
        if (value === this.listLevelNumberIn) {
            return;
        }
        this.listLevelNumberIn = value;
        this.notifyPropertyChanged('listLevelNumber');
    }
    /**
     * Gets the list text for selected paragraphs.
     */
    get listText(): string {
        let listFormat: string = undefined;
        let list: WList = this.viewer.getListById(this.listId);
        if (list instanceof WList && this.listLevelNumberIn > -1 && this.listLevelNumberIn < 9) {
            let listLevel: WListLevel = list.getListLevel(this.listLevelNumber);
            if (listLevel instanceof WListLevel) {
                if (listLevel.listLevelPattern === 'Bullet') {
                    listFormat = listLevel.numberFormat;
                } else {
                    listFormat = listLevel.numberFormat;
                    for (let i: number = 0; i < 9; i++) {
                        let levelPattern: string = '%' + (i + 1);
                        if (listFormat.indexOf(levelPattern) > -1) {
                            let level: WListLevel = i === this.listLevelNumberIn ? listLevel : list.getListLevel(i);
                            let listTextElement: ListTextElementBox = this.selection.getListTextElementBox(this.selection.start.paragraph);
                            let listText: string = listTextElement ? listTextElement.text : '';
                            listFormat = listText;
                        }
                    }
                }
            }
        }
        return listFormat;
    }
    /**
     * @private
     */
    constructor(selection: Selection, viewer: LayoutViewer) {
        this.selection = selection;
        this.viewer = viewer;
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
            default:
                return undefined;
        }
    }
    /**
     * Notifies whenever the property gets changed.
     * @param  {string} propertyName
     */
    private notifyPropertyChanged(propertyName: string): void {
        if (!isNullOrUndefined(this.selection) &&
            (this.selection.owner.isReadOnlyMode || !this.selection.owner.isDocumentLoaded)
            && !this.selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            let editorModule: Editor = this.selection.owner.editorModule;
            let value: Object = this.getPropertyValue(propertyName);
            if ((propertyName === 'leftIndent' || propertyName === 'rightIndent' || propertyName === 'firstLineIndent')
                && !(value >= -1056 && value < 1056)) {
                return;
            }
            if (propertyName === 'listLevelNumber') {
                editorModule.onApplyListInternal(this.viewer.getListById(this.listId), this.listLevelNumber);
            } else {
                editorModule.onApplyParagraphFormat(propertyName, value, propertyName === 'textAlignment' ? true : false, false);
            }
        }
    }
    /**
     * Copies the format.
     * @param  {WParagraphFormat} format
     * @returns void
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
     * @param  {WParagraphFormat} format
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
    }
    /**
     * Combines the format.
     * @param  {WParagraphFormat} format
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
        // tslint:disable-next-line:max-line-length
        if (this.listLevelNumber >= 0 && !isNullOrUndefined(this.listId) && (isNullOrUndefined(format.listFormat) || format.listFormat.listLevelNumber !== this.listLevelNumber)) {
            this.listLevelNumber = -1;
        }
        // tslint:disable-next-line:max-line-length
        if (isNullOrUndefined(format.listFormat) || isNullOrUndefined(format.listFormat.listId) || (!isNullOrUndefined(this.listId) && this.listId !== format.listFormat.listId)) {
            this.listId = undefined;
        }
    }
    /**
     * Clears the format.
     * @returns void
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
    }
    /**
     * Gets the clone of list at current selection.
     * @returns WList
     * @private
     */
    public getList(): WList {
        let list: WList = this.viewer.getListById(this.listId);
        if (!isNullOrUndefined(list)) {
            let listAdv: WList = new WList();
            let abstractList: WAbstractList = new WAbstractList();
            let currentAbstractList: WAbstractList = this.viewer.getAbstractListById(list.abstractListId);
            let editor: Editor = this.selection.owner.editorModule;
            if (!isNullOrUndefined(currentAbstractList)) {
                for (let i: number = 0; i < currentAbstractList.levels.length; i++) {
                    let level: WListLevel = editor.cloneListLevel(currentAbstractList.levels[i]);
                    abstractList.levels.push(level);
                    level.ownerBase = abstractList;
                }
            } else {
                abstractList.levels.push(new WListLevel(abstractList));
            }
            if (!isNullOrUndefined(list.levelOverrides)) {
                for (let i: number = 0; i < list.levelOverrides.length; i++) {
                    let levelOverride: WLevelOverride = editor.cloneLevelOverride(list.levelOverrides[i]);
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
     * @param  {WList} listAdv
     * @private
     */
    public setList(listAdv: WList): void {
        if (this.viewer.owner.isReadOnlyMode || !this.viewer.owner.isDocumentLoaded) {
            return;
        }
        let list: WList = this.viewer.getListById(this.listId);
        let collection: Dictionary<number, ModifiedLevel> = undefined;
        let currentAbstractList: WAbstractList = listAdv ? this.viewer.getAbstractListById(listAdv.abstractListId) : undefined;
        if (!isNullOrUndefined(list) && !isNullOrUndefined(listAdv)
            && !isNullOrUndefined(currentAbstractList) && listAdv.sourceListId === list.listId) {
            let history: EditorHistory = this.viewer.owner.editorHistory;
            let listLevel: WListLevel = this.viewer.layout.getListLevel(list, 1);
            this.selection.owner.isLayoutEnabled = false;
            this.viewer.owner.editorModule.setOffsetValue(this.selection);
            if (history) {
                collection = history.updateListChangesInHistory(currentAbstractList, list);
            }
            this.viewer.owner.editorModule.updateListParagraphs();
            if (history) {
                history.applyListChanges(this.selection, collection);
            }
            this.selection.owner.isLayoutEnabled = true;
            this.viewer.renderedLists.clear();
            // this.viewer.pages = [];
            this.viewer.owner.editorModule.layoutWholeDocument();
            this.viewer.owner.editorModule.updateSelectionTextPosition(false);
            if (history && history.currentBaseHistoryInfo) {
                if (history.currentBaseHistoryInfo.modifiedProperties.length > 0) {
                    history.currentBaseHistoryInfo.updateSelection();
                }
                history.updateHistory();
            }
            this.viewer.owner.editorModule.fireContentChange();
        } else if (!isNullOrUndefined(listAdv)) {
            this.selection.owner.isLayoutEnabled = false;
            if (!isNullOrUndefined(currentAbstractList) && this.viewer.abstractLists.indexOf(currentAbstractList) === -1) {
                this.viewer.abstractLists.push(currentAbstractList);
            }
            if (this.viewer.lists.indexOf(listAdv) === -1) {
                this.viewer.lists.push(listAdv);
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
     * @returns void
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
        this.viewer = undefined;
        this.selection = undefined;
        this.styleName = undefined;
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
    /**
     * Gets or sets the page height.
     */
    get pageHeight(): number {
        return this.pageHeightIn;
    }
    set pageHeight(value: number) {
        this.pageHeightIn = value;
        this.notifyPropertyChanged('pageHeight');
    }
    /**
     * Gets or sets the page width.
     */
    get pageWidth(): number {
        return this.pageWidthIn;
    }
    set pageWidth(value: number) {
        this.pageWidthIn = value;
        this.notifyPropertyChanged('pageWidth');
    }
    /**
     * Gets or sets the page left margin.
     */
    get leftMargin(): number {
        return this.leftMarginIn;
    }
    set leftMargin(value: number) {
        this.leftMarginIn = value;
        this.notifyPropertyChanged('leftMargin');
    }
    /**
     * Gets or sets the page bottom margin.
     */
    get bottomMargin(): number {
        return this.bottomMarginIn;
    }
    set bottomMargin(value: number) {
        this.bottomMarginIn = value;
        this.notifyPropertyChanged('bottomMargin');
    }
    /**
     * Gets or sets the page top margin.
     */
    get topMargin(): number {
        return this.topMarginIn;
    }
    set topMargin(value: number) {
        this.topMarginIn = value;
        this.notifyPropertyChanged('topMargin');
    }
    /**
     * Gets or sets the page right margin.
     */
    get rightMargin(): number {
        return this.rightMarginIn;
    }
    set rightMargin(value: number) {
        this.rightMarginIn = value;
        this.notifyPropertyChanged('rightMargin');
    }
    /**
     * Gets or sets the header distance.
     */
    get headerDistance(): number {
        return this.headerDistanceIn;
    }
    set headerDistance(value: number) {
        this.headerDistanceIn = value;
        this.notifyPropertyChanged('headerDistance');
    }
    /**
     * Gets or sets the footer distance.
     */
    get footerDistance(): number {
        return this.footerDistanceIn;
    }
    set footerDistance(value: number) {
        this.footerDistanceIn = value;
        this.notifyPropertyChanged('footerDistance');
    }
    /**
     * Gets or sets a value indicating whether the section has different first page.
     */
    get differentFirstPage(): boolean {
        return this.differentFirstPageIn;
    }
    set differentFirstPage(value: boolean) {
        this.differentFirstPageIn = value;
        this.notifyPropertyChanged('differentFirstPage');
    }
    /**
     * Gets or sets a value indicating whether the section has different odd and even page.
     */
    get differentOddAndEvenPages(): boolean {
        return this.differentOddAndEvenPagesIn;
    }
    set differentOddAndEvenPages(value: boolean) {
        this.differentOddAndEvenPagesIn = value;
        this.notifyPropertyChanged('differentOddAndEvenPages');
    }
    /**
     * @private
     */
    constructor(selection: Selection) {
        this.selection = selection;
    }
    /**
     * Copies the format.
     * @param  {WSectionFormat} format
     * @returns void
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
    }
    private notifyPropertyChanged(propertyName: string): void {
        let selection: Selection = this.selection;
        if (!isNullOrUndefined(selection) && (selection.isCleared || selection.owner.isPastingContent
            || selection.owner.isReadOnlyMode || !selection.owner.isDocumentLoaded)
            && !selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(selection) && !isNullOrUndefined(selection.start) && !selection.isRetrieveFormatting) {
            let value: Object = this.getPropertyvalue(propertyName);
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
            default:
                return undefined;
        }
    }
    /**
     * Combines the format.
     * @param  {WSectionFormat} format
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
        if (!isNullOrUndefined(this.differentOddAndEvenPages) && this.differentOddAndEvenPages !== format.differentOddAndEvenPages) {
            this.differentOddAndEvenPages = undefined;
        }
    }
    /**
     * Clears the format.
     * @returns void
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
    }
    /**
     * Destroys the managed resources.
     * @returns void
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
    /**
     * Gets or sets the table.
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
     * @private
     */
    get leftIndent(): number {
        return this.leftIndentIn;
    }
    set leftIndent(value: number) {
        if (value === this.leftIndentIn) {
            return;
        }
        this.leftIndentIn = value;
        this.notifyPropertyChanged('leftIndent');
    }
    /**
     * Gets or Sets the default top margin of cell for selected table.
     * @default undefined
     */
    get topMargin(): number {
        return this.topMarginIn;
    }
    set topMargin(value: number) {
        if (value === this.topMarginIn) {
            return;
        }
        this.topMarginIn = value;
        this.notifyPropertyChanged('topMargin');
    }
    /**
     * Gets or Sets the background for selected table.
     * @default undefined
     */
    get background(): string {
        return this.backgroundIn;
    }
    set background(value: string) {
        if (value === this.backgroundIn) {
            return;
        }
        this.backgroundIn = value;
        this.notifyPropertyChanged('background');
    }
    /**
     * Gets or Sets the table alignment for selected table.
     * @default undefined
     */
    get tableAlignment(): TableAlignment {
        return this.tableAlignmentIn;
    }
    set tableAlignment(value: TableAlignment) {
        if (value === this.tableAlignmentIn) {
            return;
        }
        this.tableAlignmentIn = value;
        this.notifyPropertyChanged('tableAlignment');
    }
    /**
     * Gets or Sets the default left margin of cell for selected table.
     * @default undefined
     */
    get leftMargin(): number {
        return this.leftMarginIn;
    }
    set leftMargin(value: number) {
        if (value === this.leftMarginIn) {
            return;
        }
        this.leftMarginIn = value;
        this.notifyPropertyChanged('leftMargin');
    }
    /**
     * Gets or Sets the default bottom margin of cell for selected table.
     * @default undefined
     */
    get bottomMargin(): number {
        return this.bottomMarginIn;
    }
    set bottomMargin(value: number) {
        if (value === this.bottomMarginIn) {
            return;
        }
        this.bottomMarginIn = value;
        this.notifyPropertyChanged('bottomMargin');
    }
    /**
     * Gets or Sets the cell spacing for selected table.
     * @default undefined
     */
    get cellSpacing(): number {
        return this.cellSpacingIn;
    }
    set cellSpacing(value: number) {
        if (value === this.cellSpacingIn) {
            return;
        }
        this.cellSpacingIn = value;
        this.notifyPropertyChanged('cellSpacing');
    }
    /**
     * Gets or Sets the default right margin of cell for selected table.
     * @default undefined
     */
    get rightMargin(): number {
        return this.rightMarginIn;
    }
    set rightMargin(value: number) {
        if (value === this.rightMarginIn) {
            return;
        }
        this.rightMarginIn = value;
        this.notifyPropertyChanged('rightMargin');
    }
    /**
     * Gets or Sets the preferred width for selected table.
     * @default undefined
     */
    get preferredWidth(): number {
        return this.preferredWidthIn;
    }
    set preferredWidth(value: number) {
        if (value === this.preferredWidthIn) {
            return;
        }
        this.preferredWidthIn = value;
        this.notifyPropertyChanged('preferredWidth');
    }
    /**
     * Gets or Sets the preferred width type for selected table.
     * @default undefined
     */
    get preferredWidthType(): WidthType {
        return this.preferredWidthTypeIn;
    }
    set preferredWidthType(value: WidthType) {
        if (value === this.preferredWidthTypeIn) {
            return;
        }
        this.preferredWidthTypeIn = value;
        this.notifyPropertyChanged('preferredWidthType');
    }
    /**
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
                let shading: WShading = new WShading();
                shading.backgroundColor = this.background;
                return shading;
            case 'preferredWidth':
                return this.preferredWidth;
            case 'preferredWidthType':
                return this.preferredWidthType;
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
            let value: Object = this.getPropertyValue(propertyName);
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
     * @param  {WTableFormat} format Format to copy.
     * @returns void
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
    }
    /**
     * Clears the format.
     * @returns void
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
    }
    /**
     * Destroys the managed resources.
     * @returns void
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
     * @default undefined
     */
    get verticalAlignment(): CellVerticalAlignment {
        return this.verticalAlignmentIn;
    }
    set verticalAlignment(value: CellVerticalAlignment) {
        if (value === this.verticalAlignmentIn) {
            return;
        }
        this.verticalAlignmentIn = value;
        this.notifyPropertyChanged('verticalAlignment');
    }
    /**
     * Gets or Sets the left margin for selected cells.
     * @default undefined
     */
    /* tslint:disable */
    get leftMargin(): number {
        return this.leftMarginIn;
    }
    set leftMargin(value: number) {
        if (value === this.leftMarginIn) {
            return;
        }
        this.leftMarginIn = value;
        this.notifyPropertyChanged('leftMargin');
    }
    /**
     * Gets or Sets the right margin for selected cells.
     * @default undefined
     */
    get rightMargin(): number {
        return this.rightMarginIn;
    }
    set rightMargin(value: number) {
        if (value === this.rightMarginIn) {
            return;
        }
        this.rightMarginIn = value;
        this.notifyPropertyChanged('rightMargin');
    }
    /**
     * Gets or Sets the top margin for selected cells.
     * @default undefined
     */
    get topMargin(): number {
        return this.topMarginIn;
    }
    set topMargin(value: number) {
        if (value === this.topMarginIn) {
            return;
        }
        this.topMarginIn = value;
        this.notifyPropertyChanged('topMargin');
    }
    /**
     * Gets or Sets the bottom margin for selected cells.
     * @default undefined
     */
    get bottomMargin(): number {
        return this.bottomMarginIn;
    }
    set bottomMargin(value: number) {
        if (value === this.bottomMarginIn) {
            return;
        }
        this.bottomMarginIn = value;
        this.notifyPropertyChanged('bottomMargin');
    }
    /**
     * Gets or Sets the background for selected cells.
     * @default undefined
     */
    get background(): string {
        return this.backgroundIn;
    }
    /* tslint:enable */
    set background(value: string) {
        if (value === this.backgroundIn) {
            return;
        }
        this.backgroundIn = value;
        this.notifyPropertyChanged('background');
    }
    /* tslint:disable */
    /**
     * Gets or Sets the preferred width type for selected cells.
     * @default undefined
     */
    get preferredWidthType(): WidthType {
        return this.preferredWidthTypeIn;
    }

    set preferredWidthType(value: WidthType) {
        if (value === this.preferredWidthTypeIn) {
            return;
        }
        this.preferredWidthTypeIn = value;
        this.notifyPropertyChanged('preferredWidthType');
    }
    /**
     * Gets or Sets the preferred width  for selected cells.
     * @default undefined
     */
    get preferredWidth(): number {
        return this.preferredWidthIn;
    }

    set preferredWidth(value: number) {
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
    /* tslint:enable */
    private notifyPropertyChanged(propertyName: string): void {
        let selection: Selection = this.selection;
        if (!isNullOrUndefined(selection)) {
            if ((selection.isCleared || !selection.owner.isDocumentLoaded
                || selection.owner.isReadOnlyMode || selection.owner.isPastingContent) && !selection.isRetrieveFormatting) {
                return;
            }
            if (!isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
                let value: Object = this.getPropertyValue(propertyName);
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
                let shading: WShading = new WShading();
                shading.backgroundColor = this.background;
                return shading;
            default:
                return undefined;
        }
    }
    /**
     * Copies the format.
     * @param  {WCellFormat} format Source Format to copy.
     * @returns void
     * @private
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
     * @returns void
     * @private
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
     * @param  {WCellFormat} format 
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
     * @returns void
     * @private
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
     * @returns void
     * @private
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
     * @default undefined
     */
    get height(): number {
        return this.heightIn;
    }
    set height(value: number) {
        if (value === this.heightIn) {
            return;
        }
        this.heightIn = value;
        this.notifyPropertyChanged('height');
    }
    /**
     * Gets or Sets the height type for selected rows.
     * @default undefined
     */
    get heightType(): HeightType {
        return this.heightTypeIn;
    }
    set heightType(value: HeightType) {
        if (value === this.heightTypeIn) {
            return;
        }
        this.heightTypeIn = value;
        this.notifyPropertyChanged('heightType');
    }
    /**
     * Gets or Sets a value indicating whether the selected rows are header rows or not.
     * @default undefined
     */
    get isHeader(): boolean {
        return this.isHeaderIn;
    }
    set isHeader(value: boolean) {
        if (value === this.isHeaderIn) {
            return;
        }
        this.isHeaderIn = value;
        this.notifyPropertyChanged('isHeader');
    }
    /**
     * Gets or Sets a value indicating whether to allow break across pages for selected rows.
     * @default undefined
     */
    get allowBreakAcrossPages(): boolean {
        return this.allowRowBreakAcrossPagesIn;
    }
    set allowBreakAcrossPages(value: boolean) {
        if (value === this.allowRowBreakAcrossPagesIn) {
            return;
        }
        this.allowRowBreakAcrossPagesIn = value;
        this.notifyPropertyChanged('allowBreakAcrossPages');
    }
    /**
     * @private
     */
    constructor(selection: Selection) {
        this.selection = selection;
    }
    private notifyPropertyChanged(propertyName: string): void {
        let selection: Selection = this.selection;
        if (!isNullOrUndefined(selection) && (selection.isCleared || selection.owner.isReadOnlyMode
            || !selection.owner.isDocumentLoaded || selection.owner.isPastingContent) && !selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(selection) && !isNullOrUndefined(selection.start) && !selection.isRetrieveFormatting) {
            let value: Object = this.getPropertyValue(propertyName);
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
     * @param  {WRowFormat} format
     * @returns void
     * @private
     */
    public copyFormat(format: WRowFormat): void {
        this.height = format.height;
        this.heightType = format.heightType;
        this.allowBreakAcrossPages = format.allowBreakAcrossPages;
        this.isHeader = format.isHeader;
    }
    /**
     * Combines the format.
     * @param  {WRowFormat} format
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
     * @returns void
     * @private
     */
    public clearRowFormat(): void {
        this.height = undefined;
        this.heightType = undefined;
        this.allowBreakAcrossPages = undefined;
        this.isHeader = undefined;
    }
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    public clearFormat(): void {
        this.height = 0;
        this.heightType = undefined;
        this.allowBreakAcrossPages = undefined;
        this.isHeader = undefined;
    }
    /**
     * Destroys the managed resources.
     * @returns void
     * @private
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
     */
    get width(): number {
        if (this.image) {
            return this.image.width;
        }
        return 0;
    }
    /**
     * Gets the height of the image.
     */
    get height(): number {
        if (this.image) {
            return this.image.height;
        }
        return 0;
    }
    /**
     * @private
     */
    constructor(selection: Selection) {
        this.selection = selection;
    }
    /**
     * Resizes the image based on given size.
     * @param width 
     * @param height 
     */
    public resize(width: number, height: number): void {
        this.updateImageFormat(width, height);
    }
    /**
     * Update image width and height
     * @private
     */
    public updateImageFormat(width: number, height: number): void {
        if (this.image) {
            if (this.selection.owner.editorModule) {
                this.selection.owner.editorModule.onImageFormat(this.image, width, height);
            }
        }
    }
    /**
     * @private
     */
    public copyImageFormat(image: ImageElementBox): void {
        this.image = image;
    }
    /**
     * @private
     */
    public clearImageFormat(): void {
        this.image = undefined;
    }
}
/* tslint:enable */