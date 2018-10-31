import { addClass, removeClass, attributes, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, ICellRenderer, CommandModel } from '../base/interface';
import { CommandButtonType } from '../base/enum';
import { CellRenderer } from './cell-renderer';
import { appendChildren } from '../base/util';

/**
 * `CommandColumn` used to render command column in grid
 * @hidden
 */

export class CommandColumnRenderer extends CellRenderer implements ICellRenderer<Column> {
    private buttonElement: HTMLButtonElement = <HTMLButtonElement>this.parent.createElement('button', {});
    private unbounDiv: HTMLElement = this.parent.createElement('div', { className: 'e-unboundcelldiv', styles: 'display: inline-block' });

    public element: HTMLElement = this.parent.createElement('TD', {
        className: 'e-rowcell e-unboundcell', attrs: {
            role: 'gridcell', tabindex: '-1'
        }
    });
    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
    }
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.appendChild(this.unbounDiv.cloneNode());
        (<HTMLElement>node).setAttribute('aria-label', 'is Command column column header ' + cell.column.headerText);
        if (cell.column.commandsTemplate) {
            appendChildren(node.firstElementChild, cell.column.getColumnTemplate()(data));
        } else {
            for (let command of cell.commands) {
                node = this.renderButton(node, command, <number>attributes.index);
            }
        }
        this.setAttributes(<HTMLElement>node, cell, attributes);
        if (this.parent.isEdit) {
            addClass(node.querySelectorAll('.e-edit-delete'), 'e-hide');
            removeClass(node.querySelectorAll('.e-save-cancel'), 'e-hide');
        } else {
            addClass(node.querySelectorAll('.e-save-cancel'), 'e-hide');
            removeClass(node.querySelectorAll('.e-edit-delete'), 'e-hide');
        }
        return node;
    }

    private renderButton(node: Element, buttonOption: CommandModel, index: number): Element {
        let button: HTMLButtonElement = <HTMLButtonElement>this.buttonElement.cloneNode();
        attributes(button, {
            'id': this.parent.element.id + (buttonOption.type || '') + '_' + index, 'type': 'button',
            title: !isNullOrUndefined(buttonOption.title) ? buttonOption.title :
                buttonOption.buttonOption.content || this.localizer.getConstant(buttonOption.type) || buttonOption.type
        });
        button.onclick = buttonOption.buttonOption.click;
        let buttonObj: Button = new Button(buttonOption.buttonOption, button);
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
