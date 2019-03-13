import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class calendarHelper extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    constructor(id:string, wrapperFn:Function) {
        super();
        this.id = id;
        if(wrapperFn!==undefined){
            this.wrapperFn = wrapperFn
        }
        return this;
    }

    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }

    getElement() {
        return this.selector('#' + this.id);
    }

    getMonthHeaderElement(){
        return this.selector('#' + this.id + ' .e-header.e-month');
    }

    getYearHeaderElement(){
        return this.selector('#' + this.id + ' .e-header.e-year');
    }

    getDecadeHeaderElement(){
        return this.selector('#' + this.id + ' .e-header.e-decade');
    }

    getMonthContentElement(){
        return this.selector('#' + this.id + ' .e-content.e-month');
    }

    getTitleElement(){
        return this.selector('#' + this.id + ' .e-day.e-title');
    }

    getNextIconElement(){
        return this.selector('#' + this.id + ' .e-icon-container .e-next');
    }

    getPrevIconElement(){
        return this.selector('#' + this.id + ' .e-icon-container .e-prev');
    }
   
    getWeekHeaderElement(){
        return this.selector('#' + this.id + ' .e-week-header');
    }

    getWeekNumberElement(){
        return this.selector('#' + this.id + ' .e-content.e-month .e-cell.e-week-number');
    }

    getCellElement(){
        return this.selector('#' + this.id + ' .e-cell');
    }

    getOtherMonthCellElement(){
        return this.selector('#' + this.id + ' .e-cell.e-other-month');
    }

    getSelectedCellElement(){
        return this.selector('#' + this.id + ' .e-cell.e-selected');
    }

    getDisabledCellElement(){
        return this.selector('#' + this.id + ' .e-cell.e-disabled.e-overlay');
    }

    getFocusedCellElement(){
        return this.selector('#' + this.id + ' .e-cell.e-focused-date');
    }

    getTodayCellElement(){
        return this.selector('#' + this.id + ' .e-cell.e-today');
    }
    
    getFooterElement(){
        return this.selector('#' + this.id + ' .e-footer-container');
    }

    getTodatButtonElement(){
        return this.selector('#' + this.id + ' .e-footer-container .e-today');
    }
}
    
