/* eslint-disable */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CellVerticalAlignment, LineStyle } from '../../base/types';
import { WCharacterFormat } from '../format/character-format';
import { WParagraphFormat } from '../format/paragraph-format';
import { HelperMethods } from '../editor/editor-helper';
import { sectionsProperty, characterFormatProperty, paragraphFormatProperty, listsProperty, abstractListsProperty, nameProperty, boldProperty, italicProperty, underlineProperty, baselineAlignmentProperty, strikethroughProperty, highlightColorProperty, fontSizeProperty, fontColorProperty, fontFamilyProperty, styleNameProperty, allCapsProperty, listIdProperty, listLevelNumberProperty, leftIndentProperty, rightIndentProperty, firstLineIndentProperty, textAlignmentProperty, afterSpacingProperty, beforeSpacingProperty, lineSpacingProperty, lineSpacingTypeProperty, listFormatProperty, bordersProperty, leftMarginProperty, rightMarginProperty, topMarginProperty, bottomMarginProperty, cellWidthProperty, columnSpanProperty, rowSpanProperty, verticalAlignmentProperty, isHeaderProperty, cellSpacingProperty, shadingProperty, tableAlignmentProperty, preferredWidthProperty, preferredWidthTypeProperty, backgroundColorProperty, hasNoneStyleProperty, lineStyleProperty, lineWidthProperty, textProperty, widthProperty, heightProperty, colorProperty, imageStringProperty, topProperty, bottomProperty, rightProperty, leftProperty, fieldTypeProperty, inlinesProperty, cellFormatProperty, rowFormatProperty, cellsProperty, rowsProperty, tableFormatProperty, blocksProperty, listLevelPatternProperty, abstractListIdProperty, levelsProperty, bookmarkTypeProperty, inlineFormatProperty, startAtProperty, characterSpacingProperty, scalingProperty, DocumentEditor,imagesProperty, Dictionary, isMetaFileProperty} from '../../index';

/**
 * @private
 */
export class HtmlExport {
    private document: any = undefined;
    private characterFormat: WCharacterFormat;
    private paragraphFormat: WParagraphFormat;
    private prevListLevel: any = undefined;
    private isOrdered: boolean = undefined;
    private keywordIndex: number = undefined;
    private images: Dictionary<number, string[]>;

    /**
     * @private
     */
    public fieldCheck: number = 0;


    public writeHtml(document: any, isOptimizeSfdt: boolean): string {
        this.keywordIndex = isOptimizeSfdt ? 1 : 0;
        this.document = document;
        let html: string = '';
        if (document.hasOwnProperty(imagesProperty[this.keywordIndex])) {
            this.serializeImages(document[imagesProperty[this.keywordIndex]]);
        }
        for (let i: number = 0; i < document[sectionsProperty[this.keywordIndex]].length; i++) {
            html += this.serializeSection(document[sectionsProperty[this.keywordIndex]][i]);
        }
        return html;
    }
    private serializeImages(data: any): void {
        this.images = new Dictionary<number, string[]>();
        for (let img in data) {
            if (Array.isArray(data[`${img}`])) {
                this.images.add(parseInt(img), data[`${img}`]);
            } else {
                let images: string[] = [];
                images.push(data[`${img}`]);
                this.images.add(parseInt(img), images);
            }
        }
    }
    private serializeSection(section: any): string {
        let string: string = '';
        for (let i: number = 0; i < section[blocksProperty[this.keywordIndex]].length; i++) {
            const block: any = section[blocksProperty[this.keywordIndex]][i];
            if (block.hasOwnProperty(inlinesProperty[this.keywordIndex])) {
                string += this.serializeParagraph(block);
            } else if (block.hasOwnProperty(blocksProperty[this.keywordIndex])) {
                string += this.serializeSection(block);
            } else {
                string += this.closeList();
                string += this.serializeTable(block);
            }
        }
        string += this.closeList();
        this.prevListLevel = undefined;
        this.isOrdered = undefined;
        return string;
    }

    // Serialize Paragraph
    private serializeParagraph(paragraph: any): string {
        let blockStyle: string = '';
        let isList: boolean = false;
        let isPreviousList: boolean = false;

        if (!isNullOrUndefined(this.prevListLevel)) {
            isPreviousList = true;
        }
        const tagAttributes: string[] = [];
        let listLevel: any = undefined;
        if (!isNullOrUndefined(paragraph[paragraphFormatProperty[this.keywordIndex]][listFormatProperty[this.keywordIndex]])) {
            listLevel = this.getListLevel(paragraph);
            if (!isPreviousList) {
                this.prevListLevel = listLevel;
            }
            if (this.prevListLevel !== listLevel) {
                isPreviousList = false;
            }
            this.prevListLevel = listLevel;
        }
        if (!isPreviousList) {
            blockStyle += this.closeList();
        }

        if (!isNullOrUndefined(listLevel)) {
            isList = true;
        }
        if (isList && !isPreviousList) {
            blockStyle += this.getHtmlList(listLevel, paragraph[paragraphFormatProperty[this.keywordIndex]][listFormatProperty[this.keywordIndex]][listLevelNumberProperty[this.keywordIndex]]);
        }
        tagAttributes.push('style="' + this.serializeParagraphStyle(paragraph, '', isList) + ';' + 'white-space:pre' + '"' );
        if (isList) {
            blockStyle += this.createAttributesTag('li', tagAttributes);
        } else {
            this.prevListLevel = undefined;
            this.isOrdered = undefined;
            blockStyle += this.createAttributesTag(this.getStyleName(paragraph[paragraphFormatProperty[this.keywordIndex]][styleNameProperty[this.keywordIndex]]), tagAttributes);
        }
        if (paragraph[inlinesProperty[this.keywordIndex]].length === 0) {
            //Handled to preserve non breaking space for empty paragraphs similar to MS Word behavior.
            blockStyle += '&nbsp';
        } else {
            blockStyle = this.serializeInlines(paragraph, blockStyle);
        }
        if (isList) {
            blockStyle += this.endTag('li');
            if (blockStyle.indexOf('<ul') > -1) {
                this.isOrdered = false;
            } else if (blockStyle.indexOf('<ol') > -1) {
                this.isOrdered = true;
            }
        } else {
            blockStyle += this.endTag(this.getStyleName(paragraph[paragraphFormatProperty[this.keywordIndex]][styleNameProperty[this.keywordIndex]]));
        }

        return blockStyle;
    }
    private closeList(): string {
        let blockStyle: string = '';
        if (!isNullOrUndefined(this.isOrdered)) {
            if (this.isOrdered) {
                blockStyle = this.endTag('ol');
            } else {
                blockStyle = this.endTag('ul');
            }
            this.isOrdered = undefined;
        }
        return blockStyle;
    }
    private getListLevel(paragraph: any): any {
        let listLevel: any = undefined;
        let list: any = undefined;
        for (let i: number = 0; i < this.document[listsProperty[this.keywordIndex]].length; i++) {
            if (this.document[listsProperty[this.keywordIndex]][i][listIdProperty[this.keywordIndex]] === paragraph[paragraphFormatProperty[this.keywordIndex]][listFormatProperty[this.keywordIndex]][listIdProperty[this.keywordIndex]]) {
                list = this.document[listsProperty[this.keywordIndex]][i];
                break;
            }
        }
        if (list) {
            for (let j: number = 0; j < this.document[abstractListsProperty[this.keywordIndex]].length; j++) {
                if (this.document[abstractListsProperty[this.keywordIndex]][j][abstractListIdProperty[this.keywordIndex]] === list[abstractListIdProperty[this.keywordIndex]]) {
                    let levelNumber: number = paragraph[paragraphFormatProperty[this.keywordIndex]][listFormatProperty[this.keywordIndex]][listLevelNumberProperty[this.keywordIndex]];
                    listLevel = this.document[abstractListsProperty[this.keywordIndex]][j][levelsProperty[this.keywordIndex]][levelNumber];
                    break;
                }
            }
        }
        return listLevel;

    }
    private getHtmlList(listLevel: any, levelNumer: number): string {
        //if (start == null || (start != null && start.Paragraph != this)) {
        //    let block: BlockAdv = this.GetPreviousBlock();
        //    if (block instanceof ParagraphAdv) {
        //        let previousListLevel: ListLevelAdv = (block as ParagraphAdv).ParagraphFormat.ListFormat.ListLevel;
        //        if (previousListLevel == listLevel)
        //            return "";
        //    }
        //}
        let html: string = '';
        if (listLevel[listLevelPatternProperty[this.keywordIndex]] === (this.keywordIndex == 1 ? 10 : 'Bullet')) {
            html += '<ul type="';
            switch (levelNumer) {
            case 0:
                html += 'disc';
                listLevel[characterFormatProperty[this.keywordIndex]][fontFamilyProperty[this.keywordIndex]] = 'Symbol';
                break;
            case 1:
                html += 'circle';
                listLevel[characterFormatProperty[this.keywordIndex]][fontFamilyProperty[this.keywordIndex]] = 'Symbol';
                break;
            case 2:
                html += 'square';
                listLevel[characterFormatProperty[this.keywordIndex]][fontFamilyProperty[this.keywordIndex]] = 'Wingdings';
                break;
            default:
                html += 'disc';
                listLevel[characterFormatProperty[this.keywordIndex]][fontFamilyProperty[this.keywordIndex]] = 'Symbol';
                break;
            }
            html += '">';
        } else {
            html += '<ol type="';
            switch (listLevel[listLevelPatternProperty[this.keywordIndex]]) {
                case 'UpRoman':
                case 2:
                    html += 'I';
                    break;
                case 'LowRoman':
                case 3:
                    html += 'i';
                    break;
                case 'UpLetter':
                case 4:
                    html += 'A';
                    break;
                case 'LowLetter':
                case 5:
                    html += 'a';
                    break;
                default:
                    html += '1';
                break;
            }
            html += '" start="' + listLevel[startAtProperty[this.keywordIndex]].toString() + '">';
        }
        return html;
    }


    //SerializeInlines
    private serializeInlines(paragraph: any, blockStyle: string): string {
        let inline: any = undefined;
        let i: number = 0;      
        while (paragraph[inlinesProperty[this.keywordIndex]].length > i) {
            inline = paragraph[inlinesProperty[this.keywordIndex]][i];
            if (inline.hasOwnProperty(inlinesProperty[this.keywordIndex])) {
                blockStyle += this.serializeContentInlines(inline, blockStyle);
                i++;
                continue;
            }
            if (inline.hasOwnProperty(imageStringProperty[this.keywordIndex])) {
                blockStyle += this.serializeImageContainer(inline);
            } else if (inline.hasOwnProperty(fieldTypeProperty[this.keywordIndex])) {
                if (inline[fieldTypeProperty[this.keywordIndex]] === 0) {
                    let fieldCode: any = paragraph[inlinesProperty[this.keywordIndex]][i + 1];
                    if (isNullOrUndefined(fieldCode[textProperty[this.keywordIndex]])) {
                        fieldCode = paragraph[inlinesProperty[this.keywordIndex]][i + 2];
                    }
                    if (!isNullOrUndefined(fieldCode) && !isNullOrUndefined(fieldCode[textProperty[this.keywordIndex]]) &&
                        (fieldCode[textProperty[this.keywordIndex]].indexOf('TOC') >= 0 || fieldCode[textProperty[this.keywordIndex]].indexOf('HYPERLINK') >= 0)) {
                        this.fieldCheck = 1;
                        let tagAttributes: string[] = [];
                        tagAttributes.push('style="' + this.serializeInlineStyle(inline[characterFormatProperty[this.keywordIndex]]) + '"');
                        blockStyle += this.createAttributesTag('a', tagAttributes);
                    } else {
                        this.fieldCheck = undefined;
                    }
                } else if (inline[fieldTypeProperty[this.keywordIndex]] === 2) {
                    if (!isNullOrUndefined(this.fieldCheck)) {
                        this.fieldCheck = 2;
                    } else {
                        this.fieldCheck = 0;
                    }
                } else {
                    if (!isNullOrUndefined(this.fieldCheck) && this.fieldCheck !== 0) {
                    

                        blockStyle += this.endTag('a');
                    }
                    this.fieldCheck = 0;
                }
            } else {
                const text: string = isNullOrUndefined(inline[textProperty[this.keywordIndex]]) ? '' : inline[textProperty[this.keywordIndex]];
                if (inline.hasOwnProperty(bookmarkTypeProperty[this.keywordIndex])) {
                    switch (inline[bookmarkTypeProperty[this.keywordIndex]]) {
                        case 0:
                            blockStyle += '<a name=' + inline[nameProperty[this.keywordIndex]] + '>';
                            break;
                        case 1:
                            blockStyle += '</a>';
                            break;
                    }

                }
                if (this.fieldCheck === 0) {
                    blockStyle += this.serializeSpan(text, inline[characterFormatProperty[this.keywordIndex]]);
                }
                if (this.fieldCheck === 1) {
                    let hyperLink: string = text.replace(/"/g, '');
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
    private serializeContentInlines(inline: any, inlineStyle: string): string {
        inlineStyle += this.serializeInlines(inline, inlineStyle);
        return inlineStyle;
    }
    // Serialize Span
    private serializeSpan(spanText: string, characterFormat: WCharacterFormat): string {
        let spanClass: string = '';
        if (spanText.indexOf('\v') !== -1) {
            spanClass += '<br>';
            return spanClass.toString();
        } else if (spanText.indexOf('\f') !== -1) {
            spanClass += '<br style = "page-break-after:always;"/>';
            return spanClass.toString();
        }
        const tagAttributes: string[] = [];
        this.serializeInlineStyle(characterFormat);
        tagAttributes.push('style="' + this.serializeInlineStyle(characterFormat) + '"');
        spanClass += this.createAttributesTag('span', tagAttributes);
        // Todo: Need to handle it.
        // If the text starts with white-space, need to check whether it is a continuous space.
        // if (characterFormat.ownerBase instanceof WInline) {
        //     let inline: WInline = (characterFormat.ownerBase as WInline);
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
        // if (text.length === 0) {
        //     text = '&nbsp';
        // }
        spanClass += text;
        spanClass += this.endTag('span');
        return spanClass.toString();
    }

    /**
     * @private
     * @param {string} style - style name.
     * @returns {string} - return heading tag.
     */
    public getStyleName(style: string): string {
        switch (style) {
        case 'Heading 1':
            return 'h1';
        case 'Heading 2':
            return 'h2';
        case 'Heading 3':
            return 'h3';
        case 'Heading 4':
            return 'h4';
        case 'Heading 5':
            return 'h5';
        default:
            return 'p';
        }
    }
    //Serialize Image
    private serializeImageContainer(image: any): string {
        let imageStyle: string = '';
        const tagAttributes: string[] = [];
        this.serializeInlineStyle(image[characterFormatProperty[this.keywordIndex]]);
        let imageSource: string = '';
        if (!isNullOrUndefined(image[imageStringProperty[this.keywordIndex]])) {
            let base64ImageString: string[] = this.images.get(parseInt(image[imageStringProperty[this.keywordIndex]]));
            imageSource = base64ImageString[HelperMethods.parseBoolValue(image[isMetaFileProperty[this.keywordIndex]]) ? 1 : 0];
        }
        const width: number = HelperMethods.convertPointToPixel(image[widthProperty[this.keywordIndex]]);
        const height: number = HelperMethods.convertPointToPixel(image[heightProperty[this.keywordIndex]]);
        tagAttributes.push('width="' + width.toString() + '"');
        tagAttributes.push('height="' + height.toString() + '"');
        tagAttributes.push('src="' + imageSource + '"');
        imageStyle += this.createAttributesTag('img', tagAttributes);
        imageStyle += (this.endTag('img'));
        return imageStyle.toString();
    }

    // Serialize Table Cell
    public serializeCell(cell: any, row: any): string {
        let blockStyle: string = '';
        let tagAttributes: string[] = [];
        let cellHtml: string = '';
        tagAttributes = [];
        if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]])) {
            //if (cell.cellFormat.shading.backgroundColor !== Color.FromArgb(0, 0, 0, 0)) {
            if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][shadingProperty[this.keywordIndex]][backgroundColorProperty[this.keywordIndex]]) && cell[cellFormatProperty[this.keywordIndex]][shadingProperty[this.keywordIndex]][backgroundColorProperty[this.keywordIndex]] !== 'empty') {
                tagAttributes.push('bgcolor="' + HelperMethods.getColor(cell[cellFormatProperty[this.keywordIndex]][shadingProperty[this.keywordIndex]][backgroundColorProperty[this.keywordIndex]]) + '"');
            }
            // }
            if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][columnSpanProperty[this.keywordIndex]]) && cell[cellFormatProperty[this.keywordIndex]][columnSpanProperty[this.keywordIndex]] > 1) {
                tagAttributes.push('colspan="' + cell[cellFormatProperty[this.keywordIndex]][columnSpanProperty[this.keywordIndex]].toString() + '"');
            }
            if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][rowSpanProperty[this.keywordIndex]]) && cell[cellFormatProperty[this.keywordIndex]][rowSpanProperty[this.keywordIndex]] > 1) {
                tagAttributes.push('rowspan="' + cell[cellFormatProperty[this.keywordIndex]][rowSpanProperty[this.keywordIndex]].toString() + '"');
            }
            if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][cellWidthProperty[this.keywordIndex]]) && cell[cellFormatProperty[this.keywordIndex]][cellWidthProperty[this.keywordIndex]] !== 0) {
                const cellWidth: number = HelperMethods.convertPointToPixel(cell[cellFormatProperty[this.keywordIndex]][cellWidthProperty[this.keywordIndex]]);
                tagAttributes.push('width="' + cellWidth.toString() + '"');
            }
            const cellAlignment: string = isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][verticalAlignmentProperty[this.keywordIndex]]) ? 'top' : 
                this.convertVerticalAlignment(cell[cellFormatProperty[this.keywordIndex]][verticalAlignmentProperty[this.keywordIndex]]);
            tagAttributes.push('valign="' + cellAlignment + '"');
            if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][leftMarginProperty[this.keywordIndex]]) && cell[cellFormatProperty[this.keywordIndex]][leftMarginProperty[this.keywordIndex]] !== 0) {
                cellHtml += ('padding-left:' + cell[cellFormatProperty[this.keywordIndex]][leftMarginProperty[this.keywordIndex]].toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][rightMarginProperty[this.keywordIndex]]) && cell[cellFormatProperty[this.keywordIndex]][rightMarginProperty[this.keywordIndex]] !== 0) {
                cellHtml += ('padding-right:' + cell[cellFormatProperty[this.keywordIndex]][rightMarginProperty[this.keywordIndex]].toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][topMarginProperty[this.keywordIndex]]) && cell[cellFormatProperty[this.keywordIndex]][topMarginProperty[this.keywordIndex]] !== 0) {
                cellHtml += ('padding-top:' + cell[cellFormatProperty[this.keywordIndex]][topMarginProperty[this.keywordIndex]].toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][bottomMarginProperty[this.keywordIndex]]) && cell[cellFormatProperty[this.keywordIndex]][bottomMarginProperty[this.keywordIndex]] !== 0) {
                cellHtml += ('padding-bottom:' + cell[cellFormatProperty[this.keywordIndex]][bottomMarginProperty[this.keywordIndex]].toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell[cellFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]])) {
                cellHtml += this.serializeCellBordersStyle(cell[cellFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]], row);
            }
        }
        if (cellHtml.length !== 0) {
            tagAttributes.push('style="' + cellHtml + '"');
        }
        blockStyle += (this.createAttributesTag('td', tagAttributes));
        for (let k: number = 0; k < cell[blocksProperty[this.keywordIndex]].length; k++) {
            const block: any = cell[blocksProperty[this.keywordIndex]][k];
             if (block.hasOwnProperty(rowsProperty[this.keywordIndex])) {
                blockStyle += this.serializeTable(block);
            } else {
                blockStyle += this.serializeParagraph(block);
            }
         }
        blockStyle += (this.endTag('td'));
        return blockStyle;
    }

    private convertVerticalAlignment(cellVerticalAlignment: number | CellVerticalAlignment): string {
        switch (cellVerticalAlignment) {
            case 'Center':
            case 1:
                return 'middle';
            case 'Bottom':
            case 2:
                return 'bottom';
            default:
                return 'top';
        }
    }

    // Serialize Table
    private serializeTable(table: any): string {
        let html: string = '';
        html += this.createTableStartTag(table);
        for (let j: number = 0; j < table[rowsProperty[this.keywordIndex]].length; j++) {
            html += this.serializeRow(table[rowsProperty[this.keywordIndex]][j]);
        }
        html += this.createTableEndTag();
        return html;
    }

    // Serialize Row
    private serializeRow(row: any): string {
        let html: string = '';
        html += this.createRowStartTag(row);
        for (let k: number = 0; k < row[cellsProperty[this.keywordIndex]].length; k++) {
            html += this.serializeCell(row[cellsProperty[this.keywordIndex]][k], row);
        }
        return html;
    }

    // Serialize Styles
    private serializeParagraphStyle(paragraph: any, className: string, isList: boolean,keywordIndex?:number): string {
        let paragraphClass: string = '';
        let editor: DocumentEditor;
        if(isNullOrUndefined(this.keywordIndex)){
            this.keywordIndex =keywordIndex
        }
        if (paragraph[inlinesProperty[this.keywordIndex]].length > 0) {
            paragraphClass += this.serializeCharacterFormat(paragraph[characterFormatProperty[this.keywordIndex]]);
        }
        let isEmptyLine: boolean = false;
        if (paragraph[inlinesProperty[this.keywordIndex]].length == 0) {
            isEmptyLine = true;
        }
        paragraphClass += this.serializeCharacterFormat(paragraph[characterFormatProperty[this.keywordIndex]], isEmptyLine);
        paragraphClass += this.serializeParagraphFormat(paragraph[paragraphFormatProperty[this.keywordIndex]], isList);
        return paragraphClass;
    }
    private serializeInlineStyle(characterFormat: WCharacterFormat): string {
        return this.serializeCharacterFormat(characterFormat);
    }
    private serializeTableBorderStyle(borders: any): string {
        let borderStyle: string = '';

        let border: any = {};
        //LeftBorder
        border = borders[leftProperty[this.keywordIndex]];
        if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
            border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
            border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
            borderStyle += this.serializeBorderStyle(border, 'left');
        } else if (!isNullOrUndefined(border) && HelperMethods.parseBoolValue(border[hasNoneStyleProperty[this.keywordIndex]])) {
            borderStyle += ('border-left-style:none;');
        }
        //TopBorder
        border = borders[topProperty[this.keywordIndex]];
        if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
            border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
            border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
            borderStyle += this.serializeBorderStyle(border, 'top');
        } else if (!isNullOrUndefined(border) && HelperMethods.parseBoolValue(border[hasNoneStyleProperty[this.keywordIndex]])) {
            borderStyle += ('border-top-style:none;');
        }
        //RightBorder
        border = borders[rightProperty[this.keywordIndex]];
        if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
            border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
            border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
            borderStyle += this.serializeBorderStyle(border, 'right');
        } else if (!isNullOrUndefined(border) && HelperMethods.parseBoolValue(border[hasNoneStyleProperty[this.keywordIndex]])) {
            borderStyle += ('border-right-style:none;');
        }
        //BottomBorder
        border = borders[bottomProperty[this.keywordIndex]];
        if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
            border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
            border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
            borderStyle += this.serializeBorderStyle(border, 'bottom');
        } else if (!isNullOrUndefined(border) && HelperMethods.parseBoolValue(border[hasNoneStyleProperty[this.keywordIndex]])) {
            borderStyle += ('border-bottom-style:none;');
        }
        return borderStyle;
    }
    private serializeCellBordersStyle(borders: any, row: any): string {
        let borderStyle: string = '';

        //borderStyle = 'border:solid 1px;';
        // if (borders.left.color) {
        //     borderStyle += ('border-left-color:' + HelperMethods.getColor(borders.left.color));
        //     borderStyle += ';';
        // }
        // borderStyle += this.serializeBorderStyle(borders.left, 'left');
        // if (!isNullOrUndefined(borders.right.color)) {

        //     borderStyle += ('border-right-color:' + HelperMethods.getColor(borders.right.color));
        //     borderStyle += ';';
        // }
        // borderStyle += this.serializeBorderStyle(borders.right, 'right');
        // if (!isNullOrUndefined(borders.top.color)) {

        //     borderStyle += ('border-top-color:' + HelperMethods.getColor(borders.top.color));
        //     borderStyle += ';';
        // }
        // borderStyle += this.serializeBorderStyle(borders.top, 'top');
        // if (!isNullOrUndefined(borders.bottom.color)) {
        //     borderStyle += ('border-bottom-color:' + HelperMethods.getColor(borders.bottom.color));
        //     borderStyle += ';';
        // }
        // borderStyle += this.serializeBorderStyle(borders.bottom, 'bottom');

        let border: any = {};
        //LeftBorder
        border = borders[leftProperty[this.keywordIndex]];
        if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
            border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
            border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
            borderStyle += this.serializeBorderStyle(border, 'left');
        } else if (!isNullOrUndefined(border) && HelperMethods.parseBoolValue(border[hasNoneStyleProperty[this.keywordIndex]])) {
            borderStyle += ('border-left-style:none;');
        } else if (!isNullOrUndefined(row[rowFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]][leftProperty[this.keywordIndex]])) {
            border = row[rowFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]][leftProperty[this.keywordIndex]];
            if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
                border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
                border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
                borderStyle += this.serializeBorderStyle(border, 'left');
            }
        }
        //TopBorder
        border = borders[topProperty[this.keywordIndex]];
        if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
            border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
            border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
            borderStyle += this.serializeBorderStyle(border, 'top');
        } else if (!isNullOrUndefined(border) && HelperMethods.parseBoolValue(border[hasNoneStyleProperty[this.keywordIndex]])) {
            borderStyle += ('border-top-style:none;');
        } else if (!isNullOrUndefined(row[rowFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]][topProperty[this.keywordIndex]])) {
            border = row[rowFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]][topProperty[this.keywordIndex]];
            if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
                border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
                border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
                borderStyle += this.serializeBorderStyle(border, 'top');
            }
        }
        //RightBorder
        border = borders[rightProperty[this.keywordIndex]];
        if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
            border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
            border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
            borderStyle += this.serializeBorderStyle(border, 'right');
        } else if (!isNullOrUndefined(border) && HelperMethods.parseBoolValue(border[hasNoneStyleProperty[this.keywordIndex]])) {
            borderStyle += ('border-right-style:none;');
        } else if (!isNullOrUndefined(row[rowFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]][rightProperty[this.keywordIndex]])) {
            border = row[rowFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]][rightProperty[this.keywordIndex]];
            if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
                border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
                border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
                borderStyle += this.serializeBorderStyle(border, 'right');
            }
        }
        //BottomBorder
        border = borders[bottomProperty[this.keywordIndex]];
        if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
            border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
            border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
            borderStyle += this.serializeBorderStyle(border, 'bottom');
        } else if (!isNullOrUndefined(border) && HelperMethods.parseBoolValue(border[hasNoneStyleProperty[this.keywordIndex]])) {
            borderStyle += ('border-bottom-style:none;');
        } else if (!isNullOrUndefined(row[rowFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]][bottomProperty[this.keywordIndex]])) {
            border = row[rowFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]][bottomProperty[this.keywordIndex]];
            if (!isNullOrUndefined(border) && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 1 : 'None') && border[lineStyleProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 26 : 'Cleared')) {
                border[colorProperty[this.keywordIndex]] = isNullOrUndefined(border[colorProperty[this.keywordIndex]]) ? "#000000" : border[colorProperty[this.keywordIndex]];
                border[lineWidthProperty[this.keywordIndex]] = isNullOrUndefined(border[lineWidthProperty[this.keywordIndex]]) ? 0.5 : border[lineWidthProperty[this.keywordIndex]];
                borderStyle += this.serializeBorderStyle(border, 'bottom');
            }
        }
        return borderStyle;
    }
    private serializeBorderStyle(border: any, borderPosition: string): string {
        let borderStyle: string = '';
        borderStyle += ('border-' + borderPosition + '-style:' + this.convertBorderLineStyle(border[lineStyleProperty[this.keywordIndex]]));
        borderStyle += ';';
        if (border[lineWidthProperty[this.keywordIndex]] > 0) {
            borderStyle += ('border-' + borderPosition + '-width:' + border[lineWidthProperty[this.keywordIndex]].toString() + 'pt;');
        }
        //if (border.color !== Color.FromArgb(0, 0, 0, 0))
        if (!isNullOrUndefined(border[colorProperty[this.keywordIndex]])) {
            borderStyle += ('border-' + borderPosition + '-color:' + HelperMethods.getColor(border[colorProperty[this.keywordIndex]]) + ';');
        }
        return borderStyle;
    }
    private convertBorderLineStyle(lineStyle: number | LineStyle): string {
        switch (lineStyle) {
            case 'Single':
            case 0:
                return 'solid';
            case 'None':
            case 1:
                return 'none';
            case 'Dot':
            case 2:
                return 'dotted';
            case 'DashSmallGap':
            case 'DashLargeGap':
            case 'DashDot':
            case 'DashDotDot':
            case 3:
            case 4:
            case 5:
            case 6:
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
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
                return 'double';
            case 'SingleWavy':
            case 18:
                return 'solid';
            case 'DoubleWavy':
            case 19:
                return 'double';
            case 'DashDotStroked':
            case 20:
                return 'solid';
            case 'Emboss3D':
            case 21:
                return 'ridge';
            case 'Engrave3D':
            case 22:
                return 'groove';
            case 'Outset':
            case 23:
                return 'outset';
            case 'Inset':
            case 24:
                return 'inset';
            default:
                return 'solid';
        }
    }

    // Serialize Format
    private serializeCharacterFormat(characterFormat: any, isEmptyLine?: boolean): string {
        if (!isNullOrUndefined(characterFormat[inlineFormatProperty[this.keywordIndex]])) {
            return this.serializeCharacterFormat(characterFormat[inlineFormatProperty[this.keywordIndex]], isEmptyLine);
        }
        let propertyValue: any;
        let charStyle: string = '';
        charStyle += 'font-weight';
        charStyle += ':';
        charStyle += HelperMethods.parseBoolValue(characterFormat[boldProperty[this.keywordIndex]]) ? 'bold' : 'normal';
        charStyle += ';';
        charStyle += 'font-style';
        charStyle += ':';
        if (HelperMethods.parseBoolValue(characterFormat[italicProperty[this.keywordIndex]])) {
            charStyle += 'italic';
        } else {
            charStyle += 'normal';
        }
        charStyle += ';';
        charStyle += this.serializeTextDecoration(characterFormat);
        //Text Baseline Alignment
        if (characterFormat[baselineAlignmentProperty[this.keywordIndex]] === (this.keywordIndex == 1 ? 1 : 'Superscript') || characterFormat[baselineAlignmentProperty[this.keywordIndex]] === (this.keywordIndex == 1 ? 2 : 'Subscript')) {
            charStyle += 'vertical-align';
            charStyle += ':';
            charStyle += characterFormat[baselineAlignmentProperty[this.keywordIndex]] === (this.keywordIndex == 1 ? 1 : 'Superscript') ? 'super' : 'sub';
            charStyle += ';';

        }
        //Text Foreground and Background Color
        if (!isNullOrUndefined(characterFormat[highlightColorProperty[this.keywordIndex]]) && characterFormat[highlightColorProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 0 : 'NoColor') && !isEmptyLine) {
            charStyle += 'background-color';
            charStyle += ':';
            charStyle += this.keywordIndex == 1 ? this.getHighlightColorCode(characterFormat[highlightColorProperty[this.keywordIndex]]) : HelperMethods.getHighlightColorCode(characterFormat.highlightColor.toString());
            charStyle += ';';
        }
        //Font Color
        propertyValue = characterFormat[fontColorProperty[this.keywordIndex]];
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'color';
            charStyle += ':';
            charStyle += HelperMethods.getColor(propertyValue);
            charStyle += ';';
        }

        if (!isNullOrUndefined(characterFormat[allCapsProperty[this.keywordIndex]]) && HelperMethods.parseBoolValue(characterFormat[allCapsProperty[this.keywordIndex]])) {
            charStyle += 'text-transform';
            charStyle += ':';
            charStyle += 'uppercase';
            charStyle += ';';
        }
        propertyValue = characterFormat[fontSizeProperty[this.keywordIndex]];
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'font-size';
            charStyle += ':';
            charStyle += propertyValue.toString();
            charStyle += 'pt';
            charStyle += ';';
        }
        propertyValue = characterFormat[fontFamilyProperty[this.keywordIndex]];
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'font-family';
            charStyle += ':';
            charStyle += propertyValue.toString();
            charStyle += ';';
        }
        propertyValue = characterFormat[characterSpacingProperty[this.keywordIndex]];
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'letter-spacing';
            charStyle += ':';
            charStyle += propertyValue.toString();
            charStyle += 'pt';
            charStyle += ';';
        }
        propertyValue = characterFormat[scalingProperty[this.keywordIndex]];
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'transform:scaleX(';
            charStyle += (propertyValue/100).toString();
            charStyle += ')';
            charStyle += ';';
        }
        return charStyle.toString();
    }
    private serializeTextDecoration(characterFormat: any): string {
        let charStyle: string = 'text-decoration:';
        let value: string = '';
        // Double strike through will become Single strike through while saving HTML using MS Word.
        if (characterFormat[strikethroughProperty[this.keywordIndex]] === (this.keywordIndex == 1 ? 1 : 'SingleStrike') || characterFormat[strikethroughProperty[this.keywordIndex]] === (this.keywordIndex == 1 ? 2 : 'DoubleStrike')) {
            value += 'line-through ';
        }
        if (!isNullOrUndefined(characterFormat[underlineProperty[this.keywordIndex]]) && characterFormat[underlineProperty[this.keywordIndex]] !== (this.keywordIndex == 1 ? 0 : 'None')) {
            value += 'underline';
        }
        if (value.length > 1) {
            value = charStyle + value + ';';
        }
        return value;
    }
    /**
     * @private
     */
    public serializeParagraphFormat(paragraphFormat: any, isList: boolean, keywordIndex?: number): string {
        if (isNullOrUndefined(this.keywordIndex)) {
            this.keywordIndex = keywordIndex;
        }
        if (!isNullOrUndefined(paragraphFormat[inlineFormatProperty[this.keywordIndex]])) {
            return this.serializeParagraphFormat(paragraphFormat[inlineFormatProperty[this.keywordIndex]], isList);
        }
        let propertyValue: any;
        let paraStyle: string = '';
        propertyValue = this.getTextAlignment(paragraphFormat[textAlignmentProperty[this.keywordIndex]]);
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'text-align:' + propertyValue.toLowerCase() + ';';
        }
        propertyValue = paragraphFormat[beforeSpacingProperty[this.keywordIndex]];
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-top:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat[rightIndentProperty[this.keywordIndex]];
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-right:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat[afterSpacingProperty[this.keywordIndex]];
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-bottom:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat[leftIndentProperty[this.keywordIndex]];
        if (isList) {
            // if (isNullOrUndefined(propertyValue)) {
            //     propertyValue = -36;
            // } else {
            //     propertyValue -= 36;
            // }
            propertyValue = 0;
        }
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-left:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat[firstLineIndentProperty[this.keywordIndex]];
        if (isList) {
            // if (isNullOrUndefined(propertyValue)) {
            //     propertyValue = 18;
            // } else {
            //     propertyValue += 18;
            // }
            propertyValue = 0;
        }
        if (!isNullOrUndefined(propertyValue) && propertyValue !== 0) {
            paraStyle += 'text-indent:' + propertyValue.toString() + 'pt;';
        }
        propertyValue = paragraphFormat[lineSpacingProperty[this.keywordIndex]];
        if (!isNullOrUndefined(propertyValue)) {
            if (paragraphFormat[lineSpacingTypeProperty[this.keywordIndex]] === (this.keywordIndex == 1 ? 0 : 'Multiple')) {
                propertyValue = Math.round(propertyValue * 10) / 10;
            } else {
                propertyValue = propertyValue.toString() + 'pt;';
            }
            paraStyle += 'line-height:' + propertyValue;
        }
        return paraStyle.toString();
    }
    private createAttributesTag(tagValue: string, localProperties: string[]): string {
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
    private createTag(tagValue: string): string {
        let s: string = '';
        s += '<';
        s += tagValue;
        s += '>';
        return s;
    }
    private endTag(tagValue: string): string {
        let sb: string = '';
        sb += '<';
        sb += '/';
        sb += tagValue;
        sb += '>';
        return sb;
    }
    public createTableStartTag(table: any): string {
        let blockStyle: string = '';
        let tableStyle: string = '';
        const tagAttributes: string[] = [];
        //tagAttributes.push('border="' + '1"');
        if (!isNullOrUndefined(table[tableFormatProperty[this.keywordIndex]])) {
            //if (table.tableFormat.shading.backgroundColor !== Color.FromArgb(0, 0, 0, 0)) {
            if (!isNullOrUndefined(table[tableFormatProperty[this.keywordIndex]][shadingProperty[this.keywordIndex]]) && !isNullOrUndefined(table[tableFormatProperty[this.keywordIndex]][shadingProperty[this.keywordIndex]][backgroundColorProperty[this.keywordIndex]]) && table[tableFormatProperty[this.keywordIndex]][shadingProperty[this.keywordIndex]][backgroundColorProperty[this.keywordIndex]] !== 'empty' ) {
                tagAttributes.push('bgcolor="' + HelperMethods.getColor(table[tableFormatProperty[this.keywordIndex]][shadingProperty[this.keywordIndex]][backgroundColorProperty[this.keywordIndex]]) + '"');
            }
            //}
            if (!isNullOrUndefined(table[tableFormatProperty[this.keywordIndex]][cellSpacingProperty[this.keywordIndex]]) && table[tableFormatProperty[this.keywordIndex]][cellSpacingProperty[this.keywordIndex]] > 0) {
                tagAttributes.push('cellspacing="' + (((table[tableFormatProperty[this.keywordIndex]][cellSpacingProperty[this.keywordIndex]] * 72) / 96) * 2).toString() + '"');
            } else {
                tableStyle += ('border-collapse:collapse;');
            }
            tagAttributes.push('cellpadding="' + '0"');
            if (!isNullOrUndefined(table[tableFormatProperty[this.keywordIndex]][leftIndentProperty[this.keywordIndex]]) && table[tableFormatProperty[this.keywordIndex]][leftIndentProperty[this.keywordIndex]] !== 0 &&
                table[tableFormatProperty[this.keywordIndex]][tableAlignmentProperty[this.keywordIndex]] === (this.keywordIndex == 1 ? 0 : 'Left')) {
                tableStyle += 'margin-left:' + (table[tableFormatProperty[this.keywordIndex]][leftIndentProperty[this.keywordIndex]].toString() + 'pt;');
            }
            if (!isNullOrUndefined(table[tableFormatProperty[this.keywordIndex]])) {
                tableStyle += this.serializeTableWidth(table[tableFormatProperty[this.keywordIndex]]);
            }
            if (!isNullOrUndefined(table[tableFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]])) {
                tableStyle += this.serializeTableBorderStyle(table[tableFormatProperty[this.keywordIndex]][bordersProperty[this.keywordIndex]]);
            }
        }
        if (tableStyle.length !== 0) {
            tagAttributes.push('style="', tableStyle.toString() + '"');
        }
        return blockStyle += (this.createAttributesTag('table', tagAttributes));
    }

    private serializeTableWidth(tableFormat: any): string {
        let width: string = '';
        switch (tableFormat[preferredWidthTypeProperty[this.keywordIndex]]) {
            case 'Percent':
            case 1:
                width += 'width: ' + tableFormat[preferredWidthProperty[this.keywordIndex]].toString() + '%;';
                break;
            case 'Point':
            case 2:
                width += 'width: ' + tableFormat[preferredWidthProperty[this.keywordIndex]].toString() + 'pt;';
                break;
            case 'Auto':
            case 0:
                width += 'width: auto;';
                break;
        }
        return width;
    }
    private getHighlightColorCode(highlightColor: number): string {
        let color: string = '#ffffff';
        switch (highlightColor) {
        case 1: color = '#ffff00';
            break;
        case 2: color = '#00ff00';
            break;
        case 3: color = '#00ffff';
            break;
        case 4: color = '#ff00ff';
            break;
        case 5: color = '#0000ff';
            break;
        case 6: color = '#ff0000';
            break;
        case 7: color = '#000080';
            break;
        case 8: color = '#008080';
            break;
        case 9: color = '#008000';
            break;
        case 10: color = '#800080';
            break;
        case 11: color = '#800000';
            break;
        case 12: color = '#808000';
            break;
        case 13: color = '#808080';
            break;
        case 14: color = '#c0c0c0';
            break;
        case 15: color = '#000000';
            break;
        }
        return color;
    }
    private getTextAlignment(textAlignment: number): string {
        switch (textAlignment) {
            case 1:
                return 'Center';
            case 2:
                return 'Right';
            case 3:
                return 'Justify';
            default:
                return 'Left';
        }
    }
    private createTableEndTag(): string {
        let blockStyle: string = '';
        blockStyle += (this.endTag('table'));
        return blockStyle;
    }
    private createRowStartTag(row: any): string {
        let blockStyle: string = '';
        const tagAttributes: string[] = [];
        if (HelperMethods.parseBoolValue(row[rowFormatProperty[this.keywordIndex]][isHeaderProperty[this.keywordIndex]])) {
            blockStyle += (this.createTag('thead'));
        }
        if (!isNullOrUndefined(row[rowFormatProperty[this.keywordIndex]][heightProperty[this.keywordIndex]]) && row[rowFormatProperty[this.keywordIndex]][heightProperty[this.keywordIndex]] > 0) {
            const height: number = HelperMethods.convertPointToPixel(row[rowFormatProperty[this.keywordIndex]][heightProperty[this.keywordIndex]]);
            tagAttributes.push('height="' + height + '"');
        }
        return blockStyle + this.createAttributesTag('tr', tagAttributes);
    }
    private createRowEndTag(row: any): string {
        let blockStyle: string = '';
        blockStyle += (this.endTag('tr'));
        if (HelperMethods.parseBoolValue(row[rowFormatProperty[this.keywordIndex]][isHeaderProperty[this.keywordIndex]])) {
            blockStyle += (this.endTag('thead'));
        }
        return blockStyle;
    }
    private decodeHtmlNames(text: string): string {
        if (text === '\t') {
            return '&emsp;';
        }
        text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const splittedText: string[] = text.split(' ');
        let htmlText: string = '';
        if (splittedText.length > 0) {
            htmlText = splittedText[0];
            for (let i: number = 0; i < splittedText.length - 1; i++) {
                htmlText += ' ' + splittedText[i + 1];
            }
        }
        return htmlText;
    }
    /* eslint:enable:no-any */
}
