export let toolbarItems: string[] = ['NewFolder', 'Upload', '|', 'Delete', 'Rename', 'Download', 'Cut', 'Copy', 'Paste',
    'SortBy', 'Refresh', 'Selection', 'View', 'Details'];

export let toolbarItems1: string[] = ['NewFolder1', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Download', 'Upload', '|', 'Search'];

export let toolbarItems2: string[] = ['NewFolder', '|', 'Upload', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Custom tool', '|', 'Download',
'|', 'SortBy', '|', 'Search', 'Refresh', 'Grid', 'LargeIcons', 'Details', 'Options'];

export let toolbarItems3: string[] = ['NewFolder', 'Upload', '|', 'Delete', 'Rename', 'Download', 'Cut', 'Copy', 'Paste',
    'SortBy', 'Refresh', 'Selection', 'View', 'Details', 'Search', 'Options'];

export let data1: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\" },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};
export let dataForSanitization: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\" },
        { "name": "'><img src='x' onerror=alert(\"XSSFromSFTP\")>'txt", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};
export let errorData: any = [];
export let uploadedData: any = [
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T18:16:38.4384894+05:30",
        filterPath: "",
        hasChild: true,
        id: '0',
        isFile: false,
        name: "Files",
        parentId: null,
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: true,
        id: '1',
        isFile: false,
        name: "Documents",
        parentId: '0',
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\Documents\\",
        hasChild: false,
        id: '7',
        isFile: false,
        name: "NewFolder",
        parentId: '1',
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '2',
        isFile: false,
        name: "Downloads",
        parentId: '0',
        size: 0,
        type: "",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '3',
        isFile: false,
        name: "Base",
        parentId: '0',
        size: 0,
        type: "",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '4',
        isFile: true,
        name: "newfile.txt",
        parentId: '0',
        size: 0,
        type: ".txt",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '5',
        isFile: true,
        name: "textDocument.doc",
        parentId: '0',
        size: 0,
        type: ".doc",
        showHiddenItems: false
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '6',
        isFile: true,
        name: "Adam.png",
        parentId: '0',
        size: 0,
        type: ".png",
        imgUrl: "https://ej2.syncfusion.com/demos/src/treeview/images/employees/7.png"
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '8',
        isFile: true,
        name: "sample.txt",
        parentId: '0',
        size: 0,
        type: ".txt",
    }
];
export let dataForSanitization1: any = [{
    dateCreated: "2023-11-15T19:02:02.3419426+05:30",
    dateModified: "2024-01-08T18:16:38.4384894+05:30",
    filterPath: "",
    hasChild: true,
    id: '0',
    isFile: false,
    name: "Files",
    parentId: null,
    size: 0,
    type: "",
}, {
    dateCreated: "2023-11-15T19:02:02.3419426+05:30",
    dateModified: "2024-01-08T16:55:20.9464164+05:30",
    filterPath: "\\",
    hasChild: true,
    id: '1',
    isFile: false,
    name: "Documents",
    parentId: '0',
    size: 0,
    type: "",
}, {
    dateCreated: "2023-11-15T19:02:02.3419426+05:30",
    dateModified: "2024-01-08T16:55:20.9464164+05:30",
    filterPath: "\\Documents\\",
    hasChild: false,
    id: '7',
    isFile: false,
    name: "NewFolder",
    parentId: '1',
    size: 0,
    type: "",
}, {
    dateCreated: "2023-11-15T19:02:02.3419426+05:30",
    dateModified: "2024-01-08T16:55:20.9464164+05:30",
    filterPath: "\\",
    hasChild: false,
    id: '2',
    isFile: false,
    name: "Downloads",
    parentId: '0',
    size: 0,
    type: "",
},
{
    dateCreated: "2023-11-15T19:02:02.3419426+05:30",
    dateModified: "2024-01-08T16:55:20.9464164+05:30",
    filterPath: "\\",
    hasChild: false,
    id: '3',
    isFile: false,
    name: "Base",
    parentId: '0',
    size: 0,
    type: "",
},
{
    dateCreated: "2023-11-15T19:02:02.3419426+05:30",
    dateModified: "2024-01-08T16:55:20.9464164+05:30",
    filterPath: "\\",
    hasChild: false,
    id: '4',
    isFile: true,
    name: "newfile.txt",
    parentId: '0',
    size: 0,
    type: ".txt",
},
{
    dateCreated: "2023-11-15T19:02:02.3419426+05:30",
    dateModified: "2024-01-08T16:55:20.9464164+05:30",
    filterPath: "\\",
    hasChild: false,
    id: '5',
    isFile: true,
    name: "Adam.png",
    parentId: '0',
    size: 0,
    type: ".png",
    imgUrl: "https://ej2.syncfusion.com/demos/src/treeview/images/employees/7.png"
},
{
    dateCreated: "2023-11-15T19:02:02.3419426+05:30",
    dateModified: "2024-01-08T16:55:20.9464164+05:30",
    filterPath: "\\",
    hasChild: false,
    id: '6',
    isFile: false,
    name: "'><img src='x' onerror=alert(\"XSSFromSFTP\")>'txt",
    parentId: '0',
    size: 0,
    type: ""
}];
export let flatData: any = [
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T18:16:38.4384894+05:30",
        filterPath: "",
        hasChild: true,
        id: '0',
        isFile: false,
        name: "Files",
        parentId: null,
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: true,
        id: '1',
        isFile: false,
        name: "Documents",
        parentId: '0',
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\Documents\\",
        hasChild: false,
        id: '7',
        isFile: false,
        name: "NewFolder",
        parentId: '1',
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '2',
        isFile: false,
        name: "Downloads",
        parentId: '0',
        size: 0,
        type: "",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '3',
        isFile: false,
        name: "Base",
        parentId: '0',
        size: 0,
        type: "",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '4',
        isFile: true,
        name: "newfile.txt",
        parentId: '0',
        size: 0,
        type: ".txt",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '5',
        isFile: true,
        name: "textDocument.doc",
        parentId: '0',
        size: 0,
        type: ".doc",
        showHiddenItems: false
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '6',
        isFile: true,
        name: "Adam.png",
        parentId: '0',
        size: 0,
        type: ".png",
        imgUrl: "https://ej2.syncfusion.com/demos/src/treeview/images/employees/7.png"
    }
];
export let flatData1: any = [
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T18:16:38.4384894+05:30",
        filterPath: "",
        hasChild: true,
        id: '0',
        isFile: false,
        name: "Files",
        parentId: null,
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: true,
        id: '1',
        isFile: false,
        name: "Documents",
        parentId: '0',
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\Documents\\",
        hasChild: false,
        id: '7',
        isFile: false,
        name: "NewFolder",
        parentId: '1',
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '2',
        isFile: false,
        name: "Downloads",
        parentId: '0',
        size: 0,
        type: "",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '3',
        isFile: false,
        name: "Base",
        parentId: '0',
        size: 0,
        type: "",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '4',
        isFile: true,
        name: "newfile.txt",
        parentId: '0',
        size: 0,
        type: ".txt",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '5',
        isFile: true,
        name: "textDocument.doc",
        parentId: '0',
        size: 0,
        type: ".doc",
        showHiddenItems: false
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '6',
        isFile: true,
        name: "Adam.png",
        parentId: '0',
        size: 0,
        type: ".png",
        imgUrl: "https://ej2.syncfusion.com/demos/src/treeview/images/employees/7.png"
    }
];
export let flatData2: any = [
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T18:16:38.4384894+05:30",
        filterPath: "",
        hasChild: true,
        id: '0',
        isFile: false,
        name: "Files",
        parentId: null,
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: true,
        id: '1',
        isFile: false,
        name: "Documents",
        parentId: '0',
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\Documents\\",
        hasChild: false,
        id: '7',
        isFile: false,
        name: "NewFolder",
        parentId: '1',
        size: 0,
        type: "",
    }, {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '2',
        isFile: false,
        name: "Downloads",
        parentId: '0',
        size: 0,
        type: "",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '3',
        isFile: false,
        name: "Base",
        parentId: '0',
        size: 0,
        type: "",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\Base\\",
        hasChild: false,
        id: '8',
        isFile: true,
        name: "textFile.txt",
        parentId: '3',
        size: 0,
        type: ".txt",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '4',
        isFile: true,
        name: "newfile.txt",
        parentId: '0',
        size: 0,
        type: ".txt",
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '5',
        isFile: true,
        name: "textDocument.doc",
        parentId: '0',
        size: 0,
        type: ".doc",
        showHiddenItems: false
    },
    {
        dateCreated: "2023-11-15T19:02:02.3419426+05:30",
        dateModified: "2024-01-08T16:55:20.9464164+05:30",
        filterPath: "\\",
        hasChild: false,
        id: '6',
        isFile: true,
        name: "Adam.png",
        parentId: '0',
        size: 0,
        type: ".png",
        imgUrl: "https://ej2.syncfusion.com/demos/src/treeview/images/employees/7.png"
    }
];
export let filterData: any = {
    "files": [
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};

export let uploadData1: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": null },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "sample.txt", "size": 49792, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\" },
};

export let uploadData2: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": null },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "sample.txt", "size": 49792, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "sample(1).txt", "size": 49792, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\" },
};

export let uploadData3: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": null },
        { "name": "demo(1).txt", "size": 49792, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "sample.txt", "size": 49792, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "demo.txt", "size": 49792, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "sample(1).txt", "size": 49792, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\" },
};

export let dataDelete: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\" },
};

export let data1Delete: any = {
    "files": [
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};

export let dataHidden: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": null },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Test", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\" },
};

export let dataSortbySize: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": null },
        { "name": "Documents", "size": 20, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 100, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\" },
};

export let data2: any = {
    "files": null,
    "error": { "code": 404, "message": "Folder doesn't contain" },
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data3: any = {
    "files": [],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data4: any = {
    "files": [
        { "name": "New folder", "size": 0, "dateModified": "10/23/2018 8:25:45 PM", "dateCreated": "10/23/2018 8:25:45 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data5: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/22/2018 4:00:52 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "New folder", "size": 0, "dateModified": "10/23/2018 8:25:45 PM", "dateCreated": "10/23/2018 8:25:45 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data5rename: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/22/2018 4:00:52 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "My Folder", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data6: any = {
    "files": null,
    "error": { "code": "500", "message": "New folder Directory already exist" },
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data6a: any = {
    "files": null,
    "error": { "code": "400", "message": "New folder Directory already exist" },
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data7: any = {
    "files": [
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data8: any = {
    "details": [
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "files": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data9: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data10: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data11: any = {
    "files": [
        { "name": "image.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "music.mp3", "size": 41392, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/14/2018 5:39:03 PM", "hasChild": false, "isFile": true, "type": "mp3", "filterPath": null },
        { "name": "new.html", "size": 4972, "dateModified": "10/12/2018 5:39:03 PM", "dateCreated": "10/10/2018 5:39:03 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "start.exe", "size": 492, "dateModified": "10/25/2018 5:39:03 PM", "dateCreated": "10/11/2018 5:39:03 PM", "hasChild": false, "isFile": true, "type": "html", "filterPath": null },
        { "name": "video.mp4", "size": 39792, "dateModified": "10/22/2018 5:39:03 PM", "dateCreated": "10/12/2018 5:39:03 PM", "hasChild": false, "isFile": true, "type": "mp4", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let UploadData: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "sample.txt", "size": 49792, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "demo.txt", "size": 49792, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data12: any = {
    "cwd": { "name": "Food", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\" },
    "files": [
        { "name": "Apple pie.png", "size": 101767, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Apple pie.png" },
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Bread.png" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Doughnut.png" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Nuggets.png" },
        { "name": "Sugar cookie.png", "size": 93929, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Sugar cookie.png" },
        { "name": "New folder", "size": 0, "dateModified": "11/15/2018 11:06:12 AM", "dateCreated": "11/15/2018 11:06:12 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\New folder" },
        { "name": "test1", "size": 0, "dateModified": "11/15/2018 11:42:40 AM", "dateCreated": "11/15/2018 11:42:03 AM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\test1" },
        { "name": "test2", "size": 0, "dateModified": "11/15/2018 11:42:07 AM", "dateCreated": "11/15/2018 11:42:07 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\test2" },
        { "name": "test3", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/15/2018 11:42:21 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\test3" }
    ],
    "error": null,
    "details": null
};

export let sortComparerData: any = {
    "cwd": { "name": "Food", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\" },
    "files": [
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Nuggets.png" },
        { "name": "Sugar cookie.png", "size": 93929, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Sugar cookie.png" },
        { "name": "1. A", "size": 0, "dateModified": "11/15/2018 11:06:12 AM", "dateCreated": "11/15/2018 11:06:12 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\1. A" },
        { "name": "2. react", "size": 0, "dateModified": "11/15/2018 11:42:40 AM", "dateCreated": "11/15/2018 11:42:03 AM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\2. react" },
        { "name": "10. angular", "size": 0, "dateModified": "11/15/2018 11:42:07 AM", "dateCreated": "11/15/2018 11:42:07 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\10. angular" },
        { "name": "20. vue", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/15/2018 11:42:21 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\20. vue" },
        { "name": "Downloads", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/15/2018 11:42:21 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Downloads" }
    ],
    "error": null,
    "details": null
};

export let dataContextMenu: any = {
    "cwd": { "name": "Food", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\" },
    "files": [
        { "name": "Sugar cookie.png", "size": 93929, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Sugar cookie.png" },
        { "name": "New folder", "size": 0, "dateModified": "11/15/2018 11:06:12 AM", "dateCreated": "11/15/2018 11:06:12 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\New folder" },
        { "name": "test1", "size": 0, "dateModified": "11/15/2018 11:42:40 AM", "dateCreated": "11/15/2018 11:42:03 AM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\test1" },
        { "name": "test2", "size": 0, "dateModified": "11/15/2018 11:42:07 AM", "dateCreated": "11/15/2018 11:42:07 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\test2" },
        { "name": "test3", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/15/2018 11:42:21 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\test3" }
    ],
    "error": null,
    "details": null
};

export let data14: any = {
    "files": [
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let data14Rename: any = {
    "files": [
        { "name": "My Folder", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};

export let data15: any = {
    "cwd": { "name": "Food", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\" },
    "files": [
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Bread.png" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Doughnut.png" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Nuggets.png" },
    ],
    "error": null,
    "details": null
}
export let data1pasteIN: any = {
    "files": [
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};
export let data1pasteIN2: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\" },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};
export let data1pasteIN3: any = {
    "files": [
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};
export let data1pasteIN4: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};

export let doubleClickEmpty: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" },
    "files": [],
    "error": null,
    "details": null
}

export let doubleClickRead: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
    ],
    "error": null,
    "details": null
}

export let doubleClickRead1: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let doubleClickRead2: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let fileCopymissing1: any = {
    "cwd": null,
    "files": [
        { "name": "1.png", "previousName": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" },
        { "name": "Employees", "previousName": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": { "code": "404", "message": "Food not found in given location.", "fileExists": null },
    "details": null
}

export let fileCopymissing2: any = {
    "cwd": null,
    "files": [
        { "name": "1.png", "previousName": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" },
        { "name": "Employees", "previousName": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": { "code": "404", "message": "Food not found in given location.", "fileExists": ["Documents"] },
    "details": null
}

export let fileCopySuccess: any = {
    "cwd": null,
    "files": [
        { "name": "1.png", "previousName": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let multiCopySuccess: any = {
    "cwd": null,
    "files": [
        { "name": "1.png", "previousName": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" },
        { "name": "Documents", "previousName": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let multiCopySuccess1: any = {
    "cwd": null,
    "files": [
        { "name": "Documents", "previousName": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": { "code": "503", "fileExists": ["1.png", "Employees"], "message": "File Already Exists" },
    "details": null
}

export let multiCopySuccess2: any = {
    "cwd": null,
    "files": [
        { "name": "Employees(1)", "previousName": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let multiCopySuccess3: any = {
    "cwd": null,
    "files": [
        { "name": "1(1).png", "previousName": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let fileCopyRead: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let multiItemCopyRead: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let multiItemCopyRead3: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Food\\" },
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let multiItemCopyRead1: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Food\\" },
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "1(1).png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" },
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let multiItemCopyRead2: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Food\\" },
        { "name": "Employees(1)", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Food\\" },
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Food\\" },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let folderCopySuccess: any = {
    "cwd": null,
    "files": [
        { "name": "Documents", "previousName": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let folderDragSuccess: any = {
    "cwd": null,
    "files": [
        { "name": "Documents", "previousName": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Employees\\" }
    ],
    "error": null,
    "details": null
}

export let folderDragSuccess1: any = {
    "cwd": null,
    "files": [
        { "name": "Documents", "previousName": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Food\\Employees\\" }
    ],
    "error": null,
    "details": null
}

export let folderDragSuccess2: any = {
    "cwd": null,
    "files": [],
    "error": { "code": "503", "fileExists": ["Employees"], "message": "File Already Exists" },
    "details": null
}

export let folderDragRead: any = {
    "cwd": { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" },
    "files": [
        { "name": "Documents", "previousName": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\Employees\\" }
    ],
    "error": null,
    "details": null
}

export let folderCopyRead: any = {
    "cwd": { "name": "Food", "size": 0, "_fm_id": "fe_tree_2", "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" }
    ],
    "error": null,
    "details": null
}

export let rename: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "My Folder", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let rename1: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\" },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "My Folder", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};

export let rename2: any = {
    "files": [
        { "name": "1+2.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\" },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};

export let folderRename: any = {
    "files": [

        { "name": "My Folder", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": null
};

export let renameExist: any = {
    "files": null,
    "error": { "code": "500", "message": "Cannot create a file when that file already exists" },
    "details": null
};
export let renameExtension: any = {
    "files": null,
    "error": { "code": "500", "message": "If you change file name extension, the file might become unstable.Are you want to change it?" },
    "details": null
};

export let renamed_ext: any = {
    "files": [
        { "name": "1.jpg", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "My Folder", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};
export let renamedwithout_ext: any = {
    "files": [
        { "name": "2.jpg", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "My Folder", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let getMultipleDetails: any = {
    "files": null,
    "error": null,
    "details": { "name": "Documents, Employees", "location": "D:/EJ2 FE service/FEService/FEService/FileContent/", "size": 199483, "multipleFiles": true },
    "cwd": { "name": "FileContent", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
};

export let getSingleDetails: any = {
    "files": null,
    "error": null,
    "details": { "name": "FileContent", location: '/FileContent', "size": 0, "modified": "10/16/2018 7:43:17 PM", "created": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
    "cwd": null
};

export let singleSelectionDetails: any = {
    "files": null,
    "error": null,
    "details": { "name": "Documents", "size": 0, location: '/Documents', "modified": "10/16/2018 7:43:17 PM", "created": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
    "cwd": null
};

export let data13: any = {
    "files": [
        { "name": "bird.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "emp.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\" },
};

export let paste1: any = {
    "files": [
        { "name": "New folder", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\" },
};

export let pastesuccess: any = {
    "cwd": { "name": "Food", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\" },
    "files": [
        { "name": "Apple pie.png", "size": 101767, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Apple pie.png" },
        { "name": "Bread.png", "size": 100486, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Bread.png" },
        { "name": "Doughnut.png", "size": 99344, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Doughnut.png" },
        { "name": "Nuggets.png", "size": 100139, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Nuggets.png" },
        { "name": "Sugar cookie.png", "size": 93929, "dateModified": "11/8/2018 4:07:01 PM", "dateCreated": "11/8/2018 4:07:01 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\Sugar cookie.png" },
        { "name": "New folder", "size": 0, "dateModified": "11/15/2018 11:06:12 AM", "dateCreated": "11/15/2018 11:06:12 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\New folder" },
        { "name": "test1", "size": 0, "dateModified": "11/15/2018 11:42:40 AM", "dateCreated": "11/15/2018 11:42:03 AM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\test1" },
        { "name": "test2", "size": 0, "dateModified": "11/15/2018 11:42:07 AM", "dateCreated": "11/15/2018 11:42:07 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\test2" },
        { "name": "test3", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/15/2018 11:42:21 AM", "hasChild": false, "isFile": false, "type": "", "filterPath": "D:\\EJ2\\FileExplorer\\Services\\FEService\\FEService\\FileContent\\Food\\test3" },
        { "name": "New folder", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": null },
    ],
    "error": null,
    "details": null
}

export let data16: any = {
    "cwd": { "name": "Employees", "size": 0, "dateModified": "2019-03-14T09:41:45.0619083+05:30", "dateCreated": "2019-03-08T02:27:19.6234841+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Employees\\" },
    "files": [{ "name": "demo", "size": 0, "dateModified": "2019-03-14T09:41:45.0619083+05:30", "dateCreated": "2019-03-14T09:41:45.0619083+05:30", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Employees\\demo" }],
    "error": null,
    "details": null
}

export let data17: any = {
    "cwd": { "name": "Documents", "size": 0, "dateModified": "2019-03-13T12:58:06.1173237+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
    "files": [{ "name": "docs", "size": 0, "dateModified": "2019-03-13T12:58:14.6420886+05:30", "dateCreated": "2019-03-13T12:58:06.1173237+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\" }],
    "error": null,
    "details": null
}

//Search 'doc' key in FileContent
export let data18: any = {
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "2019-03-14T09:41:18.6337978+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
    "files": [
        { "name": "EJ2 File Manager.docx", "size": 12403, "dateModified": "2019-03-07T14:49:02.6204366+05:30", "dateCreated": "2019-03-07T14:49:02.619437+05:30", "hasChild": false, "isFile": true, "type": ".docx", "filterPath": "\\Documents\\" },
        { "name": "Documents", "size": 0, "dateModified": "2019-03-14T14:55:22.5808132+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "docs", "size": 0, "dateModified": "2019-03-14T14:57:45.3465235+05:30", "dateCreated": "2019-03-13T12:58:06.1173237+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\" }],
    "error": null,
    "details": null
}

//Search 'doc' key in FileContent
export let searchdocstart: any = {
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "2019-03-14T09:41:18.6337978+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
    "files": [
        { "name": "Documents", "size": 0, "dateModified": "2019-03-14T14:55:22.5808132+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "docs", "size": 0, "dateModified": "2019-03-14T14:57:45.3465235+05:30", "dateCreated": "2019-03-13T12:58:06.1173237+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\" }],
    "error": null,
    "details": null
}

//Search 'doc' key in FileContent
export let searchdoccase: any = {
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "2019-03-14T09:41:18.6337978+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
    "files": [
        { "name": "docs", "size": 0, "dateModified": "2019-03-14T14:57:45.3465235+05:30", "dateCreated": "2019-03-13T12:58:06.1173237+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\" }],
    "error": null,
    "details": null
}

//Search '.png' key in FileContent
export let searchpng: any = {
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "2019-03-14T09:41:18.6337978+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "2019-03-14T14:57:45.3485237+05:30", "dateCreated": "2019-03-14T14:57:45.3465235+05:30", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\" },
        { "name": "Sugar cookie.png", "size": 93929, "dateModified": "2019-03-14T14:57:45.3465235+05:30", "dateCreated": "2019-03-14T14:57:45.3465235+05:30", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Food\\" },
    ],
    "error": null,
    "details": null
}

//Search 'apple' key in FileContent
export let searchapp: any = {
    "cwd":{"path":null,"action":null,"newName":null,"names":null,"name":"Files","size":0,"previousName":null,"dateModified":"2021-04-20T12:00:49.4556427+00:00","dateCreated":"2021-04-20T12:00:48.5928243+00:00","hasChild":true,"isFile":false,"type":"","id":null,"filterPath":"","filterId":null,"parentId":null,"targetPath":null,"renameFiles":null,"uploadFiles":null,"caseSensitive":false,"searchString":null,"showHiddenItems":false,"data":null,"targetData":null,"permission":{"copy":true,"download":true,"write":true,"writeContents":true,"read":true,"upload":true,"message":""}},
    "files":[
        {"path":null,"action":null,"newName":null,"names":null,"name":"Apple pie.png","size":101767,"previousName":null,"dateModified":"2019-11-04T11:53:34.2696436+00:00","dateCreated":"2021-04-20T12:00:49.9815567+00:00","hasChild":false,"isFile":true,"type":".png","id":null,"filterPath":"\\Pictures\\Food\\","filterId":null,"parentId":null,"targetPath":null,"renameFiles":null,"uploadFiles":null,"caseSensitive":false,"searchString":null,"showHiddenItems":false,"data":null,"targetData":null,"permission":{"copy":true,"download":true,"write":true,"writeContents":true,"read":true,"upload":true,"message":""}}
    ],
    "error":null,
    "details":null
}

//Search 'hello.png' key in FileContent
export let searchhellopng: any = {
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "2019-03-14T09:41:18.6337978+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
    "files": [],
    "error": null,
    "details": null
}


export let data19: any = {
    "cwd": { "name": "docs", "size": 0, "dateModified": "2019-03-14T14:57:45.3465235+05:30", "dateCreated": "2019-03-13T12:58:06.1173237+05:30", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Documents\\" },
    "files": [{ "name": "1.png", "size": 49792, "dateModified": "2019-03-14T14:57:45.3485237+05:30", "dateCreated": "2019-03-14T14:57:45.3465235+05:30", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Documents\\docs\\" }],
    "error": null,
    "details": null
}

export let data20: any = {
    "cwd": null,
    "files": [{ "name": "docs1", "size": 0, "dateModified": "2019-03-14T14:57:45.3465235+05:30", "dateCreated": "2019-03-13T12:58:06.1173237+05:30", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Documents\\" }],
    "error": null,
    "details": null
}

export let data21: any = {
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "2019-03-14T09:41:18.6337978+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
    "files": [
        { "name": "EJ2 File Manager.docx", "size": 12403, "dateModified": "2019-03-07T14:49:02.6204366+05:30", "dateCreated": "2019-03-07T14:49:02.619437+05:30", "hasChild": false, "isFile": true, "type": ".docx", "filterPath": "\\Documents\\" },
        { "name": "Documents", "size": 0, "dateModified": "2019-03-14T14:55:22.5808132+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "docs1", "size": 0, "dateModified": "2019-03-14T14:57:45.3465235+05:30", "dateCreated": "2019-03-13T12:58:06.1173237+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\" }],
    "error": null,
    "details": null
}

export let data22: any = {
    "cwd": null,
    "files": [{ "name": "docs", "size": 0, "dateModified": "2019-03-14T14:57:45.3465235+05:30", "dateCreated": "2019-03-13T12:58:06.1173237+05:30", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Documents\\" }],
    "error": null,
    "details": null
}

export let stringData: string = '{"files":[{ "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": null },{ "name": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": null },{ "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },{ "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null },{ "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": null }],"error": null,    "details": null,        "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "D:/EJ2/FileExplorer//Services" }}';

export let data23: any = {
    "files": [
        { "name": "image.abc", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": "abc", "filterPath": "\\Documents\\" },
        { "name": "music.mp3", "size": 41392, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/14/2018 5:39:03 PM", "hasChild": false, "isFile": true, "type": "mp3", "filterPath": "\\Documents\\" },
        { "name": "new.html", "size": 4972, "dateModified": "10/12/2018 5:39:03 PM", "dateCreated": "10/10/2018 5:39:03 PM", "hasChild": false, "isFile": true, "type": "png", "filterPath": "\\Documents\\" },
        { "name": "start.exe", "size": 492, "dateModified": "10/25/2018 5:39:03 PM", "dateCreated": "10/11/2018 5:39:03 PM", "hasChild": false, "isFile": true, "type": "html", "filterPath": "\\Documents\\" },
        { "name": "video.mp4", "size": 39792, "dateModified": "10/22/2018 5:39:03 PM", "dateCreated": "10/12/2018 5:39:03 PM", "hasChild": false, "isFile": true, "type": "mp4", "filterPath": "\\Documents\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "Document", "size": "0", "dateModified": "1-23-2019 9:21:31 PM", "dateCreated": "12-24-2018 5:14:59 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
};

export let accessSearchData: any = {
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "2019-03-14T09:41:18.6337978+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
    "files": [
        { "name": "EJ2 File Manager.docx", "size": 12403, "dateModified": "2019-03-07T14:49:02.6204366+05:30", "dateCreated": "2019-03-07T14:49:02.619437+05:30", "hasChild": false, "isFile": true, "type": ".docx", "filterPath": "\\Documents\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": false } },
        { "name": "Documents", "size": 0, "dateModified": "2019-03-14T14:55:22.5808132+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": true, "download": false, "write": false, "writeContents": true, "read": true, "upload": true } },
        { "name": "docs", "size": 0, "dateModified": "2019-03-14T14:57:45.3465235+05:30", "dateCreated": "2019-03-13T12:58:06.1173237+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\", "permission": { "copy": true, "download": false, "write": false, "writeContents": true, "read": true, "upload": true } }],
    "error": null,
    "details": null
}

export let accessData1: any = {
    "cwd": { "name": "Files", "size": 0, "dateModified": "2019-04-26T15:23:18.7087237+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "", "permission": { "copy": false, "download": false, "write": false, "writeContents": false, "read": true, "upload": false } },
    "files": [
        { "name": "Documents", "size": 0, "dateModified": "2019-04-29T16:41:41.314427+05:30", "dateCreated": "2019-04-22T12:38:31.9246688+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": true, "download": false, "write": false, "writeContents": true, "read": true, "upload": true } },
        { "name": "Downloads", "size": 0, "dateModified": "2019-04-24T12:56:17.3095747+05:30", "dateCreated": "2019-03-07T14:49:02.6324297+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": false, "read": false, "upload": false } },
        { "name": "Music.png", "size": 0, "dateModified": "2019-04-26T11:59:16.2421514+05:30", "dateCreated": "2019-04-22T17:48:53.9322593+05:30", "hasChild": true, "isFile": false, "type": ".png", "filterPath": "\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "Videos", "size": 0, "dateModified": "2019-03-07T14:49:02.6654092+05:30", "dateCreated": "2019-03-07T14:49:02.6644086+05:30", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": false, "read": false, "upload": false } },
        { "name": "2.gif", "size": 207320, "dateModified": "2019-03-06T10:43:51.8195497+05:30", "dateCreated": "2019-04-16T15:31:27.8010411+05:30", "hasChild": false, "isFile": true, "type": ".gif", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "2.png", "size": 66523, "dateModified": "2019-03-07T14:49:02.6434232+05:30", "dateCreated": "2019-04-16T15:00:29.3932591+05:30", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\", "permission": { "copy": false, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "3.png", "size": 62190, "dateModified": "2019-03-07T14:49:02.6454208+05:30", "dateCreated": "2019-04-16T15:00:29.3622788+05:30", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": true, "upload": true } },
        { "name": "README.md", "size": 517, "dateModified": "2019-03-11T11:02:01.7962742+05:30", "dateCreated": "2019-03-11T11:02:01.7952736+05:30", "hasChild": false, "isFile": true, "type": ".md", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": false, "upload": true } },
        { "name": "textbooks", "size": 0, "dateModified": "2019-04-17T09:34:10.2358973+05:30", "dateCreated": "2019-04-17T09:34:54.741977+05:30", "hasChild": false, "isFile": true, "type": "", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": false, "upload": true } }
    ],
    "error": null, "details": null
}

export let accessDetails1: any = {
    "cwd": null,
    "files": null,
    "error": null,
    "details": { "name": "Downloads", "location": "\\Files\\Downloads", "isFile": false, "size": "206.1 KB", "created": "2019-03-07T14:49:02.6324297+05:30", "modified": "2019-04-24T12:56:17.3095747+05:30", "multipleFiles": false, "permission": { "copy": false, "download": false, "write": false, "writeContents": false, "read": false, "upload": false } }
}

export let accessDetails2: any = {
    "cwd": null,
    "files": null,
    "error": null,
    "details": { "name": "Downloads, Music.png", "location": "\\Files", "isFile": false, "size": "305.9 KB", "created": "0001-01-01T00:00:00", "modified": "0001-01-01T00:00:00", "multipleFiles": true, "permission": null }
}

export let accessData2: any = {
    "cwd": { "name": "Documents", "size": 0, "dateModified": "2019-05-07T09:50:24.051718+05:30", "dateCreated": "2019-04-22T12:38:31.9246688+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": true, "download": false, "write": false, "writeContents": true, "read": true, "upload": true } },
    "files": [
        { "name": "demo1", "size": 0, "dateModified": "2019-04-26T18:12:28.0480335+05:30", "dateCreated": "2019-04-26T18:12:23.9210595+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Documents\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "Music.png", "size": 0, "dateModified": "2019-04-22T14:30:28.6565228+05:30", "dateCreated": "2019-04-22T12:38:53.1888675+05:30", "hasChild": false, "isFile": false, "type": ".png", "filterPath": "\\Documents\\", "permission": { "copy": true, "download": false, "write": true, "writeContents": true, "read": true, "upload": false } },
        { "name": "1.png", "size": 49792, "dateModified": "2019-04-10T17:12:27.2532121+05:30", "dateCreated": "2019-04-22T12:39:18.5190803+05:30", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Documents\\", "permission": { "copy": false, "download": true, "write": true, "writeContents": true, "read": false, "upload": true } },
        { "name": "2.gif", "size": 207320, "dateModified": "2019-03-06T10:43:51.8195497+05:30", "dateCreated": "2019-04-22T12:39:18.5280705+05:30", "hasChild": false, "isFile": true, "type": ".gif", "filterPath": "\\Documents\\", "permission": { "copy": false, "download": true, "write": false, "writeContents": true, "read": false, "upload": true } },
        { "name": "2.png", "size": 66523, "dateModified": "2019-03-07T14:49:02.6434232+05:30", "dateCreated": "2019-04-22T12:39:18.537065+05:30", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\Documents\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": false, "upload": true } },
        { "name": "2.txt", "size": 274, "dateModified": "2019-03-07T14:49:02.6324297+05:30", "dateCreated": "2019-04-22T12:39:18.5510561+05:30", "hasChild": false, "isFile": true, "type": ".txt", "filterPath": "\\Documents\\", "permission": { "copy": false, "download": true, "write": false, "writeContents": true, "read": false, "upload": true } },
        { "name": "3.PNG", "size": 62190, "dateModified": "2019-03-07T14:49:02.6454208+05:30", "dateCreated": "2019-04-22T12:39:18.5630472+05:30", "hasChild": false, "isFile": true, "type": ".PNG", "filterPath": "\\Documents\\", "permission": { "copy": false, "download": true, "write": true, "writeContents": true, "read": false, "upload": true } },
        { "name": "4.jpg", "size": 46393, "dateModified": "2019-03-07T14:49:02.641425+05:30", "dateCreated": "2019-04-22T12:39:18.5700425+05:30", "hasChild": false, "isFile": true, "type": ".jpg", "filterPath": "\\Documents\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "EJ2 File Manager.docx", "size": 12403, "dateModified": "2019-03-07T14:49:02.6204366+05:30", "dateCreated": "2019-04-22T12:39:18.5760393+05:30", "hasChild": false, "isFile": true, "type": ".docx", "filterPath": "\\Documents\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "EJ2 File Manager.pdf", "size": 90099, "dateModified": "2019-03-07T14:49:02.6224359+05:30", "dateCreated": "2019-04-22T12:39:18.583036+05:30", "hasChild": false, "isFile": true, "type": ".pdf", "filterPath": "\\Documents\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "File Manager PPT.pptx", "size": 578010, "dateModified": "2019-03-07T14:49:02.6314292+05:30", "dateCreated": "2019-04-22T12:39:18.5930286+05:30", "hasChild": false, "isFile": true, "type": ".pptx", "filterPath": "\\Documents\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "File Manager.txt", "size": 274, "dateModified": "2019-03-07T14:49:02.6324297+05:30", "dateCreated": "2019-04-22T12:39:18.6050224+05:30", "hasChild": false, "isFile": true, "type": ".txt", "filterPath": "\\Documents\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } }
    ],
    "error": null,
    "details": null
}

export let accessData3: any = {
    "cwd": { "name": "Downloads", "size": 0, "dateModified": "2019-04-24T12:56:17.3095747+05:30", "dateCreated": "2019-03-07T14:49:02.6324297+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": false, "read": false, "upload": false } },
    "files": null,
    "error": { "code": "401", "message": "'/Downloads/' is not accessible. Access is denied.", "fileExists": null },
    "details": null
}

export let accessData4: any = {
    "cwd": { "name": "Music.png", "oldName": null, "size": 0, "dateModified": "2019-05-17T14:51:49.1146061+05:30", "dateCreated": "2019-04-22T17:48:53.9322593+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
    "files": [
        { "name": "as", "oldName": null, "size": 0, "dateModified": "2019-05-17T09:26:13.3180631+05:30", "dateCreated": "2019-04-26T11:59:16.2421514+05:30", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\Music.png\\", "permission": { "copy": false, "download": false, "write": true, "writeContents": true, "read": false, "upload": false } },
        { "name": "4.jpg", "oldName": null, "size": 46393, "dateModified": "2019-03-07T14:49:02.641425+05:30", "dateCreated": "2019-04-22T12:39:18.5700425+05:30", "hasChild": false, "isFile": true, "type": ".jpg", "filterPath": "\\Music.png\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": false, "upload": true } },
        { "name": "Music.mp3", "oldName": null, "size": 0, "dateModified": "2019-03-07T14:49:02.6344281+05:30", "dateCreated": "2019-04-22T17:48:53.9352567+05:30", "hasChild": false, "isFile": true, "type": ".mp3", "filterPath": "\\Music.png\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": false, "upload": true } },
        { "name": "Sample Music.mp3", "oldName": null, "size": 0, "dateModified": "2019-03-07T14:49:02.6354274+05:30", "dateCreated": "2019-04-22T17:48:53.9522458+05:30", "hasChild": false, "isFile": true, "type": ".mp3", "filterPath": "\\Music.png\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": false, "upload": true } }
    ],
    "error": null,
    "details": null
}

export let accessData5: any = {
    "cwd": { "name": "Files", "size": 0, "dateModified": "2019-05-07T10:22:34.1406062+05:30", "dateCreated": "2019-03-07T14:49:02.6184375+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
    "files": [
        { "name": "Documents", "size": 0, "dateModified": "2019-05-07T11:15:20.235362+05:30", "dateCreated": "2019-04-22T12:38:31.9246688+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": true, "download": false, "write": false, "writeContents": true, "read": true, "upload": true } },
        { "name": "Downloads", "size": 0, "dateModified": "2019-04-24T12:56:17.3095747+05:30", "dateCreated": "2019-03-07T14:49:02.6324297+05:30", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": true, "writeContents": true, "read": false, "upload": false } },
        { "name": "Music.png", "size": 0, "dateModified": "2019-05-07T09:46:48.2605339+05:30", "dateCreated": "2019-04-22T17:48:53.9322593+05:30", "hasChild": true, "isFile": false, "type": ".png", "filterPath": "\\", "permission": { "copy": true, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "Videos", "size": 0, "dateModified": "2019-03-07T14:49:02.6654092+05:30", "dateCreated": "2019-03-07T14:49:02.6644086+05:30", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": true, "writeContents": true, "read": false, "upload": false } },
        { "name": "2.gif", "size": 207320, "dateModified": "2019-03-06T10:43:51.8195497+05:30", "dateCreated": "2019-04-16T15:31:27.8010411+05:30", "hasChild": false, "isFile": true, "type": ".gif", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "2.png", "size": 66523, "dateModified": "2019-03-07T14:49:02.6434232+05:30", "dateCreated": "2019-04-16T15:00:29.3932591+05:30", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\", "permission": { "copy": false, "download": true, "write": true, "writeContents": true, "read": true, "upload": true } },
        { "name": "3.png", "size": 62190, "dateModified": "2019-03-07T14:49:02.6454208+05:30", "dateCreated": "2019-04-16T15:00:29.3622788+05:30", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": true, "upload": true } },
        { "name": "README.md", "size": 517, "dateModified": "2019-03-11T11:02:01.7962742+05:30", "dateCreated": "2019-03-11T11:02:01.7952736+05:30", "hasChild": false, "isFile": true, "type": ".md", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": false, "upload": true } },
        { "name": "textbooks", "size": 0, "dateModified": "2019-04-17T09:34:10.2358973+05:30", "dateCreated": "2019-04-17T09:34:54.741977+05:30", "hasChild": false, "isFile": true, "type": "", "filterPath": "\\", "permission": { "copy": false, "download": false, "write": false, "writeContents": true, "read": false, "upload": true } }
    ],
    "error": null,
    "details": null
}

export let accessData6: any = {
    "cwd": null,
    "files": null,
    "error": { "code": "401", "message": "'Files/README.md' is not accessible. Access is denied.", "fileExists": null },
    "details": null
}

export let accessData7: any = {
    "cwd": null,
    "files": null,
    "error": { "code": "401", "message": "'Files/2.gif' is not accessible. Access is denied.", "fileExists": null },
    "details": null
}

export let idData1: any = {
    "cwd": { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Files", "size": 0, "dateModified": "2011-02-05T00:00:00", "targetData": null, "dateCreated": "2011-02-05T00:00:00", "hasChild": true, "isFile": false, "type": "", "id": "1", "filterPath": "", "filterId": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
    "files": [
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Documents", "size": 30, "dateModified": "2019-06-18T18:57:12.53", "targetData": null, "dateCreated": "2019-06-18T18:57:12.567", "hasChild": false, "isFile": false, "type": "", "id": "6171", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Downloads", "size": 30, "dateModified": "2019-06-18T18:57:16.603", "targetData": null, "dateCreated": "2019-06-18T18:57:16.603", "hasChild": false, "isFile": false, "type": "", "id": "6172", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Music", "size": 30, "dateModified": "2019-06-18T18:57:24.173", "targetData": null, "dateCreated": "2019-06-18T18:57:24.173", "hasChild": false, "isFile": false, "type": "", "id": "6173", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Pictures", "size": 30, "dateModified": "2019-06-18T18:57:28.15", "targetData": null, "dateCreated": "2019-06-18T18:57:28.15", "hasChild": true, "isFile": false, "type": "", "id": "6174", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Videos", "size": 30, "dateModified": "2019-06-18T18:57:32.717", "targetData": null, "dateCreated": "2019-06-18T18:57:32.717", "hasChild": false, "isFile": false, "type": "", "id": "6175", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null }
    ],
    "error": null,
    "details": null
}

export let idData2: any = {
    "cwd": { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Pictures", "size": 30, "dateModified": "2019-06-18T18:57:28.15", "targetData": null, "dateCreated": "2019-06-18T18:57:28.15", "hasChild": true, "isFile": false, "type": "", "id": "6174", "filterPath": "/", "filterId": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
    "files": [
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Employees", "size": 30, "dateModified": "2019-06-18T18:58:16.893", "targetData": null, "dateCreated": "2019-06-18T18:58:16.893", "hasChild": false, "isFile": false, "type": "", "id": "6176", "filterPath": "/Pictures/", "filterId": "1/6174/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Nature", "size": 30, "dateModified": "2019-06-18T18:58:20.55", "targetData": null, "dateCreated": "2019-06-18T18:58:20.55", "hasChild": false, "isFile": false, "type": "", "id": "6177", "filterPath": "/Pictures/", "filterId": "1/6174/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Food", "size": 30, "dateModified": "2019-06-18T18:58:23.537", "targetData": null, "dateCreated": "2019-06-18T18:58:23.537", "hasChild": false, "isFile": false, "type": "", "id": "6178", "filterPath": "/Pictures/", "filterId": "1/6174/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null }
    ],
    "error": null,
    "details": null
}

export let idData3: any = {
    "cwd": { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Employees", "size": 30, "dateModified": "2019-06-18T18:58:16.893", "targetData": null, "dateCreated": "2019-06-18T18:58:16.893", "hasChild": false, "isFile": false, "type": "", "id": "6176", "filterPath": "/Pictures/", "filterId": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
    "files": [
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "4.png", "size": 20, "dateModified": "2019-06-18T19:00:37.033", "targetData": null, "dateCreated": "2019-06-18T19:00:37.033", "hasChild": false, "isFile": true, "type": ".png", "id": "6188", "filterPath": "/Pictures/Employees/", "filterId": "1/6174/6176/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "1.png", "size": 20, "dateModified": "2019-06-18T19:00:37.073", "targetData": null, "dateCreated": "2019-06-18T19:00:37.073", "hasChild": false, "isFile": true, "type": ".png", "id": "6190", "filterPath": "/Pictures/Employees/", "filterId": "1/6174/6176/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "2.png", "size": 20, "dateModified": "2019-06-18T19:00:37.947", "targetData": null, "dateCreated": "2019-06-18T19:00:37.947", "hasChild": false, "isFile": true, "type": ".png", "id": "6191", "filterPath": "/Pictures/Employees/", "filterId": "1/6174/6176/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "5.png", "size": 20, "dateModified": "2019-06-18T19:00:38.893", "targetData": null, "dateCreated": "2019-06-18T19:00:38.893", "hasChild": false, "isFile": true, "type": ".png", "id": "6192", "filterPath": "/Pictures/Employees/", "filterId": "1/6174/6176/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "6.png", "size": 20, "dateModified": "2019-06-18T19:00:39.14", "targetData": null, "dateCreated": "2019-06-18T19:00:39.14", "hasChild": false, "isFile": true, "type": ".png", "id": "6193", "filterPath": "/Pictures/Employees/", "filterId": "1/6174/6176/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "3.png", "size": 20, "dateModified": "2019-06-18T19:00:37.037", "targetData": null, "dateCreated": "2019-06-18T19:00:37.037", "hasChild": false, "isFile": true, "type": ".png", "id": "6189", "filterPath": "/Pictures/Employees/", "filterId": "1/6174/6176/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null }
    ],
    "error": null,
    "details": null
}

export let idData4: any = {
    "cwd": { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Documents", "size": 30, "dateModified": "2019-06-18T18:57:12.53", "targetData": null, "dateCreated": "2019-06-18T18:57:12.567", "hasChild": false, "isFile": false, "type": "", "id": "6171", "filterPath": "/", "filterId": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
    "files": [
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "File Manager.txt", "size": 20, "dateModified": "2019-06-18T18:58:59.047", "targetData": null, "dateCreated": "2019-06-18T18:58:59.047", "hasChild": false, "isFile": true, "type": ".txt", "id": "6179", "filterPath": "/Documents/", "filterId": "1/6171/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "EJ2 File Manager.pdf", "size": 20, "dateModified": "2019-06-18T18:59:13.177", "targetData": null, "dateCreated": "2019-06-18T18:59:13.177", "hasChild": false, "isFile": true, "type": ".pdf", "id": "6182", "filterPath": "/Documents/", "filterId": "1/6171/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "EJ2FileManager", "size": 20, "dateModified": "2019-06-18T19:06:20", "targetData": null, "dateCreated": "2019-06-18T19:06:06.943", "hasChild": false, "isFile": true, "type": ".ppt", "id": "6206", "filterPath": "/Documents/", "filterId": "1/6171/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null }
    ],
    "error": null,
    "details": null
}

export let idData1Delete: any = {
    "cwd": { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Files", "size": 0, "dateModified": "2011-02-05T00:00:00", "targetData": null, "dateCreated": "2011-02-05T00:00:00", "hasChild": true, "isFile": false, "type": "", "id": "1", "filterPath": "", "filterId": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
    "files": [
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Downloads", "size": 30, "dateModified": "2019-06-18T18:57:16.603", "targetData": null, "dateCreated": "2019-06-18T18:57:16.603", "hasChild": false, "isFile": false, "type": "", "id": "6172", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Music", "size": 30, "dateModified": "2019-06-18T18:57:24.173", "targetData": null, "dateCreated": "2019-06-18T18:57:24.173", "hasChild": false, "isFile": false, "type": "", "id": "6173", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Pictures", "size": 30, "dateModified": "2019-06-18T18:57:28.15", "targetData": null, "dateCreated": "2019-06-18T18:57:28.15", "hasChild": true, "isFile": false, "type": "", "id": "6174", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Videos", "size": 30, "dateModified": "2019-06-18T18:57:32.717", "targetData": null, "dateCreated": "2019-06-18T18:57:32.717", "hasChild": false, "isFile": false, "type": "", "id": "6175", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null }
    ],
    "error": null,
    "details": null
}

export let idData1Rename: any = {
    "cwd": { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Files", "size": 0, "dateModified": "2011-02-05T00:00:00", "targetData": null, "dateCreated": "2011-02-05T00:00:00", "hasChild": true, "isFile": false, "type": "", "id": "1", "filterPath": "", "filterId": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
    "files": [
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "My Folder", "size": 30, "dateModified": "2019-06-18T18:57:12.53", "targetData": null, "dateCreated": "2019-06-18T18:57:12.567", "hasChild": false, "isFile": false, "type": "", "id": "6171", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Downloads", "size": 30, "dateModified": "2019-06-18T18:57:16.603", "targetData": null, "dateCreated": "2019-06-18T18:57:16.603", "hasChild": false, "isFile": false, "type": "", "id": "6172", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Music", "size": 30, "dateModified": "2019-06-18T18:57:24.173", "targetData": null, "dateCreated": "2019-06-18T18:57:24.173", "hasChild": false, "isFile": false, "type": "", "id": "6173", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Pictures", "size": 30, "dateModified": "2019-06-18T18:57:28.15", "targetData": null, "dateCreated": "2019-06-18T18:57:28.15", "hasChild": true, "isFile": false, "type": "", "id": "6174", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "Videos", "size": 30, "dateModified": "2019-06-18T18:57:32.717", "targetData": null, "dateCreated": "2019-06-18T18:57:32.717", "hasChild": false, "isFile": false, "type": "", "id": "6175", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null }
    ],
    "error": null,
    "details": null
}

export let idData1Rename1: any = {
    "cwd": null,
    "files": [
        { "path": null, "action": null, "newName": null, "renameFiles": null, "targetPath": null, "names": null, "name": "My Folder", "size": 30, "dateModified": "2019-06-18T18:57:12.53", "targetData": null, "dateCreated": "2019-06-18T18:57:12.567", "hasChild": false, "isFile": false, "type": "", "id": "6171", "filterPath": "/", "filterId": "1/", "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "iconClass": null, "nodeId": null, "parentID": null, "selected": false, "icon": null, "data": null },
    ],
    "error": null,
    "details": null
}

export let data24: any = {
    "cwd": { "path": null, "action": null, "newName": null, "names": null, "name": "Files", "size": 0, "previousName": null, "dateModified": "2019-07-22T17:18:35.6490313+05:30", "dateCreated": "2019-07-22T15:05:29.16003+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
    "files": [
        { "path": null, "action": null, "newName": null, "names": null, "name": "Documents", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1730273+05:30", "dateCreated": "2019-07-22T15:05:29.16003+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Downloads", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.175025+05:30", "dateCreated": "2019-07-22T15:05:29.1740261+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Music", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.177026+05:30", "dateCreated": "2019-07-22T15:05:29.1760243+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Pictures", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1973518+05:30", "dateCreated": "2019-07-22T15:05:29.177026+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Videos", "size": 0, "previousName": null, "dateModified": "2019-07-22T17:18:35.6560266+05:30", "dateCreated": "2019-07-22T15:05:29.2071306+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File.png", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6140539+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File1.txt", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6480326+05:30", "hasChild": false, "isFile": true, "type": ".txt", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null }
    ],
    "error": null,
    "details": null
}

export let data26: any = {
    "cwd": { "path": null, "action": null, "newName": null, "names": null, "name": "Files", "size": 0, "previousName": null, "dateModified": "2019-07-22T17:18:35.6490313+05:30", "dateCreated": "2019-07-22T15:05:29.16003+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
    "files": [
        { "path": null, "action": null, "newName": null, "names": null, "name": "Documents", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1730273+05:30", "dateCreated": "2019-07-22T15:05:29.16003+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Downloads", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.175025+05:30", "dateCreated": "2019-07-22T15:05:29.1740261+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Music", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.177026+05:30", "dateCreated": "2019-07-22T15:05:29.1760243+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Pictures", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1973518+05:30", "dateCreated": "2019-07-22T15:05:29.177026+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Videos", "size": 0, "previousName": null, "dateModified": "2019-07-22T17:18:35.6560266+05:30", "dateCreated": "2019-07-22T15:05:29.2071306+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File.png", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6140539+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File1.txt", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6480326+05:30", "hasChild": false, "isFile": true, "type": ".txt", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Documents1", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1730273+05:30", "dateCreated": "2019-07-22T15:05:29.16003+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Downloads1", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.175025+05:30", "dateCreated": "2019-07-22T15:05:29.1740261+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Music1", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.177026+05:30", "dateCreated": "2019-07-22T15:05:29.1760243+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Pictures1", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1973518+05:30", "dateCreated": "2019-07-22T15:05:29.177026+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Videos1", "size": 0, "previousName": null, "dateModified": "2019-07-22T17:18:35.6560266+05:30", "dateCreated": "2019-07-22T15:05:29.2071306+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File.png1", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6140539+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File1.txt1", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6480326+05:30", "hasChild": false, "isFile": true, "type": ".txt", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Documents2", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1730273+05:30", "dateCreated": "2019-07-22T15:05:29.16003+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Downloads2", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.175025+05:30", "dateCreated": "2019-07-22T15:05:29.1740261+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Music2", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.177026+05:30", "dateCreated": "2019-07-22T15:05:29.1760243+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Pictures2", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1973518+05:30", "dateCreated": "2019-07-22T15:05:29.177026+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Videos2", "size": 0, "previousName": null, "dateModified": "2019-07-22T17:18:35.6560266+05:30", "dateCreated": "2019-07-22T15:05:29.2071306+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File.png2", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6140539+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File1.txt2", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6480326+05:30", "hasChild": false, "isFile": true, "type": ".txt", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Documents3", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1730273+05:30", "dateCreated": "2019-07-22T15:05:29.16003+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Downloads3", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.175025+05:30", "dateCreated": "2019-07-22T15:05:29.1740261+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Music3", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.177026+05:30", "dateCreated": "2019-07-22T15:05:29.1760243+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Pictures3", "size": 0, "previousName": null, "dateModified": "2019-07-22T15:05:29.1973518+05:30", "dateCreated": "2019-07-22T15:05:29.177026+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Videos3", "size": 0, "previousName": null, "dateModified": "2019-07-22T17:18:35.6560266+05:30", "dateCreated": "2019-07-22T15:05:29.2071306+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File.png3", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6140539+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "File1.txt3", "size": 274, "previousName": null, "dateModified": "2019-07-22T15:05:29.1740261+05:30", "dateCreated": "2019-07-22T17:18:35.6480326+05:30", "hasChild": false, "isFile": true, "type": ".txt", "id": null, "filterPath": "\\", "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "_fm_iconClass": null, "_fm_id": null, "_fm_pId": null, "_fm_selected": false, "_fm_icon": null, "data": null, "targetData": null, "permission": null }
    ],
    "error": null,
    "details": null
}

export let data25: any = {
    "cwd": null,
    "files": null,
    "error": { "code": "400", "message": "Cannot rename File.png to File.png: destination already exists.", "fileExists": null },
    "details": null
}

export let noExtension: any = {
    "cwd": { "path": null, "action": null, "newName": null, "names": null, "name": "Files", "size": 0, "previousName": null, "dateModified": "2019-09-17T14:55:06.2893577+05:30", "dateCreated": "2019-09-17T14:54:40.0589732+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
    "files": [
        { "path": null, "action": null, "newName": null, "names": null, "name": "Testing", "size": 0, "previousName": null, "dateModified": "2019-09-17T14:54:45.8898912+05:30", "dateCreated": "2019-09-17T14:54:45.8898912+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "1.png", "size": 102182, "previousName": null, "dateModified": "2019-07-22T15:05:29.1993566+05:30", "dateCreated": "2019-09-17T14:55:06.2893577+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "New", "size": 0, "previousName": null, "dateModified": "2019-09-17T10:50:44.9921206+05:30", "dateCreated": "2019-09-17T14:55:06.2873602+05:30", "hasChild": false, "isFile": true, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null }
    ],
    "error": null,
    "details": null
}

export let noExtensionRename: any = {
    "cwd": null,
    "files": [
        { "path": null, "action": null, "newName": null, "names": null, "name": "2.png", "size": 102182, "previousName": null, "dateModified": "2019-07-22T15:05:29.1993566+05:30", "dateCreated": "2019-09-17T14:55:06.2893577+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null }
    ],
    "error": null,
    "details": null
}

export let noExtensionSuccess: any = {
    "cwd": { "path": null, "action": null, "newName": null, "names": null, "name": "Files", "size": 0, "previousName": null, "dateModified": "2019-09-17T15:20:03.0795592+05:30", "dateCreated": "2019-09-17T14:54:40.0589732+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
    "files": [
        { "path": null, "action": null, "newName": null, "names": null, "name": "Testing", "size": 0, "previousName": null, "dateModified": "2019-09-17T14:54:45.8898912+05:30", "dateCreated": "2019-09-17T14:54:45.8898912+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "2.png", "size": 102182, "previousName": null, "dateModified": "2019-07-22T15:05:29.1993566+05:30", "dateCreated": "2019-09-17T14:55:06.2893577+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "New", "size": 0, "previousName": null, "dateModified": "2019-09-17T10:50:44.9921206+05:30", "dateCreated": "2019-09-17T14:55:06.2873602+05:30", "hasChild": false, "isFile": true, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null }
    ],
    "error": null,
    "details": null
}

export let ascendingData: any = {

    "cwd": { "path": null, "action": null, "newName": null, "names": null, "name": "Files", "size": 0, "previousName": null, "dateModified": "2019-09-17T15:20:03.0795592+05:30", "dateCreated": "2019-09-17T14:54:40.0589732+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
    "files": [
        { "path": null, "action": null, "newName": null, "names": null, "name": "Apple", "size": 0, "previousName": null, "dateModified": "2019-09-17T14:54:45.8898912+05:30", "dateCreated": "2019-09-17T14:54:45.8898912+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Music", "size": 102182, "previousName": null, "dateModified": "2019-07-22T15:05:29.1993566+05:30", "dateCreated": "2019-09-17T14:55:06.2893577+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Videos", "size": 0, "previousName": null, "dateModified": "2019-09-17T10:50:44.9921206+05:30", "dateCreated": "2019-09-17T14:55:06.2873602+05:30", "hasChild": false, "isFile": true, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null }
    ],
    "error": null,
    "details": null
}

export let descendingData: any = {
    "cwd": { "path": null, "action": null, "newName": null, "names": null, "name": "Files", "size": 0, "previousName": null, "dateModified": "2019-09-17T15:20:03.0795592+05:30", "dateCreated": "2019-09-17T14:54:40.0589732+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
    "files": [
        { "path": null, "action": null, "newName": null, "names": null, "name": "Videos", "size": 0, "previousName": null, "dateModified": "2019-09-17T14:54:45.8898912+05:30", "dateCreated": "2019-09-17T14:54:45.8898912+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Music", "size": 102182, "previousName": null, "dateModified": "2019-07-22T15:05:29.1993566+05:30", "dateCreated": "2019-09-17T14:55:06.2893577+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Apple", "size": 0, "previousName": null, "dateModified": "2019-09-17T10:50:44.9921206+05:30", "dateCreated": "2019-09-17T14:55:06.2873602+05:30", "hasChild": false, "isFile": true, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null }
    ],
    "error": null,
    "details": null
}
export let noSorting: any = {
    "cwd": { "path": null, "action": null, "newName": null, "names": null, "name": "Files", "size": 0, "previousName": null, "dateModified": "2019-09-17T15:20:03.0795592+05:30", "dateCreated": "2019-09-17T14:54:40.0589732+05:30", "hasChild": true, "isFile": false, "type": "", "id": null, "filterPath": "", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
    "files": [
        { "path": null, "action": null, "newName": null, "names": null, "name": "Music", "size": 0, "previousName": null, "dateModified": "2019-09-17T14:54:45.8898912+05:30", "dateCreated": "2019-09-17T14:54:45.8898912+05:30", "hasChild": false, "isFile": false, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Videos", "size": 102182, "previousName": null, "dateModified": "2019-07-22T15:05:29.1993566+05:30", "dateCreated": "2019-09-17T14:55:06.2893577+05:30", "hasChild": false, "isFile": true, "type": ".png", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null },
        { "path": null, "action": null, "newName": null, "names": null, "name": "Apple", "size": 0, "previousName": null, "dateModified": "2019-09-17T10:50:44.9921206+05:30", "dateCreated": "2019-09-17T14:55:06.2873602+05:30", "hasChild": false, "isFile": true, "type": "", "id": null, "filterPath": "\\", "filterId": null, "targetPath": null, "renameFiles": null, "uploadFiles": null, "caseSensitive": false, "searchString": null, "showHiddenItems": false, "data": null, "targetData": null, "permission": null }
    ],
    "error": null,
    "details": null
}
export let folderCopy: any = {
    "cwd": null,
    "files": [
        { "name": "Documents", "previousName": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\Documents\\" }
    ],
    "error": null,
    "details": null
}
export let folderRead: any = {
    "cwd": { "name": "Documents", "previousName": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\" },
    "files": [
        { "name": "Documents", "previousName": "Documents", "size": 0, "dateModified": "10/16/2018 7:43:17 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\Food\\Documents\\" }
    ],
    "error": null,
    "details": null
}
export let dragOnHover: any = {
    "files": [
        { "name": "1.png", "size": 49792, "dateModified": "1/3/2018 4:07:28 PM", "dateCreated": "10/17/2018 12:57:59 PM", "hasChild": false, "isFile": true, "type": ".png", "filterPath": "\\" },
        { "name": "Employees", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Food", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "\\" },
        { "name": "Nature", "size": 0, "dateModified": "10/15/2018 5:39:03 PM", "dateCreated": "10/15/2018 5:39:03 PM", "hasChild": false, "isFile": false, "type": "", "filterPath": "\\" }
    ],
    "error": null,
    "details": null,
    "cwd": { "name": "FileContent", "size": 0, "dateModified": "11/15/2018 11:42:21 AM", "dateCreated": "11/8/2018 4:07:00 PM", "hasChild": true, "isFile": false, "type": "", "filterPath": "" },
};