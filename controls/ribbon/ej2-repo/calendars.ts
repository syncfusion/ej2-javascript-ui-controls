import * as index from '@syncfusion/ej2-calendars';
index.Calendar.Inject( index.Islamic);
index.DatePicker.Inject( index.Islamic,index.MaskedDateTime);
index.TimePicker.Inject( index.MaskedDateTime);
index.DateTimePicker.Inject( index.Islamic,index.MaskedDateTime);
export * from '@syncfusion/ej2-calendars';
