import { Spreadsheet } from '../base/index';
import { SortEventArgs, SaveCompleteEventArgs, BeforeCellFormatArgs, BeforeSaveEventArgs, triggerDataChange } from '../../workbook/index';
import { BeforeSortEventArgs, beginAction } from '../../workbook/index';
import { CellSaveEventArgs, BeforeOpenEventArgs, BeforeSelectEventArgs, completeAction, positionAutoFillElement, NoteSaveEventArgs } from '../common/index';
import { BeforePasteEventArgs, setActionData, updateUndoRedoCollection, BeforeChartEventArgs, spreadsheetDestroyed } from '../common/index';

/**
 *  Begin and complete events.
 *
 * @hidden
 */
export class ActionEvents {
    private parent: Spreadsheet;

    /**
     * Constructor for initializing action begin and action complete services.
     *
     * @param {Spreadsheet} parent - Specifies the spreadsheet element.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //this.initializeActionBegin();
        //this.initializeActionComplete();
    }

    private initializeActionBegin(): void {
        const cellFormat: Function = this.parent.beforeCellFormat;
        this.parent.beforeCellFormat = (args: BeforeCellFormatArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: cellFormat, actionType: 'begin', eventType: 'format' });
        };
        const beforeOpen: Function = this.parent.beforeOpen;
        this.parent.beforeOpen = (args: BeforeOpenEventArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: beforeOpen, actionType: 'begin', eventType: 'beforeOpen' });
        };
        const beforeSave: Function = this.parent.beforeSave;
        this.parent.beforeSave = (args: BeforeSaveEventArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: beforeSave, actionType: 'begin', eventType: 'beforeSave' });
        };
        const beforeSort: Function = this.parent.beforeSort;
        this.parent.beforeSort = (args: BeforeSortEventArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: beforeSort, actionType: 'begin', eventType: 'beforeSort' });
        };
    }


    private initializeActionComplete(): void {
        const sortComplete: Function = this.parent.sortComplete;
        this.parent.sortComplete = (args: SortEventArgs) => {
            this.actionEventHandler({ evtArgs: args, evtFunc: sortComplete, actionType: 'complete', eventType: 'sorting' });
        };
        const cellSave: Function = this.parent.cellSave;
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
        | BeforeSortEventArgs | BeforePasteEventArgs | BeforeChartEventArgs,
        action: string, preventAction?: boolean, isUndo?: boolean, isRedo?: boolean
    }): void {
        const preventAction: boolean = args.preventAction; delete args.preventAction;
        const actionArgs: { [key: string]: Object } = { action: args.action };
        if (args.isUndo) { actionArgs.isUndo = true; delete args.isUndo; }
        if (args.isRedo) { actionArgs.isUndo = false; delete args.isRedo; }
        actionArgs.args = args;
        this.parent.trigger('actionBegin', actionArgs);
        if (!preventAction && !this.parent.isPrintingProcessing && (args.action === 'clipboard' || args.action === 'format' ||
            args.action === 'cellSave' || args.action === 'addNote' || args.action === 'editNote' || args.action === 'deleteNote' || args.action === 'beforeWrap' || args.action === 'beforeReplace' || args.action === 'filter'
            || args.action === 'beforeClear' || args.action === 'beforeInsertImage' || args.action === 'beforeInsertChart' || args.action === 'chartDesign'
            || args.action === 'cellDelete' || args.action === 'autofill' || args.action === 'removeValidation' || args.action === 'hyperlink' || args.action === 'removeHyperlink' || args.action === 'deleteImage')) {
            this.parent.notify(setActionData, { args: args });
        }
        if (preventAction) { args.preventAction = true; }
        if (actionArgs.isUndo) { args.isUndo = true; }
        if (actionArgs.isUndo === false) { args.isRedo = true; }
    }

    private actionCompleteHandler(
        args: { eventArgs: SortEventArgs | CellSaveEventArgs | SaveCompleteEventArgs | NoteSaveEventArgs, action: string,
            preventAction?: boolean, preventEventTrigger?: boolean }): void {
        const preventAction: boolean = args.preventAction; delete args.preventAction;
        this.parent.notify(triggerDataChange, args);
        if (!args.preventEventTrigger) {
            this.parent.trigger('actionComplete', args);
        }
        if (!preventAction && args.action !== 'undoRedo' && args.action !== 'gotoSheet') {
            this.parent.notify(updateUndoRedoCollection, { args: args });
        }
        this.parent.notify(positionAutoFillElement, null);
    }

    private addEventListener(): void {
        this.parent.on(completeAction, this.actionCompleteHandler, this);
        this.parent.on(beginAction, this.actionBeginHandler, this);
        this.parent.on(spreadsheetDestroyed, this.removeEventListener, this);
    }

    private removeEventListener(): void {
        this.parent.off(completeAction, this.actionCompleteHandler);
        this.parent.off(beginAction, this.actionBeginHandler);
        this.parent.off(spreadsheetDestroyed, this.removeEventListener);
    }
}
