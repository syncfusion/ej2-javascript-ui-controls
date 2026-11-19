/**
 * Indexes into {@link Calculate.getErrorStrings} for Excel-compatible error tokens.
 *
 * @hidden
 *
 * @example
 * ```ts
 * const na = engine.getErrorStrings()[CommonErrors.NA]; // '#N/A'
 * ```
 */
export enum CommonErrors {
    /** `#N/A` */
    NA = 0,
    /** `#VALUE!` */
    Value = 1,
    /** `#REF!` */
    Ref = 2,
    /** `#DIV/0!` */
    DivZero = 3,
    /** `#NUM!` */
    Num = 4,
    /** `#NAME?` */
    Name = 5,
    /** `#NULL!` */
    Null = 6,
    /** `#CALC!` */
    Calc = 7
}

/**
 * Indexes into {@link Calculate.formulaErrorStrings} for parser/engine failure messages.
 *
 * @hidden
 */
export enum FormulasErrorsStrings {
    OperatorsCannotStartWithExpression = 0,
    ReservedWordAND = 1,
    ReservedWordXOR = 2,
    ReservedWordIf = 3,
    NumberContains2DecimalPoints = 4,
    ReservedWordElse = 5,
    ReservedWordNOT = 6,
    InvalidCharInNumber = 7,
    InvalidCharactersFollowingWithOperator = 6,
    MismatchedParentheses = 8,
    UnknownFormulaName = 9,
    RequiresASingleArgument = 10,
    Requires3Args = 11,
    InvalidMathArgument = 12,
    Requires2Args = 13,
    BadIndex = 14,
    TooComplex = 15,
    CircularReference = 16,
    MissingFormula = 17,
    ImproperFormula = 18,
    InvalidExpression = 19,
    CellEmpty = 20,
    BadFormula = 21,
    EmptyExpression = 22,
    VirtualModeRequired = 23,
    MismatchedTics = 24,
    WrongNumberArguments = 25,
    InvalidArguments = 26,
    IterationsDoNotConverge = 27,
    CalculationOverflow = 29,
    AlreadyRegistered = 28,
    MissingSheet = 30,
    CannotParse = 31,
    ExpressionCannotEndWithAnOperator = 32,
    Spill = 33,
    Div = 34
}

/**
 * Excel file format extensions recognized by Calculate helpers.
 *
 * @hidden
 */
export enum ExcelFileFormats {
    xlsx = 'xlsx',
    xlsm = 'xlsm',
    xlsb = 'xlsb',
    xltx = 'xltx',
    xltm = 'xltm',
    xls = 'xls',
    xml = 'xml',
    xlam = 'xlam',
    xla = 'xla',
    xlw = 'xlw',
    xlr = 'xlr',
    prn = 'prn',
    txt = 'txt',
    csv = 'csv',
    dif = 'dif',
    slk = 'slk'
}
