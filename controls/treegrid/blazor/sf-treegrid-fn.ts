import { BlazorDotnetObject, EventHandler, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { BlazorTreeGridElement, ITreeGridOptions, Column } from './interface';
import { Clipboard } from './clipboard';
import { RowDD } from './rowdragdrop';
import { CheckboxColumn } from './checkboxcolumn';

/**
 * Specifies SfTreeGrid class for native blazor rendering.
 * @hidden
 */

export class SfTreeGrid {
    /* tslint:disable-next-line */
    public grid: any;
    public element: BlazorTreeGridElement;
    public dotNetRef: BlazorDotnetObject;
    public options: ITreeGridOptions;
    public header: HTMLElement;
    public content: HTMLElement;
    public footer: HTMLElement;
    public columnModel: Column[] = [];
    public copyHierarchyMode: string;
    public clipboardModule: Clipboard;
    public rowDragAndDropModule: RowDD;
    public checkboxcolumnModule: CheckboxColumn;
    constructor(element: BlazorTreeGridElement, options: ITreeGridOptions, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.element.blazor_instance = this;
        /* tslint:disable-next-line */
        this.grid = (element.querySelector('#' + element.id + '_gridcontrol') as any).blazor__instance;
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.header = this.element.querySelector('.e-headercontent');
        this.content = this.element.querySelector('.e-content');
        this.footer = this.element.querySelector('.e-summarycontent');
        this.clipboardModule = new Clipboard(this);
        this.rowDragAndDropModule = new RowDD(this);
        this.checkboxcolumnModule = new CheckboxColumn(dotnetRef, this);
        this.wireEvents();
    }

    public wireEvents(): void {
        EventHandler.add(this.element, 'keydown', this.KeyDownHandler, this);
    }

    public getContent(): HTMLElement { return this.content; }

    public getContentTable(): HTMLElement { return this.content.querySelector('.e-table'); }

    public getHeaderContent(): HTMLElement { return this.header; }

    public getHeaderTable(): HTMLElement { return this.header.querySelector('.e-table'); }

    public getRows(): HTMLTableRowElement[] { return [].slice.call(this.getContent().querySelectorAll('.e-row')); }

    public KeyDownHandler(e: KeyboardEventArgs): void {
        if (e.keyCode === 67 && e.ctrlKey) {
            this.clipboardModule.copy();
        } else if (e.keyCode === 72 && e.ctrlKey && e.shiftKey) {
            this.clipboardModule.copy(true);
        }
    }

    public unWireEvents(): void {
        EventHandler.remove(this.element, 'keydown', this.KeyDownHandler);
    }

    public destroy(): void {
        this.unWireEvents();
    }
}