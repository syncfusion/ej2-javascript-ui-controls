import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DataManager, Query } from '@syncfusion/ej2-data';
import {
    BpmnShapeModel,
    ConnectorModel, DataBinding, FlowchartLayout, FlowShapeModel, NodeModel,
} from '../../../src/diagram/index';
Diagram.Inject(FlowchartLayout,DataBinding);
const employeeData1 = [
    {
        empId: "1",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "2",
        parentId: ["1"],
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#3dbfc9"
    },
    {
        empId: "3",
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "4",
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#B22222"
    }
];
const employeeData2 = [
    {
        empId: "1",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#B22222"
    },
    {
        empId: "2",
        parentId: ["1"],
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "3",
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "4",
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#3dbfc9"
    },
    {
        empId: "5",
        parentId: ["3"],
        shape: "StartOrEnd",
        width: 50,
        height: 50,
        color: "#034d6d"
    }
];
const employeeData3 = [
    {
        empId: "1",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#3dbfc9"
    },
    {
        empId: "2",
        parentId: ["1"],
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "3",
        parentId: ["2", "4"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#B22222"
    },
    {
        empId: "4",
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#1b80c6"
    }
];
const employeeData4 = [
    {
        empId: "1",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "2",
        parentId: ["1"],
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#1b80c6"
    },
    {
        empId: "3",
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#3dbfc9"
    },
    {
        empId: "4",
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "5",
        parentId: ["3", "4"],
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#B22222"
    }
];

const employeeData5 = [
    {
        empId: "1",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "2",
        parentId: ["1", "3"],
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#3dbfc9"
    },
    {
        empId: "3",
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "4",
        parentId: ["3"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#B22222"
    }
];

const employeeData6 = [
    {
        empId: "1",
        name: "",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "3",
        name: "Yes",
        parentId: ["1"],
        shape: "Decision",
        width: 100,
        height: 50,
        color: "#1b80c6"
    },
    {
        empId: "4",
        label: ["yes"],
        parentId: ["3"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#3dbfc9"
    },
    {
        empId: "5",
        label: ["No"],
        parentId: ["3"],
        shape: "Decision",
        width: 70,
        height: 50,
        color: "#3dbfc9"
    },
    {
        empId: "6",
        parentId: ["4", "7"],
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#B22222"
    },
    {
        empId: "7",
        label: ["yes"],
        parentId: ["5"],
        shape: "Ellipse",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "8",
        label: ["No"],
        parentId: ["5"],
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "9",
        label: ["yes"],
        parentId: ["8"],
        shape: "Ellipse",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "10",
        label: ["No"],
        parentId: ["8"],
        shape: "Ellipse",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    }
];

const employeeData7 = [
    {
        empId: "1",
        name: "Start",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "2",
        parentId: ["1"],
        name: "Editing",
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "3",
        name: "No Editing",
        label: ["No"],
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "4",
        name: "Yes Editing",
        label: ["Yes"],
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "5",
        parentId: ["3", "4"],
        name: "End",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#034d6d"
    }
];

const employeeData8 = [
    {
        empId: "1",
        name: "Start",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "2",
        parentId: ["1"],
        name: "process",
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "3",
        parentId: ["2", "6"],
        label: ["No"],
        name: "Decision",
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "4",
        parentId: ["3"],
        name: "process",
        label: ["Yes"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "5",
        parentId: ["3", "4"],
        name: "process1",
        label: ["No"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "6",
        parentId: ["5"],
        name: "Decision1",
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "7",
        parentId: ["6"],
        name: "End",
        label: ["Yes"],
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#034d6d"
    }
];

const employeeData9 = [
    {
        empId: "1",
        name: "Start",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "2",
        name: "Editing",
        parentId: ["1"],
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "3",
        name: "No Editing",
        label: ["No"],
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "4",
        name: "Yes Editing",
        label: ["Yes"],
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "5",
        name: "End",
        shape: "Terminator",
        parentId: ["3", "4"],
        width: 50,
        height: 50,
        color: "#034d6d"
    }
];

const employeeData10 = [
    {
        empId: "1",
        name: "start",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "2",
        name: "process",
        parentId: ["1"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "4",
        name: "Process",
        label: ["Yes"],
        parentId: null,
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "5",
        name: "Decision",
        parentId: ["4"],
        label: ["No"],
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "6",
        name: "Decision",
        parentId: ["5"],
        label: ["Yes"],
        shape: "Decision",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    }
];

const employeeData11 = [
    {
        empId: "1",
        name: "Start",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "2",
        name: "prepare",
        parentId: ["1"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "3",
        name: "process",
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "4",
        name: "data",
        parentId: ["3"],
        shape: "Ellipse",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "5",
        name: "Done?",
        parentId: ["3"],
        shape: "Ellipse",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "6",
        name: "ENd",
        label: ["Yes"],
        parentId: ["5"],
        shape: "Ellipse",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    }
];

const employeeData12 = [
    {
        empId: "1",
        name: "patient",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "2",
        name: "process",
        parentId: ["1"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "3",
        name: "Made",
        label: ["Yes"],
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "4",
        name: "exclude",
        label: ["No"],
        parentId: ["2"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "5",
        name: "tx works",
        parentId: ["3"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    },
    {
        empId: "6",
        name: "risk avoided",
        parentId: ["4"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#FFC0CB"
    }
];

const employeeData13 = [
    {
        empId: "1",
        name: "Start",
        shape: "Terminator",
        width: 50,
        height: 50,
        color: "#034d6d"
    },
    {
        empId: "2",
        name: "alaram rings",
        parentId: ["1"],
        shape: "Rectangle",
        width: 50,
        height: 50,
        color: "#034d6d"
    }
];

const employeeData14 = [
    {
        "empId": "1",
        "name": "Start",
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Gather Customer Data",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Campaign",
        "parentId": ["2", "6"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Success",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Opportunity for sales",
        "label": ["Yes"],
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Rethink Strategy",
        "label": ["No", ""],
        "parentId": ["4", "8"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Buy",
        "parentId": ["5"],
        "shape": "Decision",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Unsuccessful Sale",
        "label": ["No"],
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Successful Sale",
        "label": ["Yes"],
        "parentId": ["7"],
        "shape": "Terminator",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData15 = [
    {
        "empId": "1",
        "name": "Start",
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "S = 12",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "enter p",
        "parentId": ["2"],
        "shape": "Data",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "is p even",
        "parentId": ["3", "7"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "p = p+1",
        "label": ["Yes"],
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Is p prime?",
        "label": ["No"],
        "parentId": ["4"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "p = p + 2",
        "label": ["No", "", "No"],
        "parentId": ["6", "9", "11"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "is p < S",
        "label": ["Yes"],
        "parentId": ["6"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "S = S - p",
        "label": ["Yes"],
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "S = S - 1",
        "label": ["No"],
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Does S = 0",
        "parentId": ["10"],
        "shape": "Decision",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "Output p",
        "label": ["Yes"],
        "parentId": ["11"],
        "shape": "Data",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "13",
        "name": "Stop",
        "parentId": ["12"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData16 = [
    {
        "empId": "1",
        "name": "Start",
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Do I Want to do this?",
        "parentId": ["1"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Will it likely end in disaster?",
        "label": ["Yes"],
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Would it make a good story?",
        "label": ["Yes"],
        "parentId": ["3"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Do it",
        "label": ["Yes", "No"],
        "parentId": ["4", "3"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Dont Do it",
        "label": ["No", "No"],
        "parentId": ["4", "2"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData17 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId":null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "2",
        "name": "prepare",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "3",
        "name": "process",
        "parentId": ["2", "4", "5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "4",
        "name": "data",
        "parentId": ["3"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "5",
        "name": "Done?",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "6",
        "name": "ENd",
        "label": ["Yes"],
        "parentId": ["5"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    }
];

const employeeData18 = [
    {
        "empId": "1",
        "name": "start",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "2",
        "name": "process",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "3",
        "name": "Process",
        "parentId": ["2", "5"],
        "label": ["No"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "4",
        "name": "Process",
        "parentId": ["3"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "5",
        "name": "Decision",
        "parentId": ["3", "4"],
        "label": ["No"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "6",
        "name": "Decision",
        "parentId": ["5"],
        "label": ["Yes"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "7",
        "name": "Decision",
        "parentId": ["6"],
        "label": ["Yes"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    }
];

const employeeData19 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "multiplicate",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Q0=0?",
        "parentId": ["2", "6"],
        "label": ["No"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "C=A+M?",
        "parentId": ["3"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Shift, Count",
        "parentId": ["3", "4"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Count=n?",
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "End",
        "parentId": ["6"],
        "label": ["Yes"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
]

const employeeData20 = [
    {
        "empId": "1",
        "name": "Order place",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Transection started",
        "parentId": ["1", "6"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Validate through visa",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "credit card valid",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Funds available?",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Customer enter new payment method",
        "parentId": ["4", "5"],
        "label": ["No", "No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Customer completed in order sysytem",
        "parentId": ["5"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Customer information data base",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Customer sent receipt in mail",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Transection enterened in ledger",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "entries are reconcel at end of the month",
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData21 = [
    {
        "empId": "1",
        "name": "purchase process",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Complete purchase request form",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Approved",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Purchase request",
        "parentId": ["3"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Credit card or cash?",
        "parentId": ["3"],
        "label": ["Yes"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Is it independent contractor?",
        "parentId": ["5"],
        "label": ["Cash"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "IC's agreement filled or not",
        "parentId": ["6"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Obtain PO form controller",
        "parentId": ["6", "7"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Invoice P.O",
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Fill out CCPR",
        "parentId": ["5"],
        "label": ["Credit card"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Invoice CCPR",
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "Document to controller for approval",
        "parentId": ["9", "11"],
        "label": ["To controller"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];
const employeeData22 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Login",
        "parentId": ["1", "7"],
        "label": ["", "No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "5",
        "name": "Authorized",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "6",
        "name": "Access Granted",
        "parentId": ["5", "8"],
        "label": ["Yes", "No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#B22222"
    },
    {
        "empId": "7",
        "name": "Attempted 3 Times",
        "parentId": ["5"],
        "label": ["No"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "8",
        "name": "Exit Module",
        "parentId": ["6"],
        "shape": "Decision",
        "width": 100,
        "height": 100,
        "color": "#FFC0CB"
    },
    {
        "empId": "9",
        "name": "Start",
        "parentId": ["8", "7"],
        "label": ["Yes"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    }
];

const employeeData23 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Look Outside",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Is it Raining",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Look for Umbrella",
        "parentId": ["5", "10"],
        "label": ["Yes", "Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Leave Umbrella",
        "parentId": ["5"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Did you find it?",
        "parentId": ["6"],
        "shape": "Decision",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Finish",
        "parentId": ["8", "7", "11"],
        "label": ["Yes", "", ""],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Is it still raining",
        "parentId": ["8"],
        "label": ["No"],
        "shape": "Decision",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Leave Umbrella",
        "parentId": ["10"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData24 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 30,
        "color": "#B22222"
    },
    {
        "empId": "2",
        "name": "Look for the lost item",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "3",
        "name": "Did you find it",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "4",
        "name": "Do you need it",
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["No"],
        "color": "#B22222"
    },
    {
        "empId": "5",
        "name": "stop looking",
        "parentId": ["3", "4"],
        "shape": "Terminator",
        "width": 50,
        "height": 30,
        "label": ["Yes", "No"],
        "color": "#034d6d"
    }
];

const employeeData25 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 30,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Look for the lost item",
        "parentId": ["1", "4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["", "Yes"],
        "color": "#FFC0CB"
    },
    {
        "empId": "3",
        "name": "Did you find it",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#B22222"
    },
    {
        "empId": "4",
        "name": "Do you need it",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "label": ["No"],
        "color": "#1b80c6"
    },
    {
        "empId": "5",
        "name": "stop looking",
        "parentId": ["3", "4"],
        "shape": "Terminator",
        "width": 50,
        "height": 30,
        "label": ["Yes", "No"],
        "color": "#034d6d"
    }
]

const employeeData26 = [
    {
        "empId": "1",
        "name": "",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Yes",
        "parentId": ["1"],
        "shape": "Decision",
        "width": 100,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "4",
        "name": "",
        "label": ["yes"],
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "5",
        "name": "",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "6",
        "name": "",
        "parentId": ["4", "7"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#B22222"
    },
    {
        "empId": "7",
        "name": "",
        "label": ["yes"],
        "parentId": ["5"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "8",
        "name": "",
        "label": ["No"],
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "9",
        "name": "",
        "label": ["yes"],
        "parentId": ["8"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "10",
        "name": "",
        "label": ["No"],
        "parentId": ["8"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    }
];

const employeeData27 = [
    {
        "empId": "1",
        "name": "Begin",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Input",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "5",
        "name": "Decision",
        "parentId": ["4"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "6",
        "name": "",
        "label": ["Yes"],
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#B22222"
    },
    {
        "empId": "7",
        "name": "",
        "label": ["No"],
        "parentId": ["5", "9"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "8",
        "name": "Delay",
        "parentId": ["6"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "9",
        "name": "Output",
        "parentId": ["8"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "10",
        "name": "End",
        "parentId": ["7"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    }
];

const employeeData28 = [
    {
        "empId": "1",
        "name": "Begin",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Reduce Step Size",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "4",
        "name": "",
        "parentId": ["3"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "5",
        "name": "Mode Decision",
        "parentId": ["4"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "6",
        "name": "",
        "label": ["Yes"],
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#B22222"
    },
    {
        "empId": "7",
        "name": "",
        "label": ["No"],
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "8",
        "name": "",
        "parentId": ["6", "7"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "9",
        "name": "Enable Migration",
        "parentId": ["8"],
        "shape": "Decision",
        "width": 150,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "10",
        "name": "Migration",
        "label": ["Yes"],
        "parentId": ["9"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "11",
        "name": "",
        "label": ["No"],
        "parentId": ["9", "10"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "12",
        "name": "",
        "parentId": ["11"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "13",
        "name": "End of Phase",
        "label": ["Yes"],
        "parentId": ["12"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    }
];

const employeeData29 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 70,
        "height": 40,
        "color": "#1b80c6"
    },
    {
        "empId": "2",
        "name": "New Search Process",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "3",
        "name": "Set index to 1; Set found to false",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "4",
        "name": "While found=false and not at end of array",
        "parentId": ["3", "7", "9"],
        "label": ["No"],
        "shape": "Decision",
        "width": 100,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "5",
        "name": "If found = true",
        "parentId": ["4"],
        "label": ["No"],
        "shape": "Decision",
        "width": 100,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "6a",
        "name": "Item not found",
        "label": ["No"],
        "parentId": ["5"],
        "shape": "StartOrEnd",
        "width": 70,
        "height": 40,
        "color": "#1b80c6"
    },
    {
        "empId": "6b",
        "name": "Item found",
        "label": ["Yes"],
        "parentId": ["5"],
        "shape": "StartOrEnd",
        "width": 70,
        "height": 40,
        "color": "#1b80c6"
    },
    {
        "empId": "7",
        "name": "If item = search",
        "parentId": ["4"],
        "label": ["Yes"],
        "shape": "Decision",
        "width": 100,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "8",
        "name": "Location = index",
        "parentId": ["7"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "9",
        "name": "Found = true",
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#1b80c6"
    }
];

const employeeData30 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "2",
        "name": "prepare",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "3",
        "name": "process",
        "parentId": ["2", "4", "5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "4",
        "name": "data",
        "parentId": ["3"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "5",
        "name": "Done?",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "6",
        "name": "ENd",
        "label": ["Yes"],
        "parentId": ["5"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    }
];

const employeeData31 = [
    {
        "empId": "1",
        "name": "start",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "2",
        "name": "process",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "3",
        "name": "Process",
        "parentId": ["2", "5"],
        "label": ["No"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "4",
        "name": "Process",
        "label": ["Yes"],
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "5",
        "name": "Decision",
        "label": ["No"],
        "parentId": ["3", "4"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "6",
        "name": "Decision",
        "label": ["Yes"],
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "7",
        "name": "Decision",
        "label": ["Yes"],
        "parentId": ["6"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    }
];

const employeeData32 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "multiplicate",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Q0=0?",
        "parentId": ["2", "6"],
        "label": ["No"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "C=A+M?",
        "parentId": ["3"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Shift, Count",
        "parentId": ["3", "4"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Count=n?",
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "End",
        "parentId": ["6"],
        "label": ["Yes"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData33 = [
    {
        "empId": "1",
        "name": "Order place",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Transaction started",
        "parentId": ["1", "6"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Validate through visa",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Credit card valid",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Funds available?",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Customer enter new payment method",
        "parentId": ["4", "5"],
        "label": ["No", "No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Customer completed in order system",
        "parentId": ["5"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Customer information database",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Customer sent receipt in mail",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Transaction entered in ledger",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Entries are reconciled at end of the month",
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData34 = [
    {
        "empId": "1",
        "name": "purchase process",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Complete purchase request form",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Approved",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Purchase request",
        "parentId": ["3"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Credit card or cash?",
        "parentId": ["3"],
        "label": ["Yes"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Is it independent contractor?",
        "parentId": ["5"],
        "label": ["Cash"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "IC's agreement filled or not",
        "parentId": ["6"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Obtain PO from controller",
        "parentId": ["6", "7"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Invoice PO",
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Fill out CCPR",
        "parentId": ["5"],
        "label": ["Credit card"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Invoice CCPR",
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "Document to controller for approval",
        "parentId": ["9", "11"],
        "label": ["To controller"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData35 = [
    {
        "empId": "1",
        "name": "New User",
        "parentId": null,
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "User Configuration",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Allow user registration",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Display registration form unavailable",
        "parentId": ["3"],
        "label": ["No"],
        "shape": "Delay",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Display registration form available",
        "parentId": ["3"],
        "label": ["Yes"],
        "shape": "Delay",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "New user account activation",
        "parentId": ["3"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "User activated",
        "parentId": ["6"],
        "label": ["None"],
        "shape": "Terminator",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "User sent email confirmation",
        "parentId": ["6"],
        "label": ["None"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Administrator activates account",
        "parentId": ["6"],
        "label": ["None"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Account not activated",
        "parentId": ["8"],
        "label": ["No Reply"],
        "shape": "Terminator",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Account activated",
        "parentId": ["8", "9"],
        "label": ["Reply"],
        "shape": "Terminator",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData36 = [
    {
        "empId": "1",
        "name": "New technology request",
        "parentId": null,
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "IT leadership assessment",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Meets project criteria?",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Service request",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Project proposal",
        "label": ["Yes"],
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Division head approval?",
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Technology committee approval",
        "label": ["Yes"],
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Committee approval?",
        "parentId": ["7"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Project charter",
        "label": ["Yes"],
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Division head approval",
        "parentId": ["9"],
        "shape": "Decision",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Denied",
        "label": ["No", "No", "No"],
        "parentId": ["10", "8", "6"],
        "shape": "Terminator",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "Project funding",
        "label": ["Yes"],
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "13",
        "name": "Budget approved?",
        "parentId": ["12", "14"],
        "shape": "Decision",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "14",
        "name": "Rework budget",
        "label": ["No"],
        "parentId": ["13"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "15",
        "name": "Implementation",
        "label": ["Yes"],
        "parentId": ["13"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "16",
        "name": "Project sign-off",
        "parentId": ["15"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "17",
        "name": "Sponsor sign-off",
        "parentId": ["16"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "18",
        "name": "SLA",
        "parentId": ["17"],
        "shape": "Terminator",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData37 = [
    {
        "empId": "1",
        "name": "New incident",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Detection and recording",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Classification and initial support",
        "parentId": ["2", "9"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Investigation and diagnosis",
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Revolution and recovery",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Resolved",
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Closing",
        "label": ["Yes"],
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Close incident",
        "parentId": ["7"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Escalation",
        "label": ["No"],
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData38 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Decision",
        "parentId": ["1"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Step 1",
        "label": ["Yes"],
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Step 2",
        "label": ["No"],
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Step 3",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "End",
        "parentId": ["5", "3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData39 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Step 1",
        "parentId": ["1", "4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Decision",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Step 2",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "End",
        "label": ["Yes"],
        "parentId": ["3"],
        "shape": "Terminator",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData40 = [
    {
        "empId": "1",
        "name": "Step 1",
        "parentId": null,
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Decision 1",
        "parentId": ["1"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Decision 2",
        "label": ["No"],
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Decision 3",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Step 5",
        "label": ["No"],
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Step 2",
        "label": ["Yes"],
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Step 3",
        "label": ["Yes"],
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Step 4",
        "label": ["Yes"],
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData41 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Step 1",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Step 2",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Step 3",
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Step 4",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "End",
        "parentId": ["5"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData42 =[
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Step 1",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Decision 1",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Step 2",
        "label": ["Yes"],
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Decision 2",
        "parentId": ["4"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Step 3",
        "label": ["Yes"],
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Step 4",
        "label": ["No"],
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "End",
        "parentId": ["6"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "End",
        "parentId": ["7"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "End",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData43 = [
    {
        "empId": "1",
        "name": "A",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Contact vendor",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#1b80c6"
    },
    {
        "empId": "4",
        "name": "Receive quote",
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "5",
        "name": "Agree to terms?",
        "parentId": ["4"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#3dbfc9"
    },
    {
        "empId": "6",
        "name": "B",
        "label": ["Yes", "Yes"],
        "parentId": ["5", "8"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#B22222"
    },
    {
        "empId": "7",
        "name": "Renegotiate",
        "label": ["No"],
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "8",
        "name": "Is Renegotiable amend",
        "parentId": ["7"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    },
    {
        "empId": "9",
        "name": "Stop",
        "label": ["No"],
        "parentId": ["8"],
        "shape": "Ellipse",
        "width": 50,
        "height": 50,
        "color": "#FFC0CB"
    }
];

const employeeData44 = [
    {
        "empId": "1",
        "name": "President consults",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Nomination sent to Senate",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "the comitted collect recordes",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Hearing?",
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Comiite votes",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Recomentation sent",
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "the sentae votes on nomination",
        "parentId": ["6", "9"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "filbuster",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Cloture vote?",
        "parentId": ["8"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Approved by majority?",
        "parentId": ["9"],
        "label": ["Yes"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Nomiee swornm in supreme ",
        "parentId": ["10"],
        "label": ["Yes"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "Nimination declies ",
        "parentId": ["10"],
        "label": ["No"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData45 = [
    {
        "empId": "1",
        "name": "Ordering supplies",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Complete supplies purchase",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Submit for Approvel?",
        "parentId": ["2", "5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Approved?",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Amedn orde for meet requriment",
        "label": ["No"],
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Submit approved pruchase",
        "label": ["Yes"],
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Receive purchase order",
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Contect vender",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];
const employeeData46 = [
    {
        "empId": "1",
        "name": "Customer paymeny processing",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "recevie payment in mail",
        "parentId": ["1", "13"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Does payment corrrespond to outstanding invoice?",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Forward copy of check to slaes",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "create invoice for order",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "match payment for invoice",
        "label": ["yes"],
        "parentId": ["3", "5"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "amount match?",
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "is discreprency over?",
        "label": ["no"],
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "write discreprency",
        "label": ["no"],
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "is discreprency over payment?",
        "label": ["Yes"],
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Recording recepit in account system?",
        "label": ["Yes"],
        "parentId": ["7", "9", "12"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "Issue refund for amount?",
        "label": ["Yes"],
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "13",
        "name": "Contect customer to request for balance",
        "label": ["No"],
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData47 = [
    {
        "empId": "1",
        "name": "Patient arrives",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "patient in the system?",
        "parentId": ["1", "3", "5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Patient need to complete the paper work",
        "label": ["No"],
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Is nurse availabe?",
        "label": ["Yes"],
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Waiting in room",
        "label": ["No"],
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Test bloodd pressure, weight, urine",
        "label": ["Yes"],
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Is doctor available?",
        "parentId": ["6", "8"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "wait in room",
        "label": ["No"],
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "patient with doctor",
        "label": ["Yes"],
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Need follow-up appoinment",
        "parentId": ["9"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Need modificaion?",
        "label": ["No"],
        "parentId": ["10"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "Patient send to pharmecy",
        "label": ["Yes"],
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "13",
        "name": "Dispense medication",
        "parentId": ["12"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "14",
        "name": "leave patient",
        "label": ["No"],
        "parentId": ["11", "13"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "15",
        "name": "Make an appoinment",
        "label": ["Yes"],
        "parentId": ["10", "14"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData48 = [
    {
        "empId": "1",
        "name": "collect late payment",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Send collection letter",
        "parentId": ["1"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "patient received within 1 week?",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Accounting assistant calls for payment",
        "parentId": ["3"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Payment received?",
        "parentId": ["4"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Forward Payment to processing",
        "parentId": ["5", "3"],
        "label": ["Yes", "Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Payment is $10000 ?",
        "parentId": ["5"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Write off-invoice is closed.",
        "parentId": ["7"],
        "label": ["No"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Contact collection agency",
        "parentId": ["7"],
        "label": ["Yes"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "end",
        "parentId": ["9", "8", "6"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];

const employeeData49 = [
    {
        "empId": "1",
        "name": "Establish need",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 30,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Supplies/Equipment",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Make a list of what is needed/along with details/reasons",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Fill out request form",
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Submit request form",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Request accepted?",
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Is equipment available for employee pickup?",
        "parentId": ["6"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Fill out purchase requisition",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Order from appropriate supplier",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Supplies delivered",
        "parentId": ["9"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Add to inventory",
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "Purchase",
        "parentId": ["8", "11"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 30,
        "color": "#034d6d"
    },
    {
        "empId": "13",
        "name": "Medical Personal/Facility",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "14",
        "name": "Is the hospital more than 1 hour away?",
        "parentId": ["13"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "15",
        "name": "Determine level of first aid needed (rate and severity of injuries)",
        "parentId": ["14"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "16",
        "name": "If injury occurs, employee sent to hospital",
        "parentId": ["14"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 30,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "17",
        "name": "Onsite registered medical personnel needed?",
        "parentId": ["15"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "18",
        "name": "Need to interview registered medical personnel",
        "parentId": ["17"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "19",
        "name": "Need to train employee in first aid",
        "parentId": ["17"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 30,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "20",
        "name": "Hire medical personnel",
        "parentId": ["18"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 30,
        "color": "#034d6d"
    }
];

const employeeData50 = [
    {
        "empId": "1",
        "name": "Receive imaging request from MD or PA",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 30,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Complete corresponding imaging request form",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Submit imaging request form",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Approval?",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Make corrections and re-submit form",
        "parentId": ["4", "3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Receive test schedule from lab",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Receive and review patient's information",
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Perform imaging procedure",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Enter results into PACS",
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "MD receives?",
        "parentId": ["9"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Retransmit images and add to patient file",
        "parentId": ["10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "MD analyzes test results",
        "parentId": ["10", "11"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "13",
        "name": "Archive images for future review",
        "parentId": ["12"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 30,
        "color": "#034d6d"
    }
];
const employeeData51 = [
    {
        "empId": "1",
        "name": "Patient arrives at Hospital with fatal injuries",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 100,
        "height": 30,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Can Patient be stabilized?",
        "parentId": ["1"],
        "shape": "Decision",
        "width": 100,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Patient Treated and released when stable",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "MD analyzes test results",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Permission to transplant organs",
        "parentId": ["4"],
        "shape": "Decision",
        "width": 100,
        "height": 70,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Patient transferred to funeral home",
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Specially trained nurse and surgeon from organ donation center prepare organs for donation",
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Donor's information entered into UNOS database",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Organ retrieved and prepped for transplant",
        "parentId": ["8", "10"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Recipient and donor organ ready?",
        "parentId": ["9"],
        "shape": "Decision",
        "width": 100,
        "height": 70,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Transplant Occur",
        "parentId": ["10"],
        "shape": "StartOrEnd",
        "width": 100,
        "height": 30,
        "color": "#034d6d"
    }
];

const employeeData52 = [
    {
        "empId": "1",
        "name": "Patient arrives at Hospital with fatal injuries",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 100,
        "height": 30,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Can Patient be stabilized?",
        "parentId": ["1"],
        "shape": "Decision",
        "width": 100,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Patient Treated and released when stable",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "MD analyzes test results",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Permission to transplant organs",
        "parentId": ["4"],
        "shape": "Decision",
        "width": 100,
        "height": 70,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Patient transferred to funeral home",
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Specially trained nurse and surgeon from organ donation center prepare organs for donation",
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Donor's information entered into UNOS database",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Organ retrieved and prepped for transplant",
        "parentId": ["8", "10"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Recipient and donor organ ready?",
        "parentId": ["9"],
        "shape": "Decision",
        "width": 100,
        "height": 70,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Transplant Occur",
        "parentId": ["10", "16"],
        "shape": "StartOrEnd",
        "width": 100,
        "height": 30,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "name": "Organ recipients' evaluated",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 100,
        "height": 30,
        "color": "#034d6d"
    },
    {
        "empId": "13",
        "name": "Transplant recipients registered with UNOS",
        "parentId": ["12"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "14",
        "name": "Transplant recipient matched with organ in UNOS",
        "parentId": ["13"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "15",
        "name": "Patient brought to hospital and transplant team assembled",
        "parentId": ["14"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "16",
        "name": "Patient prepped for surgery",
        "parentId": ["15", "17"],
        "shape": "Rectangle",
        "width": 100,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "17",
        "name": "Recipient and donor organ read?",
        "parentId": ["16"],
        "shape": "Decision",
        "width": 100,
        "height": 70,
        "color": "#034d6d"
    }
];
const employeeData53 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Declare Variables fterm , sterm and temp",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "fterm <-- 0 sterm <-- 1",
        "parentId": ["2"],
        "shape": "Data",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Is sterm <= 1000",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Stop",
        "parentId": ["4"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Display sterm",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "temp <-- sterm",
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "sterm <-- sterm + fterm",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "fterm <-- temp",
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData54 = [
    {
        "empId": "1",
        "name": "Start",
        "parentId": null,
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Declare Variables fterm , sterm and temp",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "fterm <-- 0 sterm <-- 1",
        "parentId": ["2", "9"],
        "shape": "Data",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Is sterm <= 1000",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 70,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Stop",
        "parentId": ["4"],
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Display sterm",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "temp <-- sterm",
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "sterm <-- sterm + fterm",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "fterm <-- temp",
        "parentId": ["8"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData55 = [
    {
        "empId": "1",
        "name": "Identify purpose of design",
        "parentId": null,
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Specify requirements",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Brainstorm options",
        "parentId": ["2", "11"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Finalize an idea",
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 70,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Develop Prototype",
        "parentId": ["4", "10"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "label": ["", "Yes"],
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Successful prototype?",
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Communicate result",
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Refine design",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "End",
        "parentId": ["8"],
        "shape": "StartOrEnd",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Can the problem be fixed?",
        "parentId": ["6"],
        "shape": "Decision",
        "width": 100,
        "height": 100,
        "label": ["No"],
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "name": "Abandon Prototype",
        "parentId": ["10"],
        "shape": "Decision",
        "width": 100,
        "height": 100,
        "label": ["No"],
        "color": "#034d6d"
    }
];

const employeeData56 = [
    {
        "empId": "1",
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "label": ["Yes"],
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 70,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "Document",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "parentId": ["8"],
        "shape": "Document",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "parentId": ["9"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "parentId": ["10", "7", "15"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "parentId": ["11"],
        "shape": "Document",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "13",
        "parentId": ["12"],
        "shape": "StartOrEnd",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "14",
        "parentId": ["5"],
        "shape": "Document",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "15",
        "parentId": ["14"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData57 = [
    {
        "empId": "1",
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "label": ["Yes"],
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 70,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "parentId": ["3"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "label": ["No"],
        "parentId": ["3"],
        "shape": "Document",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "parentId": ["8"],
        "shape": "Document",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "parentId": ["9"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "11",
        "parentId": ["10", "7", "15"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "12",
        "parentId": ["11"],
        "shape": "Document",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "13",
        "parentId": ["12"],
        "shape": "StartOrEnd",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "14",
        "parentId": ["5"],
        "shape": "Document",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "15",
        "parentId": ["14"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData58 = [
    {
        "empId": "1",
        "name": "Start",
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "New Search Process",
        "parentId": ["1"],
        "shape": "Activity",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Set index to 1; Set found to false",
        "parentId": ["2"],
        "shape": "Activity",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "While found = false and not at end of array",
        "label": ["", "No", ""],
        "parentId": ["3", "5", "8"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "If item = search",
        "label": ["Yes"],
        "parentId": ["4"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "If found = true",
        "label": ["No"],
        "parentId": ["4"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Location = index",
        "label": ["Yes"],
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Found = true",
        "parentId": ["7"],
        "shape": "Activity",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Item not found",
        "label": ["No"],
        "parentId": ["6"],
        "shape": "Document",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Item foundd",
        "label": ["Yes"],
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData59 = [
    {
        "empId": "1",
        "name": "Start",
        "shape": "StartOrEnd",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Turn On Computer",
        "parentId": ["1"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Did it boot up?",
        "parentId": ["2"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Login with password",
        "label": ["Yes", "Yes"],
        "parentId": ["3", "8"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Is it plugged in ?",
        "label": ["No", "No"],
        "parentId": ["3", "6"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Are you sure?",
        "label": ["Yes"],
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Plug it in",
        "label": ["No"],
        "parentId": ["5"],
        "shape": "Rectangle",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Did this fix the problem",
        "parentId": ["7"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "The computer is broken",
        "label": ["No", "Yes"],
        "parentId": ["8", "6"],
        "shape": "Document",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "Finish",
        "parentId": ["9", "4"],
        "shape": "StartOrEnd",
        "width": 100,
        "height": 100,
        "color": "#034d6d"
    }
];

const employeeData60 = [
    {
        "empId": "1",
        "name": "Process",
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "2",
        "name": "Decision",
        "parentId": ["1"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "3",
        "name": "Process",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "4",
        "name": "Decision",
        "parentId": ["3"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "5",
        "name": "Process",
        "parentId": ["4"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "6",
        "name": "Decision",
        "parentId": ["5"],
        "shape": "Decision",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "7",
        "name": "Process",
        "parentId": ["2"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "8",
        "name": "Process",
        "parentId": ["7"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "9",
        "name": "Process",
        "parentId": ["8", "6"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    },
    {
        "empId": "10",
        "name": "end",
        "parentId": ["6"],
        "shape": "Rectangle",
        "width": 50,
        "height": 50,
        "color": "#034d6d"
    }
];
const employeeData61 = [
    {
      "empId": "1",
      "name": "start",
      "shape": "StartOrEnd",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "2",
      "name": "Decision",
      "parentId": ["1"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "3",
      "name": "Process",
      "parentId": ["2"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "4",
      "name": "Process",
      "parentId": ["3"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "5",
      "name": "Process",
      "parentId": ["4", "2"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "6",
      "name": "Decision",
      "parentId": ["5"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "7",
      "name": "Process",
      "parentId": ["6"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "8",
      "name": "Process",
      "parentId": ["6", "9"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "9",
      "name": "Process",
      "parentId": ["7"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "10",
      "name": "Process",
      "parentId": ["9"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "11",
      "name": "end",
      "parentId": ["10"],
      "shape": "StartOrEnd",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    }
];

const employeeData62 = [
    {
      "empId": "1",
      "name": "start",
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "2",
      "name": "Requirment gathering",
      "parentId": ["1", "3"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "3",
      "name": "Reserach customer input",
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "4",
      "name": "start wireframe design",
      "parentId": ["2", "6"],
      "label": ["No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "5",
      "name": "Review",
      "parentId": ["4"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "6",
      "name": "Approved?",
      "parentId": ["5"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "7",
      "name": "Creating mockups",
      "parentId": ["6", "9"],
      "label": ["Yes", "No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "8",
      "name": "Review",
      "parentId": ["7"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "9",
      "name": "Approved?",
      "parentId": ["8"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "10",
      "name": "Create prototype",
      "parentId": ["9", "12"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "11",
      "name": "Create the budget",
      "parentId": ["10", "16"],
      "label": ["No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "12",
      "name": "",
      "parentId": ["13", "14"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "13",
      "name": "material inventary",
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "14",
      "name": "take form suppliers",
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "15",
      "name": "Get approvel",
      "parentId": ["11"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "16",
      "name": "approved?",
      "parentId": ["15"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "17",
      "name": "Require sucess",
      "parentId": ["16"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "18",
      "name": "End",
      "parentId": ["17"],
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    }
];

const employeeData63 = [
    {
      "empId": "1",
      "name": "start",
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "2",
      "name": "Process",
      "parentId": ["1"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "3",
      "name": "Process",
      "parentId": ["2", "9"],
      "label": ["No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "4",
      "name": "Decision",
      "parentId": ["3"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "5",
      "name": "Process",
      "parentId": ["4"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "6",
      "name": "Process",
      "parentId": ["4"],
      "label": ["No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "7",
      "name": "Process",
      "parentId": ["5"],
      "label": ["No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "8",
      "name": "Process",
      "parentId": ["7", "6"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "9",
      "name": "Decision",
      "parentId": ["8"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "10",
      "name": "Process",
      "parentId": ["9"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "11",
      "name": "Process",
      "parentId": ["10"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "12",
      "name": "Process",
      "parentId": ["11"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "13",
      "name": "Process",
      "parentId": ["12"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "14",
      "name": "end",
      "parentId": ["13"],
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    }
];
  
const employeeData64 = [
    {
      "empId": "1",
      "name": "start",
      "shape": "StartOrEnd",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "2",
      "name": "identify the problem or opportunity",
      "parentId": ["1"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "3",
      "name": "Analyze how problm cam be fixed",
      "parentId": ["2"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "4",
      "name": "does a solution is exist?",
      "parentId": ["3"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "5",
      "name": "found the scope of the solution?",
      "parentId": ["4"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "6",
      "name": "is it design related?",
      "parentId": ["5"],
      "label": ["Yes"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "7",
      "name": "crate a controlled process",
      "parentId": ["4", "8"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "8",
      "name": "figure out the most simples solution",
      "parentId": ["5"],
      "label": ["No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "9",
      "name": "end",
      "parentId": ["7"],
      "shape": "StartOrEnd",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "10",
      "name": "design for six-sigma",
      "parentId": ["6"],
      "label": ["No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "11",
      "name": "is the problem complex?",
      "parentId": ["6"],
      "label": ["No"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "12",
      "name": "use cause and effect for solution",
      "parentId": ["11"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "13",
      "name": "is the problem related to wasters?",
      "parentId": ["11"],
      "label": ["No"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "14",
      "name": "use 5'th methodology",
      "parentId": ["13"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "15",
      "name": "solved",
      "parentId": ["13"],
      "label": ["No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "16",
      "name": "end",
      "parentId": ["15"],
      "shape": "StartOrEnd",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    }
];

const employeeData65 = [
    {
      "empId": "1",
      "name": "start",
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "2",
      "name": "Do you want to do this?",
      "parentId": ["1"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "3",
      "name": "Do not do it",
      "parentId": ["2", "6"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "4",
      "name": "end",
      "parentId": ["3"],
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "5",
      "name": "Will it likely end in disater?",
      "parentId": ["2"],
      "label": ["No"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "6",
      "name": "would it make a good experience?",
      "parentId": ["5"],
      "label": ["Yes"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "7",
      "name": "Do it",
      "parentId": ["5", "6"],
      "label": ["No", "Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "8",
      "name": "end",
      "parentId": ["7"],
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    }
];

const employeeData66 = [
    {
      "empId": "1",
      "name": "start",
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "2",
      "name": "Decision",
      "parentId": ["1"],
      "label": ["Yes"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "3",
      "name": "Decision",
      "parentId": ["2"],
      "label": ["Yes"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "4",
      "name": "Decision",
      "parentId": ["2"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "5",
      "name": "Decision",
      "parentId": ["4"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "6",
      "name": "Process",
      "parentId": ["5"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "7",
      "name": "Decision",
      "parentId": ["4"],
      "label": ["Yes"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "8",
      "name": "Process",
      "parentId": ["7"],
      "label": ["no"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "9",
      "name": "Process",
      "parentId": ["7"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "10",
      "name": "Decision",
      "parentId": ["1"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "11",
      "name": "Decision",
      "parentId": ["10"],
      "label": ["yes"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "12",
      "name": "Process",
      "parentId": ["11"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "13",
      "name": "Process",
      "parentId": ["12"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "14",
      "name": "Decision",
      "parentId": ["11"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "15",
      "name": "Process",
      "parentId": ["14"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "16",
      "name": "Decision",
      "parentId": ["10"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "17",
      "name": "Process",
      "parentId": ["16"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "18",
      "name": "Decision",
      "parentId": ["17", "19"],
      "label": ["Yes"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "19",
      "name": "Decision",
      "parentId": ["16"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "20",
      "name": "Process",
      "parentId": ["19"],
      "label": ["no"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    }
];

const employeeData67 = [
    {
      "empId": "1",
      "name": "start",
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "2",
      "name": "Looking for a diagramming software?",
      "parentId": ["1"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "3",
      "name": "B",
      "parentId": ["2"],
      "label": ["No"],
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "4",
      "name": "Diagramin needs specific industry?",
      "parentId": ["2"],
      "label": ["Yes"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "5",
      "name": "C",
      "parentId": ["4"],
      "label": ["No"],
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "6",
      "name": "creating is perfect choice!",
      "parentId": ["4"],
      "label": ["yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "7",
      "name": "end",
      "parentId": ["6"],
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    }
];

const employeeData68 = [
    {
      "empId": "1",
      "name": "start",
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "2",
      "name": "Do you have experience?",
      "parentId": ["1"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "3",
      "name": "Know the people in the industry?",
      "parentId": ["2"],
      "label": ["Yes"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "4",
      "name": "Apply through referals",
      "parentId": ["3"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "5",
      "name": "Apply for 1000 jobs",
      "parentId": ["3"],
      "label": ["no"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "6",
      "name": "Cry",
      "parentId": ["5"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "7",
      "name": "Apply some more?",
      "parentId": ["6"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "8",
      "name": "Get lucky! get hired!",
      "parentId": ["4", "7", "14", "15"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "9",
      "name": "Willing to start at bottom?",
      "parentId": ["2"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "10",
      "name": "Get an internship work for free",
      "parentId": ["9"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "11",
      "name": "Do yu have morals?",
      "parentId": ["9"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "12",
      "name": "Give up try to McDonald's",
      "parentId": ["7", "11"],
      "label": ["no", "Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "13",
      "name": "Are you attractive?",
      "parentId": ["11"],
      "label": ["no"],
      "shape": "Decision",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "14",
      "name": "Smile nicely, flirt!",
      "parentId": ["13"],
      "label": ["Yes"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "15",
      "name": "Process",
      "parentId": ["13"],
      "label": ["No"],
      "shape": "Rectangle",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    },
    {
      "empId": "16",
      "name": "End",
      "parentId": ["8"],
      "shape": "Terminator",
      "width": 50,
      "height": 50,
      "color": "#034d6d"
    }
];

let businessStartup = [
    {
      "id": "A",
      "name": "Start",
      "shape": "Terminator",
      "color": "#90EE90",
      "parentId": null as any,
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "B",
      "name": "Identify Business Idea",
      "shape": "Rectangle",
      "color": "#4682B4",
      "parentId": [
        "A"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "C",
      "name": "Conduct Market Research",
      "shape": "Rectangle",
      "color": "#4682B4",
      "label":["", "No"],
      "parentId": [
        "B",
        "H"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "D",
      "name": "Research Successful?",
      "shape": "Decision",
      "color": "#32CD32",
      "parentId": [
        "C"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "E",
      "name": "Develop Business Plan",
      "shape": "Rectangle",
      "color": "#4682B4",
      "parentId": [
        "D"
      ],
      "label": "Yes",
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "F",
      "name": "Adjust Business Idea",
      "shape": "Rectangle",
      "color": "#FFD700",
      "parentId": [
        "D"
      ],
      "label": "No",
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "G",
      "name": "Secure Funding",
      "shape": "Rectangle",
      "color": "#4682B4",
      "parentId": [
        "E",
        "F"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "H",
      "name": "Ready to Launch?",
      "shape": "Decision",
      "color": "#32CD32",
      "parentId": [
        "G"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "I",
      "name": "Launch Business",
      "shape": "Rectangle",
      "color": "#4682B4",
      "parentId": [
        "H"
      ],
      "label": "Yes",
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "J",
      "name": "Implement Marketing Strategies",
      "shape": "Rectangle",
      "color": "#4682B4",
      "parentId": [
        "I",
        "L"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "K",
      "name": "Achieve Success?",
      "shape": "Decision",
      "color": "#32CD32",
      "parentId": [
        "J"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "L",
      "name": "Revise Strategies",
      "shape": "Rectangle",
      "color": "#FFD700",
      "parentId": [
        "K"
      ],
      "label": "No",
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "M",
      "name": "Celebrate Success",
      "shape": "Predefined Process",
      "color": "#4682B4",
      "parentId": [
        "K"
      ],
      "label": "Yes",
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "N",
      "name": "End",
      "shape": "Terminator",
      "color": "#FF6347",
      "parentId": [
        "M"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    }
  ]
  let businessStartup2 = [
    {
      "id": "A",
      "name": "Start",
      "shape": "Terminator",
      "color": "#90EE90",
      "parentId": null as any,
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "B",
      "name": "Identify Business Idea",
      "shape": "Hexagon",
      "color": "",
      "parentId": [
        "A"
      ],
      "arrowType": "",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "C",
      "name": "Conduct Market Research",
      "shape": "PredefinedProcess",
      "color": "#4682B4",
      "label":["", "No"],
      "parentId": [
        "B",
        "H"
      ],
      "arrowType": "double-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "D",
      "name": "Research Successful?",
      "shape": "Parallelogram",
      "color": "#32CD32",
      "parentId": [
        "C"
      ],
      "arrowType": "dashed-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "E",
      "name": "Develop Business Plan",
      "shape": "ParallelogramAlt",
      "color": "#4682B4",
      "parentId": [
        "D"
      ],
      "label": "Yes",
      "arrowType": "dotted-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "F",
      "name": "Adjust Business Idea",
      "shape": "Trapezoid",
      "color": "#FFD700",
      "parentId": [
        "D"
      ],
      "label": "No",
      "arrowType": "wiggly-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "G",
      "name": "Secure Funding",
      "shape": "TrapezoidAlt",
      "color": "#4682B4",
      "parentId": [
        "E",
        "F"
      ],
      "arrowType": "dashed-dot-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "H",
      "name": "Ready to Launch?",
      "shape": "DataSource",
      "color": "#32CD32",
      "parentId": [
        "G"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "I",
      "name": "Launch Business",
      "shape": "Asymmetric",
      "color": "#4682B4",
      "parentId": [
        "H"
      ],
      "label": "Yes",
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "J",
      "name": "Implement Marketing Strategies",
      "shape": "DoubleCircle",
      "color": "#4682B4",
      "parentId": [
        "I",
        "L"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "K",
      "name": "Achieve Success?",
      "shape": "",
      "color": "#32CD32",
      "parentId": [
        "J"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "L",
      "name": "Revise Strategies",
      "shape": "Rectangle",
      "color": "#FFD700",
      "parentId": [
        "K"
      ],
      "label": "No",
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "M",
      "name": "Celebrate Success",
      "shape": "Predefined Process",
      "color": "#4682B4",
      "parentId": [
        "K"
      ],
      "label": "Yes",
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    },
    {
      "id": "N",
      "name": "End",
      "shape": "Terminator",
      "color": "#FF6347",
      "parentId": [
        "M"
      ],
      "arrowType": "single-line-arrow",
      "stroke": "#333",
      "strokeWidth": 2
    }
  ]

  const businessStartup3 = [
    {
        "empId": "A",
        "name": "Start",
        "shape": "Terminator",
        "color": "#90EE90",
        "parentId": null as any,
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "B",
        "name": "Identify Business Idea",
        "shape": "Or",
        "color": "#4682B4",
        "parentId": [
            "A"
        ],
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "C",
        "name": "Conduct Market Research",
        "shape": "Sort",
        "color": "#4682B4",
        "label": ["", "No"],
        "parentId": [
            "B",
            "H"
        ],
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "D",
        "name": "Research Successful?",
        "shape": "Decision",
        "color": "#32CD32",
        "parentId": [
            "C"
        ],
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "E",
        "name": "Develop Business Plan",
        "shape": "MultiDocument",
        "color": "#4682B4",
        "parentId": [
            "D"
        ],
        "label": "Yes",
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "F",
        "name": "Adjust Business Idea",
        "shape": "Extract",
        "color": "#FFD700",
        "parentId": [
            "D"
        ],
        "label": "No",
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "G",
        "name": "Secure Funding",
        "shape": "Collate",
        "color": "#4682B4",
        "parentId": [
            "E",
            "F"
        ],
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "H",
        "name": "Ready to Launch?",
        "shape": "Card",
        "color": "#32CD32",
        "parentId": [
            "G"
        ],
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "I",
        "name": "Launch Business",
        "shape": "PaperTap",
        "color": "#4682B4",
        "parentId": [
            "H"
        ],
        "label": "Yes",
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "J",
        "name": "Implement Marketing Strategies",
        "shape": "OffPageReference",
        "color": "#4682B4",
        "parentId": [
            "I",
            "L"
        ],
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "K",
        "name": "Achieve Success?",
        "shape": "StoredData",
        "color": "#32CD32",
        "parentId": [
            "J"
        ],
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "L",
        "name": "Revise Strategies",
        "shape": "Merge",
        "color": "#FFD700",
        "parentId": [
            "K"
        ],
        "label": "No",
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "M",
        "name": "Celebrate Success",
        "shape": "PredefinedProcess",
        "color": "#4682B4",
        "parentId": [
            "K"
        ],
        "label": "Yes",
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "N",
        "name": "End",
        "shape": "SummingJunction",
        "color": "#FF6347",
        "parentId": [
            "M"
        ],
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },


    {
        "empId": "A1",
        "name": "Start",
        "shape": "Display",
        "color": "#90EE90",
        "parentId": null,
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "B1",
        "name": "Identify Business Idea",
        "shape": "Delay",
        "color": "#4682B4",
        "parentId": [
            "A1"
        ],
        "arrowType": "Diamond",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "C1",
        "name": "Conduct Market Research",
        "shape": "LoopLimit",
        "color": "#4682B4",
        "label": ["", "No"],
        "parentId": [
            "B1",
            "H1"
        ],
        "arrowType": "Circle",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "D1",
        "name": "Research Successful?",
        "shape": "SequentialAccessStorage",
        "color": "#32CD32",
        "parentId": [
            "C1"
        ],
        "arrowType": "Fletch",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "E1",
        "name": "Develop Business Plan",
        "shape": "Preparation",
        "color": "#4682B4",
        "parentId": [
            "D1"
        ],
        "label": "Yes",
        "arrowType": "OpenFetch",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "F1",
        "name": "Adjust Business Idea",
        "shape": "Data",
        "color": "#FFD700",
        "parentId": [
            "D1"
        ],
        "label": "No",
        "arrowType": "DoubleArrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "G1",
        "name": "Secure Funding",
        "shape": "DirectData",
        "color": "#4682B4",
        "parentId": [
            "E1",
            "F1"
        ],
        "arrowType": "IndentedArrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "H1",
        "name": "Ready to Launch?",
        "shape": "Document",
        "color": "#32CD32",
        "parentId": [
            "G1"
        ],
        "arrowType": "OutdentedArrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "I1",
        "name": "Launch Business",
        "shape": "SequentialData",
        "color": "#4682B4",
        "parentId": [
            "H1"
        ],
        "label": "Yes",
        "arrowType": "None",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "J1",
        "name": "Implement Marketing Strategies",
        "shape": "Collate",
        "color": "#4682B4",
        "parentId": [
            "I1",
            "L1"
        ],
        "arrowType": "Square",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "K1",
        "name": "Achieve Success?",
        "shape": "Annotation2",
        "color": "#32CD32",
        "parentId": [
            "J1"
        ],
        "arrowType": "OpenArrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "L1",
        "name": "Revise Strategies",
        "shape": "ManualInput",
        "color": "#FFD700",
        "parentId": [
            "K1"
        ],
        "label": "No",
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "M1",
        "name": "Celebrate Success",
        "shape": "ManualOperation",
        "color": "#4682B4",
        "parentId": [
            "K1"
        ],
        "label": "Yes",
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    },
    {
        "empId": "N1",
        "name": "End",
        "shape": "Annotation",
        "color": "#FF6347",
        "parentId": [
            "M1"
        ],
        "arrowType": "single-line-arrow",
        "stroke": "#333",
        "strokeWidth": 2
    }
    ];

interface Employee {
    empId: string;
    parentId: string;
    shape: string;
    width: number;
    height: number;
    color: string;

}
describe('Diagram Control', () => {
    describe('Flow chart layout 1', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(employeeData1, new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramFlowChart1' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                layout: {
                    type: 'Flowchart',
                    verticalSpacing: 50,
                    horizontalSpacing: 50,
                    orientation: 'TopToBottom',
                },
                dataSourceSettings: {
                    id: 'empId', parentId: 'parentId', dataSource: items
                },
                getNodeDefaults: (obj: NodeModel) => {
                    obj.height = (obj.data as Employee).height;
                    obj.width = (obj.data as Employee).width;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#diagramFlowChart1');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking FlowChart Tree Layout', (done: Function) => {
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 3).toBe(true);
            done();
        });
    });

    describe('Flow chart layout 2', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(employeeData2, new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramFlowChart2' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                layout: {
                    type: 'Flowchart',
                    verticalSpacing: 50,
                    horizontalSpacing: 50,
                    orientation: 'LeftToRight',
                },
                dataSourceSettings: {
                    id: 'empId', parentId: 'parentId', dataSource: items
                },
                getNodeDefaults: (obj: NodeModel) => {
                    obj.height = (obj.data as Employee).height;
                    obj.width = (obj.data as Employee).width;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#diagramFlowChart2');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking FlowChart Tree Layout', (done: Function) => {
            expect(diagram.nodes.length === 5).toBe(true);
            expect(diagram.connectors.length === 4).toBe(true);
            done();
        });
    });

    describe('Flow chart layout with multiple parents', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(employeeData3, new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramFlowChart3' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                layout: {
                    type: 'Flowchart',
                    verticalSpacing: 50,
                    horizontalSpacing: 50,
                    orientation: 'TopToBottom',
                },
                dataSourceSettings: {
                    id: 'empId', parentId: 'parentId', dataSource: items
                },
                getNodeDefaults: (obj: NodeModel) => {
                    obj.height = (obj.data as Employee).height;
                    obj.width = (obj.data as Employee).width;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#diagramFlowChart3');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking FlowChart Layout with multiple parents', (done: Function) => {
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 4).toBe(true);
            done();
        });
        it('Checking node style', (done: Function) => {
            expect(diagram.nodes[0].style.fill === '#3dbfc9').toBe(true);
            expect(diagram.nodes[1].style.fill === '#FFC0CB').toBe(true);
            expect(diagram.nodes[2].style.fill === '#B22222').toBe(true);
            expect(diagram.nodes[3].style.fill === '#1b80c6').toBe(true);
            done();
        });
    });

    describe('Flow chart layout-Dynamic dataSource change', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(employeeData4, new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramFlowChart4' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                layout: {
                    type: 'Flowchart',
                    verticalSpacing: 50,
                    horizontalSpacing: 50,
                    orientation: 'TopToBottom',
                },
                dataSourceSettings: {
                    id: 'empId', parentId: 'parentId', dataSource: items
                },
                getNodeDefaults: (obj: NodeModel) => {
                    obj.height = (obj.data as Employee).height;
                    obj.width = (obj.data as Employee).width;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#diagramFlowChart4');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking FlowChart Layout with multiple parents', (done: Function) => {
            expect(diagram.nodes.length === 5).toBe(true);
            expect(diagram.connectors.length === 5).toBe(true);
            done();
        });
        it('Checking dataSource dynamically-1', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData5);
            done();
        });
        it('Checking dataSource dynamically-2', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData68);
            done();
        });
    });

    describe('Yes and No branch', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let items: DataManager = new DataManager(employeeData6, new Query().take(7));
        beforeAll(() => {
            ele = createElement('div', { id: 'diagramFlowChart5' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                layout: {
                    type: 'Flowchart',
                    verticalSpacing: 50,
                    horizontalSpacing: 50,
                    orientation: 'TopToBottom',
                    flowchartLayoutSettings:{
                        yesBranchDirection:'SameAsFlow',
                        noBranchDirection:'RightInFlow',
                    }
                },
                dataSourceSettings: {
                    id: 'empId', parentId: 'parentId', dataSource: items
                },
                getNodeDefaults: (obj: NodeModel) => {
                    obj.height = (obj.data as Employee).height;
                    obj.width = (obj.data as Employee).width;
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#diagramFlowChart5');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking FlowChart Layout yes and no branch', (done: Function) => {
            let firstNodeOffset = diagram.nodes[0].offsetX;
            let lastNodeOffset = diagram.nodes[diagram.nodes.length-1].offsetX;
            expect(firstNodeOffset < lastNodeOffset).toBe(true);
            done();
        });
        it('changing dataSource dynamically', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData7);
            done();
        });
        it('Checking FlowChart Layout node fill', (done: Function) => {
            expect(diagram.nodes[0].style.fill === '#034d6d').toBe(true);
            done();
        });
        it('Chaning data source dynamically-2', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData8);
            expect(diagram.nodes[0].style.fill === '#034d6d' && diagram.nodes.length === 5).toBe(true);
            done();
        });
        it('Changing data source dynamically-3', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData9);
            expect(diagram.nodes[0].style.fill === '#034d6d' && diagram.nodes.length === 7).toBe(true);
            done();
        });
        it('Changing data source dynamically-4', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData10);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            console.log('Fill- ' + diagram.nodes[0].style.fill, 'Length - ' + root.length)
            expect(diagram.nodes[0].style.fill === '#FFC0CB' && root.length === 2).toBe(true);
            done();
        });
        it('Changing data source dynamically-5', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData11);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            console.log('Fill- ' + diagram.nodes[0].style.fill, 'Length - ' + root.length)
            expect(diagram.nodes[0].style.fill === '#FFC0CB' && root.length === 1).toBe(true);
            done();
        });
        it('Changing data source dynamically-6', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData12);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#FFC0CB' && root.length === 1 && diagram.nodes.length === 6).toBe(true);
            done();
        });
        it('Changing data source dynamically-7', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData13);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            console.log('Fill- ' + diagram.nodes[0].style.fill, 'Length - ' + root.length, 'Nodes - ' + diagram.nodes.length)
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 2).toBe(true);
            done();
        });
        it('Changing data source dynamically-8', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData14);
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'RightInFlow';
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'SameAsFlow';
            diagram.dataBind();
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 9).toBe(true);
            done();
        });
        it('Changing data source dynamically-9', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData15);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            console.log('Fill- ' + diagram.nodes[0].style.fill, 'Length - ' + root.length, 'Nodes - ' + diagram.nodes.length)
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 13).toBe(true);
            done();
        });
        it('Changing data source dynamically-10', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData16);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            console.log('Fill- ' + diagram.nodes[0].style.fill, 'Length - ' + root.length, 'Nodes - ' + diagram.nodes.length)
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 6).toBe(true);
            done();
        });
        it('Changing data source dynamically-11', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData17);
            diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'SameAsFlow';
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'RightInFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#FFC0CB' && root.length === 1 && diagram.nodes.length === 6).toBe(true);
            done();
        });
        it('Changing data source dynamically-12', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData18);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#FFC0CB' && root.length === 1 && diagram.nodes.length === 7).toBe(true);
            done();
        });
        it('Changing data source dynamically-13', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData19);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 7).toBe(true);
            done();
        });
        it('Changing data source dynamically-14', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData20);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            console.log('Fill- ' + diagram.nodes[0].style.fill, 'Length - ' + root.length, 'Nodes - ' + diagram.nodes.length);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 11).toBe(true);
            done();
        });
        it('Changing data source dynamically-15', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData21);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 12).toBe(true);
            done();
        });
        it('Changing data source dynamically-16', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData22);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 7).toBe(true);
            done();
        });
        it('Changing data source dynamically-17', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData23);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 9).toBe(true);
            done();
        });
        it('Changing data source dynamically-18', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData24);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#B22222' && root.length === 1 && diagram.nodes.length === 5).toBe(true);
            done();
        });
        it('Changing data source dynamically-19', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData25);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 5).toBe(true);
            done();
        });
        it('Changing data source dynamically-20',(done:Function)=>{
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData26);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 9).toBe(true);
            done();
        });
        it('Changing data source dynamically-21',(done:Function)=>{
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData27);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            console.log('Fill- ' + diagram.nodes[0].style.fill, 'Length - ' + root.length, 'Nodes - ' + diagram.nodes.length)
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 8).toBe(true);
            done();
        });
        it('Changing data source dynamically-22', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData28);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'RightInFlow';
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'LeftInFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[diagram.nodes.length-1].style.fill === '#FFC0CB' && root.length === 1 && diagram.nodes.length === 12).toBe(true);
            done();
        });
        it('Changing data source dynamically-23', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData29);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'SameAsFlow';
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'RightInFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#1b80c6' && root.length === 1 && diagram.nodes.length === 10).toBe(true);
            done();
        });
        it('Changing data source dynamically-24', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData30);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#FFC0CB' && root.length === 1 && diagram.nodes.length === 6).toBe(true);
            done();
        });
        it('Changing data source dynamically-25', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData31);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#FFC0CB' && root.length === 1 && diagram.nodes.length === 7).toBe(true);
            done();
        });
        it('Changing data source dynamically-26', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData32);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 7).toBe(true);
            done();
        });

        it('Changing data source dynamically-27', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData33);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 11).toBe(true);
            done();
        });

        it('Changing data source dynamically-28', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData34);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 12).toBe(true);
            done();
        });

        it('Changing data source dynamically-29', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData35);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.yesBranchValues =  ["Yes", "True", "Y", "Reply" ];
            diagram.layout.flowchartLayoutSettings.noBranchValues =  ["No", "None", "False", "No Reply" ];
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 11).toBe(true);
            done();
        });

        it('Changing data source dynamically-30', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData36);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 18).toBe(true);
            done();
        });

        it('Changing data source dynamically-31', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData37);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 9).toBe(true);
            done();
        });
        it('Changing data source dynamically-32', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData38);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 6).toBe(true);
            done();
        });
        it('Changing data source dynamically-33', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData39);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 5).toBe(true);
            done();
        });
        it('Changing data source dynamically-34', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData40);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'RightInFlow';
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'SameAsFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 8).toBe(true);
            done();
        });
        it('Changing data source dynamically-35', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData41);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'SameAsFlow';
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'RightInFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 6 && diagram.nodes[0].offsetX === diagram.nodes[diagram.nodes.length-1].offsetX).toBe(true);
            done();
        });
        it('Changing data source dynamically-36', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData42);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 10).toBe(true);
            done();
        });
        it('Changing data source dynamically-37', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData43);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 8).toBe(true);
            done();
        });
        it('Changing data source dynamically-38', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData44);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 12).toBe(true);
            done();
        });
        it('Changing data source dynamically-39', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData45);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 8).toBe(true);
            done();
        });
        it('Changing data source dynamically-40', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData46);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 13).toBe(true);
            done();
        });
        it('Changing data source dynamically-41', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData47);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 15).toBe(true);
            done();
        });
        it('Changing data source dynamically-42', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData48);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 10).toBe(true);
            done();
        });
        it('Changing data source dynamically-43', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData49);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 20).toBe(true);
            done();
        });
        it('Changing data source dynamically-44', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData50);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'LeftInFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 13).toBe(true);
            done();
        });
        it('Changing data source dynamically-45', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData51);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'RightInFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 11).toBe(true);
            done();
        });
        it('Changing data source dynamically-46', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData52);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            console.log('Fill- ' + diagram.nodes[0].style.fill, 'Length - ' + root.length, 'Nodes - ' + diagram.nodes.length)
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 2 && diagram.nodes.length === 17).toBe(true);
            done();
        });
        it('Changing data source dynamically-47', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData53);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'RightInFlow';
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'SameAsFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes[diagram.nodes.length-1].width ===
                100 && diagram.nodes.length === 9).toBe(true);
            done();
        });
        it('Changing data source dynamically-48', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData54);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes[diagram.nodes.length-1].width ===
                100 && diagram.nodes.length === 9).toBe(true);
            done();
        });
        it('Changing data source dynamically-49', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData55);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 11).toBe(true);
            done();
        });
        it('Changing data source dynamically-50', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData56);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 15).toBe(true);
            done();
        });
        it('Changing data source dynamically-51', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData57);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'RightInFlow';
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'LeftInFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 15).toBe(true);
            done();
        });
        it('Changing data source dynamically-52', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData58);
            diagram.dataBind();
            diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'SameAsFlow';
            diagram.layout.flowchartLayoutSettings.noBranchDirection = 'RightInFlow';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 10).toBe(true);
            done();
        });
        it('Changing data source dynamically-53', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData59);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 10).toBe(true);
            done();
        });
        it('Changing data source dynamically-54', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData60);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 10).toBe(true);
            done();
        });
        it('Changing data source dynamically-55', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData61);
            diagram.dataBind();
            diagram.layout.orientation = 'LeftToRight';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 11).toBe(true);
            done();
        });
        it('Changing data source dynamically-56', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData62);
            diagram.dataBind();
            diagram.layout.orientation = 'TopToBottom';
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 4 && diagram.nodes.length === 18).toBe(true);
            done();
        });
        it('Changing data source dynamically-57', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData63);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 14).toBe(true);
            done();
        });
        it('Changing data source dynamically-58', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData64);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 16).toBe(true);
            done();
        });
        it('Changing data source dynamically-59', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData65);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 8).toBe(true);
            done();
        });
        it('Changing data source dynamically-60', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData66);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 20).toBe(true);
            done();
        });
        it('Changing data source dynamically-61', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData67);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 7).toBe(true);
            done();
        });
        it('Changing data source dynamically-62', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData68);
            diagram.dataBind();
            let root = diagram.nodes.filter((x:any)=>x.inEdges.length === 0);
            expect(diagram.nodes[0].style.fill === '#034d6d' && root.length === 1 && diagram.nodes.length === 16).toBe(true);
            done();
        });
        it('Changing data source dynamically-63', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(employeeData36);
            diagram.layout.orientation = 'LeftToRight';
            diagram.dataBind();
            expect(diagram.nodes[0].style.fill === '#034d6d' && diagram.nodes.length === 18).toBe(true);
            done();
        });
        it('Changing data source dynamically-64', (done: Function) => {
            diagram.dataSourceSettings.dataSource = new DataManager(businessStartup3);
            diagram.dataBind();
            expect(diagram.nodes.length === 28).toBe(true);
            done();
        });
    });

});

describe('Flowchart import and export', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let items: DataManager = new DataManager(businessStartup, new Query().take(7));
    beforeAll(() => {
        ele = createElement('div', { id: 'flowchartimportexport' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: '100%', height: '900px',
            layout:{
                type:'Flowchart',
                verticalSpacing: 50,
                horizontalSpacing: 50,
                orientation: 'TopToBottom',
                flowchartLayoutSettings:{
                    yesBranchDirection:'LeftInFlow',
                    noBranchDirection:'RightInFlow',
                    yesBranchValues: ["Yes", "True", "Y" ],
                    noBranchValues: ["No", "None", "False", ]
                }
            },
            dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: new DataManager(businessStartup)},
            getNodeDefaults: (obj: NodeModel) => {
                obj.width =  120;
                obj.height =  50;
                  if((obj.shape as FlowShapeModel).shape === 'Decision' || (obj.shape as BpmnShapeModel).shape === 'DataSource'){
                    obj.height = 80;
                }
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#flowchartimportexport');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Exporting flowchart layout', (done: Function) => {
        let data = diagram.saveDiagramAsMermaid();
        expect(data !== '' && data.includes('graph TD')).toBe(true);
        done();
    });
    it('Importing and exporting flowchart layout', (done: Function) => {
        const data = `graph TD
                        A((Start)) --> B[Identify Business Idea]
                        B --> C(((Conduct Market Research)))
                        C --> D{Research Successful?}
                        D -->|Yes| E{{Develop Business Plan}}
                        E --> F[/Secure Funding/]
                        F --> G[\\Ready to Launch?\\]
                        G -->|No| C
                        G -->|Yes| H[(Launch Business)]
                        H --> I[/Implement Marketing Strategies\\]
                        I --> J{Achieve Success?}
                        J -->|No| K[\\Revise Strategies/]
                        K --> I
                        J -->|Yes| L[[Celebrate Success]]
                        L --> M([End])
                        D -->|No| N>Adjust Business Idea]
                        N --> F
                        style A fill:#90EE90,stroke:#333,stroke-width:2px;
                        style B fill:#4682B4,stroke:#333,stroke-width:2px;
                        style C fill:#4682B4,stroke:#333,stroke-width:2px;
                        style D fill:#32CD32,stroke:#333,stroke-width:2px;
                        style E fill:#4682B4,stroke:#333,stroke-width:2px;
                        style F fill:#4682B4,stroke:#333,stroke-width:2px;
                        style G fill:#32CD32,stroke:#333,stroke-width:2px;
                        style H fill:#4682B4,stroke:#333,stroke-width:2px;
                        style I fill:#4682B4,stroke:#333,stroke-width:2px;
                        style J fill:#32CD32,stroke:#333,stroke-width:2px;
                        style K fill:#FFD700,stroke:#333,stroke-width:2px;
                        style L fill:#4682B4,stroke:#333,stroke-width:2px;
                        style M fill:#FF6347,stroke:#333,stroke-width:2px;
                        style N fill:#FFD700,stroke:#333,stroke-width:2px;`;

        diagram.loadDiagramFromMermaid(data);
        expect(diagram.nodes.length === 14).toBe(true);
        let saveData1 = diagram.saveDiagramAsMermaid();
        diagram.loadDiagramFromMermaid(saveData1);
        let saveData2 = diagram.saveDiagramAsMermaid();
        diagram.loadDiagramFromMermaid(saveData2);
        let saveData3 = diagram.saveDiagramAsMermaid();
        diagram.loadDiagramFromMermaid(saveData3);
        expect(diagram.nodes.length === 14).toBe(true);
        done();
    });
    it('Different types of shapes and arrow at initial rendering', (done: Function) => {
        diagram.dataSourceSettings = { id: 'id', parentId: 'parentId', dataSource: new DataManager(businessStartup2)};
        diagram.dataBind();
        expect(diagram.nodes.length === 14).toBe(true);
        done();
    });
    it('Different types of arrow load', (done: Function) => {
        const data = `flowchart TD
        A[Christmas] ---|Get money| B(Go shopping)
        B -.-> C{Let me think}
        C -.One.-> D[Laptop]
        C ==>|Two| E[iPhone]
        C ~~~|Three| F[Car]
        F === G[New Model]
        E -..-> G
        D ~~~ G
        G --Text--> H{Do you like?}
        H ==One==> I[Yes]
        H -.- J[No]`
        diagram.loadDiagramFromMermaid(data);
        expect(diagram.nodes.length === 10).toBe(true);
        done();
    });
});

describe('Flowchart orientation and layout settings-Dynamic dataSource change', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let items: DataManager = new DataManager(businessStartup, new Query().take(7));
    beforeAll(() => {
        ele = createElement('div', { id: 'flowchartorientation' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: '100%', height: '900px',
            layout:{
                type:'Flowchart',
                verticalSpacing: 50,
                horizontalSpacing: 50,
                orientation: 'LeftToRight',
                flowchartLayoutSettings:{
                    yesBranchDirection:'LeftInFlow',
                    noBranchDirection:'RightInFlow',
                    yesBranchValues: ["Yes", "True", "Y" ],
                    noBranchValues: ["No", "None", "False", ]
                }
            },
            dataSourceSettings: { id: 'id', parentId: 'parentId', dataSource: new DataManager(businessStartup)},
            getNodeDefaults: (obj: NodeModel) => {
                obj.width =  120;
                obj.height =  50;
                  if((obj.shape as FlowShapeModel).shape === 'Decision' || (obj.shape as BpmnShapeModel).shape === 'DataSource'){
                    obj.height = 80;
                }
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#flowchartorientation');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking FlowChart Layout', (done: Function) => {
        expect(diagram.nodes.length === 14).toBe(true);
        expect(diagram.connectors.length === 16).toBe(true);
        done();
    });
    it('Changing dataSource dynamically-code coverage', (done: Function) => {
        diagram.dataSourceSettings = { id: 'empId', parentId: 'parentId', dataSource: new DataManager(employeeData36)};
        done();
    });
    it('Changing LayoutSettings', (done: Function) => {
        diagram.layout.flowchartLayoutSettings.yesBranchDirection = 'RightInFlow';
        diagram.dataBind();
        done();
    });
});


describe('954960 Error while loading single node data', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll(() => {
        ele = createElement('div', { id: 'flowchartSingleData' });
        document.body.appendChild(ele);
        diagram = new Diagram({
            width: '100%', height: '700px',
            layout: {
                type: 'Flowchart',
                verticalSpacing: 50,
                horizontalSpacing: 50,
                orientation: 'TopToBottom',
                flowchartLayoutSettings: {
                    yesBranchDirection: 'LeftInFlow',
                    noBranchDirection: 'RightInFlow',
                    yesBranchValues: ["Yes", "True", "Y"],
                    noBranchValues: ["No", "None", "False",]
                }
            },
            getNodeDefaults: (obj: NodeModel) => {
                obj.width = 120;
                obj.height = 50;
                if ((obj.shape as FlowShapeModel).shape === 'Decision' || (obj.shape as BpmnShapeModel).shape === 'DataSource') {
                    obj.height = 80;
                }
                return obj;
            }, getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.type = 'Orthogonal';
                return connector;
            }
        });
        diagram.appendTo('#flowchartSingleData');
    });
    afterAll(() => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking FlowChart Layout with single node', (done: Function) => {
        const mermaidData = `flowchart LR
        A:::someclass --> B
        classDef someclass fill:#f96`;
        diagram.loadDiagramFromMermaid(mermaidData);
        //Failure case - nodes length should be 2
        expect(diagram.nodes.length === 3).toBe(true);
        expect(diagram.connectors.length === 1).toBe(true);
        done();
    });
    it('Checking FlowChart Layout with Load single Node 2', (done: Function) => {
        const mermaidData = `flowchart TD
        A[Start]
        style A fill:#90EE90,stroke:#333,stroke-width:2px;`;
        diagram.loadDiagramFromMermaid(mermaidData);
        expect(diagram.nodes.length === 1).toBe(true);
        expect(diagram.connectors.length === 0).toBe(true);
        done();
    });
    it('Checking FlowChart Layout Load Mermaid Node 3', (done: Function) => {
        const mermaidData = `flowchart LR
        markdown["This **is** _Markdown_"]
        newLines["Line1
        Line 2
        Line 3"]
        markdown --> newLines`;
        //Failure case - nodes length should be 2
        diagram.loadDiagramFromMermaid(mermaidData);
        expect(diagram.nodes.length === 4).toBe(true);
        expect(diagram.connectors.length === 1).toBe(true);
        done();
    });
    it('Checking FlowChart Layout Load Mermaid 4', (done: Function) => {
        const mermaidData = `graph LR;
        A(["Start"]) --> B{"Is it raining (or snowing)?"};
        B -->|Yes| C["Take an umbrella"];
        B -->|No| D["Leave umbrella at home (if dry)"];
        C --> E["Go to work"]; D --> E;
        E --> F{"Do you have a meeting?"};
        F -->|Yes| G["Prepare documents"];
        F -->|No| H["Proceed with daily tasks"];
        G --> I["Attend meeting"];
        H --> I;
        I --> J{"Is it lunchtime?"};
        J -->|Yes| K["Go to lunch"];
        J -->|No| L["Continue working"];
        K --> M["Return to work"];
        L --> M;
        M --> N{"End of day?"};
        N -->|Yes| O["Go home"];
        N -->|No| P["Finish remaining tasks"];

        O --> Q(["End"]);
        %% Additional elements
        subgraph "Optional Tasks";
            R["Check emails"] --> S["Respond to emails"];
            T["Review reports"] --> U["Update project status"];
        end;
        M --> R;
        M --> T;

        %% Corrected shapes
        A1(("Circle")) --> A2(("Circle with text"));
        A2 --> A3>"Asymmetric shape"];
        A3 --> A4{"Rhombus"};
        A4 --> A5{{"Hexagon"}};
        A5 --> A6[/"Parallelogram"/];
        A6 --> A7[\"Parallelogram alt"\];
        A7 --> A8[/"Trapezoid"\];
        A8 --> A9[\"Trapezoid alt"/];
        A9 --> A10(["Stadium"]);
        A10 --> A11[["Subroutine"]];
        A11 --> A12[("Cylinder")];
        A12 --> A13[("Database")];
        A13 --> A14A["Rectangle"];
        A13 --> A14B["Rectangular callout"];
        A14A --> A15("Rounded rectangular callout");
        A15 --> A16{"Diamond callout"};
        A16 --> A17{{"Hexagonal callout"}};
        A17 --> A18[/"Parallelogram callout"/];
        A18 --> A19[/"Trapezoid callout"\];
        A19 --> A20(["Stadium callout"]);
        A20 --> A21[["Subroutine callout"]];
        A21 --> A22[("Cylinder callout")];
        A22 --> A23[("Database callout")];

        %% Line types
        A -->|"Solid line"| B;

        C ===|"Thick line"| D;
        D -.-|"Dotted line"| E;

        %% Arrow types
        G -->|"Arrow"| H;
        H --o|"Open arrow"| I;
        I --x|"Cross arrow"| J;

        K --x|"Cross dashed arrow"| L;

        %% Connector types

        O --- P;
        P -->|"Connector"| Q;
        Q ---|"Thick connector"| R;
        R -.-|"Dotted connector"| S;
        S ===|"Dashed connector"| T;`;
        diagram.loadDiagramFromMermaid(mermaidData);
        //Failure case - nodes and connectors should not overlap/recursive conectors should not considered
        expect(diagram.nodes.length === 45).toBe(true);
        expect(diagram.connectors.length === 55).toBe(true);
        done();
    });
    it('Checking FlowChart Layout Load Mermaid with subgraph', (done: Function) => {
        const mermaidData = `graph LR;
        A(["Start"]) --> B{"Is it raining (or snowing)?"};
        B -->|Yes| C["Take an umbrella"];
        B -->|No| D["Leave umbrella at home (if dry)"];
        C --> E["Go to work"]; D --> E;E --> F{"Do you have a meeting?"};
        F -->|Yes| G["Prepare documents"];
        F -->|No| H["Proceed with daily tasks"];
        G --> I["Attend meeting"];
        H --> I;
        I --> J{"Is it lunchtime?"};
        J -->|Yes| K["Go to lunch"];J -->|No| L["Continue working"];
        K --> M["Return to work"];
        L --> M;
        M --> N{"End of day?"};
        N -->|Yes| O["Go home"];N -->|No| P["Finish remaining tasks"];
        P --> N;
        O --> Q(["End"]);

        subgraph "Optional Tasks";
        R["Check emails"] --> S["Respond to emails"];
        T["Review reports"] --> U["Update project status"];
        end;
        M --> R;
        M --> T;`;
        diagram.loadDiagramFromMermaid(mermaidData);
        expect(diagram.nodes.length === 21).toBe(true);
        expect(diagram.connectors.length === 24).toBe(true);
        done();
    });
    it('Checking FlowChart Layout Load Mermaid with comment line', (done: Function) => {
        const mermaidData = `graph LR
        %% Line types
        A -->|"Solid line"| B;
        B -.->|"Dashed line"| C;
        C ===|"Thick line"| D;
        D -.-|"Dotted line"| E;`;
        diagram.loadDiagramFromMermaid(mermaidData);
        expect(diagram.nodes.length === 5).toBe(true);
        expect(diagram.connectors.length === 4).toBe(true);
        done();
    });
    it('Checking FlowChart Layout Load Mermaid with subgraph and comment line', (done: Function) => {
        const mermaidData = `graph LR;
        A(["Start"]) --> B{"Is it raining (or snowing)?"};
        B -->|Yes| C["Take an umbrella"];
        B -->|No| D["Leave umbrella at home (if dry)"];
        C --> E["Go to work"]; D --> E;
        E --> F{"Do you have a meeting?"};
        F -->|Yes| G["Prepare documents"];
        F -->|No| H["Proceed with daily tasks"];
        G --> I["Attend meeting"];
        H --> I;
        I --> J{"Is it lunchtime?"};
        J -->|Yes| K["Go to lunch"];
        J -->|No| L["Continue working"];
        K --> M["Return to work"];
        L --> M;
        M --> N{"End of day?"};
        N -->|Yes| O["Go home"];
        N -->|No| P["Finish remaining tasks"];
        P --> N;
        O --> Q(["End"]);
        %% Additional elements
        subgraph "Optional Tasks";
        R["Check emails"] --> S["Respond to emails"];
        T["Review reports"] --> U["Update project status"];
        end;
        M --> R;
        M --> T;

        %% Corrected shapes
        A1(("Circle")) --> A2(("Circle with text"));
        A2 --> A3>"Asymmetric shape"];
        A3 --> A4{"Rhombus"};
        A4 --> A5{{"Hexagon"}};
        A5 --> A6[/"Parallelogram"/];
        A6 --> A7[\"Parallelogram alt"\];
        A7 --> A8[/"Trapezoid"\];
        A8 --> A9[\"Trapezoid alt"/];
        A9 --> A10(["Stadium"]);
        A10 --> A11[["Subroutine"]];
        A11 --> A12[("Cylinder")];
        A12 --> A13[("Database")];
        A13 --> A14A["Rectangle"];
        A13 --> A14B["Rectangular callout"];
        A14A --> A15("Rounded rectangular callout");
        A15 --> A16{"Diamond callout"};
        A16 --> A17{{"Hexagonal callout"}};
        A17 --> A18[/"Parallelogram callout"/];
        A18 --> A19[/"Trapezoid callout"\];
        A19 --> A20(["Stadium callout"]);
        A20 --> A21[["Subroutine callout"]];
        A21 --> A22[("Cylinder callout")];
        A22 --> A23[("Database callout")];

        %% Line types
        A -->|"Solid line"| B;
        B -.->|"Dashed line"| C;
        C ===|"Thick line"| D;
        D -.-|"Dotted line"| E;

        %% Arrow types
        G -->|"Arrow"| H;
        H --o|"Open arrow"| I;
        I --x|"Cross arrow"| J;
        J --o|"Open dashed arrow"| K;
        K --x|"Cross dashed arrow"| L;

        %% Connector types
        N --> O;
        O --- P;
        P -->|"Connector"| Q;
        Q ---|"Thick connector"| R;
        R -.-|"Dotted connector"| S;
        S ===|"Dashed connector"| T;
        `;
        diagram.loadDiagramFromMermaid(mermaidData);
        //Failure case - nodes and connectors should not overlap/recursive conectors should not considered
        expect(diagram.nodes.length === 45).toBe(true);
        expect(diagram.connectors.length === 58).toBe(true);
        done();
    });
    it('Checking FlowChart Layout Load Mermaid with same line 2 data', (done: Function) => {
        const mermaidData = `[graph LR;
        A(["Start"]) --> B{"Is it raining (or snowing)?"};
        B -->|Yes| C["Take an umbrella"];
        B -->|No| D["Leave umbrella at home (if dry)"];
        C --> E["Go to work"];
        D --> E;
        E --> F{"Do you have a meeting?"};
        F -->|Yes| G["Prepare documents"];
        F -->|No| H["Proceed with daily tasks"];
        G --> I["Attend meeting"];
        H --> I`;
        diagram.loadDiagramFromMermaid(mermaidData);
        expect(diagram.nodes.length === 9).toBe(true);
        expect(diagram.connectors.length === 10).toBe(true);
        done();
    });
    it('Checking FlowChart Layout Load Mermaid with single alphabet with ;', (done: Function) => {
        const mermaidData = `graph LR;
        A --> B;
        B --> C;
        B --> D;
        C --> E;
        D --> E;
        E --> F;
        F --> G;
        F --> H;
        G --> I;
        H --> I;`;
        diagram.loadDiagramFromMermaid(mermaidData);
        expect(diagram.nodes.length === 9).toBe(true);
        expect(diagram.connectors.length === 10).toBe(true);
        done();
    });
    it('Checking FlowChart Layout load overlap multiple tree', (done: Function) => {
        const mermaidData = `graph LR;
        A(["Start"]) --> B{"Is it raining (or snowing)?"};
        B -->|Yes| C["Take an umbrella"];
        B -->|No| D["Leave umbrella at home (if dry)"];
        C --> E["Go to work"];
        D --> E;

        A1(("Circle")) --> A2(("Circle with text"));
        A2 --> A3>"Asymmetric shape"];
        A3 --> A4{"Rhombus"};
        A4 --> A5{{"Hexagon"}};
        A -->|"Solid line"| B(["check"]);

        C ===|"Thick line"| D;
        D -.-|"Dotted line"| E;

        N --> O;
        O --- P;
        P -->|"Connector"| Q;
        Q ---|"Thick connector"| R;
        R -.-|"Dotted connector"| S;`;
        diagram.loadDiagramFromMermaid(mermaidData);
        expect(diagram.nodes.length === 16).toBe(true);
        expect(diagram.connectors.length === 17).toBe(true);
        done();
    });
    it('Checking FlowChart Layout with simple multiple tree', (done: Function) => {
        const mermaidData = `graph LR;
        A(["Start"]) --> B{"Is it raining (or snowing)?"};
        B -->|Yes| C["Take an umbrella"];
        B -->|No| D["Leave umbrella at home (if dry)"];
        C --> E["Go to work"]; D --> E;

        A1(("Circle")) --> A2(("Circle with text"));
        A2 --> A3>"Asymmetric shape"];
        A3 --> A4{"Rhombus"};
        A4 --> A5{{"Hexagon"}}`;
        diagram.loadDiagramFromMermaid(mermaidData);
        expect(diagram.nodes.length === 10).toBe(true);
        expect(diagram.connectors.length === 9).toBe(true);
        done();
    });
});