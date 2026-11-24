import {
    MATH_NAMESPACE,
    OfficeMath,
    OfficeMathCollection,
    OfficeMathFunctionBase,
    OfficeMathParagraph,
    OpenXmlElement,
    parseOfficeMathParagraph,
    serializeOfficeMathParagraph
} from '@syncfusion/ej2-office-common';
import { ParagraphItem } from '../document/paragraph-item';
import { DocxMathAdapter } from './math-adapter';
import { forEachMathFunction, seedMathDefaults } from './math-defaults';

const MATH_PREFIX: string = 'm';

/**
 * Represents an equation in a paragraph.
 *
 * The equation content is available through {@link Math.mathParagraph}.
 *
 * @public
 */
export class Math extends ParagraphItem {
    /**
     * Gets the math paragraph.
     */
    readonly mathParagraph: OfficeMathParagraph;

    private inlineValue: boolean;
    /** Functions parsed from a file; they keep their stored properties on save. */
    private readonly loaded: WeakSet<object> = new WeakSet<object>();

    /**
     * Creates an empty math item; the first equation is created on demand.
     * Initializes a new instance of the Math class.
     *
     * @param {boolean} isInline - Specifies whether the equation is inline. The default value is true.
     * @param {OfficeMathParagraph} mathParagraph - Specifies the equation content.
     */
    constructor(isInline: boolean = true, mathParagraph?: OfficeMathParagraph) {
        super();
        this.mathParagraph = mathParagraph !== undefined ? mathParagraph : new OfficeMathParagraph(new DocxMathAdapter());
        this.inlineValue = isInline;
        if (mathParagraph !== undefined) {
            forEachMathFunction(mathParagraph, (fn: OfficeMathFunctionBase) => this.loaded.add(fn));
        }
    }

    /**
     * Gets a value indicating whether the equation is inline (true) or displayed on its own line (false).
     */
    get isInline(): boolean {
        return this.inlineValue;
    }

    set isInline(value: boolean) {
        this.mutate();
        this.inlineValue = value;
    }

    /**
     * Changes the equation to an inline equation.
     *
     * @returns {void}
     */
    changeToInline(): void {
        this.isInline = true;
    }

    /**
     * Changes the equation to a display equation.
     *
     * @returns {void}
     */
    changeToDisplay(): void {
        this.isInline = false;
    }

    /**
     * Gets the first equation of the item; creates one when none exists.
     */
    get equation(): OfficeMath {
        const maths: OfficeMathCollection = this.mathParagraph.maths;
        return maths.count > 0 ? maths.toArray()[0]! : maths.add();
    }

    /**
     * Creates a native Math item from an `m:oMath` or `m:oMathPara` element.
     *
     * @param {OpenXmlElement} element - The element.
     * @returns {Math | undefined} The result.
     * @private
     */
    static tryFromOpenXml(element: OpenXmlElement): Math | undefined {
        if (element.namespaceUri !== MATH_NAMESPACE || (element.localName !== 'oMath' && element.localName !== 'oMathPara')) {
            return undefined;
        }
        const parsed: OfficeMathParagraph = parseOfficeMathParagraph(element, new DocxMathAdapter());
        return new Math(element.localName === 'oMath', parsed);
    }

    /**
     * Serializes the live model to OpenXML.
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        if (this.mathParagraph.maths.count === 0) {
            this.mathParagraph.maths.add();
        }
        seedMathDefaults(this.mathParagraph, this.loaded);
        // A bare m:oMath holds exactly one equation; several equations need m:oMathPara.
        const display: boolean = !this.inlineValue || this.mathParagraph.maths.count !== 1;
        const root: OpenXmlElement = serializeOfficeMathParagraph(this.mathParagraph, { prefix: MATH_PREFIX, display });
        return { ...root, namespaceDeclarations: [{ prefix: MATH_PREFIX, namespaceUri: MATH_NAMESPACE }] };
    }
}
