import { Schedule } from '../../src/schedule/base/schedule';
import { Day } from '../../src/schedule/renderer/day';
import { Week } from '../../src/schedule/renderer/week';
import { WorkWeek } from '../../src/schedule/renderer/work-week';
import { Month } from '../../src/schedule/renderer/month';
import { Agenda } from '../../src/schedule/renderer/agenda';
import { defaultData } from '../../spec/schedule/base/datasource.spec';

/**
 * schedule validation sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

let minValidation: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
    return args['value'].length >= 5;
};

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    selectedDate: new Date(2017, 10, 1),
    eventSettings: {
        dataSource: defaultData,
        fields: {
            id: 'Id',
            subject: { name: 'Subject', validation: { required: true } },
            location: { name: 'Location', validation: { required: true } },
            description: {
                name: 'Description', validation: {
                    required: true, minLength: [minValidation, 'Need atleast 5 letters to be entered']
                }
            },
            startTime: { name: 'StartTime', validation: { required: true } },
            endTime: { name: 'EndTime', validation: { required: true } },
        }
    }
});
scheduleObj.appendTo('#schedule');