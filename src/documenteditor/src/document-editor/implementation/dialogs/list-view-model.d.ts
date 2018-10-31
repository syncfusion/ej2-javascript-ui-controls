import { ListDialog } from './list-dialog';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
import { FollowCharacterType, ListLevelPattern } from '../../base/index';
/**
 * List view model implementation
 * @private
 */
export declare class ListViewModel {
    private listIn;
    private levelNumberIn;
    /**
     * @private
     */
    dialog: ListDialog;
    /**
     * @private
     */
    /**
    * @private
    */
    levelNumber: number;
    /**
     * @private
     */
    /**
    * @private
    */
    list: WList;
    /**
     * @private
     */
    readonly listLevel: WListLevel;
    /**
     * @private
     */
    /**
    * @private
    */
    listLevelPattern: ListLevelPattern;
    /**
     * @private
     */
    /**
    * @private
    */
    followCharacter: FollowCharacterType;
    /**
     * @private
     */
    constructor();
    private createList;
    private addListLevels;
    /**
     * @private
     */
    destroy(): void;
}
