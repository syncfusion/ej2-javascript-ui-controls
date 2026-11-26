import { IGrid, EJ2Intance, IFilterMUI, IFilterCreate, IFilterWrite, IDateRangePreset, IDateRangeFilter } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { DatePicker, DateTimePicker, DatePickerModel, DateTimePickerModel, MaskedDateTime, DateRangePicker } from '@syncfusion/ej2-calendars';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import {getCustomDateFormat, getFilterDlgElement} from '../base/util';
import * as events from '../base/constant';
import * as literals from '../base/string-literals';

/**
 * `datefilterui` render date column.
 *
 * @hidden
 */

export class DateFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected locator: ServiceLocator;
    private inputElem: HTMLElement;
    private value: string;
    private datePickerObj: DatePicker;
    private fltrSettings: FilterSettings;
    private dialogObj: Dialog;
    private dlgElement: Element;
    private dpOpen: Function = this.openPopup.bind(this);
    private rangePickerObj: DateRangePicker;
    private rangeWrapper: HTMLElement;
    private optrChange: Function = this.onOperatorChange.bind(this);
    private optrObj: { dropOptr?: { value?: string | number | boolean, addEventListener?: Function, removeEventListener?: Function } };
    private col: Column;
    private localeText: { getConstant: Function };
    /** @hidden */
    public rangeInvalid: boolean = false;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.locator = serviceLocator;
        this.fltrSettings = filterSettings;
        if (this.parent) {
            this.parent.on(events.filterMenuClose, this.destroy, this);
            this.parent.on(events.destroy, this.destroy, this);
        }
    }

    public injectMaskedDateTime(type: string): void {
        if (type === 'date' || type === 'dateonly') {
            DatePicker.Inject(MaskedDateTime);
        }
        else if (type === 'datetime') {
            DateTimePicker.Inject(MaskedDateTime);
        }
    }

    public create(args: IFilterCreate): void {
        const format: string = getCustomDateFormat(args.column.format, args.column.type);
        this.dialogObj = args.dialogObj;
        this.dlgElement = getFilterDlgElement(args.dialogObj, args.target);
        this.inputElem = this.parent.createElement('input', { className: 'e-flmenu-input', id: 'dateui-' + args.column.uid });
        args.target.appendChild(this.inputElem);
        if (args.column.filter && args.column.filter.params &&
            (args.column.filter.params as DatePickerModel | DateTimePickerModel).enableMask) {
            this.injectMaskedDateTime(args.column.type);
        }
        if (args.column.type === 'date' || args.column.type === 'dateonly') {
            this.datePickerObj = new DatePicker(extend(
                {
                    format: format,
                    cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
                    placeholder: args.localizeText.getConstant('ChooseDate'),
                    width: '100%',
                    locale: this.parent.locale,
                    enableRtl: this.parent.enableRtl
                },
                args.column.filter.params
            ));
        } else if (args.column.type === 'datetime') {
            this.datePickerObj = new DateTimePicker(extend(
                {
                    format: format,
                    cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
                    placeholder: args.localizeText.getConstant('ChooseDate'),
                    width: '100%',
                    locale: this.parent.locale,
                    enableRtl: this.parent.enableRtl
                },
                args.column.filter.params)
            );
        }
        this.datePickerObj.addEventListener(literals['open'], this.dpOpen);
        this.datePickerObj.appendTo(this.inputElem);
        this.col = args.column as Column;
        this.localeText = args.localizeText;
        this.optrObj = args.getOptrInstance as { dropOptr?: { value?: string, addEventListener?: Function } };
        if (this.optrObj && this.optrObj.dropOptr) {
            this.optrObj.dropOptr.addEventListener('change', this.optrChange);
        }
    }

    private onOperatorChange(): void {
        const isBetween: boolean = this.optrObj.dropOptr.value === 'between';
        if (isBetween && !this.rangePickerObj) {
            this.showRange(this.datePickerObj.value);
        } else if (!isBetween && this.rangePickerObj) {
            const startDate: Date = this.rangePickerObj.startDate;
            this.hideRange();
            this.datePickerObj.value = startDate;
        }
    }

    private showRange(start: Date, end?: Date): void {
        const column: Column = this.col;
        const format: string = getCustomDateFormat(column.format, column.type);
        const singlePickerWrapper: HTMLElement = this.datePickerObj.element.parentElement;
        singlePickerWrapper.style.display = 'none';
        this.rangeWrapper = this.parent.createElement('div', { className: 'e-flmenu-range' });
        const rangeInput: HTMLElement = this.parent.createElement('input', {
            className: 'e-flmenu-input e-flmenu-range-input', id: 'daterangeui-' + column.uid
        });
        this.rangeWrapper.appendChild(rangeInput);
        singlePickerWrapper.parentElement.insertBefore(this.rangeWrapper, singlePickerWrapper.nextSibling);
        this.rangePickerObj = new DateRangePicker(extend({
            format: format,
            cssClass: this.parent.cssClass ? 'e-popup-flmenu' + ' ' + this.parent.cssClass : 'e-popup-flmenu',
            placeholder: this.localeText.getConstant('ChooseDate'),
            width: '100%',
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            startDate: start || null,
            endDate: end || null
        }, column.filter.params, this.getPresetOptions(column)));
        this.rangePickerObj.addEventListener(literals['open'], this.dpOpen);
        this.rangePickerObj.appendTo(rangeInput);
        rangeInput.setAttribute('aria-label', this.localeText.getConstant('BetweenFromAria') + ', ' +
            this.localeText.getConstant('BetweenToAria'));
    }

    private getPresetOptions(column: Column): { presets?: IDateRangePreset[] } {
        const dateRanges: IDateRangeFilter = column.filter.dateRanges;
        if (!dateRanges || !dateRanges.enablePresets) {
            return {};
        }
        const presetMode: string = dateRanges.presetMode === 'Custom' || dateRanges.presetMode === 'Both' ?
            dateRanges.presetMode : 'Default';
        const customPresets: IDateRangePreset[] = presetMode !== 'Default' && Array.isArray(dateRanges.customPresetRanges) ?
            this.validatePresets(dateRanges.customPresetRanges) : [];
        const presets: IDateRangePreset[] = presetMode === 'Custom' ? customPresets :
            this.getDefaultPresets().concat(presetMode === 'Both' ? customPresets : []);
        return presets.length ? { presets: presets } : {};
    }

    private validatePresets(presets: IDateRangePreset[]): IDateRangePreset[] {
        const validPresets: IDateRangePreset[] = [];
        const isValidDate: Function = (date: Date): boolean => date instanceof Date && !isNaN(date.getTime());
        for (const preset of presets) {
            if (preset && typeof preset.label === 'string' && preset.label.trim() !== '' && isValidDate(preset.start) &&
                isValidDate(preset.end) && preset.start.getTime() <= preset.end.getTime()) {
                validPresets.push(preset);
            }
        }
        return validPresets;
    }

    private getDefaultPresets(): IDateRangePreset[] {
        const today: Date = new Date();
        const year: number = today.getFullYear();
        const month: number = today.getMonth();
        const pickerParams: { firstDayOfWeek?: number } = <{ firstDayOfWeek?: number }>this.col.filter.params;
        const firstDayOfWeek: number = pickerParams && typeof pickerParams.firstDayOfWeek === 'number' ?
            pickerParams.firstDayOfWeek : 0;
        const weekStart: Date = new Date(year, month, today.getDate() - ((today.getDay() - firstDayOfWeek + 7) % 7));
        const weekStartDay: number = weekStart.getDate();
        const getLabel: (key: string) => string = (key: string): string => this.localeText.getConstant(key);
        return [
            { label: getLabel('PresetThisWeek'), start: weekStart, end: new Date(year, weekStart.getMonth(), weekStartDay + 6) },
            { label: getLabel('PresetThisMonth'), start: new Date(year, month, 1), end: new Date(year, month + 1, 0) },
            { label: getLabel('PresetThisYear'), start: new Date(year, 0, 1), end: new Date(year, 11, 31) },
            { label: getLabel('PresetLastWeek'), start: new Date(year, weekStart.getMonth(), weekStartDay - 7),
                end: new Date(year, weekStart.getMonth(), weekStartDay - 1) },
            { label: getLabel('PresetLastMonth'), start: new Date(year, month - 1, 1), end: new Date(year, month, 0) },
            { label: getLabel('PresetLast3Months'), start: new Date(year, month - 3, 1), end: new Date(year, month, 0) },
            { label: getLabel('PresetLast6Months'), start: new Date(year, month - 6, 1), end: new Date(year, month, 0) },
            { label: getLabel('PresetLastYear'), start: new Date(year - 1, 0, 1), end: new Date(year - 1, 11, 31) }
        ];
    }

    private hideRange(): void {
        if (this.rangePickerObj && !this.rangePickerObj.isDestroyed) {
            this.rangePickerObj.removeEventListener(literals['open'], this.dpOpen);
            this.rangePickerObj.destroy();
        }
        this.rangePickerObj = null;
        if (this.rangeWrapper && this.rangeWrapper.parentElement) {
            this.rangeWrapper.parentElement.removeChild(this.rangeWrapper);
        }
        this.rangeWrapper = null;
        this.rangeInvalid = false;
        this.datePickerObj.element.parentElement.style.display = '';
    }

    public write(args: IFilterWrite): void {
        const dateuiObj: DatePicker | DateTimePicker = this.datePickerObj ||
            (<EJ2Intance>document.querySelector('#dateui-' + args.column.uid)).ej2_instances[0];
        const rangeValue: Date[] = args.filteredValue as Object as Date[];
        if (Array.isArray(rangeValue) && rangeValue.length === 2) {
            if (!this.rangePickerObj) {
                this.optrObj.dropOptr.value = 'between';
                this.showRange(new Date(rangeValue[0]), new Date(rangeValue[1]));
            }
            return;
        }
        dateuiObj.value = !isNullOrUndefined(args.filteredValue) ? new Date(args.filteredValue as string) as Date : null as Date;
    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        if (this.rangePickerObj && filterOptr === 'between') {
            const startDate: Date = this.rangePickerObj.startDate;
            const endDate: Date = this.rangePickerObj.endDate;
            this.rangeInvalid = isNullOrUndefined(startDate) || isNullOrUndefined(endDate);
            this.rangePickerObj.element.setAttribute('aria-invalid', this.rangeInvalid ? 'true' : 'false');
            this.rangePickerObj.element.parentElement.classList.toggle('e-error', this.rangeInvalid);
            if (!this.rangeInvalid) {
                filterObj.filterByColumn(column.field, 'between', [new Date(startDate.getTime()), new Date(endDate.getTime())], 'and', true);
            }
            return;
        }
        const dateuiObj: DatePicker | DateTimePicker = this.datePickerObj ||
            (<EJ2Intance>document.querySelector('#dateui-' + column.uid)).ej2_instances[0];
        let filterValue: Date = dateuiObj.value;
        filterValue = isNullOrUndefined(filterValue) ? null : filterValue;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', true);
    }

    private openPopup(args: { popup: Popup }): void {
        args.popup.element.style.zIndex = ((this.dialogObj ? this.dialogObj.zIndex : 1000) + 1).toString();
        // Add e-popup-flmenu class so the popup is recognized as part of the filter menu
        // and is not treated as an outside click that would close the dialog
        if (!args.popup.element.classList.contains('e-popup-flmenu')) {
            args.popup.element.classList.add('e-popup-flmenu');
        }
        // Add e-date-overflow class so the filter.ts click handler recognizes it as a date picker
        // popup and doesn't close the dialog when the APPLY button is clicked
        if (!args.popup.element.classList.contains('e-date-overflow')) {
            args.popup.element.classList.add('e-date-overflow');
        }
    }

    public destroy(args?: { element?: Element }): void {
        if (args && args.element && this.dlgElement && args.element !== this.dlgElement) { return; }
        this.parent.off(events.filterMenuClose, this.destroy);
        this.parent.off(events.destroy, this.destroy);
        if (this.optrObj && this.optrObj.dropOptr && this.optrObj.dropOptr.removeEventListener) {
            try { this.optrObj.dropOptr.removeEventListener('change', this.optrChange); } catch (e) { /* operator list already destroyed */ }
        }
        if (this.rangePickerObj && !this.rangePickerObj.isDestroyed) {
            this.rangePickerObj.removeEventListener(literals['open'], this.dpOpen);
            this.rangePickerObj.destroy();
            this.rangePickerObj = null;
        }
        if (isNullOrUndefined(this.datePickerObj) || this.datePickerObj.isDestroyed) { return; }
        this.datePickerObj.removeEventListener(literals['open'], this.dpOpen);
        this.datePickerObj.destroy();
    }
}
