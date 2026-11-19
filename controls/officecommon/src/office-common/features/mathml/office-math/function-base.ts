/**
 * Base class of every Math function.
 */

import { OfficeMathEntity } from './entity';
import { OfficeRunFormat } from './adapter';
import { MathFunctionType } from './enums';
import { OwnerHolder } from './owner-holder';

interface DefaultFormatHolder {
    readonly defaultMathCharacterFormat: OfficeRunFormat;
}

/**
 * Base of all concrete Math functions.
 *
 * @public
 */
export abstract class OfficeMathFunctionBase extends OwnerHolder {
    private _controlProperties: OfficeRunFormat | undefined;

    /** The concrete function type. */
    abstract readonly type: MathFunctionType;

    /**
     * Character format of the function (`m:ctrlPr`). Created from the paragraph default on first access.
     */
    get controlProperties(): OfficeRunFormat {
        if (this._controlProperties === undefined) {
            this._controlProperties = this.getDefaultControlProperties();
        }
        return this._controlProperties;
    }
    set controlProperties(value: OfficeRunFormat) {
        this._controlProperties = value;
        this.notifyMutated();
    }

    /**
     * Whether control properties exist (assigned, parsed or accessed).
     *
     * @private
     */
    get hasControlProperties(): boolean {
        return this._controlProperties !== undefined;
    }

    private getDefaultControlProperties(): OfficeRunFormat {
        let entity: OfficeMathEntity = this.ownerMathEntity;
        while (entity !== undefined && !('defaultMathCharacterFormat' in entity)) {
            entity = entity.ownerMathEntity;
        }
        if (entity === undefined) {
            throw new Error('Math function is not attached to a Math paragraph.');
        }
        return (entity as unknown as DefaultFormatHolder).defaultMathCharacterFormat.clone();
    }
}
