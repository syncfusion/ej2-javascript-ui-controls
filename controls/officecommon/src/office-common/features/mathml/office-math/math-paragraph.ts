/**
 * Office Math paragraph (`m:oMathPara`): the root of the Math model.
 */

import { OwnerHolder } from './owner-holder';
import { OfficeMathCollection } from './math-collection';
import { MathJustification } from './enums';
import { K } from './keys';
import { MathDocumentAdapter, OfficeRunFormat } from './adapter';
import { BasicRunFormat } from './basic';
import { parseLatexIntoMathParagraph } from '../latex/latex-parser';
import { mathToLatex } from '../latex/latex-generator';

/**
 * Root container of equations. Notifies a host listener on any change below it.
 *
 * @public
 */
export class OfficeMathParagraph extends OwnerHolder {
    private readonly _maths: OfficeMathCollection;
    private _listener: (() => void) | undefined;
    private _suspended: number = 0;

    readonly adapter: MathDocumentAdapter | undefined;

    constructor(adapter?: MathDocumentAdapter) {
        super();
        this.adapter = adapter;
        this._maths = new OfficeMathCollection(this);
    }

    /** Equations of the paragraph. */
    get maths(): OfficeMathCollection { return this._maths; }

    /** Paragraph justification. Default center-group. */
    get justification(): MathJustification {
        return this.getProperty(K.Justification, () => MathJustification.CenterGroup);
    }
    set justification(value: MathJustification) { this.setProperty(K.Justification, value); }

    /** Whether the justification was set or parsed explicitly. */
    get hasExplicitJustification(): boolean { return this.isExplicit(K.Justification); }

    /** Default Math character format used to seed function control properties. */
    get defaultMathCharacterFormat(): OfficeRunFormat {
        return this.adapter !== undefined
            ? this.adapter.createDefaultMathCharacterFormat(this)
            : new BasicRunFormat();
    }

    /**
     * LaTeX of the current equations, generated from the live Math tree.
     * Assigning replaces all equations on this same paragraph.
     */
    get latex(): string { return mathToLatex(this); }
    set latex(value: string) { this.convertLatexToMath(value); }

    /**
     * Replaces all equations with those parsed from `latex`. The paragraph keeps its identity, owner,
     * adapter and mutation listener; one mutation notification is raised after the replacement.
     * An empty string leaves the paragraph without equations.
     *
     * @param {string} latex The LaTeX source.
     * @returns {void}
     */
    convertLatexToMath(latex: string): void {
        this.suspendMutations(() => {
            this._maths.clear();
            parseLatexIntoMathParagraph(latex, this);
        });
        this.notifyMutated();
    }

    /**
     * Registers a callback invoked after any change in the Math tree.
     *
     * @param {Function} listener The mutation callback, or undefined to clear it.
     * @returns {void}
     */
    setMutationListener(listener: (() => void) | undefined): void { this._listener = listener; }

    /**
     * Runs `action` without raising mutation notifications, then restores notifications.
     * Used while hydrating the model from XML.
     *
     * @param {Function} action The work to perform silently.
     * @returns {void}
     * @private
     */
    suspendMutations(action: () => void): void {
        this._suspended++;
        try {
            action();
        } finally {
            this._suspended--;
        }
    }

    protected rootMutated(): void {
        if (this._suspended === 0 && this._listener !== undefined) { this._listener(); }
    }
}
