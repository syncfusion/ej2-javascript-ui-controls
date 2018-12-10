import { enableRipple, addClass, removeClass } from '@syncfusion/ej2-base';
import {
    Schedule, Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth, Resize, DragAndDrop
} from '../../src/schedule/index';
import { blockData } from '../../spec/schedule/base/datasource.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * schedule block intervals sample
 */
enableRipple(true);
Schedule.Inject(Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth, Resize, DragAndDrop);

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '550px',
    selectedDate: new Date(2017, 10, 1),
    currentView: 'Week',
    views: ['Day', 'Week', 'WorkWeek', 'Month', 'TimelineWeek', 'TimelineMonth'],
    eventSettings: {
        dataSource: blockData.slice(0, 14),
    }
});
scheduleObj.appendTo('#schedule');

document.getElementById('themechange').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('themechange') as HTMLSelectElement;
    let links: HTMLElement[] = [].slice.call(document.getElementsByTagName('link'));
    for (let link of links) {
        let hrefValue: string = link.getAttribute('href');
        if (hrefValue.indexOf('../css/') !== -1) {
            let currentTheme: string = hrefValue.indexOf('material') !== -1 ? 'material' :
                hrefValue.indexOf('fabric') !== -1 ? 'fabric' :
                    hrefValue.indexOf('bootstrap') !== -1 ? 'bootstrap' : 'highcontrast';
            link.setAttribute('href', hrefValue.replace(currentTheme, ddl.value));
        }
    }
};

document.getElementById('biggerclass').onchange = () => {
    let ddl: HTMLInputElement = document.getElementById('biggerclass') as HTMLInputElement;
    if (ddl.checked) {
        addClass([document.body], 'e-bigger');
    } else {
        removeClass([document.body], 'e-bigger');
    }
};
