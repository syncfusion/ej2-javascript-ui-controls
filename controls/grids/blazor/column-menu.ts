import { SfGrid } from './sf-grid-fn';
import { calculatePosition } from '@syncfusion/ej2-popups';
import { closest, Browser, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * The `ColumnMenu` module is used to show or hide columns dynamically.
 */
export class ColumnMenu  {
    private parent: SfGrid;
    private key : string = null;
    private uid : string = null;

    constructor(parent: SfGrid) {
        this.parent = parent;
    }

    /** 
     * Get columnMenu Position. 
     * @return {void}  
     * @hidden
     */
    public renderColumnMenu(uid : string, isFilter: boolean, key: string): object {
        this.key = key;
        this.uid = uid;
        let e: HTMLElement = this.parent.getColumnHeaderByUid(uid).querySelector('.e-columnmenu');
        let columnMenuElement: Element = document.getElementsByClassName(`e-${this.parent.element.id}-column-menu`)[0];
        let element: HTMLElement = columnMenuElement.getElementsByTagName('ul')[0];
        if(!isNullOrUndefined(element)) {
        let pos:  {left: number; top: number;}= { top: 0, left: 0 };
        element.style.visibility = 'hidden';
        (columnMenuElement as HTMLElement).style.display = 'block';
        let elePos: ClientRect = element.getBoundingClientRect();
        element.classList.add('e-transparent');
        element.style.visibility = '';
        (columnMenuElement as HTMLElement).style.display = '';
        let headerCell: Element = this.getHeaderCell(e);
        if (Browser.isDevice) {
            pos.top = ((window.innerHeight / 2) - (elePos.height / 2));
            pos.left = ((window.innerWidth / 2) - (elePos.width / 2));
        }
        else {
            if (this.parent.options.enableRtl) {
                pos = calculatePosition(headerCell, 'left', 'bottom');
            }
            else {
                pos = calculatePosition(headerCell, 'right', 'bottom');
                pos.left -= elePos.width;
            }
        }
        if (isFilter) {
            EventHandler.add(element, 'mouseover', this.appendFilter, this);
        }
        return { Left: Math.ceil(pos.left), Top: Math.ceil(pos.top)};
      } else {
        return { Left: 1, Top: 1 };
      }
    };

    private appendFilter(e : Event): void {
        var showdialog = false;
        setTimeout(() => {
        if ((closest(e.target as Element, '#' + this.key)) && (this.parent.element.querySelector('.e-filter-popup') || !this.parent.element.querySelector('.e-filter-popup')) 
        || (e.target as Element).parentElement.id == this.key && (this.parent.element.querySelector('.e-filter-popup') || !this.parent.element.querySelector('.e-filter-popup'))) {
            showdialog = true;
        }
        else if (!closest(e.target as Element, '#' + this.key) && this.parent.element.querySelector('.e-filter-popup')) {
            showdialog = false;
        }
        this.parent.dotNetRef.invokeMethodAsync("FilterMouseOverHandler", this.uid, showdialog);
     },10)
    }

    public getHeaderCell(e : Element): Element {
        return closest(e, 'th.e-headercell');
    }
}