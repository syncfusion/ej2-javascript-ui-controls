import { ListDialog } from './list-dialog';
import { WCharacterFormat, WParagraphFormat } from '../format/index';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FollowCharacterType, ListLevelPattern } from '../../base/index';

/**
 * List view model implementation
 *
 * @private
 */
export class ListViewModel {
    private listIn: WList = undefined;
    private levelNumberIn: number = undefined;

    public dialog: ListDialog = undefined;

    public get levelNumber(): number {
        return this.levelNumberIn;
    }

    public set levelNumber(value: number) {
        this.levelNumberIn = value;
    }

    public get list(): WList {
        return this.listIn;
    }

    public set list(value: WList) {
        if (isNullOrUndefined(value)) {
            this.createList();
        } else {
            this.listIn = value;
        }
    }

    public get listLevel(): WListLevel {
        if (!isNullOrUndefined(this.list) && this.levelNumber >= 0 && this.levelNumber < 9) {
            if (!isNullOrUndefined(this.dialog.documentHelper.getAbstractListById(this.list.abstractListId))) {
                if (this.dialog.documentHelper.getAbstractListById(this.list.abstractListId).levels.length <= this.levelNumber) {
                    this.addListLevels();
                }
                return this.dialog.documentHelper.getAbstractListById(this.list.abstractListId).levels[this.levelNumber] as WListLevel;
            } else {
                this.dialog.documentHelper.lists.push(this.list);
                let abstractList: WAbstractList = this.list.abstractList;
                if (!this.list.abstractList) {
                    abstractList = new WAbstractList();
                    abstractList.abstractListId = this.list.abstractListId;
                }
                const listLevelAdv: WListLevel = new WListLevel(abstractList);
                listLevelAdv.characterFormat = new WCharacterFormat(listLevelAdv);
                listLevelAdv.paragraphFormat = new WParagraphFormat(listLevelAdv);
                listLevelAdv.paragraphFormat.leftIndent = (1) * 48;
                listLevelAdv.paragraphFormat.firstLineIndent = -24;
                listLevelAdv.numberFormat = '%' + (1).toString() + '.';
                listLevelAdv.listLevelPattern = 'UpRoman';
                listLevelAdv.followCharacter = 'Tab';
                listLevelAdv.startAt = 1;
                listLevelAdv.restartLevel = 1;
                this.dialog.documentHelper.abstractLists.push(abstractList);
                return this.dialog.documentHelper.getAbstractListById(this.list.abstractListId).levels[0];
                // return this.dialog.documentHelper.getAbstractListById(this.list.abstractListId).levels.getItem(0);
            }
        }
        return undefined;
    }

    public get listLevelPattern(): ListLevelPattern {

        if (!isNullOrUndefined(this.listLevel)) {
            return this.listLevel.listLevelPattern;
        }
        return 'Arabic';
    }

    public set listLevelPattern(value: ListLevelPattern) {
        if (!isNullOrUndefined(this.listLevel)) {
            this.listLevel.listLevelPattern = value;
        }
    }

    public get followCharacter(): FollowCharacterType {
        if (!isNullOrUndefined(this.listLevel)) {
            return this.listLevel.followCharacter;
        }
        return 'None';
    }

    public set followCharacter(value: FollowCharacterType) {
        if (!isNullOrUndefined(this.listLevel)) {
            this.listLevel.followCharacter = value;
        }
    }
    /**
     * @private
     */
    public constructor() {
        this.levelNumber = 0;
    }
    private createList(): void {
        this.list = new WList();
        this.list.listId = this.dialog.documentHelper.lists.length + 1;
        const abstractList: WAbstractList = new WAbstractList();
        abstractList.abstractListId = this.dialog.documentHelper.abstractLists.length + 1;
        this.list.abstractListId = abstractList.abstractListId;
        this.dialog.documentHelper.lists.push(this.list);
        const listLevel: WListLevel = new WListLevel(abstractList);
        listLevel.paragraphFormat = new WParagraphFormat(listLevel);
        listLevel.paragraphFormat.leftIndent = 48;
        listLevel.paragraphFormat.firstLineIndent = -24;
        listLevel.characterFormat = new WCharacterFormat(listLevel);
        listLevel.numberFormat = '%1.';
        listLevel.startAt = 1;
        abstractList.levels.push(listLevel);
        this.dialog.documentHelper.abstractLists.push(abstractList);
    }
    private addListLevels(): void {
        if (!isNullOrUndefined(this.list) && !isNullOrUndefined(this.list.abstractListId)) {
            for (let i: number = this.dialog.documentHelper.getAbstractListById(this.list.abstractListId).levels.length; i < 9; i++) {
                const listLevelAdv: WListLevel = new WListLevel(this.dialog.documentHelper.getAbstractListById(this.list.abstractListId));
                listLevelAdv.characterFormat = new WCharacterFormat(listLevelAdv);
                listLevelAdv.paragraphFormat = new WParagraphFormat(listLevelAdv);
                listLevelAdv.paragraphFormat.leftIndent = (i + 1) * 48;
                listLevelAdv.paragraphFormat.firstLineIndent = -24;
                listLevelAdv.numberFormat = '%' + (i + 1).toString() + '.';
                listLevelAdv.listLevelPattern = 'Arabic';
                listLevelAdv.followCharacter = 'Tab';
                listLevelAdv.startAt = 1;
                listLevelAdv.restartLevel = i;
                (this.dialog.documentHelper).getAbstractListById(this.list.abstractListId).levels.push(listLevelAdv);
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.list = undefined;
        this.followCharacter = undefined;
        this.levelNumber = undefined;
        this.listLevelPattern = undefined;
    }

}
