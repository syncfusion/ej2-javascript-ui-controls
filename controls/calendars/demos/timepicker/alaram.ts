import { TimePicker } from '../../src/timepicker/timepicker';
/**
 * Alaram Setting sample
 */

let input: HTMLInputElement = <HTMLInputElement>document.getElementById('label');
let time: HTMLInputElement = <HTMLInputElement>document.getElementById('timepicker');
let alarmTime: string;
let date: Date;
/*Initialize the timepicker component*/
let timepicker: TimePicker = new TimePicker({
    value: new Date()
});
timepicker.appendTo('#timepicker');

document.getElementById('alarm').addEventListener('click', createEntry);

function createEntry() {
    /*Creating Alaram*/
    let result: { hour: number; minutes: number };
    let bool: boolean;
    if (input.value !== '' && timepicker.value !== null) {
        date = new Date();
        let selectedValue: Date = new Date(date.toLocaleDateString() + ' ' + time.value);
        if (date.getTime() > selectedValue.getTime()) {
            selectedValue.setDate(date.getDate() + 1);
        }
        result = currentDayValue(selectedValue, date);
        alarmTime = "Alarm in " + result.hour + " hours and " + result.minutes + " minutes";
        bool = confirm("Alarm set for " + result.hour + " hours and " + result.minutes + " minutes from now");
        if (bool) {
            document.getElementById('alarmList').style.borderColor = "rgba(0, 0, 0, 0.12)";
            document.getElementById('alarmList').style.borderStyle = "solid";
            let container: string = "<div class='e-cell'><div class='cell_container'><div class='alarmTime'>" + alarmTime + "</div><div class='alarmLabel'>" + input.value + "</div></div><div class='time_val'><div>" + time.value + "</div></div></div>";
            document.getElementById('alarmList').innerHTML = container + document.getElementById('alarmList').innerHTML;
        }
    } else {
        alert('Please select the Time or Enter the Alarm Label!')
    }
}

function currentDayValue(end: Date, start: Date): { hour: number; minutes: number } {
    let diff: number;
    let result: number;
    let hour: number;
    let minutes: number;
    diff = end.getTime() - start.getTime();
    result = Math.floor((diff / 60000));
    hour = Math.floor(result / 60);
    minutes = result % 60;
    return { hour: hour, minutes: minutes };
}
