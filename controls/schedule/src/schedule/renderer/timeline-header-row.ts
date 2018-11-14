import { compile } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { MS_PER_DAY, getWeekNumber } from '../base/util';
import { TdData, CellTemplateArgs } from '../base/interface';
import { HeaderRowsModel } from '../models/header-rows-model';

/**
 * timeline header
 */
export class TimelineHeaderRow {
    public parent: Schedule;
    public renderDates: Date[];

    constructor(parent: Schedule, renderDates: Date[]) {
        this.parent = parent;
        this.renderDates = renderDates;
    }

    private groupByYear(dates: Date[]): { [key: number]: Date[] } {
        let result: { [key: number]: Date[] } = {};
        for (let d of dates) {
            let key: number = d.getFullYear();
            result[key] = result[key] || [];
            result[key].push(d);
        }
        return result;
    }

    private groupByMonth(dates: Date[]): { [key: number]: Date[] } {
        let result: { [key: number]: Date[] } = {};
        for (let d of dates) {
            let key: number = (d.getFullYear() - 1970) * 12 + d.getMonth();
            result[key] = result[key] || [];
            result[key].push(d);
        }
        return result;
    }

    private groupByWeek(dates: Date[]): { [key: number]: Date[] } {
        let result: { [key: number]: Date[] } = {};
        for (let d of dates) {
            let jsDate: number = +new Date(1970, 0, 1);
            let key: number = Math.ceil(((((+d - jsDate)) / MS_PER_DAY) + new Date(jsDate).getDay() + 1) / 7);
            result[key] = result[key] || [];
            result[key].push(d);
        }
        return result;
    }

    private generateSlots(data: { [key: string]: Date[] }, colspan: number, template: string, tempFn: Function, cls: string, type: string)
        : TdData[] {
        let tdDatas: TdData[] = [];
        let customHelper: Object = {
            getYear: (dt: Date) => {
                return this.parent.globalize.formatDate(dt, { format: 'y' });
            },
            getMonth: (dt: Date) => {
                return this.parent.globalize.formatDate(dt, { format: 'MMMM' });
            },
            getWeekNumber: (dt: Date) => {
                return getWeekNumber(dt);
            }
        };
        let keys: string[] = Object.keys(data);
        for (let i: number = 0; i < keys.length; i++) {
            let dates: Date[] = data[keys[i]];
            let htmlCol: NodeList;
            if (!tempFn) {
                htmlCol = compile(template, customHelper)({ date: dates[0] });
            } else {
                let args: CellTemplateArgs = { date: dates[0], type: type };
                htmlCol = tempFn(args);
            }
            tdDatas.push({
                date: dates[0], type: type, className: [cls], colSpan: dates.length * colspan, template: htmlCol
            });
        }
        return tdDatas;
    }

    public generateColumnLevels(dateSlots: TdData[], hourSlots: TdData[]): TdData[][] {
        let levels: TdData[][] = [];
        let rows: HeaderRowsModel[] = this.parent.activeViewOptions.headerRows;
        let lastLevelColspan: number = 1;
        if (rows[rows.length - 1].option === 'Hour' && hourSlots.length > 0) {
            lastLevelColspan = hourSlots.length / dateSlots.length;
        }
        let tdDatas: TdData[] = [];
        let templateFn: Function;
        for (let row of rows) {
            switch (row.option) {
                case 'Year':
                    templateFn = row.template ? this.parent.templateParser(row.template) : undefined;
                    let yearTemplate: string = '<span class="e-header-year">${getYear(date)}</span>';
                    let byYear: { [key: number]: Date[] } = this.groupByYear(this.renderDates);
                    tdDatas = this.generateSlots(byYear, lastLevelColspan, yearTemplate, templateFn, 'e-header-year-cell', 'yearHeader');
                    levels.push(tdDatas);
                    break;
                case 'Month':
                    templateFn = row.template ? this.parent.templateParser(row.template) : undefined;
                    let monthTemp: string = '<span class="e-header-month">${getMonth(date)}</span>';
                    let byMonth: { [key: number]: Date[] } = this.groupByMonth(this.renderDates);
                    tdDatas = this.generateSlots(byMonth, lastLevelColspan, monthTemp, templateFn, 'e-header-month-cell', 'monthHeader');
                    levels.push(tdDatas);
                    break;
                case 'Week':
                    templateFn = row.template ? this.parent.templateParser(row.template) : undefined;
                    let weekTemplate: string = '<span class="e-header-week">${getWeekNumber(date)}</span>';
                    let byWeek: { [key: number]: Date[] } = this.groupByWeek(this.renderDates);
                    tdDatas = this.generateSlots(byWeek, lastLevelColspan, weekTemplate, templateFn, 'e-header-week-cell', 'weekHeader');
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