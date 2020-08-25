import { SfGrid } from './sf-grid-fn';
import { parentsUntil } from './util';
import { isNullOrUndefined, EventHandler, MouseEventArgs, closest, Browser } from '@syncfusion/ej2-base';
import { calculateRelativeBasedPosition } from '@syncfusion/ej2-popups';

/**
 * The `Filter` module is used to set the Filter Dialog position dynamically.
 */

export class Filter {
    private parent: SfGrid;

    constructor(parent: SfGrid) {
        this.parent = parent;
    }

    /** 
     * Get Filter Popup Position. 
     * @return {void}  
     * @hidden
     */
    public filterPopupRender(dlgID: string, ColUid: string, type: string, isColumnMenu: boolean): void {
        let dlgelement: HTMLElement = this.parent.element.querySelector("#" + dlgID);
        if (!isNullOrUndefined(dlgelement)) {
            if (isColumnMenu) {
                EventHandler.add(dlgelement,'mousedown', this.mouseDownHandler, this);
                dlgelement.style.maxHeight = type == 'excel' ? '800px' : '350px';
                let element: Element = document.getElementsByClassName(`e-${this.parent.element.id}-column-menu`)[0].getElementsByTagName('ul')[0];
                let li: Element = element.querySelector('.' + 'e-icon-filter').parentElement;
                let ul: HTMLElement = this.parent.element.querySelector('.' + 'e-filter-popup');
                let gridPos: ClientRect = this.parent.element.getBoundingClientRect();
                let liPos: ClientRect = li.getBoundingClientRect();
                let left: number = liPos.left - gridPos.left;
                let top: number = liPos.top - gridPos.top;
                let elementVisible: string = dlgelement.style.display;
                dlgelement.style.display = 'block';
                if (gridPos.height < top) {
                    top = top - ul.offsetHeight + liPos.height;
                }
                else if (gridPos.height < top + ul.offsetHeight) {
                    top = gridPos.height - ul.offsetHeight;
                }
                if (window.innerHeight < ul.offsetHeight + top + gridPos.top) {
                    top = window.innerHeight - ul.offsetHeight - gridPos.top;
                }
                left += (this.parent.options.enableRtl ? -ul.offsetWidth : liPos.width);
                if (gridPos.width <= left + ul.offsetWidth) {
                    left -= liPos.width + ul.offsetWidth;
                }
                else if (left < 0) {
                    left += ul.offsetWidth + liPos.width;
                }
                dlgelement.style.display = elementVisible;
                this.parent.dotNetRef.invokeMethodAsync("GetFilterIconPosition", left.toString(), top.toString());
            } else {
                let FilterElement: HTMLElement[] = [].slice.call(this.parent.element.querySelector('.e-headercontent').querySelectorAll('div[e-mappinguid=' + ColUid + ']'));
                let targetElement: HTMLElement = FilterElement[1];
                dlgelement.style.maxHeight = type == 'excel' ? '800px' : '350px';
                let elementVisible: string = dlgelement.style.display;
                dlgelement.style.display = 'block';
                let newpos: { top: number, left: number } = calculateRelativeBasedPosition
                    (targetElement, dlgelement);
                dlgelement.style.display = elementVisible;
                let dlgWidth: number = 250;
                let left = newpos.left - dlgWidth + targetElement.clientWidth;
                let top = newpos.top + targetElement.getBoundingClientRect().height - 5;
                if (left < 1)
                    left = dlgWidth + left - 16;
                else
                    left = left - 4;
                this.parent.dotNetRef.invokeMethodAsync("GetFilterIconPosition", left.toString(), top.toString());
            }
        }
    }
    public mouseDownHandler(args: MouseEventArgs): void {
        if ((args && closest(args.target as Element, '.e-filter-popup')
        || (args.currentTarget && (args.currentTarget as Document).activeElement &&
            parentsUntil((args.currentTarget as Document).activeElement as Element, 'e-filter-popup'))
        || parentsUntil(args.target as Element, 'e-popup') ||
        (parentsUntil(args.target as Element, 'e-popup-wrapper'))) && !Browser.isDevice) {
            this.parent.dotNetRef.invokeMethodAsync("PreventColumnMenuClose", true);
        }
    }
}

