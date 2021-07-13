/* eslint-disable */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from './dictionary';
/**
 * @private
 */
export class WUniqueFormat {
    public propertiesHash: Dictionary<number, object>;
    public referenceCount: number = 0;
    public uniqueFormatType: number;

    public constructor(type: number) {
        this.uniqueFormatType = type;
        this.propertiesHash = new Dictionary<number, object>();
    }
    /**
     * @private
     */
    public isEqual(source: Dictionary<number, object>, property: string, modifiedValue: object): boolean {
        let isEqual: boolean = false;
        switch (this.uniqueFormatType) {
        case 1:
            isEqual = this.isBorderEqual(source, property, modifiedValue);
            break;
        case 2:
            isEqual = this.isCharacterFormatEqual(source, property, modifiedValue);
            break;
        case 3:
            isEqual = this.isParagraphFormatEqual(source, property, modifiedValue);
            break;
        case 4:
            isEqual = this.isCellFormatEqual(source, property, modifiedValue);
            break;
        case 5:
            isEqual = this.isShadingEqual(source, property, modifiedValue);
            break;
        case 6:
            isEqual = this.isRowFormatEqual(source, property, modifiedValue);
            break;
        case 7:
            isEqual = this.isListFormatEqual(source, property, modifiedValue);
            break;
        case 8:
            isEqual = this.isTableFormatEqual(source, property, modifiedValue);
            break;
        case 9:
            isEqual = this.isListLevelEqual(source, property, modifiedValue);
            break;
        case 10:
            isEqual = this.isSectionFormatEqual(source, property, modifiedValue);
            break;
        default:
            break;
        }
        return isEqual;
    }

    private isNotEqual(property: string, source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: object, uniqueFormatType: number): boolean {
        let targetValue: object = undefined;
        const propertyType: number = WUniqueFormat.getPropertyType(uniqueFormatType, property);
        if (this.propertiesHash.containsKey(propertyType)) {
            targetValue = this.propertiesHash.get(propertyType);
        }
        let sourceValue: object = undefined;
        if (property === modifiedProperty) {
            sourceValue = modifiedValue;
        } else if (source.containsKey(propertyType)) {
            sourceValue = source.get(propertyType);
        }

        if (!(targetValue === sourceValue || (!isNullOrUndefined(targetValue) && !isNullOrUndefined(sourceValue) && targetValue === sourceValue))) {
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    public static getPropertyType(uniqueFormatType: number, property: string): number {
        let type: number = 0;
        switch (uniqueFormatType) {
        case 1:
            type = this.getBorderPropertyType(property);
            break;
        case 2:
            type = this.getCharacterFormatPropertyType(property);
            break;
        case 3:
            type = this.getParaFormatPropertyType(property);
            break;
        case 4:
            type = this.getCellFormatPropertyType(property);
            break;
        case 5:
            type = this.getShadingPropertyType(property);
            break;
        case 6:
            type = this.getRowFormatType(property);
            break;
        case 7:
            type = this.getListFormatType(property);
            break;
        case 8:
            type = this.getTableFormatType(property);
            break;
        case 9:
            type = this.getListLevelType(property);
            break;
        case 10:
            type = this.getSectionFormatType(property);
            break;
        default:
            break;
        }
        return type;
    }
    private static getRowFormatType(property: string): number {
        if (property === 'allowBreakAcrossPages') {
            return 1;
        }
        if (property === 'isHeader') {
            return 2;
        }
        if (property === 'height') {
            return 3;
        }
        if (property === 'heightType') {
            return 4;
        }
        if (property === 'gridBefore') {
            return 5;
        }
        if (property === 'gridBeforeWidth') {
            return 6;
        }
        if (property === 'gridBeforeWidthType') {
            return 7;
        }
        if (property === 'gridAfter') {
            return 8;
        }
        if (property === 'gridAfterWidth') {
            return 9;
        }
        if (property === 'gridAfterWidthType') {
            return 10;
        }
        if (property === 'leftMargin') {
            return 11;
        }
        if (property === 'topMargin') {
            return 12;
        }
        if (property === 'bottomMargin') {
            return 13;
        }
        if (property === 'rightMargin') {
            return 14;
        }
        if (property === 'leftIndent') {
            return 15;
        }
        return 0;
    }
    private static getListFormatType(property: string): number {
        if (property === 'listId') {
            return 1;
        }
        if (property === 'listLevelNumber') {
            return 2;
        }
        return 0;
    }
    private static getTableFormatType(property: string): number {
        if (property === 'leftMargin') {
            return 1;
        }
        if (property === 'rightMargin') {
            return 2;
        }
        if (property === 'topMargin') {
            return 3;
        }
        if (property === 'bottomMargin') {
            return 4;
        }
        if (property === 'cellSpacing') {
            return 5;
        }
        if (property === 'leftIndent') {
            return 6;
        }
        if (property === 'tableAlignment') {
            return 7;
        }
        if (property === 'preferredWidth') {
            return 8;
        }
        if (property === 'preferredWidthType') {
            return 9;
        }
        if (property === 'bidi') {
            return 10;
        }
        if (property === 'allowAutoFit') {
            return 11;
        }
        if (property === 'horizontalPositionAbs') {
            return 12;
        }
        if (property === 'horizontalPosition') {
            return 13;
        }
        return 0;
    }
    private static getListLevelType(property: string): number {
        if (property === 'listLevelPattern') {
            return 1;
        }
        if (property === 'startAt') {
            return 2;
        }
        if (property === 'followCharacter') {
            return 3;
        }
        if (property === 'numberFormat') {
            return 4;
        }
        if (property === 'restartLevel') {
            return 5;
        }
        return 0;
    }

    private static getShadingPropertyType(property: string): number {
        if (property === 'backgroundColor') {
            return 1;
        }
        if (property === 'foregroundColor') {
            return 2;
        }
        if (property === 'textureStyle') {
            return 3;
        }
        return 0;
    }
    private static getCellFormatPropertyType(property: string): number {
        if (property === 'leftMargin') {
            return 1;
        }
        if (property === 'rightMargin') {
            return 2;
        }
        if (property === 'topMargin') {
            return 3;
        }
        if (property === 'bottomMargin') {
            return 4;
        }
        if (property === 'columnSpan') {
            return 5;
        }
        if (property === 'rowSpan') {
            return 6;
        }
        if (property === 'verticalAlignment') {
            return 7;
        }
        if (property === 'preferredWidthType') {
            return 8;
        }
        if (property === 'preferredWidth') {
            return 9;
        }
        if (property === 'cellWidth') {
            return 10;
        }
        return 0;
    }
    private static getBorderPropertyType(property: string): number {
        if (property === 'color') {
            return 1;
        }
        if (property === 'lineStyle') {
            return 2;
        }
        if (property === 'lineWidth') {
            return 3;
        }
        if (property === 'shadow') {
            return 4;
        }
        if (property === 'space') {
            return 5;
        }
        if (property === 'hasNoneStyle') {
            return 6;
        }
        return 0;
    }
    private static getCharacterFormatPropertyType(property: string): number {
        if (property === 'fontColor') {
            return 1;
        }
        if (property === 'fontFamily') {
            return 2;
        }
        if (property === 'fontSize') {
            return 3;
        }
        if (property === 'bold') {
            return 4;
        }
        if (property === 'italic') {
            return 5;
        }
        if (property === 'underline') {
            return 6;
        }
        if (property === 'strikethrough') {
            return 7;
        }
        if (property === 'baselineAlignment') {
            return 8;
        }
        if (property === 'highlightColor') {
            return 9;
        }
        if (property === 'bidi') {
            return 10;
        }
        if (property === 'bdo') {
            return 11;
        }
        if (property === 'boldBidi') {
            return 12;
        }
        if (property === 'italicBidi') {
            return 13;
        }
        if (property === 'fontFamilyBidi') {
            return 14;
        }
        if (property === 'fontSizeBidi') {
            return 15;
        }
        if (property === 'allCaps') {
            return 16;
        }
        return 0;
    }
    private static getParaFormatPropertyType(property: string): number {
        if (property === 'leftIndent') {
            return 1;
        }
        if (property === 'rightIndent') {
            return 2;
        }
        if (property === 'firstLineIndent') {
            return 3;
        }
        if (property === 'textAlignment') {
            return 4;
        }
        if (property === 'beforeSpacing') {
            return 5;
        }
        if (property === 'afterSpacing') {
            return 6;
        }
        if (property === 'lineSpacing') {
            return 7;
        }
        if (property === 'lineSpacingType') {
            return 8;
        }
        if (property === 'outlineLevel') {
            return 9;
        }
        if (property === 'bidi') {
            return 10;
        }
        if (property === 'contextualSpacing') {
            return 11;
        }
        if (property === 'keepWithNext') {
            return 12;
        }
        if (property === 'keepLinesTogether') {
            return 13;
        }
        return 0;
    }
    private static getSectionFormatType(property: string): number {
        if (property === 'headerDistance') {
            return 1;
        }
        if (property === 'footerDistance') {
            return 2;
        }
        if (property === 'differentFirstPage') {
            return 3;
        }
        if (property === 'differentOddAndEvenPages') {
            return 4;
        }
        if (property === 'pageWidth') {
            return 5;
        }
        if (property === 'pageHeight') {
            return 6;
        }
        if (property === 'leftMargin') {
            return 7;
        }
        if (property === 'topMargin') {
            return 8;
        }
        if (property === 'rightMargin') {
            return 9;
        }
        if (property === 'bottomMargin') {
            return 10;
        }
        if (property === 'bidi') {
            return 11;
        }
        if (property === 'restartPageNumbering') {
            return 12;
        }
        if (property === 'pageStartingNumber') {
            return 13;
        }
        if (property === 'endnoteNumberFormat') {
            return 14;
        }
        if (property === 'endnotePosition') {
            return 15;
        }
        if (property === 'footNoteNumberFormat') {
            return 16;
        }
        if (property === 'footnotePosition') {
            return 17;
        }
        if (property === 'restartIndexForEndnotes') {
            return 18;
        }
        if (property === 'restartIndexForFootnotes') {
            return 19;
        }
        if (property === 'initialFootNoteNumber') {
            return 20;
        }
        if (property === 'initialEndNoteNumber') {
            return 21;
        }
        return 0;
    }
    /**
     * @private
     */
    public isBorderEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: Object): boolean {
        if (this.isNotEqual('color', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('lineStyle', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('lineWidth', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('shadow', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('space', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('hasNoneStyle', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public isCharacterFormatEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: object): boolean {
        if (this.isNotEqual('fontColor', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontFamily', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontSize', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('bold', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('italic', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('underline', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('strikethrough', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('baselineAlignment', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('highlightColor', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('bidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('bdo', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontColor', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontFamilyBidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontSizeBidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('boldBidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('italicBidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('allCaps', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        return true;

    }
    private isParagraphFormatEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: Object): boolean {
        if (this.isNotEqual('leftIndent', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('rightIndent', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('firstLineIndent', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('textAlignment', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('beforeSpacing', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('afterSpacing', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('lineSpacing', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('lineSpacingType', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('outlineLevel', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('bidi', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('contextualSpacing', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('keepWithNext', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('keepLinesTogether', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public isCellFormatEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: Object): boolean {
        if (this.isNotEqual('leftMargin', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('rightMargin', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('topMargin', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('bottomMargin', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('columnSpan', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('rowSpan', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('verticalAlignment', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('preferredWidthType', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('preferredWidth', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('cellWidth', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public isShadingEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: Object): boolean {
        if (this.isNotEqual('backgroundColor', source, modifiedProperty, modifiedValue, 5)) {
            return false;
        }
        if (this.isNotEqual('foregroundColor', source, modifiedProperty, modifiedValue, 5)) {
            return false;
        }
        if (this.isNotEqual('textureStyle', source, modifiedProperty, modifiedValue, 5)) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public isRowFormatEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: Object): boolean {
        if (this.isNotEqual('allowBreakAcrossPages', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('isHeader', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('height', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('heightType', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridBefore', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridBeforeWidth', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridBeforeWidthType', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridAfter', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridAfterWidth', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridAfterWidthType', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('leftMargin', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('topMargin', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('bottomMargin', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('rightMargin', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('leftIndent', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public isListFormatEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: Object): boolean {
        if (this.isNotEqual('listId', source, modifiedProperty, modifiedValue, 7)) {
            return false;
        }
        if (this.isNotEqual('listLevelNumber', source, modifiedProperty, modifiedValue, 7)) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public isTableFormatEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: Object): boolean {
        if (this.isNotEqual('leftMargin', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('rightMargin', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('topMargin', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('bottomMargin', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('cellSpacing', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('leftIndent', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('tableAlignment', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('preferredWidth', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('preferredWidthType', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('bidi', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('allowAutoFit', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('horizontalPositionAbs', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('horizontalPosition', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public isListLevelEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: Object): boolean {
        if (this.isNotEqual('listLevelPattern', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        if (this.isNotEqual('startAt', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        if (this.isNotEqual('followCharacter', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        if (this.isNotEqual('numberFormat', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        if (this.isNotEqual('restartLevel', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public isSectionFormatEqual(source: Dictionary<number, object>, modifiedProperty: string, modifiedValue: Object): boolean {
        if (this.isNotEqual('headerDistance', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('footerDistance', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('differentFirstPage', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('differentOddAndEvenPages', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('pageWidth', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('pageHeight', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('leftMargin', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('topMargin', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('rightMargin', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('bottomMargin', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('bidi', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('restartPageNumbering', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('pageStartingNumber', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('endnoteNumberFormat', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('endnotePosition', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('footNoteNumberFormat', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('footnotePosition', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('restartIndexForEndnotes', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('restartIndexForFootnotes', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('initialFootNoteNumber', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('initialEndNoteNumber', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public cloneItems(format: WUniqueFormat, property: string, value: object, uniqueFormatType: number): void {
        const propertyType: number = WUniqueFormat.getPropertyType(uniqueFormatType, property);
        const keys: number[] = format.propertiesHash.keys;
        for (let i: number = 0; i < keys.length; i++) {
            if (keys[i] === propertyType) {
                this.propertiesHash.add(propertyType, value);
            } else {
                this.propertiesHash.add(keys[i], format.propertiesHash.get(keys[i]));
            }
        }
        if (!format.propertiesHash.containsKey(propertyType)) {
            this.propertiesHash.add(propertyType, value);
        }
    }
    /**
     * @private
     */
    public mergeProperties(format: WUniqueFormat): Dictionary<number, object> {
        const hash: Dictionary<number, object> = format.cloneProperties();
        const keys: number[] = this.propertiesHash.keys;
        for (let i: number = 0; i < keys.length; i++) {
            if (!hash.containsKey(keys[i])) {
                hash.add(keys[i], this.propertiesHash.get(keys[i]));
            }
        }
        return hash;
    }
    /**
     * @private
     */
    public cloneProperties(): Dictionary<number, object> {
        const hash: Dictionary<number, object> = new Dictionary<number, object>();
        const keys: number[] = this.propertiesHash.keys;
        for (let i: number = 0; i < keys.length; i++) {
            hash.add(keys[i], this.propertiesHash.get(keys[i]));
        }
        return hash;
    }
    // public cloneItemsInternal(format: WUniqueFormat): void {
    //     let keys: number[] = format.propertiesHash.getItem();
    //     for (let i: number = 0; i < keys.length; i++) {
    //         this.propertiesHash.add(keys[i], format.propertiesHash.get(keys[i]));
    //     }
    //     this.referenceCount = format.referenceCount;
    // }
    /**
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.propertiesHash)) {
            this.propertiesHash.destroy();
        }
        this.propertiesHash = undefined;
        this.referenceCount = undefined;
        this.uniqueFormatType = undefined;
    }
}
