import { ListDialog } from './list-dialog';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
import { FollowCharacterType, ListLevelPattern } from '../../base/index';
/**
 * List view model implementation
 *
 * @private
 */
export declare class ListViewModel {
    private listIn;
    private levelNumberIn;
    dialog: ListDialog;
    levelNumber: number;
    list: WList;
    readonly listLevel: WListLevel;
    listLevelPattern: ListLevelPattern;
    followCharacter: FollowCharacterType;
    /**
     * @private
     */
    constructor();
    private createList;
    private addListLevels;
    /**
     * @private
     * @returns {void}
     */
    destroy(): void;
}
