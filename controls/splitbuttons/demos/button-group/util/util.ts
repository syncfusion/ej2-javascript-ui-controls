/**
 * Util Sample
 */
import { createButtonGroup } from './../../../src/button-group/index';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);
createButtonGroup('#groupbutton', {
    cssClass: 'e-outline',
    buttons: [
        { content: 'Day' },
        { content: 'Week' },
        { content: 'Work Week'},
        { content: 'Month'},
        { content: 'Year'}
    ]
});

createButtonGroup('#groupbutton1', {
    cssClass: 'e-primary',
    buttons: [
        { content: 'Left' },
        { content: 'Right', cssClass: 'e-success' },
        { content: 'Middle' }
    ]
});

createButtonGroup('#groupbutton2', {
    buttons: [
        { content: 'Day' },
        { content: 'Week', disabled: true },
        { content: 'Work Week'},
        { content: 'Month', disabled: true},
        { content: 'Year'}
    ]
});

createButtonGroup('#groupbutton3', {
    buttons: [
        { content: 'Day', disabled: true },
        { content: 'Week', disabled: true },
        { content: 'Work Week', disabled: true},
        { content: 'Month', disabled: true},
        { content: 'Year', disabled: true}
    ]
});

createButtonGroup('#groupbutton4', {
    buttons: [
        { content: 'Day' },
        { content: 'Week' },
        { content: 'Work Week'},
        { content: 'Month'},
        { content: 'Year'}
    ]
});