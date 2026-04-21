import {createElement } from '@syncfusion/ej2-base';
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
        this.wrapper = createElement('div', { className: 'e-virtualtable', styles: 'position: absolute; transform: translate3d(0px, 0px, 0px) translateZ(0);' });
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
        if (this.parent.enableTimelineVirtualization) {
            const virtualTable: string = (document.getElementsByClassName('e-virtualtable')[1] as HTMLElement).style.transform;
            const treegridVirtualHeight: string = (this.parent.treeGrid.element.getElementsByClassName('e-virtualtable')[0] as HTMLElement).style.transform;
            let translateXValue: string;
            // eslint-disable-next-line no-useless-escape
            const transformRegex: RegExp = /translate(?:3d)?\(([^\)]+)\)/;
            if (virtualTable !== '') {
                translateXValue = virtualTable.match(/translate.*\((.+)\)/)[1].split(', ')[0];
            }
            else {
                const chartTransform: string = (this.parent.ganttChartModule.scrollElement.getElementsByClassName('e-virtualtable')[0] as HTMLElement).style.transform;
                const match: RegExpMatchArray = chartTransform.match(transformRegex);
                translateXValue = match[1].split(',')[0].trim();
            }
            const match: RegExpMatchArray = treegridVirtualHeight.match(transformRegex);
            const parts: string[] = match[1].split(',');
            const translateYValue: string = this.parent['getTranslateY'](parts);
            this.parent.ganttChartModule.virtualRender.wrapper.style.transform = `translate3d(${translateXValue}, ${translateYValue}, 0px) translateZ(0)`;
        }
        else {
            this.parent.ganttChartModule.virtualRender.wrapper.style.transform = content.style.transform;
        }
    }
}
