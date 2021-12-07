import { formatUnit, createElement } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';

/**
 * virtual Content renderer for Gantt
 */
export class VirtualContentRenderer {
    private parent: Gantt;
    private wrapper: HTMLElement;
    private virtualTrack: HTMLElement;
    constructor(parent: Gantt) {
        this.parent = parent;
    }

    /**
     * To render a wrapper for chart body content when virtualization is enabled.
     *
     * @returns {void} .
     * @hidden
     */
    public renderWrapper(): void {
        this.wrapper = createElement('div', { className: 'e-virtualtable', styles: 'position: absolute; transform: translate(0px, 0px);' });
        this.parent.ganttChartModule.scrollElement.appendChild(this.wrapper);
        this.virtualTrack = createElement('div', { className: 'e-virtualtrack', styles: 'position: relative; pointer-events: none; width: 100%;' });
        this.parent.ganttChartModule.scrollElement.appendChild(this.virtualTrack);
        this.wrapper.appendChild(this.parent.ganttChartModule.chartBodyContent);
    }

    /**
     * To append child elements for wrappered element when virtualization is enabled.
     *
     * @param {HTMLElement} element .
     * @returns {void} .
     * @hidden
     */
    public appendChildElements(element: HTMLElement): void {
        this.wrapper.appendChild(element);
    }

    /**
     * To adjust gantt content table's style when virtualization is enabled
     *
     * @returns {void} .
     * @hidden
     */
    public adjustTable(): void {
        const content: HTMLElement = this.parent.treeGrid.getContent().querySelector('.e-content').querySelector('.e-virtualtable');
        this.parent.ganttChartModule.virtualRender.wrapper.style.transform = content.style.transform;
    }
}
