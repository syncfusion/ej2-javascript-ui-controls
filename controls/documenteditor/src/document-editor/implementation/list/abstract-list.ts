import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WListLevel } from './list-level';
import { HelperMethods } from '../editor/editor-helper';

/**
 * @private
 */
export class WAbstractList {
    private abstractListIdIn: number = -1;
    public nsid: number = -1;
    public levels: WListLevel[] = [];
    constructor() {
        this.nsid = parseInt(HelperMethods.generateHexDecimal(), 16);
    }
    public get abstractListId(): number {
        return this.abstractListIdIn;
    }
    public set abstractListId(abstractListId: number) {
        this.abstractListIdIn = abstractListId;
    }
    public clear(): void {
        if (!isNullOrUndefined(this.levels)) {
            for (let i: number = 0; i < this.levels.length; i++) {
                const listLevel: WListLevel = this.levels[parseInt(i.toString(), 10)] as WListLevel;
                listLevel.clearFormat();
                this.levels.splice(this.levels.indexOf(listLevel), 1);
                i--;
            }
            this.levels = [];
        }
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.levels)) {
            for (let i: number = 0; i < this.levels.length; i++) {
                const listLevel: WListLevel = this.levels[parseInt(i.toString(), 10)] as WListLevel;
                listLevel.destroy();
                this.levels.splice(this.levels.indexOf(listLevel), 1);
                i--;
            }
            this.levels = [];
        }
        this.levels = undefined;
    }
    public clone(): WAbstractList {
        const absList: WAbstractList = new WAbstractList();
        for (let i: number = 0; i < this.levels.length; i++) {
            absList.levels.push(this.levels[parseInt(i.toString(), 10)].clone(absList));
        }
        return absList;
    }
}
