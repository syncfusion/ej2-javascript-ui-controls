/**
 * Trial-license shape applied on save when `validateLicense` fails.
 *
 * Same gate as `document.save` (`if (!validateLicense(...))`).
 * Kept out of `index.ts` so document serialization can call it without a
 * value-import cycle through the watermark barrel.
 *
 * @private
 */
import { WordDocument } from '../document/document';
import { Section } from '../document/section';
import { Sections } from '../document/sections';
import { Body } from '../document/body';
import { Paragraph } from '../document/paragraph';
import { Shape } from '../drawing/drawing-shape';
import { AutoShapeType } from '../drawing/shape-types';
import { TextWrappingStyle, HorizontalOrigin, VerticalOrigin, HorizontalAlignment, VerticalAlignment } from '../images/layout-types';
import { ParagraphAlignment } from '../document/alignment';
import { Color } from '../document/color';
import { TextRange } from '../document/text-range';
import { FieldMark, FieldMarkType, HyperlinkType } from '../fields/index';
import '../document/augmentations';

/** Diagonal trial text stamped when the document library license is invalid. */
const LICENSE_WATERMARK_TEXT: string = 'Created with a trial version of Syncfusion Word library.';

/** Trial paragraph text with hyperlink when the document library license is invalid. */
const LICENSE_PARAGRAPH_PREFIX: string = 'Created with a trial version of Syncfusion Word library or registered the wrong key in your application. Click ';

/** License claim URL */
const LICENSE_CLAIM_URL: string = 'https://www.syncfusion.com/account/claim-license-key?pl=d29yZCx3b3JkZWRpdG9yLGdyaWRzZGs=&vs=MzUuMS4zOQ==';

/** License claim link text */
const LICENSE_CLAIM_LINK_TEXT: string = 'here';

/** License claim url ending text */
const LICENSE_CLAIM_END_TEXT: string = ' to obtain the valid key';

/**
 * Stamp the trial watermark before package serialization.
 * Does not replace a watermark the caller already assigned.
 *
 * @param {WordDocument} document - The document to apply watermark to.
 * @returns {void} Nothing is returned.
 * @private
 */
export function applyLicenseWatermark(document: WordDocument): void {
    // Stamp a rotated, behind-text shape in every section (first paragraph anchors it).
    for (const section of document.sections) {
        addTrialShape(section);
    }

    // Add a paragraph at the beginning with trial/license message and hyperlink
    addLicenseParagraphWithHyperlink(document);
}

/**
 * Add the floating trial text shape to the section headers.
 *
 * @param {Section} section - The section.
 * @returns {void} Nothing is returned.
 * @private
 */
function addTrialShape(section: Section): void {
    addTrialShapeToHeader(section, section.headersFooters.oddHeader);
    if (section.pageSetup.differentFirstPage) {
        addTrialShapeToHeader(section, section.headersFooters.firstPageHeader);
    }
}

/**
 * Add the floating trial text shape to a header, scaled to the section page size.
 *
 * @param {Section} section - The section.
 * @param {Body} body - The header body.
 * @returns {void} Nothing is returned.
 * @private
 */
function addTrialShapeToHeader(section: Section, body: Body): void {
    const paragraph: Paragraph = body.paragraphs.count > 0 ? body.paragraphs[0] : body.appendParagraph();
    const pageWidth: number = section.pageSetup.pageSize.width;
    const pageHeight: number = section.pageSetup.pageSize.height;
    const shortSide: number = Math.min(pageWidth, pageHeight);
    const width: number = Math.round(shortSide * 0.9);
    const height: number = Math.round(width * 0.1);
    const shape: Shape = paragraph.appendShape(AutoShapeType.Rectangle, width, height);
    shape.name = 'TrialWatermark';
    shape.rotation = 315;
    shape.isBelowText = true;
    shape.wrapFormat.textWrappingStyle = TextWrappingStyle.None;
    shape.horizontalOrigin = HorizontalOrigin.Page;
    shape.verticalOrigin = VerticalOrigin.Page;
    shape.horizontalAlignment = HorizontalAlignment.Center;
    shape.verticalAlignment = VerticalAlignment.Center;
    shape.fillFormat.fill = false;
    shape.lineFormat.line = false;
    const textParagraph: Paragraph = shape.textBody.paragraphs.count > 0
        ? shape.textBody.paragraphs[0]
        : shape.textBody.appendParagraph();
    textParagraph.paragraphFormat.horizontalAlignment = ParagraphAlignment.Center;
    const text: TextRange = textParagraph.appendText(LICENSE_WATERMARK_TEXT);
    text.characterFormat.textColor = Color.Red;
    text.characterFormat.bold = true;
    text.characterFormat.fontSize = Math.max(8, Math.round(width / 40));
}

/**
 * Add a paragraph at the beginning of the document with trial/license message and hyperlink.
 *
 * @param {WordDocument} document - The document to add paragraph to.
 * @returns {void} Nothing is returned.
 * @private
 */
function addLicenseParagraphWithHyperlink(document: WordDocument): void {
    try {
        const sections: Sections = document.sections;
        if (sections.count === 0) {
            return;
        }

        const section: Section | undefined = sections[0];
        if (section === undefined) {
            return;
        }

        const body: Body | undefined = section.body;
        if (body === undefined || body.rawBlocks().length === 0) {
            return;
        }

        // Create a new paragraph at the beginning
        const licenseParagraph: Paragraph = body.insertParagraph(0);

        // Add text before hyperlink
        let text: TextRange = licenseParagraph.appendText(LICENSE_PARAGRAPH_PREFIX);
        text.characterFormat.textColor = Color.Red;
        text.characterFormat.bold = true;
        // Add hyperlink using appendHyperlink if available
        try {
            // Try to use appendHyperlink method from the augmented Paragraph class
            if (typeof licenseParagraph.appendHyperlink === 'function') {
                licenseParagraph.appendHyperlink(
                    LICENSE_CLAIM_URL,
                    LICENSE_CLAIM_LINK_TEXT,
                    HyperlinkType.WebLink
                );

                let isFieldResult: boolean = false;
                for (const currentParaItem of licenseParagraph.items) {
                    if (currentParaItem instanceof FieldMark) {
                        if (currentParaItem.fieldMarkType === FieldMarkType.Separator) {
                            isFieldResult = true;
                            continue;
                        }

                        if (currentParaItem.fieldMarkType === FieldMarkType.End) {
                            break;
                        }
                    }

                    if (isFieldResult && currentParaItem instanceof TextRange) {
                        currentParaItem.characterFormat.textColor = Color.Blue;
                        currentParaItem.characterFormat.bold = true;
                    }
                }
            } else {
                // Fallback: just add as regular text with red color
                licenseParagraph.appendText(LICENSE_CLAIM_LINK_TEXT);
            }
        } catch (e) {
            // Fallback: just add as regular text if appendHyperlink fails
            licenseParagraph.appendText(LICENSE_CLAIM_LINK_TEXT);
        }

        // Add text after hyperlink
        text = licenseParagraph.appendText(LICENSE_CLAIM_END_TEXT);
        text.characterFormat.textColor = Color.Red;
        text.characterFormat.bold = true;
    } catch (e) {
        // Silently fail if paragraph insertion fails
        // This ensures the diagonal watermark is still applied
    }
}
