import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WLevelOverride } from './level-override';
import { WAbstractList } from './abstract-list';
import { WListLevel } from './list-level';
/** 
 * @private
 */
export class WList {
    public listId: number = -1;
    public sourceListId: number = -1;
    public abstractListId: number = -1;
    public abstractList: WAbstractList = undefined;
    public levelOverrides: WLevelOverride[] = [];
    public getListLevel(levelNumber: number): WListLevel {
        let listLevel: WListLevel = undefined;
        let levelOverride: WLevelOverride = this.getLevelOverride(levelNumber);
        if (!isNullOrUndefined(levelOverride) && !isNullOrUndefined(levelOverride.overrideListLevel)) {
            listLevel = levelOverride.overrideListLevel;
        } else {
            listLevel = this.abstractList.levels[levelNumber];
        }
        return listLevel;
    }
    public getLevelOverride(levelNumber: number): WLevelOverride {
        for (let i: number = 0; i < this.levelOverrides.length; i++) {
            if (this.levelOverrides[i] instanceof WLevelOverride) {
                let levelOverride: WLevelOverride = this.levelOverrides[i] as WLevelOverride;
                if (levelOverride.levelNumber === levelNumber) {
                    return levelOverride;
                }
            }
        }
        return undefined;
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.levelOverrides)) {
            this.levelOverrides = [];
        }
        this.abstractListId = undefined;
        this.listId = undefined;
        this.sourceListId = undefined;
        this.levelOverrides = undefined;
    }
    public mergeList(list: WList): void {
        if (!isNullOrUndefined(this.abstractListId) && this.abstractListId !== -1) {
            this.abstractListId = list.abstractListId;
        }
        if (!isNullOrUndefined(this.listId) && this.listId !== -1) {
            this.listId = list.listId;
        }
        if (!isNullOrUndefined(this.sourceListId) && this.sourceListId !== -1) {
            this.sourceListId = list.sourceListId;
        }
        if (!isNullOrUndefined(this.levelOverrides) && this.levelOverrides.length !== 0) {
            this.levelOverrides = list.levelOverrides;
        }
    }

}