import { Calendar} from '../../src/calendar/calendar';
/**
 * Value sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    isMultiSelection: true,
    values: [new Date('5/12/2018'), new Date('5/13/2018'), new Date('5/20/2018'), new Date('5/01/2018')],
    change: changeValue,
    created: changeValue,
});
calendar.appendTo('#calendar');

function changeValue(): void {
    /*Displays selected date in the input textbox*/
    document.getElementById('multiSelect').innerHTML = "";
    for (let index: number = 0; index < this.values.length; index++) {
        document.getElementById('multiSelect').appendChild(document.createTextNode(this.values[index]));
        let mybreack: Element = document.createElement('br');
        document.getElementById('multiSelect').appendChild(mybreack);
    }
}