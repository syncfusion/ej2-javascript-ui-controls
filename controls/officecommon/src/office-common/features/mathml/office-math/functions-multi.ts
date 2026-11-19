/**
 * Multi-equation Math functions: delimiter, equation array, fraction, function, limit, n-ary, scripts.
 */

import { MathFunctionType, MathDelimiterShapeType, MathFractionType, MathLimitType, MathScriptType, MathVerticalAlignment, SpacingRule } from './enums';
import { K } from './keys';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMath } from './office-math';
import { OfficeMathCollection } from './math-collection';
import { OfficeMathEntity } from './entity';

/** Delimiter (`m:d`). @public */
export class OfficeMathDelimiter extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Delimiter = MathFunctionType.Delimiter;
    private readonly _equations: OfficeMathCollection;
    constructor(owner?: OfficeMathEntity) { super(owner); this._equations = new OfficeMathCollection(this); }
    /** Opening character. Default `(`. */
    get beginCharacter(): string { return this.getProperty(K.BegChar, () => '('); }
    set beginCharacter(value: string) { this.setProperty(K.BegChar, value); }
    /** Closing character. Default `)`. */
    get endCharacter(): string { return this.getProperty(K.EndChar, () => ')'); }
    set endCharacter(value: string) { this.setProperty(K.EndChar, value); }
    /** Separator character. Default `|`. */
    get separator(): string { return this.getProperty(K.SeparatorChar, () => '|'); }
    set separator(value: string) { this.setProperty(K.SeparatorChar, value); }
    /** Whether delimiters grow with content. Default true. */
    get isGrow(): boolean { return this.getProperty(K.Grow, () => true); }
    set isGrow(value: boolean) { this.setProperty(K.Grow, value); }
    /** Delimiter shape. Default centered. */
    get delimiterShape(): MathDelimiterShapeType { return this.getProperty(K.Shape, () => MathDelimiterShapeType.Centered); }
    set delimiterShape(value: MathDelimiterShapeType) { this.setProperty(K.Shape, value); }
    /** Argument equations. */
    get equations(): OfficeMathCollection { return this._equations; }
}

/**
 * Validates a row spacing value against its rule.
 *
 * @param {number} value - The value.
 * @param {SpacingRule} rule - The rule.
 * @returns {void} Nothing is returned.
 * @private
 */
export function checkRowSpacing(value: number, rule: SpacingRule): void {
    if (rule === SpacingRule.Exactly && (value < 0 || value > 1584)) {
        throw new RangeError('RowSpacing must be between 0 pt and 1584 pt for Exactly spacing rule.');
    }
    if (rule === SpacingRule.Multiple && (value < 0 || value > 132)) {
        throw new RangeError('RowSpacing must be between 0 li and 132 li for Multiple spacing rule.');
    }
}

/** Equation array (`m:eqArr`). @public */
export class OfficeMathEquationArray extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.EquationArray = MathFunctionType.EquationArray;
    private readonly _equations: OfficeMathCollection;
    constructor(owner?: OfficeMathEntity) { super(owner); this._equations = new OfficeMathCollection(this); }
    /** Vertical alignment. Default center. */
    get verticalAlignment(): MathVerticalAlignment { return this.getProperty(K.EqArrAlign, () => MathVerticalAlignment.Center); }
    set verticalAlignment(value: MathVerticalAlignment) { this.setProperty(K.EqArrAlign, value); }
    /** Expand container. Default false. */
    get expandEquationContainer(): boolean { return this.getProperty(K.MaxDist, () => false); }
    set expandEquationContainer(value: boolean) { this.setProperty(K.MaxDist, value); }
    /** Expand content. Default false. */
    get expandEquationContent(): boolean { return this.getProperty(K.ObjDist, () => false); }
    set expandEquationContent(value: boolean) { this.setProperty(K.ObjDist, value); }
    /** Row spacing; unit depends on `rowSpacingRule` (points for Exactly, lines for Multiple). Default 0. */
    get rowSpacing(): number { return this.getProperty(K.RowSpacing, () => 0); }
    set rowSpacing(value: number) {
        checkRowSpacing(value, this.rowSpacingRule);
        this.setProperty(K.RowSpacing, value);
    }
    /** Row spacing rule. Default single. */
    get rowSpacingRule(): SpacingRule { return this.getProperty(K.RowSpacingRule, () => SpacingRule.Single); }
    set rowSpacingRule(value: SpacingRule) { this.setProperty(K.RowSpacingRule, value); }
    /** Row equations. */
    get equations(): OfficeMathCollection { return this._equations; }
}

/** Fraction (`m:f`). @public */
export class OfficeMathFraction extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Fraction = MathFunctionType.Fraction;
    private readonly _numerator: OfficeMath;
    private readonly _denominator: OfficeMath;
    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._denominator = new OfficeMath(this);
        this._numerator = new OfficeMath(this);
    }
    /** Fraction type. Default normal bar. */
    get fractionType(): MathFractionType { return this.getProperty(K.FractionType, () => MathFractionType.NormalFractionBar); }
    set fractionType(value: MathFractionType) { this.setProperty(K.FractionType, value); }
    /** Numerator. */
    get numerator(): OfficeMath { return this._numerator; }
    /** Denominator. */
    get denominator(): OfficeMath { return this._denominator; }
}

/** Function application (`m:func`). @public */
export class OfficeMathFunction extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Function = MathFunctionType.Function;
    private readonly _equation: OfficeMath;
    private readonly _functionName: OfficeMath;
    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._equation = new OfficeMath(this);
        this._functionName = new OfficeMath(this);
    }
    /** Argument equation. */
    get equation(): OfficeMath { return this._equation; }
    /** Function name equation. */
    get functionName(): OfficeMath { return this._functionName; }
}

/** Lower or upper limit (`m:limLow` / `m:limUpp`). @public */
export class OfficeMathLimit extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Limit = MathFunctionType.Limit;
    private readonly _equation: OfficeMath;
    private readonly _limit: OfficeMath;
    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._equation = new OfficeMath(this);
        this._limit = new OfficeMath(this);
    }
    /** Lower or upper limit. Default lower. */
    get limitType(): MathLimitType { return this.getProperty(K.LimitType, () => MathLimitType.LowerLimit); }
    set limitType(value: MathLimitType) { this.setProperty(K.LimitType, value); }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
    /** Limit equation. */
    get limit(): OfficeMath { return this._limit; }
}

/** N-ary operator (`m:nary`). @public */
export class OfficeMathNArray extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.NArray = MathFunctionType.NArray;
    private readonly _equation: OfficeMath;
    private readonly _subscript: OfficeMath;
    private readonly _superscript: OfficeMath;
    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._equation = new OfficeMath(this);
        this._subscript = new OfficeMath(this);
        this._superscript = new OfficeMath(this);
    }
    /** Operator character. Default U+222B. */
    get nArrayCharacter(): string { return this.getProperty(K.NAryChar, () => String.fromCharCode(8747)); }
    set nArrayCharacter(value: string) { this.setProperty(K.NAryChar, value); }
    /** Whether the operator grows. Default false. */
    get hasGrow(): boolean { return this.getProperty(K.HasGrow, () => false); }
    set hasGrow(value: boolean) { this.setProperty(K.HasGrow, value); }
    /** Hides the lower limit. Default false. */
    get hideLowerLimit(): boolean { return this.getProperty(K.HideSubscript, () => false); }
    set hideLowerLimit(value: boolean) { this.setProperty(K.HideSubscript, value); }
    /** Hides the upper limit. Default false. */
    get hideUpperLimit(): boolean { return this.getProperty(K.HideSuperscript, () => false); }
    set hideUpperLimit(value: boolean) { this.setProperty(K.HideSuperscript, value); }
    /** Limits as sub/superscript. Default true for the integral character, false otherwise. */
    get subSuperscriptLimit(): boolean {
        return this.getProperty(K.SubSupLimit, () => this.nArrayCharacter === String.fromCharCode(8747));
    }
    set subSuperscriptLimit(value: boolean) { this.setProperty(K.SubSupLimit, value); }
    /** Operand equation. */
    get equation(): OfficeMath { return this._equation; }
    /** Lower limit equation. */
    get subscript(): OfficeMath { return this._subscript; }
    /** Upper limit equation. */
    get superscript(): OfficeMath { return this._superscript; }
}

/** Single subscript or superscript (`m:sSub` / `m:sSup`). @public */
export class OfficeMathScript extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.SubSuperscript = MathFunctionType.SubSuperscript;
    private readonly _equation: OfficeMath;
    private readonly _script: OfficeMath;
    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._equation = new OfficeMath(this);
        this._script = new OfficeMath(this);
    }
    /** Subscript or superscript. Default superscript. */
    get scriptType(): MathScriptType { return this.getProperty(K.ScriptType, () => MathScriptType.Superscript); }
    set scriptType(value: MathScriptType) { this.setProperty(K.ScriptType, value); }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
    /** Script equation. */
    get script(): OfficeMath { return this._script; }
}

/** Combined right sub/superscript (`m:sSubSup`). @public */
export class OfficeMathRightScript extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.RightSubSuperscript = MathFunctionType.RightSubSuperscript;
    private readonly _equation: OfficeMath;
    private readonly _subscript: OfficeMath;
    private readonly _superscript: OfficeMath;
    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._equation = new OfficeMath(this);
        this._subscript = new OfficeMath(this);
        this._superscript = new OfficeMath(this);
    }
    /** Align scripts. Default true. */
    get isSkipAlign(): boolean { return this.getProperty(K.SkipAlign, () => true); }
    set isSkipAlign(value: boolean) { this.setProperty(K.SkipAlign, value); }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
    /** Subscript equation. */
    get subscript(): OfficeMath { return this._subscript; }
    /** Superscript equation. */
    get superscript(): OfficeMath { return this._superscript; }
}

/** Left sub/superscript (`m:sPre`). @public */
export class OfficeMathLeftScript extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.LeftSubSuperscript = MathFunctionType.LeftSubSuperscript;
    private readonly _equation: OfficeMath;
    private readonly _subscript: OfficeMath;
    private readonly _superscript: OfficeMath;
    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._equation = new OfficeMath(this);
        this._subscript = new OfficeMath(this);
        this._superscript = new OfficeMath(this);
    }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
    /** Subscript equation. */
    get subscript(): OfficeMath { return this._subscript; }
    /** Superscript equation. */
    get superscript(): OfficeMath { return this._superscript; }
}
