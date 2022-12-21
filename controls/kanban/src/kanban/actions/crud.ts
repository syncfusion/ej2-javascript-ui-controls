/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kanban } from '../base/kanban';
import { isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { ActionEventArgs, SaveChanges } from '../base/interface';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
/**
 * Kanban CRUD module
 */
export class Crud {
    private parent: Kanban;

    /**
     * Constructor for CRUD module
     *
     * @param {Kanban} parent Accepts the kanban instance
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
    }

    public addCard(cardData: Record<string, any> | Record<string, any>[], index?: number): void {
        const args: ActionEventArgs = {
            cancel: false, requestType: 'cardCreate', addedRecords: (cardData instanceof Array) ? cardData : [cardData],
            changedRecords: [], deletedRecords: []
        };
        this.parent.trigger(events.actionBegin, args, (addArgs: ActionEventArgs) => {
            if (!addArgs.cancel) {
                let modifiedData: Record<string, any>[] = [];
                if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                    if (cardData instanceof Array) {
                        modifiedData = cardData;
                    } else {
                        modifiedData.push(cardData);
                    }
                    modifiedData.forEach((data: Record<string, any>, index: number) => {
                        if (!data[this.parent.sortSettings.field]) {
                            const columnData: Record<string, any>[] = this.parent.getColumnData(data[this.parent.keyField]);
                            if (this.parent.sortSettings.direction === 'Ascending' && columnData.length > 0) {
                                data[this.parent.sortSettings.field] =
                                (columnData[columnData.length - 1][this.parent.sortSettings.field]) + index + 1;
                            } else if (this.parent.sortSettings.direction === 'Descending' && columnData.length > 0) {
                                data[this.parent.sortSettings.field] = columnData[0][this.parent.sortSettings.field] + index + 1;
                            }
                            if (columnData.length === 0) {
                                data[this.parent.sortSettings.field] = 1;
                            }
                        }
                    });
                    if (!(cardData instanceof Array)) {
                        if (!index && this.parent.sortSettings.direction === 'Descending') {
                            // eslint-disable-next-line max-len
                            this.parent.getColumnData(modifiedData[0][this.parent.keyField]).filter((obj: Record<string, any>, count: number) => {
                                if (obj[this.parent.sortSettings.field] === modifiedData[0][this.parent.sortSettings.field]) {
                                    index = count + 1;
                                }
                            });
                        }
                    }
                    if (index !== 0 && !index && this.parent.sortSettings.direction === 'Descending') {
                        index = 0;
                    }
                    modifiedData = this.priorityOrder(modifiedData, index);
                }
                const addedRecords: Record<string, any>[] = (cardData instanceof Array) ? cardData : [cardData];
                const changedRecords: Record<string, any>[] =
                    (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') ? modifiedData : [];
                const editParms: SaveChanges = { addedRecords: addedRecords, changedRecords: changedRecords, deletedRecords: [] };
                const type: string = (cardData instanceof Array || modifiedData.length > 0) ? 'batch' : 'insert';
                this.parent.dataModule.updateDataManager(type, editParms, 'cardCreated', cardData as Record<string, any>, index);
            }
        });
    }

    private getIndexFromData(data: Record<string, any>): number {
        const cardElement: HTMLElement =
            this.parent.element.querySelector(`.${cls.CARD_CLASS}[data-id="${data[this.parent.cardSettings.headerField]}"]`);
        const element: Element = closest(cardElement, '.' + cls.CONTENT_CELLS_CLASS);
        const index: number = [].slice.call(element.querySelectorAll('.' + cls.CARD_CLASS)).indexOf(cardElement);
        return index;
    }

    public updateCard(cardData: Record<string, any> | Record<string, any>[], index?: number): void {
        const args: ActionEventArgs = {
            requestType: 'cardChange', cancel: false, addedRecords: [],
            changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
        };
        index = isNullOrUndefined(index) ? this.getIndexFromData(args.changedRecords[0]) : index;
        this.parent.trigger(events.actionBegin, args, (updateArgs: ActionEventArgs) => {
            if (!updateArgs.cancel) {
                if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                    let modifiedData: Record<string, any>[] = [];
                    if (cardData instanceof Array) {
                        modifiedData = cardData;
                    } else {
                        modifiedData.push(cardData);
                    }
                    cardData = this.priorityOrder(modifiedData, index);
                }
                const editParms: SaveChanges = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                const type: string = (cardData instanceof Array) ? 'batch' : 'update';
                this.parent.dataModule.updateDataManager(type, editParms, 'cardChanged', cardData as Record<string, any>, index);
            }
        });
    }

    public deleteCard(cardData: string | number | Record<string, any> | Record<string, any>[]): void {
        const editParms: SaveChanges = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (typeof cardData === 'string' || typeof cardData === 'number') {
            editParms.deletedRecords = this.parent.kanbanData.filter((data: Record<string, any>) =>
                data[this.parent.cardSettings.headerField] === cardData);
        } else {
            editParms.deletedRecords = (cardData instanceof Array) ? cardData : [cardData];
        }
        const args: ActionEventArgs = {
            requestType: 'cardRemove', cancel: false, addedRecords: [], changedRecords: [], deletedRecords: editParms.deletedRecords
        };
        this.parent.trigger(events.actionBegin, args, (deleteArgs: ActionEventArgs) => {
            if (!deleteArgs.cancel) {
                const type: string = (editParms.deletedRecords.length > 1) ? 'batch' : 'delete';
                const cardData: Record<string, any>[] = editParms.deletedRecords;
                this.parent.dataModule.updateDataManager(type, editParms, 'cardRemoved', cardData[0]);
            }
        });
    }

    private priorityOrder(cardData: Record<string, any>[], cardIndex?: number): Record<string, any>[] {
        const cardsId: string[] | number[] = cardData.map((obj: { [key: string]: string }) => obj[this.parent.cardSettings.headerField]);
        let num: number = cardData[cardData.length - 1][this.parent.sortSettings.field] as number;
        const allModifiedKeys: string[] = cardData.map((obj: { [key: string]: string }) => obj[this.parent.keyField]);
        const modifiedKey: string[] = allModifiedKeys.filter((key: string, index: number) => allModifiedKeys.indexOf(key) === index).sort();
        let columnAllDatas: Record<string, any>[];
        const finalData: Record<string, any>[] = [];
        const originalIndex: number[] = [];
        for (const columnKey of modifiedKey) {
            const keyData: Record<string, any>[] = cardData.filter((cardObj: Record<string, any>) =>
                cardObj[this.parent.keyField] === columnKey);
            columnAllDatas = this.parent.layoutModule.getColumnData(columnKey) as Record<string, any>[];
            for (const data of keyData as Record<string, any>[]) {
                if (this.parent.swimlaneSettings.keyField) {
                    const swimlaneDatas: Record<string, any>[] =
                        this.parent.getSwimlaneData(data[this.parent.swimlaneSettings.keyField] as string);
                    columnAllDatas = this.parent.getColumnData(columnKey, swimlaneDatas);
                }
            }
            keyData.forEach((key: Record<string, any>) => finalData.push(key));
            if (!isNullOrUndefined(cardIndex)) {
                for (let j: number = 0; j < cardsId.length; j++) {
                    columnAllDatas.filter((data: Record<string, any>, index: number) => {
                        if (data[this.parent.cardSettings.headerField] === cardsId[j as number] && index <= cardIndex) {
                            originalIndex.push(index);
                        }
                    });
                }
                if (originalIndex.length > 0) {
                    cardIndex = cardIndex + originalIndex.length;
                }
                if (this.parent.sortSettings.direction === 'Ascending') {
                    for (let i: number = cardIndex; i < columnAllDatas.length; i++) {
                        if (cardsId.indexOf(columnAllDatas[i as number][this.parent.cardSettings.headerField] as string) === -1) {
                            columnAllDatas[i as number][this.parent.sortSettings.field] = ++num;
                            finalData.push(columnAllDatas[i as number]);
                        }
                    }
                } else {
                    for (let i: number = cardIndex - 1; i >= 0; i--) {
                        if (cardsId.indexOf(columnAllDatas[i as number][this.parent.cardSettings.headerField] as string) === -1) {
                            columnAllDatas[i as number][this.parent.sortSettings.field] = ++num;
                            finalData.push(columnAllDatas[i as number]);
                        }
                    }
                }
            }
        }
        return finalData;
    }
}
