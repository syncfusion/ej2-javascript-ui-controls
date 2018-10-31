import { closest, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { initialEnd, click, keyPressed } from '../base/constant';
import { CellType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, EJ2Intance } from '../base/interface';
import { CellRendererFactory } from '../services/cell-render-factory';
import { CommandColumnRenderer } from '../renderer/command-column-renderer';
import { ButtonModel } from '@syncfusion/ej2-buttons';

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
        if (!target || !gObj.editModule || !(<HTMLElement>closest(<Node>e.target, '.e-unboundcell'))) {
            return;
        }
        let buttonObj: ButtonModel = (<EJ2Intance>target).ej2_instances[0];
        let type: string = (<{commandType?: string}> buttonObj).commandType;
        if (buttonObj.disabled) {
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
                gObj.editModule.endEdit();
                gObj.clearSelection();
                //for toogle issue when dbl click
                gObj.selectRow(parseInt(closest(target, 'tr').getAttribute('aria-rowindex'), 10), false);
                gObj.editModule.deleteRecord();
                break;
        }
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
        this.parent.off(initialEnd, this.initiateRender);
        this.parent.off(keyPressed, this.keyPressHandler);
    }
    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(click, this.commandClickHandler, this);
        this.parent.on(initialEnd, this.initiateRender, this);
        this.parent.on(keyPressed, this.keyPressHandler, this);
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        if (e.action === 'enter' && closest(<Node>e.target, '.e-unboundcelldiv')) {
            this.commandClickHandler(e);
            e.preventDefault();
        }
    }
}
