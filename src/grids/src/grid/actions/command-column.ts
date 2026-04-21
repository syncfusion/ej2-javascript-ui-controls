import { closest, isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { click, keyPressed, commandClick, initialEnd, destroy } from '../base/constant';
import { CellType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, EJ2Intance, CommandClickEventArgs } from '../base/interface';
import { CellRendererFactory } from '../services/cell-render-factory';
import { CommandColumnRenderer } from '../renderer/command-column-renderer';
import { ButtonModel } from '@syncfusion/ej2-buttons';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { getUid } from '../base/util';
import * as literals from '../base/string-literals';

/**
 * `CommandColumn` used to handle the command column actions.
 *
 * @hidden
 */
export class CommandColumn {

    private parent: IGrid;
    private locator: ServiceLocator;

    constructor(parent: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.initiateRender();
        this.addEventListener();
    }

    private initiateRender(): void {
        const cellFac: CellRendererFactory = this.locator.getService<CellRendererFactory>('cellRendererFactory');
        cellFac.addCellRenderer(CellType.CommandColumn, new CommandColumnRenderer(this.parent, this.locator));
    }

    private commandClickHandler(e: Event): void {
        const gObj: IGrid = this.parent;
        const target: HTMLElement = (<HTMLElement>closest(<Node>e.target, 'button'));
        if (!target || !(<HTMLElement>closest(<Node>e.target, '.e-unboundcell'))) {
            return;
        }
        const buttonObj: ButtonModel = (<EJ2Intance>target).ej2_instances[0];
        const type: string = (<{ commandType?: string }>buttonObj).commandType;
        const uid: string = target.getAttribute('data-uid');
        let commandColumn: Object;
        const row: Row<Column> = gObj.getRowObjectFromUID(closest(target, '.' + literals.row).getAttribute('data-uid'));
        const cols: Column[] = (<{ columnModel?: Column[] }>this.parent).columnModel;
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[parseInt(i.toString(), 10)].commands) {
                const commandCols: Object[] = cols[parseInt(i.toString(), 10)].commands;
                for (let j: number = 0; j < commandCols.length; j++) {
                    const idInString: string = 'uid';
                    const typeInString: string = 'type';
                    if (commandCols[parseInt(j.toString(), 10)][`${idInString}`] === uid && commandCols[parseInt(j.toString(), 10)][`${typeInString}`] === type) {
                        commandColumn = commandCols[parseInt(j.toString(), 10)];
                    } else {
                        const buttons: HTMLElement[] = [].slice.call(closest(target, '.e-unboundcell').querySelectorAll('button'));
                        const index: number = buttons.findIndex((ele: HTMLElement) => ele === target);
                        if (index < commandCols.length && commandCols[parseInt(index.toString(), 10)][`${typeInString}`] === type &&
                            String(commandCols[parseInt(j.toString(), 10)][`${idInString}`]) === uid) {
                            commandColumn = commandCols[parseInt(index.toString(), 10)];
                        }
                    }
                }
            }
        }
        const args: CommandClickEventArgs = {
            cancel: false,
            target: target,
            commandColumn: commandColumn,
            rowData: isNullOrUndefined(row) ? undefined : row.data
        };
        this.parent.trigger(commandClick, args, (commandclickargs: CommandClickEventArgs) => {
            if (buttonObj.disabled || !gObj.editModule || commandclickargs.cancel) {
                return;
            }
            switch (type) {
            case 'Edit':
                gObj.editModule.endEdit();
                gObj.editModule.startEdit(<HTMLTableRowElement>closest(target, 'tr'));
                break;
            case 'Cancel':
                gObj.isFocusFirstCell = true;
                gObj.editModule.closeEdit();
                break;
            case 'Save':
                gObj.isFocusFirstCell = true;
                gObj.editModule.endEdit();
                break;
            case 'Delete':
                if (gObj.editSettings.mode !== 'Batch') {
                    gObj.editModule.endEdit();
                }
                gObj.commandDelIndex = parseInt(closest(target, 'tr').getAttribute(literals.ariaRowIndex), 10) - 1;
                gObj.clearSelection();
                //for toogle issue when dbl click
                gObj.selectRow(gObj.commandDelIndex, false);
                gObj.isFocusFirstCell = true;
                gObj.editModule.deleteRecord();
                if (!(gObj.editSettings.showDeleteConfirmDialog && !gObj.allowSelection)) {
                    gObj.commandDelIndex = undefined;
                }
                break;
            }
        });
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     */
    private getModuleName(): string {
        return 'commandColumn';
    }

    /**
     * To destroy CommandColumn.
     *
     * @function destroy
     * @returns {void}
     */
    private destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(click, this.commandClickHandler);
        this.parent.off(keyPressed, this.keyPressHandler);
        this.parent.off(initialEnd, this.load);
        this.parent.off(destroy, this.destroy);
    }
    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(click, this.commandClickHandler, this);
        this.parent.on(keyPressed, this.keyPressHandler, this);
        this.parent.on(initialEnd, this.load, this);
        this.parent.on(destroy, this.destroy, this);
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        if ((e.action === 'enter' || e.action === 'space') && closest(<Node>e.target, '.e-unboundcelldiv')) {
            this.commandClickHandler(e);
            e.preventDefault();
        }
    }

    private load(): void {
        const uid: string = 'uid';
        const col: Column[] = (<{ columnModel?: Column[] }>this.parent).columnModel;
        for (let i: number = 0; i < col.length; i++) {
            if (col[parseInt(i.toString(), 10)].commands) {
                const commandCol: Object[] = col[parseInt(i.toString(), 10)].commands;
                for (let j: number = 0; j < commandCol.length; j++) {
                    commandCol[parseInt(j.toString(), 10)][`${uid}`] = getUid('gridcommand');
                }
            }
        }
    }
}
