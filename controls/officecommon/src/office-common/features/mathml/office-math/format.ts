/**
 * Math run format (`m:rPr`).
 */

import { MathFontType, MathStyleType } from './enums';
import { K } from './keys';
import { OwnerHolder } from './owner-holder';
import { OfficeMathBreak } from './break';

/**
 * Math-specific run properties, separate from Word character formatting (`w:rPr`).
 *
 * @public
 */
export class OfficeMathFormat extends OwnerHolder {
    private _break: OfficeMathBreak | undefined;

    /** Aligns the run (`m:aln`). Default false. */
    get hasAlignment(): boolean { return this.getProperty(K.HasAlignment, () => false); }
    set hasAlignment(value: boolean) { this.setProperty(K.HasAlignment, value); }
    /** Literal text (`m:lit`). Default false. */
    get hasLiteral(): boolean { return this.getProperty(K.HasLiteral, () => false); }
    set hasLiteral(value: boolean) { this.setProperty(K.HasLiteral, value); }
    /** Normal text (`m:nor`). Default false. */
    get hasNormalText(): boolean { return this.getProperty(K.HasNormalText, () => false); }
    set hasNormalText(value: boolean) { this.setProperty(K.HasNormalText, value); }
    /** Math font (`m:scr`). Default roman. */
    get font(): MathFontType { return this.getProperty(K.Script, () => MathFontType.Roman); }
    set font(value: MathFontType) { this.setProperty(K.Script, value); }
    /** Math style (`m:sty`). Default italic. */
    get style(): MathStyleType { return this.getProperty(K.Style, () => MathStyleType.Italic); }
    set style(value: MathStyleType) { this.setProperty(K.Style, value); }
    /** Optional manual break (`m:brk`). Not created automatically. */
    get break(): OfficeMathBreak | undefined { return this._break; }
    set break(value: OfficeMathBreak | undefined) {
        this._break = value;
        if (value !== undefined) { value.setOwner(this); }
        this.notifyMutated();
    }

    /** Whether any `m:rPr` content must be written. */
    get hasContent(): boolean {
        return this._break !== undefined || [K.HasAlignment, K.HasLiteral, K.HasNormalText, K.Script, K.Style]
            .some((key: number) => this.isExplicit(key));
    }
}
