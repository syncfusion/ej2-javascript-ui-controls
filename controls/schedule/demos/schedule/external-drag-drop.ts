import { enableRipple, closest } from '@syncfusion/ej2-base';
import { Schedule, TimelineViews, TimelineMonth, Resize, DragAndDrop, ResourceDetails, Day, Week, WorkWeek, Month } from '../../src/schedule/index';
import '../../node_modules/es6-promise/dist/es6-promise';
import { TreeView, DragAndDropEventArgs } from '@syncfusion/ej2-navigations';

/**
 * schedule timeline views sample
 */
enableRipple(true);
Schedule.Inject(Day, Week, WorkWeek, Month, TimelineViews, TimelineMonth, Resize, DragAndDrop);

// Data source for Schedule control component
export let hospitalData: Object[] = [
    {
        Id: 1,
        Name: "David",
        StartTime: new Date(2018, 7, 1, 9, 0),
        EndTime: new Date(2018, 7, 1, 10, 0),
        Description: "Health Checkup",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 1,
        OwnerId: 1,
        DeptName: "GENERAL"
    }, {
        Id: 2,
        Name: "John",
        StartTime: new Date(2018, 7, 1, 10, 30),
        EndTime: new Date(2018, 7, 1, 11, 30),
        Description: "Monthly Treatment",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 2,
        OwnerId: 2,
        DeptName: "DENTAL"
    }, {
        Id: 3,
        Name: "Peter",
        StartTime: new Date(2018, 7, 1, 12, 0),
        EndTime: new Date(2018, 7, 1, 13, 0),
        Description: "Eye and Spectacles Checkup",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 1,
        OwnerId: 3,
        DeptName: "GENERAL"
    }, {
        Id: 4,
        Name: "Starc",
        StartTime: new Date(2018, 7, 1, 14, 0),
        EndTime: new Date(2018, 7, 1, 15, 0),
        Description: "Bone and Health Checkup ",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 2,
        OwnerId: 4,
        DeptName: "DENTAL"
    }, {
        Id: 5,
        Name: "James",
        StartTime: new Date(2018, 7, 1, 10, 0),
        EndTime: new Date(2018, 7, 1, 11, 0),
        Description: "Surgery Appointment",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 1,
        OwnerId: 5,
        DeptName: "GENERAL"
    }, {
        Id: 6,
        Name: "Jercy",
        StartTime: new Date(2018, 7, 1, 9, 30),
        EndTime: new Date(2018, 7, 1, 10, 30),
        Description: "Monthly Checkup for baby",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 2,
        OwnerId: 6,
        DeptName: "DENTAL"
    }, {
        Id: 7,
        Name: "Albert",
        StartTime: new Date(2018, 7, 2, 10, 0),
        EndTime: new Date(2018, 7, 2, 11, 30),
        Description: "Skin care treatment",
        IsAllDay: false,
        Recurrence: true,
        RecurrenceRule: "FREQ=DAILY;INTERVAL=1;COUNT=10",
        RoomId: 1,
        OwnerId: 7,
        DeptName: "GENERAL"
    }, {
        Id: 9,
        Name: "Louis",
        StartTime: new Date(2018, 7, 2, 12, 30),
        EndTime: new Date(2018, 7, 2, 13, 45),
        Description: "General Checkup",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 1,
        OwnerId: 9,
        DeptName: "GENERAL"
    }, {
        Id: 10,
        Name: "Williams",
        StartTime: new Date(2018, 7, 2, 12, 0),
        EndTime: new Date(2018, 7, 2, 14, 0),
        Description: "Master Checkup",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 2,
        OwnerId: 10,
        DeptName: "DENTAL"
    },
    {
        Id: 11,
        Name: "David",
        StartTime: new Date(2018, 7, 2, 16, 30),
        EndTime: new Date(2018, 7, 2, 18, 15),
        Description: "Eye checkup and Treatment",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 1,
        OwnerId: 1,
        DeptName: "GENERAL"
    }, {
        Id: 12,
        Name: "John",
        StartTime: new Date(2018, 7, 2, 19, 30),
        EndTime: new Date(2018, 7, 2, 21, 45),
        Description: "Skin Checkup and Treatment",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 2,
        OwnerId: 2,
        DeptName: "DENTAL"
    }, {
        Id: 13,
        Name: "Peter",
        StartTime: new Date(2018, 7, 3, 17, 30),
        EndTime: new Date(2018, 7, 3, 19, 30),
        Description: "Surgery Treatment",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 1,
        OwnerId: 3,
        DeptName: "GENERAL"
    }, {
        Id: 14,
        Name: "Starc",
        StartTime: new Date(2018, 7, 4, 18, 30),
        EndTime: new Date(2018, 7, 4, 21, 30),
        Description: "Complete Checkup after surgery",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 2,
        OwnerId: 4,
        DeptName: "DENTAL"
    }, {
        Id: 15,
        Name: "James",
        StartTime: new Date(2018, 7, 3, 19, 0),
        EndTime: new Date(2018, 7, 3, 21, 0),
        Description: "General Checkup",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 1,
        OwnerId: 5,
        DeptName: "GENERAL"
    }, {
        Id: 16,
        Name: "Jercy",
        StartTime: new Date(2018, 7, 4, 20, 0),
        EndTime: new Date(2018, 7, 4, 22, 0),
        Description: "Health Checkup",
        IsAllDay: false,
        Recurrence: false,
        RoomId: 2,
        OwnerId: 6,
        DeptName: "DENTAL"
    }];

// Hierarchical data source for first TreeView component
export let waitinglist: { [key: string]: Object }[] = [
    {
        Id: 1,
        Name: "Steven",
        StartTime: new Date(2018, 8, 3, 7, 30),
        EndTime: new Date(2018, 8, 3, 9, 30),
        Description: "Consulting",
        IsAllDay: false,
        Recurrence: false,
        DeptName: "GENERAL"
    },
    {
        Id: 2,
        Name: "Milan",
        StartTime: new Date(2018, 8, 4, 8, 30),
        EndTime: new Date(2018, 8, 4, 10, 30),
        Description: "Checkup",
        IsAllDay: false,
        Recurrence: false,
        DeptName: "DENTAL"
    },
    {
        Id: 3,
        Name: "Laura",
        StartTime: new Date(2018, 8, 4, 9, 30),
        EndTime: new Date(2018, 8, 4, 10, 30),
        Description: "Extraction",
        IsAllDay: false,
        Recurrence: false,
        DeptName: "GENERAL"
    },
    {
        Id: 4,
        Name: "Janet",
        StartTime: new Date(2018, 8, 3, 11, 0),
        EndTime: new Date(2018, 8, 3, 12, 30),
        Description: "Observation",
        IsAllDay: false,
        Recurrence: false,
        DeptName: "DENTAL"
    }
];


// Render the first TreeView by mapping its fields property with data source properties
let treeObj: TreeView = new TreeView({
    fields: { dataSource: waitinglist, id: 'Id', text: 'Name' },
    allowDragAndDrop: true,
    nodeDragStop: onTreeDragStop,
    nodeDragging: onItemDrag,
    nodeTemplate: '#treeTemplate',
    cssClass: 'treeview-external-drag'
});
treeObj.appendTo('#Tree');

// Used in templates to get time string
interface TemplateFunction extends Window {
    getRoomName?: Function;
    getImage?: Function;
}
(window as TemplateFunction).getRoomName = (value: ResourceDetails) => {
    return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField];
};
(window as TemplateFunction).getImage = (value: ResourceDetails) => {
    let resourceName: string = (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
    if (resourceName === "GENERAL" || resourceName === "DENTAL") {
        return '';
    } else {
        return "<img class='specialist-img' src='images/" + resourceName + ".png' />";
    }
};


let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '550px',
    selectedDate: new Date(2018, 7, 1),
    currentView: 'TimelineDay',
    eventDragArea: '.container-fluid',
    resourceHeaderTemplate: '#resource-template',
    cssClass: 'schedule-drag-drop',
    workHours: {
        start: '08:00',
        end: '18:00'
    },
    views: [
        { option: 'Day' },
        { option: 'Week' },
        { option: 'WorkWeek' },
        { option: 'Month' },
        { option: 'TimelineDay' },
        { option: 'TimelineMonth' }
    ],
    group: {
        enableCompactView: false,
        resources: ['Rooms', 'Owners']
    },
    resources: [
        {
            field: 'RoomId', title: 'Department',
            name: 'Rooms', allowMultiple: false,
            dataSource: [
                { Text: 'GENERAL', Id: 1, Color: '#56ca85' },
                { Text: 'DENTAL', Id: 2, Color: '#56ca85' }
            ],
            textField: 'Text', idField: 'Id', colorField: 'Color'
        },
        {
            field: 'OwnerId', title: 'Consultant',
            name: 'Owners', allowMultiple: false,
            dataSource: [
                { Name: "John Xavier", Text: "JohnXavier", Id: 1, GroupId: 1, Color: "#cb6bb2" },
                { Name: "Annie", Text: "Annie", Id: 2, GroupId: 2, Color: "#56ca85" },
                { Name: "Paul", Text: "Paul", Id: 3, GroupId: 1, Color: "#cb6bb2" },
                { Name: "Helen", Text: "Helen", Id: 4, GroupId: 2, Color: "#56ca85" },
                { Name: "Smith", Text: "Smith", Id: 5, GroupId: 1, Color: "#cb6bb2" },
                { Name: "George", Text: "George", Id: 6, GroupId: 2, Color: "#56ca85" },
                { Name: "Benita", Text: "Benita", Id: 7, GroupId: 1, Color: "#cb6bb2" }
            ],
            textField: 'Text', idField: 'Id', groupIDField: 'GroupId', colorField: 'Color'
        }
    ],
    eventSettings: {
        dataSource: hospitalData,
        fields: {
            subject: { title: 'Patient Name', name: 'Name' },
            startTime: { title: "From", name: "StartTime" },
            endTime: { title: "To", name: "EndTime" },
            description: { title: 'Reason', name: 'Description' }
        }
    },
    dragStop: onScheduleDragStop,
    drag: onItemDrag
});
scheduleObj.appendTo('#Schedule');

function onScheduleDragStop(args: any) {
    let targetEle: Element = <Element>closest(args.event.target, '.e-droppable');
    let childTargetEle: Element = <Element>closest(args.event.target, '.e-content-wrap') || <Element>closest(args.event.target, '.e-all-day-row');
    if ((targetEle && targetEle.classList.contains('e-treeview')) ||
        !(targetEle.classList.contains('e-schedule') && childTargetEle)) {
        args.cancel = true;
        if (targetEle.classList.contains('e-treeview')) {
            let scheduleData: { [key: string]: Object }[] = scheduleObj.eventSettings.dataSource as { [key: string]: Object }[];
            const filteredData = scheduleData.filter((item) => item.Id === args.data.Id);
            scheduleObj.deleteEvent(filteredData[0]);
            // update tree view data
            let newData: { [key: string]: Object }[] = treeObj.fields.dataSource as { [key: string]: Object }[];
            let maxId: number = Math.max.apply(Math, newData.map(function (data) { return data.Id; }));
            args.data.Id = maxId + 1;
            newData.push(args.data);
            treeObj.fields.dataSource = newData;
            treeObj.refresh();
        }
    }
}

function onItemDrag(event: any) {
    if (document.body.style.cursor === "not-allowed") {
        document.body.style.cursor = '';
    }
}

function onTreeDragStop(event: DragAndDropEventArgs): void {
    let targetEle: Element = <Element>closest(event.target, '.e-schedule');
    if (targetEle) {
        event.cancel = true;
        let td: any = targetEle.querySelector('.e-work-cells:hover');
        let treeviewData: { [key: string]: Object }[] = treeObj.fields.dataSource as { [key: string]: Object }[];
        const filteredData = treeviewData.filter((item) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
        let detail: any = scheduleObj.getCellDetails(td);
        let data: { [key: string]: Object }[] = [];
        data = treeObj.fields.dataSource as { [key: string]: Object }[];
        const filteredPeople = data.filter((item) => item.Id !== parseInt(event.draggedNodeData.id as string, 10));
        treeObj.fields.dataSource = filteredPeople;
        treeObj.refresh();
        let elements: NodeListOf<HTMLElement> = document.querySelectorAll('.e-drag-item.treeview-external-drag');
        for (let i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
        detail["Name"] = filteredData[0].Name;
        detail["Description"] = filteredData[0].Description;
        scheduleObj.openEditor(detail, 'Add');
    }
}