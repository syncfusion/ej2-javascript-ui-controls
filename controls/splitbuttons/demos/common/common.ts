import { createElement } from '@syncfusion/ej2-base';

let themes: string[] = ['material', 'fabric', 'highcontrast', 'bootstrap', 'material-dark', 'bootstrap-dark', 'fabric-dark', 'bootstrap4'];

function createButtons(id: string): HTMLButtonElement {
    let btn: HTMLButtonElement = createElement('button', { attrs: { 'type': 'button', 'class': 'e-btn', 'id': id } }) as HTMLButtonElement;
    btn.textContent = id;
    return btn;
}

export function createTable(): void {
    let table: HTMLElement = document.createElement('table');
    let row: HTMLElement = document.createElement('tr');
    table.appendChild(row);
    for (let i = 0; i < themes.length; i++) {
        let col: HTMLElement = document.createElement('td');
        let themebtn: HTMLButtonElement = createButtons(themes[i]);
        col.appendChild(themebtn);
        row.appendChild(col);
    }
    document.body.insertBefore(table, document.body.firstChild);
}
