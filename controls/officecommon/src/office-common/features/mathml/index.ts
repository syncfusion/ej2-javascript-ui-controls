/**
 * Optional Office Math Markup Language (OMML) feature module
 * (`@syncfusion/ej2-office-common/mathml`).
 *
 * Provides the canonical Office Math authoring model (`OfficeMathParagraph`, `OfficeMath`,
 * `OfficeMath*` functions), the tolerant OMML parser, clone/equality helpers, and cited constants. "MathML" here
 * means OMML (`m:*` per ECMA-376-1 §22.1 / Part 4 Annex A.8.1) — not W3C MathML.
 *
 * Docx integration (`MathInline`, paragraph accessors, save hook) is TASK-9011.
 *
 * @packageDocumentation
 */

export {
    MATH_NAMESPACE,
    MATH_PREFIX_FALLBACKS,
    WML_TRANSITIONAL_NAMESPACE,
    XML_NAMESPACE
} from './constants';

export * from './office-math/index';
export { MathParseDiagnostic, ParseMathOptions } from './parse/parse-options';
export { parseOfficeMathParagraph } from './parse/office-math-parser';
export { parseLatexToMath, parseLatexIntoMathParagraph } from './latex/latex-parser';
export { mathToLatex } from './latex/latex-generator';
export { getLatexSymbol, getSymbolLatex } from './latex/latex-symbols';
export { serializeOfficeMathParagraph, SerializeOfficeMathOptions } from './serialize/office-math-serializer';

export { MathmlConstraintKind } from './errors';
export { MathmlReadOnlyError, MathmlValidationError } from './errors';

export {
    NamespaceDeclaration,
    OpenXmlAttribute,
    OpenXmlChild,
    OpenXmlElement,
    OpenXmlText
} from './openxml';
export {
    attrValue,
    attrValueNs,
    childElements,
    createElement,
    createText,
    textContent
} from './openxml';

export { MathSettings, parseMathSettings, mathSettingsToOpenXml } from './math-settings';
