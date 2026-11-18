/**
 * Run element (`m:r`) holding a document-native run.
 */

import { MathFunctionType } from './enums';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMathFormat } from './format';
import { OfficeRun } from './adapter';
import { OfficeMathEntity } from './entity';
import { MathDocumentAdapter } from './adapter';
import { BasicRun } from './basic';

/**
 * Math run: native document run plus Math format (`m:rPr`).
 *
 * @public
 */
export class OfficeMathRunElement extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.RunElement = MathFunctionType.RunElement;
    private _item: OfficeRun | undefined;
    private readonly _mathFormat: OfficeMathFormat;

    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._mathFormat = new OfficeMathFormat(this);
    }

    /** The native document run. */
    get item(): OfficeRun | undefined { return this._item; }
    set item(value: OfficeRun | undefined) {
        this._item = value;
        if (value !== undefined) { value.ownerMathRunElement = this; }
        this.notifyMutated();
    }

    /**
     * Text of the run (`m:t`). Uses the host adapter when the run is attached to a paragraph
     * that has one, otherwise a standalone run. Empty when no run exists yet.
     *
     * @returns {string} The run text.
     */
    get text(): string {
        const adapter: MathDocumentAdapter | undefined = this.findAdapter();
        if (this._item === undefined) { return ''; }
        return adapter !== undefined ? adapter.getRunText(this._item) : (this._item as BasicRun).text;
    }
    set text(value: string) {
        const adapter: MathDocumentAdapter | undefined = this.findAdapter();
        if (this._item === undefined) {
            this.item = adapter !== undefined ? adapter.createRun(this) : new BasicRun();
        }
        if (adapter !== undefined) {
            adapter.setRunText(this._item as OfficeRun, value);
            this.notifyMutated();
        } else {
            (this._item as BasicRun).text = value;
            this.notifyMutated();
        }
    }

    private findAdapter(): MathDocumentAdapter | undefined {
        let entity: OfficeMathEntity | undefined = this.ownerMathEntity;
        while (entity !== undefined) {
            const candidate: { adapter?: MathDocumentAdapter } = entity as { adapter?: MathDocumentAdapter };
            if (candidate.adapter !== undefined) { return candidate.adapter; }
            entity = entity.ownerMathEntity;
        }
        return undefined;
    }

    /** Math run format (`m:rPr`). */
    get mathFormat(): OfficeMathFormat { return this._mathFormat; }
}
