import {
    MATH_NAMESPACE,
    MathDocumentAdapter,
    OfficeMathFunctionBase,
    OfficeMathRunElement,
    OfficeRun,
    OfficeRunFormat,
    OpenXmlElement,
    createElement,
    createText,
    textContent
} from '@syncfusion/ej2-office-common';
import { ParagraphItem, ParagraphItemOwner } from '../document/paragraph-item';
import { TextRange, needsXmlSpacePreserve } from '../document/text-range';
import { CharacterFormat } from '../document/character-format';
import { isWml } from '../document/wml';
import { MathCharacterFormat, characterFormatFromRPr, rPrFromCharacterFormat, rPrOfCtrlPr, isMathElement } from './math-format';

const XML_NAMESPACE: string = 'http://www.w3.org/XML/1998/namespace';

/** Mutation gate for text ranges that live inside a math run rather than in a paragraph. */
const MATH_RUN_OWNER: ParagraphItemOwner = {
    assertAttachedItem(_target: ParagraphItem): void {
        // Math runs are always mutable while their Math item is.
    }
};

/** Native text range that records the math run element owning it. */
class MathRunText extends TextRange {
    constructor() {
        super(MATH_RUN_OWNER);
    }
}

/**
 *  Cambria Math in every font slot (ascii, hAnsi, eastAsia, cs), as Word writes it.
 *
 * @param {CharacterFormat} format - The format.
 * @returns {void} Nothing is returned.
 *
 * @private
 */
export function applyMathFonts(format: CharacterFormat): void {
    format.fontName = 'Cambria Math';
    format.fontNameFarEast = 'Cambria Math';
    format.fontNameBidi = 'Cambria Math';
}

function nativeRun(run: OfficeRun): MathRunText {
    return run as MathRunText;
}

/**
 * @private
 * Binds the Office Math model to native document runs: every `m:r` holds a {@link TextRange}
 * and every control property bag holds a native {@link CharacterFormat}.
 */
export class DocxMathAdapter implements MathDocumentAdapter {
    createRun(runElement: OfficeMathRunElement): OfficeRun {
        const run: MathRunText = new MathRunText();
        applyMathFonts(run.characterFormat);
        return run;
    }

    setRunText(run: OfficeRun, text: string): void {
        nativeRun(run).text = text;
    }

    appendRunText(run: OfficeRun, text: string): void {
        nativeRun(run).text += text;
    }

    getRunText(run: OfficeRun): string {
        return nativeRun(run).text;
    }

    createDefaultMathCharacterFormat(_mathOwner: unknown): OfficeRunFormat {
        const format: MathCharacterFormat = new MathCharacterFormat();
        applyMathFonts(format.format);
        format.format.italic = true;
        return format;
    }

    cloneRun(run: OfficeRun): OfficeRun {
        const source: MathRunText = nativeRun(run);
        const copy: MathRunText = new MathRunText();
        copy.text = source.text;
        copy.applyCharacterFormat(source.characterFormat);
        return copy;
    }

    parseControlProperties(element: OpenXmlElement, _owner: OfficeMathFunctionBase): OfficeRunFormat {
        return new MathCharacterFormat(characterFormatFromRPr(rPrOfCtrlPr(element)));
    }

    parseMathRun(element: OpenXmlElement, runElement: OfficeMathRunElement): void {
        const range: MathRunText = new MathRunText();
        let text: string = '';
        for (const child of element.children) {
            if (child.kind !== 'element') {
                continue;
            }
            if (isWml(child, 'rPr')) {
                range.characterFormat.hydrate(characterFormatFromRPr(child).snapshot());
            } else if (isMathElement(child, 't') || isWml(child, 't')) {
                text += textContent(child);
            }
        }
        range.setTextFromParse(text, needsXmlSpacePreserve(text));
        runElement.item = range;
    }

    serializeControlProperties(format: OfficeRunFormat): OpenXmlElement[] {
        if (!(format instanceof MathCharacterFormat)) {
            return [];
        }
        const rPr: OpenXmlElement = rPrFromCharacterFormat(format.format);
        return rPr === undefined ? [] : [rPr];
    }

    serializeMathRun(runElement: OfficeMathRunElement): OpenXmlElement[] {
        const item: OfficeRun = runElement.item;
        if (item === undefined) {
            return [];
        }
        const range: MathRunText = nativeRun(item);
        const out: OpenXmlElement[] = [];
        const rPr: OpenXmlElement = rPrFromCharacterFormat(range.characterFormat);
        if (rPr !== undefined) {
            out.push(rPr);
        }
        const attributes: { namespaceUri: string; localName: string; prefix: string; value: string; }[] = needsXmlSpacePreserve(range.text)
            ? [{ namespaceUri: XML_NAMESPACE, localName: 'space', prefix: 'xml', value: 'preserve' }]
            : [];
        out.push(createElement(MATH_NAMESPACE, 't', 'm', { attributes, children: [createText(range.text)] }));
        return out;
    }
}
