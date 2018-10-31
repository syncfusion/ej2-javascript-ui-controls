import { Calendar, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * Clear button calendar sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    created: onCreate,
    change: changeValue
});
calendar.appendTo('#calendar');

function changeValue(args: ChangedEventArgs): void {
    /* Displays the selected value in the input */
    if (args.value != null) {
        (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
    } else {
        (<HTMLInputElement>document.getElementById('value')).value = null;
    }
}
function onCreate() {
    /*Create the clear button and append inside the calendar footer element*/
    let footerElement = document.getElementsByClassName('e-footer-container')[0];
    let clearBtn: HTMLElement = document.createElement('button');
    clearBtn.className = 'e-btn e-clear e-flat';
    clearBtn.textContent = 'Clear';
    footerElement.appendChild(clearBtn);
    this.element.appendChild(footerElement);
}
document.querySelector('.e-footer-container .e-clear').addEventListener('click', function () {
    calendar.value = null;
});
