import { Spreadsheet } from '../base/index';
import { SortEventArgs, SaveCompleteEventArgs, BeforeCellFormatArgs, BeforeSaveEventArgs } from '../../workbook/index';
import { BeforeSortEventArgs } from '../../workbook/index';
import { CellSaveEventArgs, BeforeOpenEventArgs, BeforeSelectEventArgs, completeAction, beginAction } from '../common/index';
import { BeforePasteEventArgs, setActionData, updateUndoRedoCollection } from '../common/index';

/**
 *  Begin and complete events.
 * @hidden 
 */
export class ActionEvents {
    private parent: Spreadsheet;

    /**
     * Constructor for initializing action begin and action complete services.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //this.initializeActionBegin();
        //this.initializeActionComplete();
    }

    private initializeActionBegin(): void {
        let cellFormat: Function = this.parent.beforeCellFormat;
        this.parent.beforeCellFormat = (args: BeforeCellFormatArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: cellFormat, actionType: 'begin', eventType: 'format' });
        };
        let beforeOpen: Function = this.parent.beforeOpen;
        this.parent.beforeOpen = (args: BeforeOpenEventArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: beforeOpen, actionType: 'begin', eventType: 'beforeOpen' });
        };
        let beforeSave: Function = this.parent.beforeSave;
        this.parent.beforeSave = (args: BeforeSaveEventArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: beforeSave, actionType: 'begin', eventType: 'beforeSave' });
        };
        let beforeSort: Function = this.parent.beforeSort;
        this.parent.beforeSort = (args: BeforeSortEventArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: beforeSort, actionType: 'begin', eventType: 'beforeSort' });
        };
    }


    private initializeActionComplete(): void {
        let sortComplete: Function = this.parent.sortComplete;
        this.parent.sortComplete = (args: SortEventArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: sortComplete, actionType: 'complete', eventType: 'sorting' });
        };
        let cellSave: Function = this.parent.cellSave;
        this.parent.cellSave = (args: CellSaveEventArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: cellSave, actionType: 'complete', eventType: 'cellSave' });
        };
    }

    private actionEventHandler(args: { evtArgs: Object, evtFunc: Function, actionType: string, eventType: string }): void {
        if (args.evtFunc) {
            args.evtFunc.apply(this, [args]);
        }
        if (args.actionType === 'begin') {
            this.actionBeginHandler({ eventArgs: args.evtArgs, action: args.eventType });
        } else {
            this.actionCompleteHandler({ eventArgs: args.evtArgs, action: args.eventType });
        }

    }

    private actionBeginHandler(args: {
        eventArgs: BeforeCellFormatArgs | BeforeOpenEventArgs | BeforeSaveEventArgs | BeforeSelectEventArgs
        | BeforeSortEventArgs | BeforePasteEventArgs,
        action: string
    }): void {
        this.parent.trigger('actionBegin', { action: args.action, args: args });
        if (args.action === 'clipboard' || args.action === 'beforeSort' || args.action === 'format' || args.action === 'cellSave'
            || args.action === 'beforeWrap' || args.action === 'beforeReplace' || args.action === 'beforeReplaceAll') {
            this.parent.notify(setActionData, { args: args });
        }
    }

    private actionCompleteHandler(args: { eventArgs: SortEventArgs | CellSaveEventArgs | SaveCompleteEventArgs, action: string }): void {
        this.parent.trigger('actionComplete', args);
        if (args.action !== 'undoRedo') {
            this.parent.notify(updateUndoRedoCollection, { args: args });
        }
    }

    private addEventListener(): void {
        this.parent.on(completeAction, this.actionCompleteHandler, this);
        this.parent.on(beginAction, this.actionBeginHandler, this);
    }

    private removeEventListener(): void {
        this.parent.off(completeAction, this.actionCompleteHandler);
        this.parent.off(beginAction, this.actionBeginHandler);
    }
}