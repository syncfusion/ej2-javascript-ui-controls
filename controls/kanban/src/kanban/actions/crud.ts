import { Kanban } from '../base/kanban';
import { isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { ActionEventArgs, SaveChanges } from '../base/interface';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
/**
 * Kanban CRUD module
 * @hidden
 */
export class Crud {
    private parent: Kanban;

    /**
     * Constructor for CRUD module
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
    }

    public addCard(cardData: { [key: string]: Object } | { [key: string]: Object }[]): void {
        let args: ActionEventArgs = {
            cancel: false, requestType: 'cardCreate', addedRecords: (cardData instanceof Array) ? cardData : [cardData],
            changedRecords: [], deletedRecords: []
        };
        this.parent.trigger(events.actionBegin, args, (addArgs: ActionEventArgs) => {
            if (!addArgs.cancel) {
                let modifiedData: { [key: string]: Object }[] = [];
                if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    modifiedData = this.priorityOrder(modifiedData);
                }
                let addedRecords: { [key: string]: Object }[] = (cardData instanceof Array) ? cardData : [cardData];
                let changedRecords: { [key: string]: Object }[] =
                    (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') ? modifiedData : [];
                let editParms: SaveChanges = { addedRecords: addedRecords, changedRecords: changedRecords, deletedRecords: [] };
                let type: string = (cardData instanceof Array || modifiedData.length > 0) ? 'batch' : 'insert';
                this.parent.dataModule.updateDataManager(type, editParms, 'cardCreated', cardData as { [key: string]: Object });
            }
        });
    }

    private getIndexFromData(data: { [key: string]: Object }): number {
        let cardElement: HTMLElement =
            this.parent.element.querySelector(`.${cls.CARD_CLASS}[data-id="${data[this.parent.cardSettings.headerField]}"]`);
        let element: Element = closest(cardElement, '.' + cls.CONTENT_CELLS_CLASS);
        let index: number = [].slice.call(element.querySelectorAll('.' + cls.CARD_CLASS)).indexOf(cardElement);
        return index;
    }

    public updateCard(cardData: { [key: string]: Object } | { [key: string]: Object }[], index?: number): void {
        let args: ActionEventArgs = {
            requestType: 'cardChange', cancel: false, addedRecords: [],
            changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
        };
        index = isNullOrUndefined(index) ? this.getIndexFromData(args.changedRecords[0] as { [key: string]: Object }) : index;
        this.parent.trigger(events.actionBegin, args, (updateArgs: ActionEventArgs) => {
            if (!updateArgs.cancel) {
                if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                    let modifiedData: { [key: string]: Object }[] = [];
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    cardData = this.priorityOrder(modifiedData, index);
                }
                let editParms: SaveChanges = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                let type: string = (cardData instanceof Array) ? 'batch' : 'update';
                this.parent.dataModule.updateDataManager(type, editParms, 'cardChanged', cardData as { [key: string]: Object }, index);
            }
        });
    }

    public deleteCard(cardData: string | number | { [key: string]: Object } | { [key: string]: Object }[]): void {
        let editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (typeof cardData === 'string' || typeof cardData === 'number') {
            editParms.deletedRecords = this.parent.kanbanData.filter((data: { [key: string]: Object }) =>
                data[this.parent.cardSettings.headerField] === cardData) as { [key: string]: Object }[];
        } else {
            editParms.deletedRecords = (cardData instanceof Array) ? cardData : [cardData] as { [key: string]: Object }[];
        }
        let args: ActionEventArgs = {
            requestType: 'cardRemove', cancel: false, addedRecords: [], changedRecords: [], deletedRecords: editParms.deletedRecords
        };
        this.parent.trigger(events.actionBegin, args, (deleteArgs: ActionEventArgs) => {
            if (!deleteArgs.cancel) {
                let type: string = (editParms.deletedRecords.length > 1) ? 'batch' : 'delete';
                let cardData: { [key: string]: Object }[] = editParms.deletedRecords as { [key: string]: Object }[];
                this.parent.dataModule.updateDataManager(type, editParms, 'cardRemoved', cardData[0]);
            }
        });
    }

    private priorityOrder(cardData: { [key: string]: Object }[], cardIndex?: number): { [key: string]: Object }[] {
        let cardsId: string[] | number[] = cardData.map((obj: { [key: string]: string }) => obj[this.parent.cardSettings.headerField]);
        let num: number = cardData[cardData.length - 1][this.parent.sortSettings.field] as number;
        let allModifiedKeys: string[] = cardData.map((obj: { [key: string]: string }) => obj[this.parent.keyField]);
        let modifiedKey: string[] = allModifiedKeys.filter((key: string, index: number) => allModifiedKeys.indexOf(key) === index).sort();
        let columnAllDatas: { [key: string]: Object }[];
        let finalData: { [key: string]: Object }[] = [];
        let originalIndex: number[] = [];
        for (let columnKey of modifiedKey) {
            let keyData: { [key: string]: Object }[] = cardData.filter((cardObj: { [key: string]: Object }) =>
                cardObj[this.parent.keyField] === columnKey);
            columnAllDatas = this.parent.layoutModule.getColumnData(columnKey) as { [key: string]: Object }[];
            for (let data of keyData as { [key: string]: Object }[]) {
                if (this.parent.swimlaneSettings.keyField) {
                    let swimlaneDatas: Object[] = this.parent.getSwimlaneData(data[this.parent.swimlaneSettings.keyField] as string);
                    columnAllDatas = this.parent.getColumnData(columnKey, swimlaneDatas) as { [key: string]: Object }[];
                }
            }
            keyData.forEach((key: { [key: string]: Object }) => finalData.push(key));
            if (!isNullOrUndefined(cardIndex)) {
                for (let j: number = 0; j < cardsId.length; j++) {
                    columnAllDatas.filter((data: { [key: string]: Object }, index: number) => {
                        if (data[this.parent.cardSettings.headerField] === cardsId[j] && index <= cardIndex) {
                            originalIndex.push(index);
                        }
                    });
                }
                if (originalIndex.length > 0) {
                    cardIndex = cardIndex + originalIndex.length;
                }
                if (this.parent.sortSettings.direction === 'Ascending') {
                    for (let i: number = cardIndex; i < columnAllDatas.length; i++) {
                        if (cardsId.indexOf(columnAllDatas[i][this.parent.cardSettings.headerField] as string) === -1) {
                            columnAllDatas[i][this.parent.sortSettings.field] = ++num;
                            finalData.push(columnAllDatas[i]);
                        }
                    }
                } else {
                    for (let i: number = cardIndex - 1; i >= 0; i--) {
                        if (cardsId.indexOf(columnAllDatas[i][this.parent.cardSettings.headerField] as string) === -1) {
                            columnAllDatas[i][this.parent.sortSettings.field] = ++num;
                            finalData.push(columnAllDatas[i]);
                        }
                    }
                }
            }
        }
        return finalData;
    }
}
