import { HijriParser, L10n, createElement } from '@syncfusion/ej2-base';
import {
    TextBox,
    NumericTextBox,
    ColorPicker
} from '@syncfusion/ej2-inputs';
import {
    RichTextEditor,
    Toolbar,
    HtmlEditor,
    QuickToolbar
} from '@syncfusion/ej2-richtexteditor';
import {
    CheckBox,
    Switch,
    RadioButton
} from '@syncfusion/ej2-buttons';
import {
    DropDownList,
    MultiSelect
} from '@syncfusion/ej2-dropdowns';
import {
    DatePicker,
    DateTimePicker,
    TimePicker,
    DateRangePicker,
    CalendarType
} from '@syncfusion/ej2-calendars';
import { PropertyValues } from '../types/component-properties';
import { PropertyDefinition } from '../model/base';
import { generateId } from '@syncfusion/ej2-form-renderer';


/** @private */
type DirectType =
    | 'text' | 'number' | 'boolean' | 'switch'
    | 'dropdown' | 'multiselect' | 'radio'
    | 'color' | 'day' | 'time' | 'datetime' | 'daterange'
    | 'html';

/** @private */
export interface PropertyRendererOptions {
    prop: PropertyDefinition;
    value: any;
    host: HTMLElement;
    onChange: (key: string, value: any) => void;
    l10n: L10n;
    locale: string;
    mode?: 'Simple' | 'Developer';
    existingValues?: PropertyValues;
    enableRtl?: boolean;
}

/** @private */
export interface RenderedProperty {
    id: string;
    instance: any;
}

/** @private */
export class PropertyRenderer {
    private datePickers: Set<DatePicker> = new Set<DatePicker>();

    /** @private */
    public render(opts: PropertyRendererOptions): RenderedProperty {
        const { prop, value, host, onChange, l10n, locale, mode, existingValues, enableRtl } = opts;

        const fieldHost: HTMLElement = createElement('div', {
            className: 'property-field',
            attrs: { 'data-property-key': prop.key, 'data-property-type': prop.type }
        });
        const inlineLabelTypes: DirectType[] = ['boolean', 'switch'];
        const isInlineLabel: boolean = inlineLabelTypes.indexOf(prop.type as DirectType) >= 0;

        if (!isInlineLabel) {
            const label: HTMLElement = createElement('label', {
                className: 'property-label',
                attrs: { 'for': `prop-${prop.type}-${prop.key}` }
            });
            label.textContent = l10n.getConstant(prop.label as any) || prop.label;
            if (prop.required) {
                const star: HTMLElement = createElement('span', { className: 'required' });
                star.textContent = '*';
                label.appendChild(star);
            }
            fieldHost.appendChild(label);
        }
        if (prop.description) {
            const desc: HTMLElement = createElement('p', {
                className: isInlineLabel
                    ? 'property-description property-description-inline'
                    : 'property-description'
            });
            desc.textContent = l10n.getConstant(prop.description as any) || prop.description;
            fieldHost.appendChild(desc);
        }

        const id: string = generateId(`prop-${prop.type}-${prop.key}`);

        try {
            const instance: any = this.renderControl(
                prop, value, fieldHost, onChange, l10n, locale, id, existingValues, mode, this.datePickers, enableRtl
            );
            host.appendChild(fieldHost);
            return { id, instance };
        } catch (err) {
            console.error(`[PropertyRenderer] Failed to render "${prop.key}" (type="${prop.type}"):`, err);
            const warn: HTMLElement = createElement('p', {
                className: 'property-render-error',
                attrs: { 'role': 'alert' }
            });
            warn.textContent = `Property "${prop.key}" (type="${prop.type}") failed to render.`;
            fieldHost.appendChild(warn);
            host.appendChild(fieldHost);
            return { id, instance: null };
        }
    }

    public destroy(rendered: RenderedProperty | null | undefined): void {
        if (!rendered || !rendered.instance) {
            return;
        }
        this.datePickers.delete(rendered.instance as DatePicker);
        try {
            if (typeof rendered.instance.destroy === 'function') {
                rendered.instance.destroy();
            }
        } catch {
            // ignore
        }
    }

    private renderControl(
        prop: PropertyDefinition,
        value: any,
        fieldHost: HTMLElement,
        onChange: (key: string, value: any) => void,
        l10n: L10n,
        locale: string,
        id: string,
        existingValues: PropertyValues | undefined,
        mode: 'Simple' | 'Developer' | undefined,
        datePickers: Set<DatePicker>,
        enableRtl?: boolean
    ): any {
        const initialValue: any = value !== undefined ? value : prop.default;
        const ariaLabel: string = (l10n.getConstant(prop.label as any) || prop.label) + ' ' + prop.type;
        const dropdownOnChnage = (key: string, value: string) => {
            if (key === 'calendarMode') {
                datePickers.forEach((datePicker: DatePicker) => {
                    datePicker.calendarMode = value as CalendarType;
                });
            }
            onChange(key, value);
        };

        switch (prop.type as DirectType) {

            case 'text': {
                const isRawValueKey: boolean = prop.key === 'name' || prop.key === 'width';
                const isChangeKey: boolean =
                    prop.key === 'defaultValue' || prop.key === 'prefix' || prop.key === 'suffix';
                const valueToRender: any = isRawValueKey
                    ? (initialValue !== undefined ? initialValue : prop.default || '')
                    : (initialValue !== undefined
                        ? (l10n.getConstant(initialValue as any) || initialValue)
                        : (prop.default || ''));
                const textHtmlAttrs: { [key: string]: string } = {
                    'aria-label': (l10n.getConstant(prop.label as any) || prop.label) + ' textbox'
                };
                if (prop.length) {
                    textHtmlAttrs.maxLength = String(prop.length);
                }
                const textBox: TextBox = new TextBox({
                    enableRtl: enableRtl,
                    value: valueToRender,
                    placeholder: l10n.getConstant(prop.placeholder as any) || prop.placeholder,
                    floatLabelType: 'Never',
                    locale: locale,
                    change: isChangeKey ? (e: any) => onChange(prop.key, e.value) : undefined,
                    input: !isChangeKey ? (e: any) => onChange(prop.key, e.value) : undefined,
                    htmlAttributes: textHtmlAttrs
                });
                const inputEl: HTMLElement = createElement('input', { id });
                fieldHost.appendChild(inputEl);
                textBox.appendTo(inputEl);
                return textBox;
            }

            case 'number': {
                const nb: NumericTextBox = new NumericTextBox({
                    enableRtl: enableRtl,
                    value: initialValue !== undefined && initialValue !== null ? initialValue : null,
                    placeholder: l10n.getConstant(prop.placeholder as any) || prop.placeholder,
                    min: prop.min,
                    max: prop.max,
                    step: prop.step || 1,
                    format: 'n',
                    floatLabelType: 'Never',
                    locale: locale,
                    change: (e: any) => onChange(prop.key, e.value)
                });
                const inputEl: HTMLElement = createElement('input', { id });
                fieldHost.appendChild(inputEl);
                nb.appendTo(inputEl);
                return nb;
            }

            case 'boolean': {
                const cb: CheckBox = new CheckBox({
                    enableRtl: enableRtl,
                    label: l10n.getConstant(prop.label as any) || prop.label,
                    checked: !!initialValue,
                    change: (e: any) => onChange(prop.key, e.checked)
                });
                const inputEl: HTMLElement = createElement('input', { id, attrs: { 'type': 'checkbox', 'aria-label': (l10n.getConstant(prop.label as any) || prop.label) + ' checkbox' } });
                fieldHost.appendChild(inputEl);
                cb.appendTo(inputEl);
                return cb;
            }

            case 'switch': {
                const switchWrapper: HTMLElement = createElement('div', {
                    className: 'property-field property-field-checkbox'
                });
                const inlineLabel: HTMLElement = createElement('div');
                inlineLabel.style.fontWeight = '600';
                inlineLabel.textContent = (l10n.getConstant(prop.label as any) || prop.label) + ':';
                switchWrapper.appendChild(inlineLabel);
                const sw: Switch = new Switch({
                    enableRtl: enableRtl,
                    checked: !!initialValue,
                    onLabel: l10n.getConstant('on' as any) || 'On',
                    offLabel: l10n.getConstant('off' as any) || 'Off',
                    change: (e: any) => onChange(prop.key, e.checked)
                });
                const inputEl: HTMLElement = createElement('input', { id, attrs: { 'type': 'checkbox', 'aria-label': (l10n.getConstant(prop.label as any) || prop.label) + ' switch' } });
                switchWrapper.appendChild(inputEl);
                fieldHost.appendChild(switchWrapper);
                sw.appendTo(inputEl);
                return sw;
            }

            case 'dropdown': {
                const dataSource: { text: string; value: string }[] = (prop.options || []).map((opt: string) => ({
                    text: l10n.getConstant(opt as any) || opt,
                    value: opt.charAt(0).toUpperCase() + opt.slice(1)
                }));
                const dd: DropDownList = new DropDownList({
                    enableRtl: enableRtl,
                    dataSource: dataSource,
                    fields: { text: 'text', value: 'value' },
                    value: initialValue || prop.default,
                    placeholder: l10n.getConstant(prop.placeholder as any) || prop.placeholder,
                    floatLabelType: 'Never',
                    locale: locale,
                    change: (e: any) => dropdownOnChnage(prop.key, e.value),
                    htmlAttributes: {
                        'aria-label': (l10n.getConstant(prop.label as any) || prop.label) + ' dropdown'
                    }
                });
                const selectEl: HTMLElement = createElement('input', { id });
                fieldHost.appendChild(selectEl);
                dd.appendTo(selectEl);
                return dd;
            }

            case 'multiselect': {
                const dataSource: { text: string; value: string }[] = (prop.options || []).map((opt: string) => ({
                    text: l10n.getConstant(opt as any) || opt,
                    value: opt.charAt(0).toUpperCase() + opt.slice(1)
                }));
                const ms: MultiSelect = new MultiSelect({
                    enableRtl: enableRtl,
                    dataSource: dataSource,
                    fields: { text: 'text', value: 'value' },
                    value: Array.isArray(initialValue) ? initialValue : (prop.default || []),
                    allowCustomValue: true,
                    placeholder: l10n.getConstant(prop.placeholder as any) || prop.placeholder,
                    floatLabelType: 'Never',
                    locale: locale,
                    change: (e: any) => onChange(prop.key, e.value),
                    htmlAttributes: {
                        'aria-label': (l10n.getConstant(prop.label as any) || prop.label) + ' multiselect'
                    }
                });
                const selectEl: HTMLElement = createElement('input', { id });
                fieldHost.appendChild(selectEl);
                ms.appendTo(selectEl);
                return ms;
            }

            case 'radio': {
                const wrapper: HTMLElement = createElement('div', {
                    attrs: { 'role': 'radiogroup', 'aria-labelledby': `label-${prop.key}` },
                    className: 'radio-options'
                });
                fieldHost.appendChild(wrapper);
                const groupName: string = `prop-radio-${prop.key}`;
                (prop.options || []).forEach((opt: string) => {
                    const rb: RadioButton = new RadioButton({
                        enableRtl: enableRtl,
                        name: groupName,
                        label: l10n.getConstant(opt as any) || opt,
                        value: opt,
                        checked: initialValue === opt,
                        change: () => onChange(prop.key, opt)
                    });
                    const inputEl: HTMLElement = createElement('input', {
                        id: `${groupName}-${opt}`,
                        attrs: { 'type': 'radio' }
                    });
                    wrapper.appendChild(inputEl);
                    rb.appendTo(inputEl);
                });
                return null;
            }

            case 'color': {
                const cp: ColorPicker = new ColorPicker({
                    enableRtl: enableRtl,
                    value: initialValue || prop.default || '',
                    locale: locale,
                    change: (e: any) => onChange(prop.key, e.value)
                });
                const inputEl: HTMLElement = createElement('input', { id });
                fieldHost.appendChild(inputEl);
                cp.appendTo(inputEl);
                return cp;
            }

            case 'day': {
                const formatDate = (date: Date, calendarMode: CalendarType): string => {
                    if (!date) return '';
                    const dateParts: { year: number; month: number; date: number } = calendarMode === 'Islamic'
                        ? HijriParser.getHijriDate(date) as { year: number; month: number; date: number }
                        : { year: date.getFullYear(), month: date.getMonth() + 1, date: date.getDate() };
                    const month = ('0' + String(dateParts.month)).slice(-2);
                    const day = ('0' + String(dateParts.date)).slice(-2);
                    const year = dateParts.year;
                    return `${month}/${day}/${year}`;
                };
                const dp: DatePicker = new DatePicker({
                    enableRtl: enableRtl,
                    value: initialValue ? new Date(initialValue) : undefined,
                    format: 'MM/dd/yyyy',
                    placeholder: l10n.getConstant(prop.placeholder as any) || prop.placeholder || 'Select a date',
                    floatLabelType: 'Never',
                    locale: locale,
                    change: (e: any) => onChange(prop.key, formatDate(e.value, dp.calendarMode))
                });
                datePickers.add(dp);
                const inputEl: HTMLElement = createElement('input', { id });
                fieldHost.appendChild(inputEl);
                dp.appendTo(inputEl);
                return dp;
            }

            case 'time': {
                const formatTime = (date: Date): string => {
                    if (!date) return '';
                    let hours = date.getHours();
                    const minutes = ('0' + String(date.getMinutes())).slice(-2);
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12; // Convert to 12-hour format (1-12)
                    const hoursStr = ('0' + String(hours)).slice(-2);
                    return `${hoursStr}:${minutes} ${ampm}`;
                };
                const tp: TimePicker = new TimePicker({
                    enableRtl: enableRtl,
                    value: initialValue ? new Date(initialValue) : undefined,
                    format: 'hh:mm a',
                    placeholder: l10n.getConstant(prop.placeholder as any) || prop.placeholder,
                    floatLabelType: 'Never',
                    locale: locale,
                    change: (e: any) => onChange(prop.key, formatTime(e.value))
                });
                const inputEl: HTMLElement = createElement('input', { id });
                fieldHost.appendChild(inputEl);
                tp.appendTo(inputEl);
                return tp;
            }

            case 'datetime': {
                const formatDateTime = (date: Date): string => {
                    if (!date) return '';
                    const month = ('0' + String(date.getMonth() + 1)).slice(-2);
                    const day = ('0' + String(date.getDate())).slice(-2);
                    const year = date.getFullYear();
                    let hours = date.getHours();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12;
                    const hoursStr = ('0' + String(hours)).slice(-2);
                    const minutes = ('0' + String(date.getMinutes())).slice(-2);
                    return `${month}/${day}/${year} ${hoursStr}:${minutes} ${ampm}`;
                };
                const dtp: DateTimePicker = new DateTimePicker({
                    enableRtl: enableRtl,
                    value: initialValue ? new Date(initialValue) : undefined,
                    placeholder: l10n.getConstant(prop.placeholder as any) || prop.placeholder,
                    floatLabelType: 'Never',
                    locale: locale,
                    change: (e: any) => onChange(prop.key, formatDateTime(e.value))
                });
                const inputEl: HTMLElement = createElement('input', { id });
                fieldHost.appendChild(inputEl);
                dtp.appendTo(inputEl);
                return dtp;
            }

            case 'daterange': {
                const formatDateRange = (startDate: Date, endDate: Date): string => {
                    if (!startDate || !endDate) return '';
                    const formatDate = (date: Date) => {
                        const month = ('0' + String(date.getMonth() + 1)).slice(-2);
                        const day = ('0' + String(date.getDate())).slice(-2);
                        const year = date.getFullYear();
                        return `${month}/${day}/${year}`;
                    };
                    return `${formatDate(startDate)}  -  ${formatDate(endDate)}`;
                };
                const drp: DateRangePicker = new DateRangePicker({
                    enableRtl: enableRtl,
                    startDate: initialValue && initialValue.startDate ? new Date(initialValue.startDate) : undefined ,
                    endDate: initialValue && initialValue.endDate ? new Date(initialValue.endDate) : undefined,
                    placeholder: l10n.getConstant(prop.placeholder as any) || prop.placeholder,
                    floatLabelType: 'Never',
                    locale: locale,
                    change: (e: any) => {
                        if (e.startDate && e.endDate) {
                            onChange(prop.key, formatDateRange(e.startDate, e.endDate));
                        } else {
                            onChange(prop.key, '');
                        }
                    }
                });
                const inputEl: HTMLElement = createElement('input', { id });
                fieldHost.appendChild(inputEl);
                drp.appendTo(inputEl);
                return drp;
            }

            case 'html': {
                const rte: RichTextEditor = new RichTextEditor({
                    enableRtl: enableRtl,
                    editorMode: 'HTML',
                    value: initialValue || prop.default || '',
                    toolbarSettings: { items: ['Undo', 'Redo', '|', 'SourceCode'] },
                    saveInterval: 1,
                    height: '180px',
                    enableHtmlSanitizer: false,
                    locale: locale,
                    change: (e: any) => onChange(prop.key, e.value),
                    created: () => {
                        if (rte) {
                            setTimeout(() => {
                                rte.showSourceCode();
                            }, 50);
                        }
                    }
                });
                RichTextEditor.Inject(Toolbar, HtmlEditor, QuickToolbar);
                rte.appendTo(fieldHost);
                return rte;
            }

            default: {
                return null;
            }
        }
    }
}
