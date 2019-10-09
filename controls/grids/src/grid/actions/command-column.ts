import { closest, KeyboardEventArgs, isNullOrUndefined } from '@syncfusion/ej2-base';
import { click, keyPressed, commandClick, initialEnd } from '../base/constant';
import { CellType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, EJ2Intance, CommandClickEventArgs } from '../base/interface';
import { CellRendererFactory } from '../services/cell-render-factory';
import { CommandColumnRenderer } from '../renderer/command-column-renderer';
import { ButtonModel } from '@syncfusion/ej2-buttons';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { getUid } from '../base/util';

/**
 * `CommandColumn` used to handle the command column actions.
 * @hidden
 */
export class CommandColumn {

    private parent: IGrid;
    private previousClickedTD: HTMLElement;
    private locator: ServiceLocator;
    private clickedButton: HTMLElement;

    constructor(parent: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.initiateRender();
        this.addEventListener();
    }

    private initiateRender(): void {
        let cellFac: CellRendererFactory = this.locator.getService<CellRendererFactory>('cellRendererFactory');
        cellFac.addCellRenderer(CellType.CommandColumn, new CommandColumnRenderer(this.parent, this.locator));
    }

    private commandClickHandler(e: Event): void {
        let gObj: IGrid = this.parent;
        let gID: string = gObj.element.id;
        let target: HTMLElement = (<HTMLElement>closest(<Node>e.target, 'button'));
        if (!target || !(<HTMLElement>closest(<Node>e.target, '.e-unboundcell'))) {
            return;
        }
        let buttonObj: ButtonModel = (<EJ2Intance>target).ej2_instances[0];
        let type: string = (<{ commandType?: string }>buttonObj).commandType;
        let uid: string = target.getAttribute('data-uid');
        let commandColumn: Object;
        let row: Row<Column> = gObj.getRowObjectFromUID(closest(target, '.e-row').getAttribute('data-uid'));
        (<{ columnModel?: Column[] }>this.parent).columnModel.forEach((col: Column) => {
            if (col.commands) {
                col.commands.forEach((commandCol: Object) => {
                    let idInString: string = 'uid';
                    let typeInString: string = 'type';
                    if (commandCol[idInString] === uid && commandCol[typeInString] === type) {
                        commandColumn = commandCol;
                    }
                });
            }
        });
        let args: CommandClickEventArgs = {
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
                    gObj.editModule.closeEdit();
                    break;
                case 'Save':
                    gObj.editModule.endEdit();
                    break;
                case 'Delete':
                    if (gObj.editSettings.mode !== 'Batch') {
                        gObj.editModule.endEdit();
                    }
                    gObj.clearSelection();
                    //for toogle issue when dbl click
                    gObj.selectRow(parseInt(closest(target, 'tr').getAttribute('aria-rowindex'), 10), false);
                    gObj.editModule.deleteRecord();
                    break;
            }
        });
    }

    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'commandColumn';
    }

    /**
     * To destroy CommandColumn.
     * @method destroy
     * @return {void}
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
    }
    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(click, this.commandClickHandler, this);
        this.parent.on(keyPressed, this.keyPressHandler, this);
        this.parent.on(initialEnd, this.load, this);
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        if (e.action === 'enter' && closest(<Node>e.target, '.e-unboundcelldiv')) {
            this.commandClickHandler(e);
            e.preventDefault();
        }
    }

    private load(): void {
        let uid: string = 'uid';
        (<{ columnModel?: Column[] }>this.parent).columnModel.forEach((col: Column, indexs: number) => {
            if (col.commands) {
                col.commands.forEach((commandCol: Object) => {
                    commandCol[uid] = getUid('gridcommand');
                });
            }
        });
    }
}
