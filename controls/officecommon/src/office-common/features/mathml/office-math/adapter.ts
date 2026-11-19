/**
 * Generic document-adapter contracts.
 *
 * `ej2-office-common` stays document-agnostic: a host (for example `ej2-docx`)
 * supplies native runs and character formats through {@link MathDocumentAdapter}.
 */

import { OpenXmlElement } from '../openxml';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMathRunElement } from './run-element';

/**
 * A document-specific run held by an {@link OfficeMathRunElement}.
 *
 * @public
 */
export interface OfficeRun {
    /** The run element that contains this run. */
    ownerMathRunElement?: OfficeMathRunElement;
}

/**
 * A document-specific character format.
 *
 * @public
 */
export interface OfficeRunFormat {
    /** Creates an independent copy. */
    clone(): OfficeRunFormat;
    /** Value equality with another format; when omitted, formats are treated as equal. */
    equals?(other: OfficeRunFormat): boolean;
}

/**
 * Host integration points used by the Math model, parser, serializer and LaTeX converter.
 *
 * @public
 */
export interface MathDocumentAdapter {
    /** Creates a native run for the run element. */
    createRun(runElement: OfficeMathRunElement): OfficeRun;
    /** Replaces the run text. */
    setRunText(run: OfficeRun, text: string): void;
    /** Appends text to the run. */
    appendRunText(run: OfficeRun, text: string): void;
    /** Reads the run text. */
    getRunText(run: OfficeRun): string;
    /** Creates the default Math character format for the Math owner. */
    createDefaultMathCharacterFormat(mathOwner: unknown): OfficeRunFormat;
    /** Creates an independent copy of the run. */
    cloneRun(run: OfficeRun): OfficeRun;
    /** Parses `m:ctrlPr` of a function into a native character format. */
    parseControlProperties(element: OpenXmlElement, owner: OfficeMathFunctionBase): OfficeRunFormat;
    /**
     * Parses `m:r` content into the run element, in source order (`w:rPr`, text and other children).
     * The parser has already applied `m:rPr`; the adapter ignores it and must assign `runElement.item`.
     */
    parseMathRun(element: OpenXmlElement, runElement: OfficeMathRunElement): void;
    /** Serializes a control-properties format to the children of `m:ctrlPr`. */
    serializeControlProperties(format: OfficeRunFormat): OpenXmlElement[];
    /** Serializes the run (`w:rPr` and content) to the non-`m:rPr` children of `m:r`. */
    serializeMathRun(runElement: OfficeMathRunElement): OpenXmlElement[];
}
