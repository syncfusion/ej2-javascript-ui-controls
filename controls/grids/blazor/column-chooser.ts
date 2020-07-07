import { SfGrid } from './sf-grid-fn';
import { calculateRelativeBasedPosition } from '@syncfusion/ej2-popups';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Column } from './interfaces';

/**
 * The `ColumnChooser` module is used to show or hide columns dynamically.
 */
export class ColumnChooser  {
    private parent: SfGrid;
    private mediaCol: Column[] = [];
    private media: { [key: string]: MediaQueryList } = {};
    private mediaBindInstance: Object = {};
    private mediaColVisibility: { [key: string]: boolean } = {};
    private noOfTimesInvokedByMedia: number = 0;

    constructor(parent: SfGrid) {
        this.parent = parent;
    }

    /** 
     * Get columnChooser Position. 
     * @return {void}  
     * @hidden
     */
    public renderColumnChooser(): void {
        let dlgelement : HTMLElement = this.parent.element.querySelector("#" + this.parent.element.id + "_ccdlg");
        dlgelement.style.maxHeight = '430px';
        let elementVisible: string = dlgelement.style.display;
        dlgelement.style.display = 'block';
        let newpos: { top: number, left: number } = calculateRelativeBasedPosition
            (this.parent.element.querySelector(".e-cc-toolbar"), dlgelement);
        dlgelement.style.display = elementVisible;
        let top = newpos.top + this.parent.element.querySelector(".e-cc-toolbar").getBoundingClientRect().height;
        let dlgWidth: number = 250;
        let left;
        if (this.parent.options.enableRtl) {
            left = (this.parent.element.querySelector(".e-columnchooser-btn") as HTMLElement).offsetLeft;
        } else {
            left = ((newpos.left - dlgWidth) + this.parent.element.querySelector(".e-cc-toolbar").clientWidth) + 2;
        }
        this.parent.dotNetRef.invokeMethodAsync("GetChooserPosition", left.toString(), top.toString());
    }



    public setMediaColumns(): void {
        let gcol: Column[] = this.parent.getColumns();
        if (!isNullOrUndefined(gcol)) {
            for (let index: number = 0; index < gcol.length; index++) {
                if (gcol[index].hideAtMedia !== '' && (isNullOrUndefined(gcol[index].visible) || gcol[index].visible)) {
                    this.pushMediaColumn(gcol[index], index);
                }
            }
            this.parent.dotNetRef.invokeMethodAsync('SetMediaColumnVisibility', {
                mediaColVisibility: this.mediaColVisibility
            });
            this.mediaColVisibility = {};
        }
    }

    private pushMediaColumn(col: Column, index: number): void {
        this.mediaCol.push(col);
        this.media[col.uid] = window.matchMedia(col.hideAtMedia);
        this.mediaQueryUpdate(index, this.media[col.uid], true);
        this.mediaBindInstance[index] = this.mediaQueryUpdate.bind(this, index);
        this.media[col.uid].addListener(this.mediaBindInstance[index] as null);
    }

    private mediaQueryUpdate(columnIndex: number, e: MediaQueryList, invokedManually?: boolean) {
        let col: Column = this.parent.getColumns()[columnIndex];
        if (this.mediaCol.some((mediaColumn: Column) => mediaColumn.uid === col.uid)) {
            this.mediaColVisibility[col.uid] = e.matches;
            if (!invokedManually) {
                this.noOfTimesInvokedByMedia++;
                if (this.noOfTimesInvokedByMedia == this.mediaCol.length) {
                    this.parent.dotNetRef.invokeMethodAsync('SetMediaColumnVisibility', {
                        mediaColVisibility: this.mediaColVisibility,
                        invokedByMedia: true
                    });
                    this.noOfTimesInvokedByMedia = 0;
                    this.mediaColVisibility = {};
                }
            }
        }
    }


    public updateMediaColumns(mediaColumnsUid: { [uid: string]: boolean }): void {
        let keys: string[] = Object.keys(mediaColumnsUid);
        for (let i: number = 0; i < keys.length; i++) {
            let idxToSplice: number = -1;
            if (this.mediaCol.some((mCol) => {
                idxToSplice++;
                return mCol.uid === keys[i];
            })) {
                this.mediaCol.splice(idxToSplice, 1);
            } else {
                this.pushMediaColumn(this.parent.getColumnByUid(keys[i]), this.parent.getColumnIndexByUid(keys[i]));
            }
        }
    }

    public removeMediaListener(): void {
        for (let i: number = 0; i < this.mediaCol.length; i++) {
            this.media[this.mediaCol[i].uid].removeListener(this.mediaBindInstance[this.mediaCol[i].index] as null);
        }
    }



}