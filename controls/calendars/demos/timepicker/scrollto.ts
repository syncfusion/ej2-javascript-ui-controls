import { TimePicker } from '../../src/timepicker/timepicker';
/**
 * ScrollTo timepicker sample
 */
// this.default = (): void => {
let input: HTMLInputElement = <HTMLInputElement>document.getElementById('label');

let timepicker: TimePicker = new TimePicker({
});
timepicker.appendTo('#timepicker');
document.getElementById('scroll').addEventListener('click', createEntry);

function createEntry() {
    timepicker.scrollTo = new Date(input.value);
}
