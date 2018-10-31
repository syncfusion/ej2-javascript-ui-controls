import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WListLevel } from './list-level';

/** 
 * @private
 */
export class WLevelOverride {
    public startAt: number;
    public levelNumber: number;
    public overrideListLevel: WListLevel;
    public destroy(): void {
        if (!isNullOrUndefined(this.overrideListLevel)) {
            this.overrideListLevel.destroy();
        }
        this.levelNumber = undefined;
        this.startAt = undefined;
        this.overrideListLevel = undefined;
    }
}
