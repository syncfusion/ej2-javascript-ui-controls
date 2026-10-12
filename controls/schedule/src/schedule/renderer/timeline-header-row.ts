import { createElement } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { MS_PER_DAY, capitalizeFirstWord } from '../base/util';
import { TdData, CellTemplateArgs, CallbackFunction } from '../base/interface';
import { HeaderRowsModel } from '../models/header-rows-model';

/**
 * timeline header rows
 */
export class TimelineHeaderRow {
    public parent: Schedule;
    public renderDates: Date[];

    constructor(parent: Schedule, renderDates: Date[]) {
        this.parent = parent;
        this.renderDates = renderDates;
    }

    private groupByYear(dates: Date[]): { [key: number]: Date[] } {
        const result: { [key: number]: Date[] } = {};
        for (const d of dates) {
            const key: number = d.getFullYear();
            result[parseInt(key.toString(), 10)] = result[parseInt(key.toString(), 10)] || [];
            result[parseInt(key.toString(), 10)].push(d);
        }
        return result;
    }

    private groupByMonth(dates: Date[]): { [key: number]: Date[] } {
        const result: { [key: number]: Date[] } = {};
        for (const d of dates) {
            const key: number = (d.getFullYear() - 1970) * 12 + d.getMonth();
            result[parseInt(key.toString(), 10)] = result[parseInt(key.toString(), 10)] || [];
            result[parseInt(key.toString(), 10)].push(d);
        }
        return result;
    }

    private groupByWeek(dates: Date[]): { [key: number]: Date[] } {
        const result: { [key: number]: Date[] } = {};
        for (const d of dates) {
            const jsDate: number = +new Date(1970, 0, 1);
            const tzOffsetDiff: number = d.getTimezoneOffset() - new Date(1970, 0, 1).getTimezoneOffset();
            let key: number = Math.ceil(((((+d - jsDate) - (tzOffsetDiff * 60 * 1000)) / MS_PER_DAY) + new Date(jsDate).getDay() + 1) / 7);
            if (this.parent.activeViewOptions.firstDayOfWeek && this.parent.activeViewOptions.firstDayOfWeek > new Date(+d).getDay()) {
                key = key - 1;
            }
            result[parseInt(key.toString(), 10)] = result[parseInt(key.toString(), 10)] || [];
            result[parseInt(key.toString(), 10)].push(d);
        }
        return result;
    }

    private generateSlots(data: { [key: string]: Date[] }, colspan: number, row: HeaderRowsModel, cls: string, type: string): TdData[] {
        const dateParser: CallbackFunction = (date: Date, format: string): string =>
            this.parent.globalize.formatDate(date, { format: format, calendar: this.parent.getCalendarMode() });
        const tdDatas: TdData[] = [];
        const keys: string[] = Object.keys(data);
        for (let i: number = 0; i < keys.length; i++) {
            const dates: Date[] = data[keys[parseInt(i.toString(), 10)]];
            let htmlCol: HTMLElement[];
            if (row.template) {
                const args: CellTemplateArgs = { date: dates[0], type: type };
                const templateId: string = this.parent.element.id + '_headerRowTemplate';
                htmlCol = [].slice.call(this.parent.templateParser(row.template)(args, this.parent, 'template', templateId, false));
            } else {
                let viewTemplate: string;
                switch (row.option) {
                case 'Year':
                    viewTemplate = `<span class="e-header-year">${dateParser(dates[0], 'y')}</span>`;
                    break;
                case 'Month':
                    viewTemplate = `<span class="e-header-month">${capitalizeFirstWord(dateParser(dates[0], 'MMMM'), 'single')}</span>`;
                    break;
                case 'Week':
                    viewTemplate = `<span class="e-header-week">${this.parent.getWeekNumberContent(dates)}</span>`;
                }
                const headerWrapper: HTMLElement = createElement('div', { innerHTML: viewTemplate });
                htmlCol = [].slice.call(headerWrapper.childNodes);
            }
            tdDatas.push({ date: dates[0], type: type, className: [cls], colSpan: dates.length * colspan, template: htmlCol });
        }
        return tdDatas;
    }

    public generateColumnLevels(dateSlots: TdData[], hourSlots: TdData[]): TdData[][] {
        const levels: TdData[][] = [];
        const rows: HeaderRowsModel[] = this.parent.activeViewOptions.headerRows;
        let lastLevelColspan: number = 1;
        if (rows[rows.length - 1].option === 'Hour' && hourSlots.length > 0) {
            lastLevelColspan = hourSlots.length / dateSlots.length;
        }
        let tdDatas: TdData[] = [];
        let byYear: Record<number, Date[]>;
        let byMonth: Record<number, Date[]>;
        let byWeek: Record<number, Date[]>;
        for (const row of rows) {
            switch (row.option) {
            case 'Year':
                byYear = this.groupByYear(this.renderDates);
                tdDatas = this.generateSlots(byYear, lastLevelColspan, row, 'e-header-year-cell', 'yearHeader');
                levels.push(tdDatas);
                break;
            case 'Month':
                byMonth = this.groupByMonth(this.renderDates);
                tdDatas = this.generateSlots(byMonth, lastLevelColspan, row, 'e-header-month-cell', 'monthHeader');
                levels.push(tdDatas);
                break;
            case 'Week':
                byWeek = this.groupByWeek(this.renderDates);
                tdDatas = this.generateSlots(byWeek, lastLevelColspan, row, 'e-header-week-cell', 'weekHeader');
                levels.push(tdDatas);
                break;
            case 'Date':
                tdDatas = dateSlots;
                tdDatas = tdDatas.map((value: TdData) => {
                    value.colSpan = lastLevelColspan;
                    return value;
                });
                levels.push(tdDatas);
                break;
            case 'Hour':
                if (hourSlots.length > 0) {
                    levels.push(hourSlots);
                }
                break;
            }
        }
        return levels;
    }

}
