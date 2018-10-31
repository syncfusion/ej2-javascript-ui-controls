import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WListLevel } from './list-level';

/** 
 * @private
 */
export class WAbstractList {
    private abstractListIdIn: number = -1;
    public levels: WListLevel[] = [];
    get abstractListId(): number {
        return this.abstractListIdIn;
    }
    set abstractListId(abstractListId: number) {
        this.abstractListIdIn = abstractListId;
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.levels)) {
            for (let i: number = 0; i < this.levels.length; i++) {
                let listLevel: WListLevel = this.levels[i] as WListLevel;
                listLevel.destroy();
                this.levels.splice(this.levels.indexOf(listLevel), 1);
                i--;
            }
            this.levels = [];
        }
        this.levels = undefined;
    }
}