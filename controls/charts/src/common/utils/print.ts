import { print as printWindow, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../chart/chart';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { getElement } from '../utils/helper';
import { IPrintEventArgs } from '../../chart/model/chart-interface';
import { beforePrint} from '../model/constants';
import { RangeNavigator } from '../../range-navigator/range-navigator';
import { StockChart } from '../../stock-chart/stock-chart';
import { BulletChart } from '../../bullet-chart/bullet-chart';
import { Chart3D } from '../../chart3d/chart3D';


export class PrintUtils {
    private control: Chart | AccumulationChart | RangeNavigator | StockChart | BulletChart | Chart3D;
    private printWindow: Window;

    /**
     * Constructor for chart and accumulation annotation
     *
     * @param control
     */

    constructor(control: Chart | AccumulationChart | RangeNavigator | StockChart | BulletChart | Chart3D) {
        this.control = control;
    }

    /**
     * To print the accumulation and chart elements.
     *
     * @param elements
     */

    public print(elements?: string[] | string | Element): void {
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        const argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(elements), name: beforePrint
        };
        this.control.trigger(beforePrint, argsData);
        if (!argsData.cancel) {
            printWindow(argsData.htmlContent, this.printWindow);
        }
    }

    /**
     * To get the html string of the chart and accumulation
     *
     * @param elements
     * @private
     */

    public getHTMLContent(elements?: string[] | string | Element): Element {
        const div: Element = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                for (let j: number = 0; j < elements.length; j++) {
                    const value: string = elements[j as number];
                    div.appendChild(getElement(value).cloneNode(true) as Element);
                }
            } else if (elements instanceof Element) {
                div.appendChild(elements.cloneNode(true) as Element);
            } else {
                div.appendChild(getElement(elements).cloneNode(true) as Element);
            }
        } else {
            div.appendChild(this.control.element.cloneNode(true) as Element);
        }
        for (let index: number = 0; index < div.children.length; index++) {
            let backgroundColor: string = (this.control.theme.indexOf('Dark') > -1 || this.control.theme === 'HighContrast') ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
            let svg: Element = div.children[index as number];
            for (let childIndex: number = 0; childIndex < svg.children.length; childIndex++) {
                let actualBackgroundColor: string;
                let isSVG: boolean = false;
                if (svg.id.indexOf('_stockChart_svg') > -1) {
                    actualBackgroundColor = svg.children[0].getAttribute('fill');
                    isSVG = true;
                }
                else if (svg.children[childIndex as number].id.indexOf('_svg') > -1) {
                    actualBackgroundColor = svg.children[childIndex as number].children[0].getAttribute('fill');
                    isSVG = true;
                }
                if (isSVG) {
                    actualBackgroundColor = actualBackgroundColor === 'transparent' ? backgroundColor : actualBackgroundColor;
                    svg.children[childIndex as number].children[0].setAttribute('fill', actualBackgroundColor);
                }
            }
            div[index as number] = svg;
        }
        return div;
    }
}