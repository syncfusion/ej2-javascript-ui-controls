import { DateRangePicker, RangeEventArgs, RangePopupEventArgs } from '../../src/daterangepicker/daterangepicker';
/**
 * Events sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    change: onChange,
    select: onSelect,
    open: onOpen,
    close: onClose
});
daterangepicker.appendTo('#daterangepicker');

function onChange(args: RangeEventArgs) {
    /*Triggers when the value gets change*/
    alert('Change value : ' + args.value)
}
function onSelect(args: RangeEventArgs) {
    /*Triggers when the value gets select*/
    alert('Start date : ' + args.startDate + '\n'+'End date : ' + args.endDate);
}
function onOpen(args: RangePopupEventArgs) {
    /*Triggers when the popup gets open*/
    alert('Popup opened')
}
function onClose(args: RangePopupEventArgs) {
    /*Triggers when the popup gets close*/
    alert('Popup closed')
}
