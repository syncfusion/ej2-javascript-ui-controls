import { isNullOrUndefined } from '@syncfusion/ej2-base';
import {
    PdfBrush,
    PdfFont,
    PdfFontFamily,
    PdfFontStyle,
    PdfGraphics,
    PdfPen,
    PdfStandardFont,
    PdfStringFormat,
    PdfTextAlignment,
    PdfVerticalAlignment,
    Rectangle
} from '@syncfusion/ej2-pdf';
import { ICellComment, ICellCommentReply, ISortedCommentItem } from '../common/index';
import { sanitizeTextForFont } from '../common/index';

const BALLOON_BG: { r: number; g: number; b: number } = { r: 255, g: 255, b: 225 };
const BALLOON_BORDER: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 };
const BALLOON_TEXT: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 };
const THREADED_BALLOON_BG: { r: number; g: number; b: number } = { r: 248, g: 249, b: 250 };
const THREADED_BALLOON_BORDER: { r: number; g: number; b: number } = { r: 147, g: 112, b: 219 };

/**
 * Handles rendering of cell comments and notes in place as balloons or tabulated at sheet end.
 */
export class CommentRenderer {
    /**
     * Renders a callout balloon over the page representing an in-place cell note or threaded comment.
     *
     * @param {ICellComment} comment The cell comment object.
     * @param {Rectangle} cellRect The bounding rectangle of the associated cell.
     * @param {PdfGraphics} graphics Target PDF page graphics context.
     * @param {boolean} blackAndWhite Whether monochrome printing is enabled.
     * @param {number} [maxWidthLimit] Optional page boundary right limit to prevent overflow.
     * @returns {void}
     */
    public static drawInPlaceBalloon(
        comment: ICellComment,
        cellRect: Rectangle,
        graphics: PdfGraphics,
        blackAndWhite: boolean,
        maxWidthLimit?: number
    ): void {
        const balloonWidth: number = 130;
        const balloonHeight: number = comment.isThreaded ? 65 : 55;
        let balloonX: number = cellRect.x + cellRect.width + 2;
        if (!isNullOrUndefined(maxWidthLimit) && balloonX + balloonWidth > maxWidthLimit) {
            balloonX = Math.max(0, cellRect.x - balloonWidth - 2);
        }
        const balloonRect: Rectangle = {
            x: balloonX,
            y: cellRect.y,
            width: balloonWidth,
            height: balloonHeight
        };
        const bg: { r: number; g: number; b: number } = comment.isThreaded ? THREADED_BALLOON_BG : BALLOON_BG;
        const border: { r: number; g: number; b: number } = comment.isThreaded ? THREADED_BALLOON_BORDER : BALLOON_BORDER;
        const fillBrush: PdfBrush = new PdfBrush(blackAndWhite ? { r: 255, g: 255, b: 255 } : bg);
        const borderPen: PdfPen = new PdfPen(blackAndWhite ? { r: 0, g: 0, b: 0 } : border, comment.isThreaded ? 1.0 : 0.5);
        graphics.drawRectangle(balloonRect, fillBrush);
        graphics.drawRectangle(balloonRect, borderPen);

        const textBrush: PdfBrush = new PdfBrush(BALLOON_TEXT);
        const fontName: PdfFontFamily = PdfFontFamily.helvetica;
        const titleFont: PdfFont = new PdfStandardFont(fontName, 8, PdfFontStyle.bold);
        const bodyFont: PdfFont = new PdfStandardFont(fontName, 7.5, PdfFontStyle.regular);
        const format: PdfStringFormat = new PdfStringFormat();
        format.alignment = PdfTextAlignment.left;
        format.lineAlignment = PdfVerticalAlignment.top;

        let currentY: number = balloonRect.y + 3;
        const innerWidth: number = balloonRect.width - 6;
        let cleanText: string = comment.text || '';
        let authorPrefix: string = '';
        if (comment.author) {
            const authorTag: string = comment.author + ':';
            if (cleanText.indexOf(authorTag) === 0) {
                cleanText = cleanText.substring(authorTag.length).replace(/^\s+/, '');
            }
            authorPrefix = comment.author + ':\n';
        }
        if (authorPrefix) {
            const authorHeader: string = sanitizeTextForFont(authorPrefix.replace(/\s+$/, ''), titleFont);
            graphics.drawString(
                authorHeader,
                titleFont,
                { x: balloonRect.x + 4, y: currentY, width: innerWidth, height: 10 },
                textBrush,
                format
            );
            currentY += 10;
        }
        if (comment.isThreaded && comment.createdAt) {
            const dateStr: string = sanitizeTextForFont(comment.createdAt.toLocaleDateString(), bodyFont);
            const dateBrush: PdfBrush = new PdfBrush({ r: 120, g: 120, b: 120 });
            graphics.drawString(
                dateStr,
                bodyFont,
                { x: balloonRect.x + 4, y: currentY, width: innerWidth, height: 9 },
                dateBrush,
                format
            );
            currentY += 10;
        }
        const bodyText: string = sanitizeTextForFont(cleanText, bodyFont);
        const textHeight: number = balloonRect.height - (currentY - balloonRect.y) - 2;
        graphics.drawString(
            bodyText,
            bodyFont,
            { x: balloonRect.x + 4, y: currentY, width: innerWidth, height: textHeight },
            textBrush,
            format
        );
    }

    public static buildEndCommentRows(comments: ISortedCommentItem[]): { labelCol: string; valueCol: string }[] {
        const rows: { labelCol: string; valueCol: string }[] = [];
        for (let commentIndex: number = 0; commentIndex < comments.length; commentIndex++) {
            const item: ISortedCommentItem = comments[commentIndex as number];
            const comment: ICellComment = item.comment;
            if (!comment.isThreaded) {
                const label: string = 'Cell: \nNote: ';
                let cleanText: string = comment.text || '';
                let authorPrefix: string = '';
                if (comment.author) {
                    const authorTag: string = comment.author + ':';
                    if (cleanText.indexOf(authorTag) === 0) {
                        cleanText = cleanText.substring(authorTag.length).replace(/^\s+/, '');
                    }
                    authorPrefix = comment.author + ':\n';
                }
                const value: string = item.cellAddress + '\n' + authorPrefix + cleanText + '\n';
                rows.push({ labelCol: label, valueCol: value });
            } else {
                const label: string = 'Cell: \nComment: ';
                const createdStr: string = comment.createdAt ? ' ' + comment.createdAt.toLocaleDateString() : '';
                const authorHeader: string = comment.author ? comment.author + createdStr + '\n' : '';
                const value: string = item.cellAddress + '\n' + authorHeader + comment.text;
                rows.push({ labelCol: label, valueCol: value });
                if (comment.replies && comment.replies.length > 0) {
                    for (let rIdx: number = 0; rIdx < comment.replies.length; rIdx++) {
                        const reply: ICellCommentReply = comment.replies[rIdx as number];
                        const replyCreatedStr: string = reply.createdAt ? ' ' + reply.createdAt.toLocaleDateString() : '';
                        const replyAuthor: string = reply.author ? reply.author + replyCreatedStr + '\n' : '';
                        rows.push({
                            labelCol: 'Reply: ',
                            valueCol: replyAuthor + reply.text
                        });
                    }
                }
            }
        }
        return rows;
    }
}
