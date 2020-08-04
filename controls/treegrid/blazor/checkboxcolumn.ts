import { BlazorDotnetObject, isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { SfTreeGrid } from './sf-treegrid-fn';
import { BlazorTreeGridElement  } from './interface';

/**
 * The `CheckboxColumn` module is used to handle checkbox column selection.
 */

export class CheckboxColumn {

    private parent: SfTreeGrid;
    public element: BlazorTreeGridElement;
    public dotNetRef: BlazorDotnetObject;

    constructor(dotnetRef: BlazorDotnetObject, parent?: SfTreeGrid) {
        this.parent = parent;
        this.dotNetRef = dotnetRef;
    }

    public renderHeaderCheckbox(element: BlazorTreeGridElement, columnIndex: number): void {
        let container: HTMLElement = createElement('div', { className: 'e-checkbox-wrapper e-css e-hierarchycheckbox' });
        let inputelement: Element = createElement('input', { className: 'e-treeselectall', attrs: { 'type': 'checkbox'}});
        container.appendChild(inputelement);
        let span: Element = createElement('span', { className: 'e-frame e-icons', styles: 'width: 18px;'} );
        container.appendChild(span);
        span.addEventListener('click', this.headerSelect.bind(this));
        let spanlabel: Element = createElement('span', { className: 'e-lable'} );
        container.appendChild(spanlabel);
        let headerElement: HTMLElement = <HTMLElement>element.querySelectorAll('.e-headercontent th')[columnIndex];
        if (isNullOrUndefined(headerElement.querySelector('.e-checkbox-wrapper'))) {
            let headercelldiv: HTMLElement = headerElement.querySelector('.e-headercelldiv');
            headercelldiv.insertBefore(container, headercelldiv);
        }
    }

    public updateHeaderCheckbox(spanElement: Element, checkState: string): void {
        if (checkState === 'intermediate') {
            spanElement.classList.add('e-stop');
            spanElement.classList.remove('e-check');
        } else if (checkState === 'check') {
            spanElement.classList.add('e-check');
            spanElement.classList.remove('e-stop');
        } else {
            spanElement.classList.remove('e-stop');
            spanElement.classList.remove('e-check');
        }
    }

    private headerSelect(args: MouseEvent): void {
        let spanElement: HTMLElement = <HTMLElement>args.currentTarget;
        let checkState: string = 'uncheck';
        if (spanElement.classList.contains('e-check')) {
            spanElement.classList.remove('e-check');
        } else if (spanElement.classList.contains('e-stop')) {
            spanElement.classList.remove('e-stop');
        } else {
            spanElement.classList.add('e-check');
            checkState = 'check';
        }
        this.dotNetRef.invokeMethodAsync('SelectAllCheckbox', checkState);
    }
}