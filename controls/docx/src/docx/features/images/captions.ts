/**
 * Picture caption authoring. Imports fields + styles; must not be pulled into the
 * always-on core graph. Loaded from the images public feature entry
 * (`@syncfusion/ej2-docx/images`) so `addCaption` works without embedding those optionals in
 * `dist/index.js`.
 */
import { ownGet } from '../../core/compat/object-compat';
import { DetachedObjectError, DocxError } from '../../core/errors/docx-error';
import { WordDocument } from '../document/document';
import { Paragraph, BlockContent } from '../document/paragraph';

import { ParagraphAlignment } from '../document/alignment';
import { visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { appendOpaqueComplexField, fieldInstructionKeyword, opaqueComplexFieldInstructionsInParagraph } from '../fields/index';
import { Field } from '../fields/paragraph-field';
import { stylesFor } from '../styles/index';
import { providePictureCaptionAuthoring } from './caption-authoring-api';
import { CAPTION_FORMAT_SWITCH, CAPTION_NUMBERING_FORMATS, CAPTION_POSITIONS, CaptionNumberingFormat as CaptionNf, CaptionPosition as CaptionPos, formatSequenceValue } from './caption-enums';
import { CaptionNumberingFormat as CaptionNumberingFormatValue, CaptionPosition as CaptionPositionValue } from './caption-enums';
import { hostDocumentOf } from './caption-host';
import { Picture } from './index';
import { picturesInParagraph } from './index';
import { ParagraphFormat } from '../document/paragraph-format';
/** Built-in caption paragraph style id (`w:pStyle w:val="Caption"`). */
const CAPTION_STYLE_ID: string = 'Caption';
function assertEnumMember(label: string, value: string, allowed: ReadonlySet<string>): void {
    if (!allowed.has(value)) {
        if (label === 'format') {
            throw new DocxError('content/invalid-image-caption-format', `Invalid ${label} value "${value}"; expected one of: ${[...allowed].join(', ')}`);
        }
        throw new DocxError('content/invalid-image-caption-position', `Invalid ${label} value "${value}"; expected one of: ${[...allowed].join(', ')}`);
    }
}
/**
 * Locate the body paragraph containing `picture`.
 *
 * @param {WordDocument} document - The document.
 * @param {Picture} picture - The picture.
 * @returns {Object} The result.
 * @throws DetachedObjectError when the picture is not attached to a paragraph in
 * a document body.
 */
function paragraphForPicture(document: WordDocument, picture: Picture): {
    paragraph: Paragraph;
    blockIndex: number;
} {
    const blocks: ReadonlyArray<BlockContent> = document.listBlocks();
    for (const [index, content] of blocks.entries()) {
        if (content === undefined || content.type !== 'paragraph') {
            continue;
        }
        if (picturesInParagraph(content.paragraph).indexOf(picture) !== -1) {
            return { paragraph: content.paragraph, blockIndex: index };
        }
    }
    throw new DetachedObjectError('This picture is not attached to a paragraph in a document body; captions require a main-body picture paragraph');
}
/**
 * Count existing `SEQ <identifier>` complex fields (any switch) in document order.
 *
 * @param {WordDocument} document - The document.
 * @param {string} identifier - The identifier.
 * @returns {number} The result.
 */
function countSeqFields(document: WordDocument, identifier: string): number {
    let count: number = 0;
    const countInstruction: (instruction: string) => void = (instruction: string): void => {
        if (fieldInstructionKeyword(instruction) !== 'SEQ') {
            return;
        }
        const seqIdentifier: string = instruction.trim().split(/\s+/)[1];
        if ((seqIdentifier != null ? seqIdentifier : '') === identifier) {
            count += 1;
        }
    };
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        // Freshly authored captions are raw complex fields; captions read from a package are
        // parsed into Field items. Both count toward the sequence.
        for (const instruction of opaqueComplexFieldInstructionsInParagraph(paragraph)) {
            countInstruction(instruction);
        }
        for (const item of paragraph.items) {
            if (item instanceof Field) {
                countInstruction(item.fieldCode);
            }
        }
    });
    return count;
}
/**
 * Build the caption paragraph and insert it relative to the picture paragraph.
 *
 * @param {Picture} picture - The picture.
 * @param {string} captionName - The caption name.
 * @param {CaptionNumberingFormatValue} numberingFormat - The numbering format.
 * @param {CaptionPositionValue} position - The position.
 * @returns {Paragraph} The result.
 * @private
 */
export function addCaptionToPicture(
    picture: Picture,
    captionName: string,
    numberingFormat: CaptionNumberingFormatValue,
    position: CaptionPositionValue
): Paragraph {
    if (typeof captionName !== 'string' || captionName.trim().length === 0) {
        throw new DocxError('content/invalid-image-caption-name', 'Caption name must be a non-empty string (not null, undefined, empty, or whitespace-only)');
    }
    assertEnumMember('format', String(numberingFormat), CAPTION_NUMBERING_FORMATS);
    assertEnumMember('position', String(position), CAPTION_POSITIONS);
    const document: WordDocument = hostDocumentOf(picture);
    if (document === undefined) {
        throw new DetachedObjectError('This picture is not attached to a document; attach it with paragraph.appendImage() before adding a caption');
    }
    const { blockIndex } = paragraphForPicture(document, picture);
    const name: string = captionName.trim();
    stylesFor(document).ensureParagraphStyle(CAPTION_STYLE_ID);
    const instruction: string = `SEQ ${name} \\* ${ownGet(CAPTION_FORMAT_SWITCH, numberingFormat)}`;
    // Insert first (attaches the paragraph), then populate: Paragraph setters
    // and appendText/appendField require an attached paragraph.
    const caption: Paragraph = document.insertParagraphAtBlockIndex(position === CaptionPos.Above ? blockIndex : blockIndex + 1);
    caption.styleId = CAPTION_STYLE_ID;
    const captionFormat: ParagraphFormat = caption.paragraphFormat;
    captionFormat.beforeSpacing = 1.5;
    captionFormat.afterSpacing = 12;
    captionFormat.horizontalAlignment = ParagraphAlignment.Center;
    caption.appendText(`${name} `);
    const result: string = formatSequenceValue(countSeqFields(document, name) + 1, numberingFormat);
    appendOpaqueComplexField(caption, instruction, { result: result });
    return caption;
}
/**
 * @param {Picture} image - The image.
 * @param {string} captionName - The caption name.
 * @param {CaptionNumberingFormatValue} numberingFormat - The numbering format.
 * @param {CaptionPositionValue} position - The position.
 * @returns {Paragraph} The result.
 * @deprecated Use {@link addCaptionToPicture} instead.
 * @private
 */
export function addCaptionToImage(
    image: Picture,
    captionName: string,
    numberingFormat: CaptionNumberingFormatValue,
    position: CaptionPositionValue
): Paragraph {
    return addCaptionToPicture(image, captionName, numberingFormat, position);
}
providePictureCaptionAuthoring(addCaptionToPicture);
