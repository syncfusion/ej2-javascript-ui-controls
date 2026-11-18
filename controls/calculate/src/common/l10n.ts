/**
 * Localization defaults for `@syncfusion/ej2-calculate`.
 *
 * ## What is localized
 * Human-readable parser / engine failure prose (wrong argument counts, mismatched
 * parentheses, and similar messages shown via {@link FailureEventArgs} or returned
 * from evaluation).
 *
 * ## What is intentionally NOT localized
 * Excel-compatible literals required for formula language and file interchange:
 * - Error tokens: `#N/A`, `#VALUE!`, `#REF!`, `#DIV/0!`, `#NUM!`, `#NAME?`, `#NULL!`,
 *   `#CALC!`, `#SPILL!`, `#CIRCULARREF!`
 * - Logical literals: `TRUE` / `FALSE`
 * - English function names (`SUM`, `IF`, …)
 *
 * Culture-sensitive **separators** (argument, decimal, date) are configured via
 * {@link Calculate} getters/setters and host `locale`, not via these string keys.
 *
 * Load overrides with Syncfusion `L10n.load({ 'fr-FR': { calculate: { ... } } })`.
 */

/** Default English locale bag for control name `calculate`. */
export const calculateDefaultLocale: { [key: string]: string } = {
    OperatorsCannotStartWithExpression: 'binary operators cannot start an expression',
    CannotParse: 'cannot parse',
    BadLibrary: 'bad library',
    InvalidCharInFrontOf: 'invalid char in front of',
    NumberContains2DecimalPoints: 'number contains 2 decimal points',
    ExpressionCannotEndWithAnOperator: 'expression cannot end with an operator',
    InvalidCharactersFollowingWithOperator: 'invalid characters following an operator',
    InvalidCharInNumber: 'invalid character in number',
    MismatchedParentheses: 'mismatched parentheses',
    UnknownFormulaName: 'unknown formula name',
    RequiresASingleArgument: 'requires a single argument',
    Requires3Args: 'requires 3 arguments',
    InvalidMathArgument: 'invalid Math argument',
    Requires2Args: 'requires 2 arguments',
    TooComplex: 'too complex',
    MissingFormula: 'missing formula',
    ImproperFormula: 'improper formula',
    InvalidExpression: 'invalid expression',
    CellEmpty: 'cell empty',
    BadFormula: 'bad formula',
    EmptyExpression: 'empty expression',
    MismatchedTics: 'mismatched string quotes',
    WrongNumberArguments: 'wrong number of arguments',
    InvalidArguments: 'invalid arguments',
    IterationsDoNotConverge: 'iterations do not converge',
    AlreadyRegistered: 'Control is already registered',
    CalculationOverflow: 'Calculation overflow',
    MissingSheet: 'Missing sheet',
    CannotParseUnderscore: 'cannot_parse',
    ExpressionCannotEndWithAnOperatorUnderscore: 'expression_cannot_end_with_an_operator',
    CategoryAll: 'All'
};
