/**
 * Minimal document-agnostic run and format used when no document adapter is supplied.
 */

import { OfficeRun, OfficeRunFormat } from './adapter';
import { OfficeMathRunElement } from './run-element';
import { OpenXmlElement } from '../openxml';
import { xmlEqual } from './xml-equal';

/**
 * Default character format of the standalone package. Keeps a parsed `m:ctrlPr` verbatim.
 *
 * @public
 */
export class BasicRunFormat implements OfficeRunFormat {
    /** The original `m:ctrlPr` element, when the format was parsed from XML. */
    readonly preservedXml: OpenXmlElement | undefined;

    /**
     * Creates the format.
     *
     * @param {OpenXmlElement} preservedXml Optional original `m:ctrlPr` element.
     */
    constructor(preservedXml?: OpenXmlElement) {
        this.preservedXml = preservedXml;
    }

    /**
     * Creates an independent copy.
     *
     * @returns {OfficeRunFormat} The copy.
     */
    clone(): OfficeRunFormat {
        return new BasicRunFormat(this.preservedXml);
    }

    /**
     * Value equality with another format.
     *
     * @param {OfficeRunFormat} other The format to compare with.
     * @returns {boolean} True when both keep the same XML.
     */
    equals(other: OfficeRunFormat): boolean {
        const peer: BasicRunFormat | undefined = other instanceof BasicRunFormat ? other : undefined;
        if (peer === undefined) { return false; }
        if (this.preservedXml === undefined || peer.preservedXml === undefined) {
            return this.preservedXml === peer.preservedXml;
        }
        return xmlEqual(this.preservedXml, peer.preservedXml);
    }
}

/**
 * A text segment of a standalone run (`m:t`).
 *
 * @public
 */
export interface BasicRunText {
    /** Discriminator. */
    readonly kind: 'text';
    /** Text value. */
    readonly value: string;
    /** `xml:space` value of the source element, when present. */
    readonly space?: string;
}

/**
 * A non-text child of a standalone run, kept verbatim.
 *
 * @public
 */
export interface BasicRunXml {
    /** Discriminator. */
    readonly kind: 'xml';
    /** The preserved element. */
    readonly element: OpenXmlElement;
}

/**
 * Ordered content item of a standalone run.
 *
 * @public
 */
export type BasicRunPart = BasicRunText | BasicRunXml;

/**
 * Default run of the standalone package. Keeps text and non-text children in source order.
 *
 * @public
 */
export class BasicRun implements OfficeRun {
    /** The run element that contains this run. */
    ownerMathRunElement?: OfficeMathRunElement;
    /** Run character format. */
    characterFormat: OfficeRunFormat = new BasicRunFormat();
    /** The original `w:rPr` element, when parsed from XML. */
    runProperties: OpenXmlElement | undefined;
    /** Ordered run content: text segments and preserved children. */
    readonly parts: BasicRunPart[] = [];

    /**
     * Concatenated text of all text segments.
     *
     * @returns {string} The run text.
     */
    get text(): string {
        return this.parts.map((part: BasicRunPart) => part.kind === 'text' ? part.value : '').join('');
    }
    set text(value: string) {
        const first: number = this.parts.map((part: BasicRunPart) => part.kind).indexOf('text');
        const kept: BasicRunPart[] = this.parts.filter((part: BasicRunPart) => part.kind !== 'text');
        const at: number = first < 0 ? kept.length : this.parts.slice(0, first).filter((p: BasicRunPart) => p.kind !== 'text').length;
        kept.splice(at, 0, { kind: 'text', value });
        this.parts.length = 0;
        kept.forEach((part: BasicRunPart) => this.parts.push(part));
    }

    /**
     * Creates an independent copy of the run.
     *
     * @returns {BasicRun} The copy.
     */
    clone(): BasicRun {
        const copy: BasicRun = new BasicRun();
        copy.characterFormat = this.characterFormat.clone();
        copy.runProperties = this.runProperties;
        this.parts.forEach((part: BasicRunPart) => copy.parts.push(part));
        return copy;
    }
}
