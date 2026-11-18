/**
 * Single-equation Math functions: accent, bar, border box, box, group character, phantom, radical.
 */

import { MathFunctionType } from './enums';
import { K } from './keys';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMath } from './office-math';
import { OfficeMathBreak } from './break';
import { OfficeMathEntity } from './entity';

/** Accent (`m:acc`). @public */
export class OfficeMathAccent extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Accent = MathFunctionType.Accent;
    private readonly _equation: OfficeMath;
    constructor(owner?: OfficeMathEntity) { super(owner); this._equation = new OfficeMath(this); }
    /** Accent character. Default U+0302. */
    get accentCharacter(): string { return this.getProperty(K.AccentChar, () => String.fromCharCode(770)); }
    set accentCharacter(value: string) { this.setProperty(K.AccentChar, value); }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
}

/** Bar (`m:bar`). @public */
export class OfficeMathBar extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Bar = MathFunctionType.Bar;
    private readonly _equation: OfficeMath;
    constructor(owner?: OfficeMathEntity) { super(owner); this._equation = new OfficeMath(this); }
    /** Whether the bar is drawn above the base. Default false. */
    get barTop(): boolean { return this.getProperty(K.BarTop, () => false); }
    set barTop(value: boolean) { this.setProperty(K.BarTop, value); }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
}

/** Border box (`m:borderBox`). @public */
export class OfficeMathBorderBox extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.BorderBox = MathFunctionType.BorderBox;
    private readonly _equation: OfficeMath;
    constructor(owner?: OfficeMathEntity) { super(owner); this._equation = new OfficeMath(this); }
    /** Hides the top border. Default false. */
    get hideTop(): boolean { return this.getProperty(K.HideTop, () => false); }
    set hideTop(value: boolean) { this.setProperty(K.HideTop, value); }
    /** Hides the bottom border. Default false. */
    get hideBottom(): boolean { return this.getProperty(K.HideBottom, () => false); }
    set hideBottom(value: boolean) { this.setProperty(K.HideBottom, value); }
    /** Hides the left border. Default false. */
    get hideLeft(): boolean { return this.getProperty(K.HideLeft, () => false); }
    set hideLeft(value: boolean) { this.setProperty(K.HideLeft, value); }
    /** Hides the right border. Default false. */
    get hideRight(): boolean { return this.getProperty(K.HideRight, () => false); }
    set hideRight(value: boolean) { this.setProperty(K.HideRight, value); }
    /** Diagonal strike from bottom-left to top-right. Default false. */
    get strikeDiagonalUp(): boolean { return this.getProperty(K.StrikeBLTR, () => false); }
    set strikeDiagonalUp(value: boolean) { this.setProperty(K.StrikeBLTR, value); }
    /** Diagonal strike from top-left to bottom-right. Default false. */
    get strikeDiagonalDown(): boolean { return this.getProperty(K.StrikeTLBR, () => false); }
    set strikeDiagonalDown(value: boolean) { this.setProperty(K.StrikeTLBR, value); }
    /** Vertical strike. Default false. */
    get strikeVertical(): boolean { return this.getProperty(K.StrikeVertical, () => false); }
    set strikeVertical(value: boolean) { this.setProperty(K.StrikeVertical, value); }
    /** Horizontal strike. Default false. */
    get strikeHorizontal(): boolean { return this.getProperty(K.StrikeHorizontal, () => false); }
    set strikeHorizontal(value: boolean) { this.setProperty(K.StrikeHorizontal, value); }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
}

/** Box (`m:box`). @public */
export class OfficeMathBox extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Box = MathFunctionType.Box;
    private readonly _equation: OfficeMath;
    private _break: OfficeMathBreak | undefined;
    constructor(owner?: OfficeMathEntity) { super(owner); this._equation = new OfficeMath(this); }
    /** Operator alignment. Default false. */
    get alignment(): boolean { return this.getProperty(K.BoxAlign, () => false); }
    set alignment(value: boolean) { this.setProperty(K.BoxAlign, value); }
    /** Differential. Default false. */
    get enableDifferential(): boolean { return this.getProperty(K.EnableDifferential, () => false); }
    set enableDifferential(value: boolean) { this.setProperty(K.EnableDifferential, value); }
    /** Disallows line breaks inside the box. Default true. */
    get noBreak(): boolean { return this.getProperty(K.NoBreak, () => true); }
    set noBreak(value: boolean) { this.setProperty(K.NoBreak, value); }
    /** Operator emulator. Default false. */
    get operatorEmulator(): boolean { return this.getProperty(K.OperatorEmulator, () => false); }
    set operatorEmulator(value: boolean) { this.setProperty(K.OperatorEmulator, value); }
    /** Optional manual break. Not created automatically. */
    get break(): OfficeMathBreak | undefined { return this._break; }
    set break(value: OfficeMathBreak | undefined) {
        this._break = value;
        this.notifyMutated();
    }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
}

/** Group character (`m:groupChr`). @public */
export class OfficeMathGroupCharacter extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.GroupCharacter = MathFunctionType.GroupCharacter;
    private readonly _equation: OfficeMath;
    constructor(owner?: OfficeMathEntity) { super(owner); this._equation = new OfficeMath(this); }
    /** Whether the group is aligned top. Default true. */
    get hasAlignTop(): boolean { return this.getProperty(K.HasAlignTop, () => true); }
    set hasAlignTop(value: boolean) { this.setProperty(K.HasAlignTop, value); }
    /** Whether the character is drawn on top. Default false. */
    get hasCharacterTop(): boolean { return this.getProperty(K.HasCharTop, () => false); }
    set hasCharacterTop(value: boolean) { this.setProperty(K.HasCharTop, value); }
    /** Grouping character. Default U+23DF. */
    get groupCharacter(): string { return this.getProperty(K.GroupChar, () => String.fromCharCode(9183)); }
    set groupCharacter(value: string) { this.setProperty(K.GroupChar, value); }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
}

/** Phantom (`m:phant`). @public */
export class OfficeMathPhantom extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Phantom = MathFunctionType.Phantom;
    private readonly _equation: OfficeMath;
    constructor(owner?: OfficeMathEntity) { super(owner); this._equation = new OfficeMath(this); }
    /** Shows the phantom content. Default true. */
    get show(): boolean { return this.getProperty(K.Show, () => true); }
    set show(value: boolean) { this.setProperty(K.Show, value); }
    /** Transparent. Default false. */
    get transparent(): boolean { return this.getProperty(K.Transparent, () => false); }
    set transparent(value: boolean) { this.setProperty(K.Transparent, value); }
    /** Zero ascent. Default false. */
    get zeroAscent(): boolean { return this.getProperty(K.ZeroAscent, () => false); }
    set zeroAscent(value: boolean) { this.setProperty(K.ZeroAscent, value); }
    /** Zero descent. Default false. */
    get zeroDescent(): boolean { return this.getProperty(K.ZeroDescent, () => false); }
    set zeroDescent(value: boolean) { this.setProperty(K.ZeroDescent, value); }
    /** Zero width. Default false. */
    get zeroWidth(): boolean { return this.getProperty(K.ZeroWidth, () => false); }
    set zeroWidth(value: boolean) { this.setProperty(K.ZeroWidth, value); }
    /** Smash. Default false. */
    get smash(): boolean { return this.getProperty(K.Smash, () => false); }
    set smash(value: boolean) { this.setProperty(K.Smash, value); }
    /** Base equation. */
    get equation(): OfficeMath { return this._equation; }
}

/** Radical (`m:rad`). @public */
export class OfficeMathRadical extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Radical = MathFunctionType.Radical;
    private readonly _equation: OfficeMath;
    private readonly _degree: OfficeMath;
    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._equation = new OfficeMath(this);
        this._degree = new OfficeMath(this);
    }
    /** Hides the degree. Default false. */
    get hideDegree(): boolean { return this.getProperty(K.HideDegree, () => false); }
    set hideDegree(value: boolean) { this.setProperty(K.HideDegree, value); }
    /** Degree equation. */
    get degree(): OfficeMath { return this._degree; }
    /** Radicand equation. */
    get equation(): OfficeMath { return this._equation; }
}
