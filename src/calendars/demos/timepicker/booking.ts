import { TimePicker } from '../../src/timepicker/timepicker';
import { Calendar } from '../../src/calendar/calendar';
import { ChangeEventArgs } from '../../src/timepicker/timepicker';
/**
 * Default timepicker sample
 */
// this.default = (): void => {
let input: HTMLInputElement = <HTMLInputElement>document.getElementById('label');
let time: HTMLInputElement = <HTMLInputElement>document.getElementById('timepicker');
let mealType: HTMLSelectElement = (document.getElementById('mealTime') as HTMLSelectElement);
let table: HTMLSelectElement = (document.getElementById('mealTable') as HTMLSelectElement);
let options: Element[] = <NodeListOf<Element> & Element[]>document.querySelectorAll('#mealTable option');
let alaramTime: string;
let date: Date = new Date();
let max: Date = new Date();
max = new Date(max.setDate(max.getDate() + 60));
let min: Date = new Date();
min = new Date(min.setDate(min.getDate() - 1));
let monthNames: string[] = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
/*Initialize the calendar component*/
let calendar: Calendar = new Calendar({
    value: new Date(),
    max: max,
    min: min,
    change: onDateChange
});
calendar.appendTo("#calendar");
/*Initialize the timepicker component*/
let minpicker: TimePicker = new TimePicker({
    change: onMinChange,
    step: 30,
    placeholder: 'Check-In'
});
minpicker.appendTo('#min');

/*Initialize the timepicker component*/
let maxpicker: TimePicker = new TimePicker({
    placeholder: 'Check-Out'
});
maxpicker.appendTo('#max');

mealType.addEventListener('change', mealTime);

document.getElementById('reserve').addEventListener('click', reserve);

function onDateChange() {
    minpicker.value = null;
    maxpicker.value = null;
    mealType.selectedIndex = 0;
    table.selectedIndex = 0;
    document.getElementById('status').innerHTML = '';
}

function onMinChange(args: ChangeEventArgs) {
    /*setting maxtime value*/
    let time: Date = args.value;
    if (time !== null) {
        if (time.getHours() + 3 > 23) {
            time.setHours(23);
            time.setMinutes(59);
        } else {
            time.setHours(time.getHours() + 3);
        }
        maxpicker.value = time;
    } else {
        maxpicker.value = null;
    }
}

function reserve() {
    /*Getting revervation message*/
    document.getElementById('status').innerHTML = '';
    let category: string = mealType.value;
    let chkin: string = (<HTMLInputElement>document.getElementById("min")).value;
    let chkout: string = (<HTMLInputElement>document.getElementById("max")).value;
    let date: Date = calendar.value;
    let tableNo: string = table.value;
    let result: string = '';
    let isValid: boolean = true;
    if (date === null) {
        result = 'Please select a date ';
        isValid = false;
    } else if (mealType.selectedIndex <= 0) {
        if (result !== '') {
            result = result + '& select a Meal type ';
        } else {
            result = 'Please select a Meal type ';
        }
        isValid = false;
    }
    else if (chkin === '') {
        if (result !== '') {
            result = result + '& check-in time';
        } else {
            result += 'Pick a check-in time';
        }
        isValid = false;
    } else if (table.selectedIndex <= 0) {
        if (result !== '') {
            result = result + '& dine in table';
        } else {
            result += 'Choose a dine in table';
        }
        isValid = false;
    }
    if (isValid) {
        let result: string = "<b>YOU ARE BOOKING A TABLE AT</b> COA VILLAGE <b> FOR " + calendar.value.getDate() + " " + monthNames[calendar.value.getMonth()] + " AT " + chkin + " TO " + chkout + " FOR " + options[table.selectedIndex].innerHTML;
        let bool: boolean = confirm('Are you sure confirm your booking?');
        if (bool) {
            document.getElementById('status').innerHTML = result;
        } else {
            minpicker.value = null;
            maxpicker.value = null;
            mealType.selectedIndex = -1;
            table.selectedIndex = -1;
        }
    }
    else {
        alert(result);
    }
}

function mealTime() {
    /*setting mealtime for required date*/
    let category: string = (document.getElementById('mealTime') as HTMLSelectElement).value;
    let min: Date;
    let max: Date;
    if (category === 'breakfast') {
        minpicker.value = null;
        min = max = new Date();
        min.setMinutes(0);
        min.setSeconds(0)
        minpicker.min = new Date(min.setHours(8));
        max.setMinutes(0);
        max.setSeconds(0)
        minpicker.max = new Date(max.setHours(12));
    }
    else if (category === 'lunch') {
        minpicker.value = null;
        min = max = new Date();
        min.setHours(12);
        min.setMinutes(0);
        minpicker.min = new Date(min.setSeconds(0));
        max.setHours(16);
        max.setMinutes(0);
        minpicker.max = new Date(max.setSeconds(0));
    }
    else if (category === 'dinner') {
        minpicker.value = null;
        min = max = new Date();
        min.setMinutes(0);
        min.setSeconds(0);
        minpicker.min = new Date(min.setHours(19));
        max.setHours(23);
        max.setSeconds(0)
        minpicker.max = new Date(max.setMinutes(59));
    }
}
