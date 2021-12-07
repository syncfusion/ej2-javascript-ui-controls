import { addClass, removeClass, attributes, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, ICellRenderer, CommandModel } from '../base/interface';
import { CommandButtonType } from '../base/enum';
import { CellRenderer } from './cell-renderer';
import { appendChildren } from '../base/util';
import { destroy } from '../base/constant';

/**
 * `CommandColumn` used to render command column in grid
 *
 * @hidden
 */

export class CommandColumnRenderer extends CellRenderer implements ICellRenderer<Column> {
    private buttonElement: HTMLButtonElement = <HTMLButtonElement>this.parent.createElement('button', {});
    private unbounDiv: HTMLElement = this.parent.createElement('div', { className: 'e-unboundcelldiv', styles: 'display: inline-block' });
    private childRefs: Button[] = [];

    public element: HTMLElement = this.parent.createElement('TD', {
        className: 'e-rowcell e-unboundcell', attrs: {
            role: 'gridcell', tabindex: '-1'
        }
    });
    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.parent.on(destroy, this.destroyButtons, this);
    }

    private destroyButtons(): void {
        for (let i: number = 0; i < this.childRefs.length; i++) {
            if (this.childRefs[i] && !this.childRefs[i].isDestroyed) {
                this.childRefs[i].destroy();
            }
        }
        this.parent.off(destroy, this.destroyButtons);
    }

    /**
     * Function to render the cell content based on Column object.
     *
     * @param {cell<Column>} cell - specifies the cell
     * @param {Object} data - specifies the data
     * @param {Object} attributes - specifies the attributes
     * @param {boolean} isVirtualEdit - specifies virtual scroll editing
     * @returns {Element} returns the element
     */
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }, isVirtualEdit?: boolean): Element {
        let node: Element = this.element.cloneNode() as Element;
        const uid: string = 'uid';
        node.appendChild(this.unbounDiv.cloneNode());
        (<HTMLElement>node).setAttribute('aria-label', 'is Command column column header ' + cell.column.headerText);
        if (cell.column.commandsTemplate) {
            if (this.parent.isReact && typeof (cell.column.commandsTemplate) !== 'string') {
                const tempID: string = this.parent + 'commandsTemplate';
                cell.column.getColumnTemplate()(data, this.parent, 'commandsTemplate', tempID, null, null, node.firstElementChild);
                this.parent.renderTemplates();
            } else {
                appendChildren(node.firstElementChild, cell.column.getColumnTemplate()(data));
            }
        } else {
            for (const command of cell.commands) {
                node = this.renderButton(node, command, <number>attributes.index, command[uid]);
            }
        }
        this.setAttributes(<HTMLElement>node, cell, attributes);
        if ((!this.parent.enableVirtualization && this.parent.isEdit) || isVirtualEdit) {
            addClass([].slice.call(node.getElementsByClassName('e-edit-delete')), 'e-hide');
            removeClass([].slice.call(node.getElementsByClassName('e-save-cancel')), 'e-hide');
        } else {
            addClass([].slice.call(node.getElementsByClassName('e-save-cancel')), 'e-hide');
            removeClass([].slice.call(node.getElementsByClassName('e-edit-delete')), 'e-hide');
        }
        return node;
    }

    private renderButton(node: Element, buttonOption: CommandModel, index: number, uid: string): Element {
        const button: HTMLButtonElement = <HTMLButtonElement>this.buttonElement.cloneNode();
        attributes(button, {
            'id': this.parent.element.id + (buttonOption.type || '') + '_' + index + '_' + uid, 'type': 'button',
            title: !isNullOrUndefined(buttonOption.title) ? buttonOption.title :
                buttonOption.buttonOption.content || this.localizer.getConstant(buttonOption.type) || buttonOption.type,
            'data-uid': uid
        });
        button.onclick = buttonOption.buttonOption.click;
        const buttonObj: Button = new Button(buttonOption.buttonOption, button);
        this.childRefs.push(buttonObj);
        (<{ commandType?: CommandButtonType }>buttonObj).commandType = buttonOption.type;
        node.firstElementChild.appendChild(buttonObj.element);
        switch (buttonOption.type) {
        case 'Edit':
        case 'Delete':
            addClass([button], ['e-edit-delete', 'e-' + buttonOption.type.toLowerCase() + 'button']);
            break;
        case 'Cancel':
        case 'Save':
            addClass([button], ['e-save-cancel', 'e-' + buttonOption.type.toLowerCase() + 'button']);
            break;
        }
        return node;
    }
}
