import { Column, NotifyArgs, SentinelType } from '@syncfusion/ej2-grids';
import { Offsets, VirtualInfo, ServiceLocator, IGrid, IModelGenerator } from '@syncfusion/ej2-grids';
import { VirtualContentRenderer } from '@syncfusion/ej2-grids';
import { InterSectionObserver } from '@syncfusion/ej2-grids';
import { TreeVirtualRowModelGenerator } from '../renderer/virtual-row-model-generator';
import * as events from '../base/constant';
import { isNullOrUndefined, EventHandler, getValue, setValue } from '@syncfusion/ej2-base';
/**
 * Content renderer for TreeGrid
 */
export class VirtualTreeContentRenderer extends VirtualContentRenderer {
    public getModelGenerator(): IModelGenerator<Column> {
      return new TreeVirtualRowModelGenerator(this.parent);
    }
    constructor(parent: IGrid, locator?: ServiceLocator) {
      super(parent, locator);
      this.addEventListener();
    }

    private isExpandCollapse: boolean = false;
    private observers: TreeInterSectionObserver;
    private translateY: number = 0;
    private maxiPage: number = 0;
    private startIndex: number = -1;
    private endIndex: number = -1;
    private totalRecords: number;
    private contents: HTMLElement;
    public getRowByIndex(index: number) : Element {
      return this.parent.getDataRows().filter((e: HTMLElement) => parseInt(e.getAttribute('aria-rowindex'), 0) === index)[0];
    }
    public addEventListener(): void {
      this.parent.on(events.virtualActionArgs, this.virtualOtherAction, this);
      this.parent.on(events.indexModifier, this.indexModifier, this);
    }
    private virtualOtherAction(args: {setTop: boolean, isExpandCollapse: boolean}): void {
      if (args.setTop) {
        this.translateY = 0;
        this.startIndex = 0;
        this.endIndex = this.parent.pageSettings.pageSize - 1;
      } else if (args.isExpandCollapse) {
        this.isExpandCollapse = true;
      }
    }
    private indexModifier(args: {startIndex: number, endIndex: number}) : void {
      args.startIndex = this.startIndex;
      args.endIndex = this.endIndex;
    }
    public eventListener(action: string): void {
      this.parent[action]('data-ready', this.onDataReady, this);
      //this.parent[action]('refresh-virtual-block', this.refreshContentRows, this);
      let fn: Function = () => {
        this.observers.observes((scrollArgs: ScrollArg) => this.scrollListeners(scrollArgs));
        this.parent.off('content-ready', fn);
      };
      this.parent.on('content-ready', fn, this);
    }
    protected onDataReady (e?: NotifyArgs) : void {
      super.onDataReady(e);
      if (!isNullOrUndefined(e.count)) {
        this.totalRecords = e.count;
        getValue('virtualEle', this).setVirtualHeight(this.parent.getRowHeight() * e.count, '100%');
        let outBuffer: number = 4; // this.parent.pageSettings.pageSize - Math.ceil(this.parent.pageSettings.pageSize / 1.5);
      }
      if (!isNullOrUndefined(e.requestType) && e.requestType.toString() === 'collapseAll') {
        this.contents.scrollTop = 0;
      }
    }
    public renderTable() : void {
      super.renderTable();
      getValue('observer', this).options.debounceEvent = false;
      this.observers = new TreeInterSectionObserver(getValue('observer', this).element, getValue('observer', this).options);
      this.contents = this.getPanel().firstChild as HTMLElement;
    }
    public scrollListeners(scrollArgs: ScrollArg) : void {
      let info: SentinelType = scrollArgs.sentinel;
      let outBuffer: number = 10; //this.parent.pageSettings.pageSize - Math.ceil(this.parent.pageSettings.pageSize / 1.5);
      let content: HTMLElement = this.parent.getContent().querySelector('.e-content');
      let scrollHeight: number = outBuffer * this.parent.getRowHeight();
      let upScroll: boolean = (scrollArgs.offset.top - this.translateY) < 0;
      let downScroll: boolean = (scrollArgs.offset.top - this.translateY) > scrollHeight;
      if (upScroll) {
        let vHeight: number = +(this.parent.height.toString().indexOf('%') < 0 ? this.parent.height :
        this.parent.element.getBoundingClientRect().height);
        let index: number = (~~(content.scrollTop / this.parent.getRowHeight())
          + Math.ceil(vHeight / this.parent.getRowHeight()))
            - this.parent.getRows().length;
        index = (index > 0) ? index : 0;
        this.startIndex = index;
        this.endIndex = index + this.parent.getRows().length;
        if (this.endIndex > this.totalRecords) {
          let lastInx: number = this.totalRecords - 1;
          let remains: number = this.endIndex % lastInx;
          this.endIndex = lastInx;
          this.startIndex = this.startIndex - remains;
        }
        //var firsttdinx = parseInt(this.parent.getContent().querySelector('.e-content td').getAttribute('index'), 0);
        let rowPt: number = Math.ceil(scrollArgs.offset.top / this.parent.getRowHeight());
        rowPt = rowPt % this.parent.pageSettings.pageSize;
        let firsttdinx: number = 0;
        if (!isNullOrUndefined(this.parent.getRows()[rowPt])) {
          let attr: string = this.parent.getContent().querySelectorAll('.e-content tr')[rowPt]
          .querySelector('td').getAttribute('index');
          firsttdinx = +attr; // this.parent.getContent().querySelector('.e-content tr').getAttribute('aria-rowindex');
        }
        if (firsttdinx === 0) {
            this.translateY = scrollArgs.offset.top;
        } else {
          let height: number = this.parent.getRowHeight();
          this.translateY = (scrollArgs.offset.top - (outBuffer * height) > 0) ?
          scrollArgs.offset.top - (outBuffer * height) + 10 : 0;
        }
      } else if (downScroll) {
        let nextSetResIndex: number = ~~(content.scrollTop / this.parent.getRowHeight());
        let lastIndex: number = nextSetResIndex + this.parent.getRows().length;
        if (lastIndex > this.totalRecords) {
          lastIndex = nextSetResIndex +
          (this.totalRecords - nextSetResIndex);
        }
        this.startIndex = lastIndex - this.parent.getRows().length;
        this.endIndex = lastIndex;
        this.translateY = scrollArgs.offset.top;
      }
      if ((downScroll && (scrollArgs.offset.top < (this.parent.getRowHeight() * this.totalRecords)))
          || (upScroll)) {
        let viewInfo: VirtualInfo = getValue('getInfoFromView', this).apply(this, [scrollArgs.direction, info, scrollArgs.offset]);
        this.parent.notify(viewInfo.event, { requestType: 'virtualscroll', focusElement: scrollArgs.focusElement });
      }
    }
    public appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs) : void {
      let info: VirtualInfo = e.virtualInfo.sentinelInfo && e.virtualInfo.sentinelInfo.axis === 'Y' && getValue('currentInfo', this).page &&
      getValue('currentInfo', this).page !== e.virtualInfo.page ? getValue('currentInfo', this) : e.virtualInfo;
      let cBlock: number = (info.columnIndexes[0]) - 1;
      let cOffset: number = this.getColumnOffset(cBlock);
      //this.virtualEle.setWrapperWidth(width, ( Browser.isIE || Browser.info.name === 'edge') as boolean);

      target = this.parent.createElement('tbody');
      target.appendChild(newChild);
      let replace: string = 'replaceWith';
      (this.getTable().querySelector('tbody') as HTMLElement)[replace](target);
      if (!this.isExpandCollapse || this.translateY === 0) {
        getValue('virtualEle', this).adjustTable(cOffset, this.translateY);
      } else {
       this.isExpandCollapse = false;
      }
      setValue('prevInfo', info, this);
    }
  }

  export class TreeInterSectionObserver extends InterSectionObserver {
    private isWheeling: boolean = false;
    private newPos: number = 0;
    private lastPos: number = 0;
    private timer: number = 0;
    public observes(callback: Function): void {
      setValue('containerRect', getValue('options', this).container.getBoundingClientRect(), this);
      EventHandler.add(getValue('options', this).container, 'scroll', this.virtualScrollHandlers(callback), this);
    }
    private clear(): void {
      this.lastPos = null;
    }
    private virtualScrollHandlers(callback: Function) : Function {
      let prevTop: number = 0; let prevLeft: number = 0;
      return (e: Event) => {
        let scrollTop: number = (<HTMLElement>e.target).scrollTop;
        let scrollLeft: number = (<HTMLElement>e.target).scrollLeft;
        let direction: ScrollDirection = prevTop < scrollTop ? 'down' : 'up';
        direction = prevLeft === scrollLeft ? direction : prevLeft < scrollLeft ? 'right' : 'left';
        prevTop = scrollTop; prevLeft = scrollLeft;
        let current: SentinelType = getValue('sentinelInfo', this)[direction];
        let delta: number = 0;
        this.newPos = scrollTop;
        if ( this.lastPos != null ) { // && newPos < maxScroll 
          delta = this.newPos -  this.lastPos;
        }
        this.lastPos = this.newPos;
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(this.clear, 0);
        /*if (this.options.axes.indexOf(current.axis) === -1) {
            return;
        }*/
        /*if(delta > 45 || delta < -45){
          this.isWheeling = true;
        }*/
        if ((delta > 100 || delta < -100) && (e && e.preventDefault)) {
            e.returnValue = false;
            e.preventDefault();
        }
        callback({ direction: direction, isWheel: this.isWheeling,
          sentinel: current, offset: { top: scrollTop, left: scrollLeft },
          focusElement: document.activeElement});
      };
    }
}
type ScrollArg = { direction: string, isWheel: boolean,  sentinel: SentinelType, offset: Offsets, focusElement: HTMLElement };
type ScrollDirection = 'up' | 'down' | 'right' | 'left';