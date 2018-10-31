import { RecurrenceEditor } from '../../src/recurrence-editor/recurrence-editor';
import { createElement, remove } from '@syncfusion/ej2-base';
/**
 * test case for reccurence editor.
 */
const NONE: string = 'none';
const DAILY: string = 'daily';
const WEEKLY: string = 'weekly';
const MONTHLY: string = 'monthly';
const YEARLY: string = 'yearly';
const NEVER: string = 'never';
const UNTIL: string = 'until';
const COUNT: string = 'count';
const RTLCLASS: string = 'e-rtl';
describe('Schedule - recurrence rendering scenario', () => {
    let schObj: RecurrenceEditor;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll(() => {
        document.body.appendChild(elem);
        schObj = new RecurrenceEditor({ startDate: new Date('Tue, 06 May 2014') });
        schObj.appendTo('#Schedule');
    });
    afterAll(() => {
        if (schObj) {
            schObj.destroy();
        }
        remove(elem);
    });
    it('ensuring the dropdownlist components', () => {
        expect((<any>schObj).repeatType).not.toBe(null);
        expect((<any>schObj).endType).not.toBe(null);
        expect((<any>schObj).monthWeekPos).not.toBe(null);
        expect((<any>schObj).monthWeekDays).not.toBe(null);
        expect((<any>schObj).monthValue).not.toBe(null);
        schObj.getPersistData();
    });
    it('ensuring the date picker components', () => {
        expect((<any>schObj).untilDateObj).not.toBe(null);
    });
    it('ensuring the radio button components', () => {
        expect((<any>schObj).onMonthDay).not.toBe(null);
        expect((<any>schObj).onWeekDay).not.toBe(null);
    });
    it('ensuring the radio button components', () => {
        expect((<any>schObj).onMonthDay).not.toBe(null);
        expect((<any>schObj).onWeekDay).not.toBe(null);
    });
    it('ensuring the numeric textbox component', () => {
        expect((<any>schObj).recurrenceCount).not.toBe(null);
        expect((<any>schObj).monthDate).not.toBe(null);
        expect((<any>schObj).repeatInterval).not.toBe(null);
    });
    it('ensuring the day buttons', () => {
        expect((<any>schObj).dayButtons.length).toBe(7);
        (<any>schObj).dayButtons[0].element.click();
        expect((<any>schObj).dayButtons[0].element.classList.contains('e-primary')).toBe(true);
        (<any>schObj).dayButtons[0].element.click();
    });
});

describe('Schedule - recurrence rendering scenario', () => {
    let schObj: RecurrenceEditor;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll(() => {
        document.body.appendChild(elem);
        schObj = new RecurrenceEditor({ startDate: new Date('Tue, 06 May 2014'), firstDayOfWeek: 1 });
        schObj.appendTo('#Schedule');
    });
    afterAll(() => {
        if (schObj) {
            schObj.destroy();
        }
        remove(elem);
    });
    it('ensuring the Rule set process- Daily - Never', () => {
        schObj.setRecurrenceRule('FREQ=DAILY;INTERVAL=3');
        expect((<any>schObj).repeatType.value).toBe(DAILY);
        expect((<any>schObj).repeatInterval.value).toBe(3);
        expect((<any>schObj).endType.value).toBe(NEVER);
        expect(schObj.getRecurrenceRule()).toBe('FREQ=DAILY;INTERVAL=3;');
        expect('every 3 day(s)').toBe(schObj.getRuleSummary());
    });
    it('ensuring the Rule set process- Daily - Count', () => {
        schObj.setRecurrenceRule('FREQ=DAILY;INTERVAL=5;COUNT=10');
        expect((<any>schObj).repeatType.value).toBe(DAILY);
        expect((<any>schObj).repeatInterval.value).toBe(5);
        expect((<any>schObj).recurrenceCount.value).toBe(10);
        expect((<any>schObj).endType.value).toBe(COUNT);
        expect(schObj.getRecurrenceRule()).toBe('FREQ=DAILY;INTERVAL=5;COUNT=10;');
        expect('every 5 day(s), 10 time(s)').toBe(schObj.getRuleSummary());
    });
    it('ensuring the Rule set process- Daily - UNTIL', () => {
        schObj.setRecurrenceRule('FREQ=DAILY;INTERVAL=2;UNTIL=20280131T090000Z');
        expect((<any>schObj).repeatType.value).toBe(DAILY);
        expect((<any>schObj).repeatInterval.value).toBe(2);
        expect((<any>schObj).endType.value).toBe(UNTIL);
        expect(schObj.getRecurrenceRule()).toBe('FREQ=DAILY;INTERVAL=2;UNTIL=20280131T090000Z;');
        expect('every 2 day(s), until 31 Jan 2028').toBe(schObj.getRuleSummary());
    });
    //
    it('ensuring the Rule set process- WEEKLY - Never', () => {
        schObj.setRecurrenceRule('FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,WE,FR');
        expect((<any>schObj).repeatType.value).toBe(WEEKLY);
        expect((<any>schObj).repeatInterval.value).toBe(2);
        expect((<any>schObj).endType.value).toBe(NEVER);
        expect(JSON.stringify(getSelectedDays(schObj))).toBe(JSON.stringify([2, 4, 6]));
        expect(schObj.getRecurrenceRule()).toBe('FREQ=WEEKLY;BYDAY=WE,FR,SU;INTERVAL=2;');
        expect('every 2 week(s) on Wed, Fri, Sun').toBe(schObj.getRuleSummary());
    });
    it('ensuring the Rule set process- WEEKLY - Count', () => {
        schObj.setRecurrenceRule('FREQ=WEEKLY;INTERVAL=5;BYDAY=WE,FR;COUNT=10');
        expect((<any>schObj).repeatType.value).toBe(WEEKLY);
        expect((<any>schObj).repeatInterval.value).toBe(5);
        expect((<any>schObj).endType.value).toBe(COUNT);
        expect((<any>schObj).recurrenceCount.value).toBe(10);
        expect(JSON.stringify(getSelectedDays(schObj))).toBe(JSON.stringify([2, 4]));
        expect(schObj.getRecurrenceRule()).toBe('FREQ=WEEKLY;BYDAY=WE,FR;INTERVAL=5;COUNT=10;');
        expect('every 5 week(s) on Wed, Fri, 10 time(s)').toBe(schObj.getRuleSummary());
    });
    it('ensuring the Rule set process- WEEKLY - UNTIL', () => {
        schObj.setRecurrenceRule('FREQ=WEEKLY;INTERVAL=2;BYDAY=FR;UNTIL=20280131T090000Z');
        expect((<any>schObj).repeatType.value).toBe(WEEKLY);
        expect((<any>schObj).repeatInterval.value).toBe(2);
        expect((<any>schObj).endType.value).toBe(UNTIL);
        expect(JSON.stringify(getSelectedDays(schObj))).toBe(JSON.stringify([4]));
        expect(schObj.getRecurrenceRule()).toBe('FREQ=WEEKLY;BYDAY=FR;INTERVAL=2;UNTIL=20280131T090000Z;');
        expect('every 2 week(s) on Fri, until 31 Jan 2028').toBe(schObj.getRuleSummary());
    });
    //FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=2;COUNT=10
    it('ensuring the Rule set process- MONTHLY - Count', () => {
        schObj.setRecurrenceRule('FREQ=MONTHLY;BYDAY=MO;BYSETPOS=4;INTERVAL=3;COUNT=5');
        expect((<any>schObj).repeatType.value).toBe(MONTHLY);
        expect((<any>schObj).repeatInterval.value).toBe(3);
        expect((<any>schObj).monthWeekPos.value).toBe(4);
        expect((<any>schObj).endType.value).toBe(COUNT);
        expect((<any>schObj).recurrenceCount.value).toBe(5);
        expect((<any>schObj).monthWeekDays.value).toBe('MO');
        expect(schObj.getRecurrenceRule()).toBe('FREQ=MONTHLY;BYDAY=MO;BYSETPOS=4;INTERVAL=3;COUNT=5;');
        expect('every 3 month(s) on Fourth Mon, 5 time(s)').toBe(schObj.getRuleSummary());
    });
    it('ensuring the Rule set process- MONTHLY - Count', () => {
        schObj.setRecurrenceRule('FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=2;COUNT=10');
        expect((<any>schObj).repeatType.value).toBe(MONTHLY);
        expect((<any>schObj).repeatInterval.value).toBe(2);
        expect((<any>schObj).endType.value).toBe(COUNT);
        expect((<any>schObj).recurrenceCount.value).toBe(10);
        expect((<any>schObj).monthDate.value).toBe(10);
        expect(schObj.getRecurrenceRule()).toBe('FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=2;COUNT=10;');
        expect('every 2 month(s) on 10, 10 time(s)').toBe(schObj.getRuleSummary());
    });
    it('ensuring the Rule set process- MONTHLY - UNTIL', () => {
        schObj.setRecurrenceRule('FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=2;UNTIL=20280131T090000Z');
        expect(schObj.getRecurrenceRule()).toBe('FREQ=MONTHLY;BYMONTHDAY=10;INTERVAL=2;UNTIL=20280131T090000Z;');
        expect('every 2 month(s) on 10, until 31 Jan 2028').toBe(schObj.getRuleSummary());
    });
    //BYMONTH
    it('ensuring the Rule set process- YEARLY - Count', () => {
        schObj.setRecurrenceRule('FREQ=YEARLY;BYDAY=MO;BYMONTH=4;BYSETPOS=4;INTERVAL=2;COUNT=10');
        expect((<any>schObj).repeatType.value).toBe(YEARLY);
        expect((<any>schObj).repeatInterval.value).toBe(2);
        expect((<any>schObj).monthWeekPos.value).toBe(4);
        expect((<any>schObj).endType.value).toBe(COUNT);
        expect((<any>schObj).recurrenceCount.value).toBe(10);
        expect((<any>schObj).monthWeekDays.value).toBe('MO');
        expect(parseInt((<any>schObj).monthValue.value, 10)).toBe(4);
        expect(schObj.getRecurrenceRule()).toBe('FREQ=YEARLY;BYDAY=MO;BYSETPOS=4;BYMONTH=4;INTERVAL=2;COUNT=10;');
        expect('every 2 year(s) on Apr Fourth Mon, 10 time(s)').toBe(schObj.getRuleSummary());
    });
    it('ensuring the Rule set process- YEARLY - Count', () => {
        schObj.setRecurrenceRule('FREQ=YEARLY;BYMONTHDAY=10;BYMONTH=5;INTERVAL=2;COUNT=10');
        expect((<any>schObj).repeatType.value).toBe(YEARLY);
        expect((<any>schObj).repeatInterval.value).toBe(2);
        expect((<any>schObj).endType.value).toBe(COUNT);
        expect((<any>schObj).recurrenceCount.value).toBe(10);
        expect((<any>schObj).monthDate.value).toBe(10);
        expect(parseInt((<any>schObj).monthValue.value, 10)).toBe(5);
        expect(schObj.getRecurrenceRule()).toBe('FREQ=YEARLY;BYMONTHDAY=10;BYMONTH=5;INTERVAL=2;COUNT=10;');
        expect('every 2 year(s) on May 10, 10 time(s)').toBe(schObj.getRuleSummary());
    });
    it('ensuring the Rule set process- YEARLY - UNTIL', () => {
        schObj.setRecurrenceRule('FREQ=YEARLY;BYMONTHDAY=10;BYMONTH=4;INTERVAL=2;UNTIL=20280131T090000Z');
        expect(schObj.getRecurrenceRule()).toBe('FREQ=YEARLY;BYMONTHDAY=10;BYMONTH=4;INTERVAL=2;UNTIL=20280131T090000Z;');
    });
    it('Negative case for ensuring the Rule set process- MONTHLY - Count', () => {
        schObj.setRecurrenceRule('FREQ=MONTHLY;BYDAY=MO;BYSETPOS=-1;INTERVAL=3;COUNT=5');
        expect((<any>schObj).repeatType.value).toBe(MONTHLY);
        expect((<any>schObj).repeatInterval.value).toBe(3);
        expect((<any>schObj).monthWeekPos.value).toBe(-1);
        expect((<any>schObj).endType.value).toBe(COUNT);
        expect((<any>schObj).recurrenceCount.value).toBe(5);
        expect((<any>schObj).monthWeekDays.value).toBe('MO');
        expect(schObj.getRecurrenceRule()).toBe('FREQ=MONTHLY;BYDAY=MO;BYSETPOS=-1;INTERVAL=3;COUNT=5;');
        expect('every 3 month(s) on Last Mon, 5 time(s)').toBe(schObj.getRuleSummary());
    });
});

describe('Schedule - recurrence property change.', () => {
    let schObj: RecurrenceEditor;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll(() => {
        document.body.appendChild(elem);
        schObj = new RecurrenceEditor();
        schObj.appendTo('#Schedule');
    });
    afterAll(() => {
        if (schObj) {
            schObj.destroy();
        }
        remove(elem);
    });
    it('ensuring startDate property change.', () => {
        let date1: Date = new Date('Sun May 18 2014');
        schObj.setProperties({ startDate: date1 });
        expect((<any>schObj).monthDate.value).toBe(18);
        expect((<any>schObj).monthWeekDays.value).toBe('SU');
        expect((<any>schObj).monthValue.value).toBe(date1.getMonth() + 1 + '');
    });
    it('ensuring enableRtl property change.', () => {
        schObj.setProperties({ enableRtl: true });
        expect(schObj.element.classList.contains(RTLCLASS)).toBe(true);
        schObj.setProperties({ enableRtl: false });
        expect(schObj.element.classList.contains(RTLCLASS)).toBe(false);
    });
    it('ensuring cssClass property change.', () => {
        let cssClass: string = 'e-check';
        schObj.setProperties({ cssClass: cssClass });
        expect(schObj.element.classList.contains(cssClass)).toBe(true);
    });
    it('ensuring the property channge option-selectedType', () => {
        schObj.setProperties({ selectedType: 1 });
        expect(schObj.element.querySelectorAll('.e-editor>.e-hide-recurrence-element').length).not.toBe(4);
        schObj.setProperties({ selectedType: 0 });
        expect(schObj.element.querySelectorAll('.e-editor>.e-hide-recurrence-element').length).toBe(4);
    });
    it('ensuring the property changes for min-max date', () => {
        let start: Date = new Date(2018, 1, 1);
        let end: Date = new Date(2018, 1, 31);
        schObj.setProperties({ minDate: start, maxDate: end });
        expect((<any>schObj).untilDateObj.minDate.getTime()).toBe(start.getTime());
        expect((<any>schObj).untilDateObj.maxDate.getTime()).toBe(end.getTime());
    });
    it('ensuring the property channge option-value', () => {
        schObj.setProperties({ value: 'FREQ=DAILY;INTERVAL=2;' });
        expect(schObj.element.querySelectorAll('.e-editor>.e-hide-recurrence-element').length).not.toBe(4);
        schObj.setProperties({ value: '' });
        expect(schObj.element.querySelectorAll('.e-editor>.e-hide-recurrence-element').length).toBe(4);
    });

    it('Default - Interval', () => {
        let startDate: Date = new Date('Tue, 06 May 2014');
        expect(JSON.stringify(schObj.getRecurrenceDates(
            startDate,
            'FREQ=DAILY;INTERVAL=2;UNTIL=20140606T000000Z',
            null,
            0,
            new Date('Tue May 04 2014 ')
        )))
            .toBe(JSON.stringify([new Date('Tue May 06 2014 ').getTime(),
            new Date('Thu May 08 2014').getTime(),
            new Date('Sat May 10 2014').getTime(), new Date('Mon May 12 2014').getTime(),
            new Date('Wed May 14 2014').getTime(), new Date('Fri May 16 2014').getTime(),
            new Date('Sun May 18 2014').getTime(), new Date('Tue May 20 2014 ').getTime(),
            new Date('Thu May 22 2014').getTime(), new Date('Sat May 24 2014').getTime(),
            new Date('Mon May 26 2014').getTime(), new Date('Wed May 28 2014').getTime(),
            new Date('Fri May 30 2014').getTime(), new Date('Sun Jun 01 2014').getTime(),
            new Date('Tue Jun 03 2014').getTime(), new Date('Thu Jun 05 2014 ').getTime()]));
    });

    it('Custom - Interval', () => {
        let startDate: Date = new Date('Tue, 06 May 2014');
        expect(JSON.stringify(schObj.getRecurrenceDates(startDate, 'FREQ=DAILY;INTERVAL=2;UNTIL=20140606T000000Z', null, 0)))
            .toBe(JSON.stringify([new Date('Sun May 18 2014').getTime(), new Date('Tue May 20 2014 ').getTime(),
            new Date('Thu May 22 2014').getTime(), new Date('Sat May 24 2014').getTime(),
            new Date('Mon May 26 2014').getTime(), new Date('Wed May 28 2014').getTime(),
            new Date('Fri May 30 2014').getTime(), new Date('Sun Jun 01 2014').getTime(),
            new Date('Tue Jun 03 2014').getTime(), new Date('Thu Jun 05 2014 ').getTime()]));
    });
});

describe('Recurrence editor properties -setmodel checking', () => {
    let recObj: RecurrenceEditor;
    beforeAll(() => {
        recObj = undefined;
        let elem: HTMLElement = createElement('div', { id: 'editor' });
        document.body.appendChild(elem);
        recObj = new RecurrenceEditor();
        recObj.appendTo('#editor');
    });
    afterAll(() => {
        if (recObj) {
            recObj.destroy();
        }
        remove(document.querySelector('#editor'));
    });

    it('Editor frequencies set in setmodel', () => {
        recObj = new RecurrenceEditor();
        recObj.appendTo('#editor');
        recObj.frequencies = ['daily', 'monthly'];
        recObj.dataBind();
    });
});

describe('Schedule - recurrence change. event checkups', () => {
    let schObj: RecurrenceEditor;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll(() => {
        document.body.appendChild(elem);
        schObj = new RecurrenceEditor();
        schObj.appendTo('#Schedule');
    });
    afterAll(() => {
        if (schObj) {
            schObj.destroy();
        }
        remove(elem);
    });
    it('ensuring change event checkups.', () => {
        schObj.setRecurrenceRule('FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2;INTERVAL=1;UNTIL=20140729T000000Z');
        ((<any>schObj).onMonthDay.element.nextElementSibling as HTMLElement).click();
        expect((<any>schObj).onWeekDay.checked).toBe(false);
        ((<any>schObj).onWeekDay.element.nextElementSibling as HTMLElement).click();
        expect((<any>schObj).onMonthDay.checked).toBe(false);
        schObj.setRecurrenceRule('');
        (<any>schObj).getDayPosition(new Date('Fri May 30 2014'));
    });
});

describe('selectedType API checkup', () => {
    let schObj: RecurrenceEditor;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll(() => {
        document.body.appendChild(elem);
        schObj = new RecurrenceEditor({ selectedType: 1 });
        schObj.appendTo('#Schedule');
    });
    afterAll(() => {
        if (schObj) {
            schObj.destroy();
        }
        remove(elem);
    });
    it('ensuring value property is updated with selectedType API value', () => {
        let hiddenEle: number = schObj.element.querySelectorAll('.e-editor>.e-hide-recurrence-element').length;
        expect(hiddenEle).toBe(2);
        expect(schObj.element.querySelector('.e-editor').childElementCount - hiddenEle).toBe(3);
        let repeatField: HTMLElement = schObj.element.querySelector('.e-editor option') as HTMLElement;
        expect(repeatField.innerText).toBe('Daily');
        let intervalField: HTMLElement = schObj.element.querySelector('.e-interval input[type="hidden"]') as HTMLElement;
        expect(intervalField.getAttribute('value')).toBe('1');
        let endCountField: HTMLElement = schObj.element.querySelector('.e-end-on-left option') as HTMLElement;
        expect(endCountField.innerText).toBe('Never');
        expect(schObj.value).toBe('FREQ=DAILY;INTERVAL=1;');
    });
    it('ensuring whether fields are populated correctly when value API is given', () => {
        schObj.setProperties({ value: 'FREQ=DAILY;INTERVAL=2;COUNT=8' });
        expect(schObj.value).toBe('FREQ=DAILY;INTERVAL=2;COUNT=8;');
        let hiddenEle: number = schObj.element.querySelectorAll('.e-editor>.e-hide-recurrence-element').length;
        expect(hiddenEle).toBe(2);
        expect(schObj.element.querySelector('.e-editor').childElementCount - hiddenEle).toBe(3);
        let repeatField: HTMLElement = schObj.element.querySelector('.e-editor option') as HTMLElement;
        expect(repeatField.innerText).toBe('Daily');
        let intervalField: HTMLElement = schObj.element.querySelector('.e-interval input[type="hidden"]') as HTMLElement;
        expect(intervalField.getAttribute('value')).toBe('2');
        let endField: HTMLElement = schObj.element.querySelector('.e-end-on-left option') as HTMLElement;
        expect(endField.innerText).toBe('Count');
        let endCountField: HTMLElement = schObj.element.querySelector('.e-end-on-count input[type="hidden"]') as HTMLElement;
        expect(endCountField.getAttribute('value')).toBe('8');
    });
});

function getSelectedDays(editor: RecurrenceEditor): number[] {
    let colIndex: number[] = [];
    let elements: NodeListOf<Element> = editor.element.querySelectorAll('.e-days button.e-primary');
    for (let index: number = 0; index < elements.length; index++) {
        colIndex.push(parseInt(elements[index].getAttribute('data-index'), 10));
    }
    return colIndex;
}