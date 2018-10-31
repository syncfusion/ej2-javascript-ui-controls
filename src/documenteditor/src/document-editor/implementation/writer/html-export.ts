import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { LineStyle } from '../../base/types';
import { WCharacterFormat } from '../format/character-format';
import { WParagraphFormat } from '../format/paragraph-format';
import { HelperMethods } from '../editor/editor-helper';

/** 
 * @private
 */
export class HtmlExport {
    /* tslint:disable:no-any */
    private document: any = undefined;
    private characterFormat: WCharacterFormat;
    private paragraphFormat: WParagraphFormat;
    /* tslint:disable:no-any */

    /**
     * @private
     */
    public fieldCheck: number = 0;

    /* tslint:disable:no-any */
    /**
     * @private
     */
    public writeHtml(document: any): string {
        this.document = document;
        let html: string = '';
        for (let i: number = 0; i < document.sections.length; i++) {
            html = this.serializeSection(document.sections[i]);
        }
        return html;
    }
    /**
     * @private
     */
    public serializeSection(section: any): string {
        let string: string = '';
        for (let i: number = 0; i < section.blocks.length; i++) {
            let block: any = section.blocks[i];
            if (block.hasOwnProperty('inlines')) {
                string += this.serializeParagraph(block);
            } else {
                string += this.serializeTable(block);
            }
        }
        return string;
    }

    // Serialize Paragraph 
    /**
     * @private
     */
    public serializeParagraph(paragraph: any): string {
        let blockStyle: string = '';
        let startString: string = undefined;
        let isList: boolean = false;
        let tagAttributes: string[] = [];
        tagAttributes.push('style="' + this.serializeParagraphStyle(paragraph, '', isList) + '"');
        blockStyle += this.createAttributesTag('p', tagAttributes);
        if (paragraph.inlines.length === 0) {
            //Handled to preserve non breaking space for empty paragraphs similar to MS Word behavior.
            blockStyle += '&nbsp;';
        } else {
            blockStyle = this.serializeInlines(paragraph, blockStyle);
        }
        blockStyle += this.endTag('p');
        return blockStyle;
    }

    //SerializeInlines
    /**
     * @private
     */
    public serializeInlines(paragraph: any, blockStyle: string): string {
        let inline: any = undefined;
        let i: number = 0;

        while (paragraph.inlines.length > i) {
            inline = paragraph.inlines[i];
            if (inline.hasOwnProperty('imageString')) {
                blockStyle += this.serializeImageContainer(inline);
            } else if (inline.hasOwnProperty('fieldType')) {
                if (inline.fieldType === 0) {
                    this.fieldCheck = 1;
                    let tagAttributes: string[] = [];
                    tagAttributes.push('style="' + this.serializeInlineStyle(inline.characterFormat, '') + '"');
                    blockStyle += this.createAttributesTag('a', tagAttributes);
                } else if (inline.fieldType === 2) {
                    this.fieldCheck = 2;
                } else {
                    blockStyle += this.endTag('a');
                    this.fieldCheck = 0;
                }
            } else {
                let text: string = isNullOrUndefined(inline.text) ? '' : inline.text;
                if (this.fieldCheck === 0) {
                    blockStyle += this.serializeSpan(text, inline.characterFormat);
                }
                if (this.fieldCheck === 1) {
                    let hyperLink: string = text.replace('\"', '');
                    blockStyle += ' href= \"' + hyperLink.replace('HYPERLINK', '').trim();
                    blockStyle += '\"';
                    blockStyle += '>';
                }
                if (this.fieldCheck === 2) {
                    blockStyle += text;
                }
            }
            i++;
        }
        return blockStyle;
    }

    // Serialize Span
    /**
     * @private
     */
    public serializeSpan(spanText: string, characterFormat: WCharacterFormat): string {
        let spanClass: string = '';
        if (spanText.indexOf('\v') !== -1) {
            spanClass += '<br>';
            return spanClass.toString();
        }
        let tagAttributes: string[] = [];
        this.serializeInlineStyle(characterFormat, '');
        tagAttributes.push('style="' + this.serializeInlineStyle(characterFormat, '') + '"');
        spanClass += this.createAttributesTag('span', tagAttributes);
        let ignoreFirstSpace: boolean = false;
        // Todo: Need to handle it.
        // If the text starts with white-space, need to check whether it is a continuous space.
        // if (characterFormat.ownerBase instanceof WInline) {
        //     let inline: WInline = (characterFormat.ownerBase as WInline);
        //     tslint:disable:max-line-length            
        //     if (inline instanceof WSpan && !isNullOrUndefined(inline.text) && inline.text !== '' && (inline as WSpan).text[0] === ' ') {
        //         Check previous inline until, it has valid rendered text.
        //         do {
        //             inline = WInline.getPreviousTextInline((inline as WSpan));
        //         } while (inline instanceof WSpan && !isNullOrUndefined(inline.text));
        //     } else {
        //         inline = undefined;
        //     }
        //     If current white-space is a continuation of consecutive spaces, this will be set true.
        //     ignoreFirstSpace = inline instanceof WSpan && !isNullOrUndefined(inline.text)
        //         && (inline as WSpan).text[(inline as WSpan).text.length - 1] === ' ';
        // }
        let text: string = this.decodeHtmlNames(spanText.toString());
        spanClass += text;
        spanClass += this.endTag('span');
        return spanClass.toString();
    }

    //Serialize Image
    /**
     * @private
     */
    public serializeImageContainer(image: any): string {
        let imageStyle: string = '';
        let tagAttributes: string[] = [];
        this.serializeInlineStyle(image.characterFormat, '');
        let imageSource: string = '';
        if (!isNullOrUndefined(image.imageString)) {
            imageSource = image.imageString;
        }
        let width: number = HelperMethods.convertPointToPixel(image.width);
        let height: number = HelperMethods.convertPointToPixel(image.height);
        tagAttributes.push('width="', width.toString() + '"');
        tagAttributes.push('height="', height.toString() + '"');
        tagAttributes.push('src="', imageSource + '"');
        imageStyle += this.createAttributesTag('img', tagAttributes);
        imageStyle += (this.endTag('img'));
        return imageStyle.toString();
    }

    // Serialize Table Cell
    /**
     * @private
     */
    public serializeCell(cell: any): string {
        let blockStyle: string = '';
        let tagAttributes: string[] = [];
        let cellHtml: string = '';
        tagAttributes = [];
        if (!isNullOrUndefined(cell.cellFormat)) {
            //if (cell.cellFormat.shading.backgroundColor !== Color.FromArgb(0, 0, 0, 0)) {
            tagAttributes.push('bgcolor="' + cell.cellFormat.shading.backgroundColor + '"');
            // }
            if (cell.cellFormat.columnSpan > 1) {
                tagAttributes.push('colspan="' + cell.cellFormat.columnSpan.toString() + '"');
            }
            if (cell.cellFormat.rowSpan > 1) {
                tagAttributes.push('rowspan="' + cell.cellFormat.rowSpan.toString() + '"');
            }
            if (cell.cellFormat.cellWidth !== 0) {
                tagAttributes.push('width="' + cell.cellFormat.cellWidth.toString() + '"');
            }
            if (cell.cellFormat.verticalAlignment !== 'Top') {
                tagAttributes.push('valign="' + cell.cellFormat.verticalAlignment.toString().toLowerCase() + '"');
            }
            if (!isNullOrUndefined(cell.cellFormat.leftMargin) && cell.cellFormat.leftMargin !== 0) {
                cellHtml += ('padding-left:' + cell.cellFormat.leftMargin.toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell.cellFormat.rightMargin) && cell.cellFormat.rightMargin !== 0) {
                cellHtml += ('padding-right:' + cell.cellFormat.rightMargin.toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell.cellFormat.topMargin) && cell.cellFormat.topMargin !== 0) {
                cellHtml += ('padding-top:' + cell.cellFormat.topMargin.toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell.cellFormat.bottomMargin) && cell.cellFormat.bottomMargin !== 0) {
                cellHtml += ('padding-bottom:' + cell.cellFormat.bottomMargin.toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell.cellFormat.borders)) {
                cellHtml += this.serializeCellBordersStyle(cell.cellFormat.borders);
            }
        }
        if (cellHtml.length !== 0) {
            tagAttributes.push('style="' + cellHtml + '"');
        }
        blockStyle += (this.createAttributesTag('td', tagAttributes));
        for (let k: number = 0; k < cell.blocks.length; k++) {
            let block: any = cell.blocks[k];
            if (block.hasOwnProperty('rows')) {
                blockStyle += this.serializeTable(block);
            } else {
                blockStyle += this.serializeParagraph(block);
            }
        }
        blockStyle += (this.endTag('td'));
        return blockStyle;
    }

    // Serialize Table
    /**
     * @private
     */
    public serializeTable(table: any): string {
        let html: string = '';
        html += this.createTableStartTag(table);
        for (let j: number = 0; j < table.rows.length; j++) {
            html += this.serializeRow(table.rows[j]);
        }
        html += this.createTableEndTag();
        return html;
    }

    // Serialize Row
    /**
     * @private
     */
    public serializeRow(row: any): string {
        let html: string = '';
        html += this.createRowStartTag(row);
        for (let k: number = 0; k < row.cells.length; k++) {
            html += this.serializeCell(row.cells[k]);
        }
        return html;
    }

    // Serialize Styles
    /**
     * @private
     */
    public serializeParagraphStyle(paragraph: any, className: string, isList: boolean): string {
        let paragraphClass: string = '';
        paragraphClass += this.serializeCharacterFormat(paragraph.characterFormat);
        paragraphClass += this.serializeParagraphFormat(paragraph.paragraphFormat, isList);
        return paragraphClass;
    }
    /**
     * @private
     */
    public serializeInlineStyle(characterFormat: WCharacterFormat, className: string): string {
        return this.serializeCharacterFormat(characterFormat);
    }
    /**
     * @private
     */
    public serializeTableBorderStyle(borders: any): string {
        let borderStyle: string = '';

        borderStyle += ('border-left-style:' + this.convertBorderLineStyle(borders.left.lineStyle));
        borderStyle += ';';
        borderStyle += ('border-left-width:' + borders.left.lineWidth.toString() + 'pt');
        borderStyle += ';';
        borderStyle += ('border-left-color:' + borders.left.color);
        borderStyle += ';';

        borderStyle += ('border-right-style:' + this.convertBorderLineStyle(borders.right.lineStyle));
        borderStyle += ';';
        borderStyle += ('border-right-width:' + borders.right.lineWidth.toString() + 'pt');
        borderStyle += ';';
        borderStyle += ('border-right-color:' + borders.right.color);
        borderStyle += ';';

        borderStyle += ('border-top-style:' + this.convertBorderLineStyle(borders.top.lineStyle));
        borderStyle += ';';
        borderStyle += ('border-top-width:' + borders.top.lineWidth.toString() + 'pt');
        borderStyle += ';';
        borderStyle += ('border-top-color:' + borders.top.color);
        borderStyle += ';';

        borderStyle += ('border-Bottom-style:' + this.convertBorderLineStyle(borders.bottom.lineStyle));
        borderStyle += ';';
        borderStyle += ('border-Bottom-width:' + borders.bottom.lineWidth.toString() + 'pt');
        borderStyle += ';';
        borderStyle += ('border-Bottom-color:' + borders.bottom.color);
        borderStyle += ';';
        return borderStyle;
    }
    /**
     * @private
     */
    public serializeCellBordersStyle(borders: any): string {
        let borderStyle: string = '';

        borderStyle = 'border:solid 1px;';

        // Todo: handle
        // let border: WBorder = undefined;
        // //LeftBorder
        // border = WCell.getCellLeftBorder(WCell.getCellOf(borders));
        // if (!isNullOrUndefined(border) && border.lineStyle !== 'None') {
        //     borderStyle += this.serializeBorderStyle(border, 'left');
        // } else if (!isNullOrUndefined(border) && border.hasNoneStyle) {
        //     borderStyle += ('border-left-style:none;');
        // }
        // //RightBorder
        // border = WCell.getCellRightBorder(WCell.getCellOf(borders));
        // if (!isNullOrUndefined(border) && border.lineStyle !== 'None') {
        //     borderStyle += this.serializeBorderStyle(border, 'right');
        // } else if (!isNullOrUndefined(border) && border.hasNoneStyle) {
        //     borderStyle += ('border-right-style:none');
        // }
        // //TopBorder
        // border = WCell.getCellTopBorder(WCell.getCellOf(borders));
        // if (!isNullOrUndefined(border) && border.lineStyle !== 'None') {
        //     borderStyle += this.serializeBorderStyle(border, 'top');
        // } else if (!isNullOrUndefined(border) && border.hasNoneStyle) {
        //     borderStyle += ('border-top-style:none');
        // }
        // //BottomBorder
        // border = WCell.getCellBottomBorder(WCell.getCellOf(borders));
        // if (!isNullOrUndefined(border) && border.lineStyle !== 'None') {
        //     borderStyle += this.serializeBorderStyle(border, 'bottom');
        // } else if (!isNullOrUndefined(border) && border.hasNoneStyle) {
        //     borderStyle += ('border-bottom-style:none');
        // }
        return borderStyle;
    }
    /**
     * @private
     */
    public serializeBorderStyle(border: any, borderPosition: string): string {
        let borderStyle: string = '';
        borderStyle += ('border-' + borderPosition + '-style:' + this.convertBorderLineStyle(border.lineStyle));
        borderStyle += ';';
        if (border.lineWidth > 0) {
            borderStyle += ('border-' + borderPosition + '-width:' + border.lineWidth.toString() + 'pt;');
        }
        //if (border.color !== Color.FromArgb(0, 0, 0, 0))
        borderStyle += ('border-' + borderPosition + '-color:' + border.color + ';');
        return borderStyle;
    }
    /**
     * @private
     */
    public convertBorderLineStyle(lineStyle: LineStyle): string {
        switch (lineStyle) {
            case 'None':
                return 'none';
            case 'Single':
                return 'solid';
            case 'Dot':
                return 'dotted';
            case 'DashSmallGap':
            case 'DashLargeGap':
            case 'DashDot':
            case 'DashDotDot':
                return 'dashed';
            case 'Double':
            case 'Triple':
            case 'ThinThickSmallGap':
            case 'ThickThinSmallGap':
            case 'ThinThickThinSmallGap':
            case 'ThinThickMediumGap':
            case 'ThickThinMediumGap':
            case 'ThinThickThinMediumGap':
            case 'ThinThickLargeGap':
            case 'ThickThinLargeGap':
            case 'ThinThickThinLargeGap':
                return 'double';
            case 'SingleWavy':
                return 'solid';
            case 'DoubleWavy':
                return 'double';
            case 'DashDotStroked':
                return 'solid';
            case 'Emboss3D':
                return 'ridge';
            case 'Engrave3D':
                return 'groove';
            case 'Outset':
                return 'outset';
            case 'Inset':
                return 'inset';
            default:
                return 'solid';
        }
    }

    // Serialize Format
    /**
     * @private
     */
    public serializeCharacterFormat(characterFormat: any): string {
        if (!isNullOrUndefined(characterFormat.inlineFormat)) {
            return this.serializeCharacterFormat(characterFormat.inlineFormat);
        }
        let propertyValue: any;
        let charStyle: string = '';
        if (characterFormat.bold) {
            charStyle += 'font-weight';
            charStyle += ':';
            charStyle += 'bold';
            charStyle += ';';
        }
        charStyle += 'font-style';
        charStyle += ':';
        if (characterFormat.italic) {
            charStyle += 'italic';
        } else {
            charStyle += 'normal';
        }
        charStyle += ';';
        // Double strike through will become Single strike through while saving HTML using MS Word.
        if (characterFormat.strikethrough === 'SingleStrike' || characterFormat.strikethrough === 'DoubleStrike') {
            charStyle += 'text-decoration';
            charStyle += ':';
            charStyle += 'line-through';
            charStyle += ';';
        }
        //Text Baseline Alignment
        // tslint:disable-next-line:max-line-length
        if (characterFormat.baselineAlignment === 'Superscript' || characterFormat.baselineAlignment === 'Subscript') {
            charStyle += 'vertical-align';
            charStyle += ':';
            charStyle += characterFormat.baselineAlignment === 'Superscript' ? 'super' : 'sub';
            charStyle += ';';

        }
        //Text Foreground and Background Color 
        if (!isNullOrUndefined(characterFormat.highlightColor)) {
            charStyle += 'background-color';
            charStyle += ':';
            charStyle += characterFormat.highlightColor.toString();
            charStyle += ';';
        }
        //Font Color
        propertyValue = characterFormat.fontColor;
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'color';
            charStyle += ':';
            charStyle += propertyValue;
            charStyle += ';';
        }
        if (!isNullOrUndefined(characterFormat.underline) && characterFormat.underline !== 'None') {
            charStyle += 'text-decoration';
            charStyle += ':';
            charStyle += 'underline';
            charStyle += ';';
        }
        propertyValue = characterFormat.fontSize;
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'font-size';
            charStyle += ':';
            charStyle += propertyValue.toString();
            charStyle += 'pt';
            charStyle += ';';
        }
        propertyValue = characterFormat.fontFamily;
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'font-family';
            charStyle += ':';
            charStyle += propertyValue.toString();
            charStyle += ';';
        }
        return charStyle.toString();
    }
    /**
     * @private
     */
    public serializeParagraphFormat(paragraphFormat: any, isList: boolean): string {
        if (!isNullOrUndefined(paragraphFormat.inlineFormat)) {
            return this.serializeParagraphFormat(paragraphFormat.inlineFormat, isList);
        }
        let propertyValue: any;
        let paraStyle: string = '';
        propertyValue = paragraphFormat.textAlignment;
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'text-align:' + propertyValue.toLowerCase() + ';';
        }
        propertyValue = paragraphFormat.beforeSpacing;
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-top:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat.rightIndent;
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-right:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat.afterSpacing;
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-bottom:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat.leftIndent;
        if (isList) {
            if (isNullOrUndefined(propertyValue)) {
                propertyValue = -48;
            } else {
                propertyValue -= 48;
            }
        }
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-left:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat.firstLineIndent;
        if (isList) {
            if (isNullOrUndefined(propertyValue)) {
                propertyValue = 24;
            } else {
                propertyValue += 24;
            }
        }
        if (!isNullOrUndefined(propertyValue) && propertyValue !== 0) {
            paraStyle += 'text-indent:' + propertyValue.toString() + 'pt;';
        }
        propertyValue = paragraphFormat.lineSpacing;
        if (!isNullOrUndefined(propertyValue)) {
            if (paragraphFormat.lineSpacingType === 'Multiple') {
                propertyValue = (propertyValue * 100).toString() + '%;';
            } else {
                propertyValue = propertyValue.toString() + 'pt;';
            }
            paraStyle += 'line-height:' + propertyValue;
        }
        return paraStyle.toString();
    }
    /**
     * @private
     */
    public createAttributesTag(tagValue: string, localProperties: string[]): string {
        let sb: string = '';
        sb += '<';
        sb += tagValue;
        for (let i: number = 0; i < localProperties.length; i++) {
            sb += ' ';
            sb += localProperties[i];
        }
        if (tagValue !== 'a') {
            sb += '>';
        }
        return sb;
    }
    /**
     * @private
     */
    public createTag(tagValue: string): string {
        let s: string = '';
        s += '<';
        s += tagValue;
        s += '>';
        return s;
    }
    /**
     * @private
     */
    public endTag(tagValue: string): string {
        let sb: string = '';
        sb += '<';
        sb += '/';
        sb += tagValue;
        sb += '>';
        return sb;
    }
    /**
     * @private
     */
    public createTableStartTag(table: any): string {
        let blockStyle: string = '';
        let tableStyle: string = '';
        let tagAttributes: string[] = [];
        tagAttributes.push('border="' + '1"');
        if (!isNullOrUndefined(table.tableFormat)) {
            //if (table.tableFormat.shading.backgroundColor !== Color.FromArgb(0, 0, 0, 0)) {
            tagAttributes.push('bgcolor="' + table.tableFormat.shading.backgroundColor + '"');
            //}
            if (table.tableFormat.leftIndent !== 0) {
                tagAttributes.push('left-indent="' + table.tableFormat.leftIndent.toString() + 'pt;');
            }
            if (table.tableFormat.cellSpacing > 0) {
                tagAttributes.push('cellspacing="' + (((table.tableFormat.cellSpacing * 72) / 96) * 2).toString() + '"');
            } else {
                tableStyle += ('border-collapse:collapse;');
            }
            tagAttributes.push('cellpadding="' + '0"');
            if (!isNullOrUndefined(table.tableFormat.borders)) {
                tableStyle += this.serializeTableBorderStyle(table.tableFormat.borders);
            }
        }
        if (tableStyle.length !== 0) {
            tagAttributes.push('style="', tableStyle.toString() + '"');
        }
        return blockStyle += (this.createAttributesTag('table', tagAttributes));
    }
    /**
     * @private
     */
    public createTableEndTag(): string {
        let blockStyle: string = '';
        blockStyle += (this.endTag('table'));
        return blockStyle;
    }
    /**
     * @private
     */
    public createRowStartTag(row: any): string {
        let blockStyle: string = '';
        let tagAttributes: string[] = [];
        if (row.rowFormat.isHeader) {
            blockStyle += (this.createTag('thead'));
        }
        if (row.rowFormat.height > 0) {
            tagAttributes.push('height="' + row.rowFormat.height + '"');
        }
        return blockStyle + this.createAttributesTag('tr', tagAttributes);
    }
    /**
     * @private
     */
    public createRowEndTag(row: any): string {
        let blockStyle: string = '';
        blockStyle += (this.endTag('tr'));
        if (row.rowFormat.isHeader) {
            blockStyle += (this.endTag('thead'));
        }
        return blockStyle;
    }
    /**
     * @private
     */
    public decodeHtmlNames(text: string): string {
        if (text === '\t') {
            return '&emsp;';
        }
        let splittedText: string[] = text.split(' ');
        let htmlText: string = '';
        if (splittedText.length > 0) {
            htmlText = splittedText[0];
            for (let i: number = 0; i < splittedText.length - 1; i++) {
                htmlText += '&nbsp;' + splittedText[i + 1];
            }
        }
        return htmlText;
    }
    /* tslint:enable:no-any */
}