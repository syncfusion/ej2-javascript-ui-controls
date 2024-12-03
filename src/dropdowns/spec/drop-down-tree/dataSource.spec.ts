let nodeAttr: { [key: string]: string } = { 'class': 'firstnode', 'style': 'background: red' };
let subAttr: { [key: string]: string } = { 'class': 'customnode', 'style': 'background: blue' };


export let hierarchicalData: any = [
    {
        value: 1, text: "Artwork", iconCss: 'folder', imageUrl: 'base/spec/images/Shooting.png', tooltip: 'This is Artwork node', selected: true,
        child: [
            {
                value: 2, text: "Abstract",
                child: [
                    { value: 3, text: "2 Acrylic Mediums" },
                    { value: 4, text: "Creative Acrylic" },
                    { value: 5, text: "Modern Painting" },
                    { value: 6, text: "Canvas Art" },
                    { value: 7, text: "Black white" },
                ]
            },
            {
                value: 8, text: "Children",
                child: [
                    { value: 9, text: "Preschool Crafts" },
                    { value: 10, text: "School-age Crafts" },
                    { value: 11, text: "Fabulous Toddler" },
                ]
            },
            {
                value: 12, text: "Comic / Cartoon",
                child: [
                    { value: 13, text: "Batman" },
                    { value: 14, text: "Adventures of Superman" },
                    { value: 15, text: "Super boy" },
                ]
            },
        ]
    },
    {
        value: 16, text: "Books", htmlAttributes: nodeAttr,
        child: [
            {
                value: 17, text: "Comics",
                child: [
                    { value: 18, text: "The Flash" },
                    { value: 19, text: "Human Target" },
                    { value: 20, text: "Birds of Prey" },
                ]
            },
            { value: 21, text: "Entertaining" },
            { value: 22, text: "Design" },
        ]
    },
    {
        value: 23, text: "Music", expanded: true,
        child: [
            {
                value: 24, text: "Classical", expanded: 'true',
                child: [
                    { value: 25, text: "Avant-Garde" },
                    { value: 26, text: "Medieval" },
                    { value: 27, text: "Orchestral" },
                ]
            },
            { value: 28, text: "Mass" },
            { value: 29, text: "Folk" },
        ]
    },
    { value: 30, text: "Games" }
];

export var hierarchicalDataString = [
    {
        id: '01', name: 'Local Disk (C:)', expanded: true,
        subChild: [
            {
                id: '01-01', name: 'Program Files',
                subChild: [
                    { id: '01-01-01', name: 'Windows NT' },
                    { id: '01-01-02', name: 'Windows Mail' },
                    { id: '01-01-03', name: 'Windows Photo Viewer' },
                ]
            },
            {
                id: '01-02', name: 'Users', expanded: true,
                subChild: [
                    { id: '01-02-01', name: 'Smith' },
                    { id: '01-02-02', name: 'Public' },
                    { id: '01-02-03', name: 'Admin' },
                ]
            },
            {
                id: '01-03', name: 'Windows',
                subChild: [
                    { id: '01-03-01', name: 'Boot' },
                    { id: '01-03-02', name: 'FileManager' },
                    { id: '01-03-03', name: 'System32' },
                ]
            },
        ]
    },
    {
        id: '02', name: 'Local Disk (D:)',
        subChild: [
            {
                id: '02-01', name: 'Personals',
                subChild: [
                    { id: '02-01-01', name: 'My photo.png' },
                    { id: '02-01-02', name: 'Rental document.docx' },
                    { id: '02-01-03', name: 'Pay slip.pdf' },
                ]
            },
            {
                id: '02-02', name: 'Projects',
                subChild: [
                    { id: '02-02-01', name: 'ASP Application' },
                    { id: '02-02-02', name: 'TypeScript Application' },
                    { id: '02-02-03', name: 'React Application' },
                ]
            },
            {
                id: '02-03', name: 'Office',
                subChild: [
                    { id: '02-03-01', name: 'Work details.docx' },
                    { id: '02-03-02', name: 'Weekly report.docx' },
                    { id: '02-03-03', name: 'Wish list.csv' },
                ]
            },
        ]
    },
    {
        id: '03', name: 'Local Disk (E:)', icon: 'folder',
        subChild: [
            {
                id: '03-01', name: 'Pictures',
                subChild: [
                    { id: '03-01-01', name: 'Wind.jpg' },
                    { id: '03-01-02', name: 'Stone.jpg' },
                    { id: '03-01-03', name: 'Home.jpg' },
                ]
            },
            {
                id: '03-02', name: 'Documents',
                subChild: [
                    { id: '03-02-01', name: 'Environment Pollution.docx' },
                    { id: '03-02-02', name: 'Global Warming.ppt' },
                    { id: '03-02-03', name: 'Social Network.pdf' },
                ]
            },
            {
                id: '03-03', name: 'Study Materials',
                subChild: [
                    { id: '03-03-01', name: 'UI-Guide.pdf' },
                    { id: '03-03-02', name: 'Tutorials.zip' },
                    { id: '03-03-03', name: 'TypeScript.7z' },
                ]
            },
        ]
    }
];

export let hierarchicalData1: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/', nodeImage1: 'base/spec/images/Shooting.png', nodeExpanded1: true,
        nodeChild: [
            { nodeId: '01-01', nodeText: 'Gouttes.mp3', nodeIcon: 'file' }
        ]
    },
    {
        nodeId: '02', nodeText: 'Videos', nodeIcon: 'folder', nodeHtmlAttr: nodeAttr, nodeImage1: 'base/spec/images/Shooting.png',
        nodeChecked: true,
        nodeChild: [
            { nodeId: '02-01', nodeText: 'Naturals.mp4', nodeIcon: 'file' },
            { nodeId: '02-02', nodeText: 'Wild.mpeg', nodeIcon: 'file' },
        ]
    },
    {
        nodeId: '03', nodeText: 'Documents', nodeIcon: 'folder',
        nodeChild: [
            { nodeId: '03-01', nodeText: 'Environment Pollution.docx', nodeIcon: 'file' },
            { nodeId: '03-02', nodeText: 'Global Water, Sanitation, & Hygiene.docx', nodeIcon: 'file' },
            { nodeId: '03-03', nodeText: 'Global Warming.ppt', nodeIcon: 'file' },
            { nodeId: '03-04', nodeText: 'Social Network.pdf', nodeIcon: 'file' },
            { nodeId: '03-05', nodeText: 'Youth Empowerment.pdf', nodeIcon: 'file' },
        ]
    },
    {
        nodeId: '04', nodeText: 'Pictures', nodeIcon: 'folder', nodeExpanded: true,
        nodeChild: [
            {
                nodeId: '04-01', nodeText: 'Camera Roll', nodeIcon: 'folder', nodeExpanded: 'true',
                nodeChild: [
                    { nodeId: '04-01-01', nodeText: 'WIN_20160726_094117.JPG', nodeIcon: 'file' },
                    { nodeId: '04-01-02', nodeText: 'WIN_20160726_094118.JPG', nodeIcon: 'file' },
                    { nodeId: '04-01-03', nodeText: 'WIN_20160726_094119.JPG', nodeIcon: 'file' }
                ]
            },
            { nodeId: '04-02', nodeText: 'Wind.jpg', nodeIcon: 'file' },
            { nodeId: '04-03', nodeText: 'Stone.jpg', nodeIcon: 'file' },
            { nodeId: '04-04', nodeText: 'Home.jpg', nodeIcon: 'file' },
            { nodeId: '04-05', nodeText: 'Bridge.png', nodeIcon: 'file' }
        ]
    },
    {
        nodeId: '05', nodeText: 'Downloads', nodeIcon: 'folder', nodeExpanded1: true,
        nodeChild: [
            { nodeId: '05-01', nodeText: 'UI-Guide.pdf', nodeIcon: 'file' },
            { nodeId: '05-02', nodeText: 'Tutorials.zip', nodeIcon: 'file' },
            { nodeId: '05-03', nodeText: 'Game.exe', nodeIcon: 'file' },
            { nodeId: '05-04', nodeText: 'TypeScript.7z', nodeIcon: 'file' },
        ]
    },
];



export let hierarchicalData2: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/',
        subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subTooltip: 'This is Pictures node', subExpanded: true, subUrl: 'http://ej2.syncfusion.com/demos/',
        nodeChild: [
            {
                nodeId: '01-01', nodeText: 'Wind.jpg', nodeChild: [],
                subId: '21-01', subText: 'Gouttes.mp3', subChild: [],
            }
        ],
        subChild: [
            {
                nodeId: '21-01', nodeText: 'Gouttes.jpg', nodeChild: null,
                subId: '01-01', subText: 'Wind.mp3', subChild: null,
            }
        ]
    },
    {
        nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
        subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr,
    },
];

export let hierarchicalData3: { [key: string]: Object }[] = [
    {
        id: 1, name: 'Australia', expanded: true,
        child: [
            { id: 2, name: 'New South Wales', isSelected: true },
            { id: 3, name: 'Victoria' },
            { id: 4, name: 'South Australia' },
            { id: 6, name: 'Western Australia' },
        ]
    },
    {
        id: 7, name: 'Brazil', child: [
            { id: 8, name: 'Paraná' },
            { id: 9, name: 'Ceará', isSelected: true },
            { id: 10, name: 'Acre' },
        ]
    },
    {
        id: 11, name: 'China', child: [
            { id: 12, pid: 11, name: 'Guangzhou' },
            { id: 13, pid: 11, name: 'Shanghai' },
            { id: 14, pid: 11, name: 'Beijing' },
            { id: 15, pid: 11, name: 'Shantou' }
        ]
    },
    {
        id: 16, name: 'France', child: [
            { id: 17, pid: 16, name: 'Pays de la Loire' },
            { id: 18, pid: 16, name: 'Aquitaine' },
            { id: 19, pid: 16, name: 'Brittany' },
            { id: 20, pid: 16, name: 'Lorraine' },
        ]
    },
    {
        id: 21, name: 'India', child: [
            { id: 22, pid: 21, name: 'Assam' },
            { id: 23, pid: 21, name: 'Bihar' },
            { id: 24, pid: 21, name: 'Tamil Nadu' },
            { id: 25, pid: 21, name: 'Punjab' }
        ]
    }
]

export let filterData: { [key: string]: Object }[] = [
    {
        text: 'Menu 1',
        id: 'menu1',
        items: []
    },
    {
        text: 'Menu 2',
        id: 'menu2',
        items: [
            {
                text: 'sub menu 2-1',
                id: 'submenu21'
            },
            {
                text: 'sub menu 2-2',
                id: 'submenu22'
            }
        ]
    },
    {
        text: 'Menu 3',
        id: 'menu3',
        items: [
            {
                text: 'sub menu 3-1',
                id: 'submenu31'
            },
            {
                text: 'sub menu 3-2',
                id: 'submenu32'
            }
        ]
    }
];

export let hierarchicalData3filtering: { [key: string]: Object }[] = [
    {
        id: 1, name: 'Australia', expanded: true,
        child: [
            { id: 2, name: 'New South Wales', isSelected: true },
            { id: 3, name: 'Victoria' },
            { id: 4, name: 'South Australia' },
            { id: 6, name: 'Western Australia' },
        ]
    },
    {
        id: 7, name: 'Brazil', child: [
            { id: 8, name: 'Paraná' },
            { id: 9, name: 'Ceará', isSelected: true },
            { id: 10, name: 'Acre' },
        ]
    },
    {
        id: 11, name: 'China', child: [
            { id: 12, pid: 11, name: 'Guangzhou' },
            { id: 13, pid: 11, name: 'Shanghai' },
            { id: 14, pid: 11, name: 'Beijing' },
            { id: 15, pid: 11, name: 'Shantou' }
        ]
    },
    {
        id: 16, name: 'France', child: [
            { id: 17, pid: 16, name: 'Pays de la Loire' },
            { id: 18, pid: 16, name: 'Aquitaine' },
            { id: 19, pid: 16, name: 'Brittany' },
            { id: 20, pid: 16, name: 'Lorraine' },
        ]
    },
    {
        id: 21, name: 'India', child: [
            { id: 22, pid: 21, name: 'Assam' },
            { id: 23, pid: 21, name: 'Bihar' },
            { id: 24, pid: 21, name: 'Tamil Nadu', child: [
                { id: 26, pid: 24, name: 'Namakkal' },
                { id: 27, pid: 24, name: 'Salem' },
                { id: 28, pid: 24, name: 'Coimbatore' },
                { id: 29, pid: 24, name: 'Chennai' }
            ] },
            { id: 25, pid: 21, name: 'Punjab' }
        ]
    }
]

export let filteredhierarchicalData3: { [key: string]: Object }[] = [
    {
        id: 21, name: 'India', child: [
            { id: 22, pid: 21, name: 'Assam' },
            { id: 23, pid: 21, name: 'Bihar' },
            { id: 24, pid: 21, name: 'Tamil Nadu' },
            { id: 25, pid: 21, name: 'Punjab' }
        ]
    }
]


export let listData_1: { [key: string]: Object }[] = [
    { value: 1, text: "Artwork", iconCss: 'folder', imageUrl: 'base/spec/images/Shooting.png', tooltip: 'This is Artwork node', selected: true, hasChildren: true },
    { value: 2, text: "Abstract", parentValue: 1, hasChildren: true },
    { value: 3, text: "2 Acrylic Mediums", parentValue: 2 },
    { value: 4, text: "Creative Acrylic", parentValue: 2 },
    { value: 5, text: "Modern Painting", parentValue: 2 },
    { value: 6, text: "Canvas Art", parentValue: 2 },
    { value: 7, text: "Black white", parentValue: 2 },
    { value: 8, text: "Children", hasChildren: true, parentValue: 1 },
    { value: 9, text: "Preschool Crafts", parentValue: 8 },
    { value: 10, text: "School-age Crafts", parentValue: 8 },
    { value: 11, text: "Fabulous Toddler", parentValue: 8 },
    { value: 12, text: "Comic / Cartoon", parentValue: 1, hasChildren: true },
    { value: 13, text: "Batman", parentValue: 12 },
    { value: 14, text: "Adventures of Superman", parentValue: 12 },
    { value: 15, text: "Super boy", parentValue: 12 },
    { value: 16, text: "Books", htmlAttributes: nodeAttr, hasChildren: true },
    { value: 17, text: "Comics", parentValue: 16, hasChildren: true },
    { value: 18, text: "The Flash", parentValue: 17 },
    { value: 19, text: "Human Target", parentValue: 17 },
    { value: 20, text: "Birds of Prey", parentValue: 17 },
    { value: 21, text: "Entertaining", parentValue: 16 },
    { value: 22, text: "Design", parentValue: 16 },
    { value: 23, text: "Music", expanded: true, hasChildren: true },
    { value: 24, text: "Classical", expanded: 'true', parentValue: 23, hasChildren: true },
    { value: 25, text: "Avant-Garde", parentValue: 24 },
    { value: 26, text: "Medieval", parentValue: 24 },
    { value: 27, text: "Orchestral", parentValue: 24 },
    { value: 28, text: "Mass", parentValue: 23 },
    { value: 29, text: "Folk", parentValue: 23 },
    { value: 30, text: "Games" }
];
export let listData: { [key: string]: Object }[] = [
    { id: 1, name: 'Australia', hasChild: true, expanded: true },
    { id: 2, pid: 1, name: 'New South Wales', isSelected: true },
    { id: 3, pid: 1, name: 'Victoria' },
    { id: 4, pid: 1, name: 'South Australia' },
    { id: 6, pid: 1, name: 'Western Australia' },
    { id: 7, name: 'Brazil', hasChild: true },
    { id: 8, pid: 7, name: 'Paraná' },
    { id: 9, pid: 7, name: 'Ceará' ,isSelected: true }, 
    { id: 10, pid: 7, name: 'Acre' },
    { id: 11, name: 'China', hasChild: true },
    { id: 12, pid: 11, name: 'Guangzhou' },
    { id: 13, pid: 11, name: 'Shanghai' },
    { id: 14, pid: 11, name: 'Beijing' },
    { id: 15, pid: 11, name: 'Shantou' },
    { id: 16, name: 'France', hasChild: true },
    { id: 17, pid: 16, name: 'Pays de la Loire' },
    { id: 18, pid: 16, name: 'Aquitaine' },
    { id: 19, pid: 16, name: 'Brittany' },
    { id: 20, pid: 16, name: 'Lorraine' },
    { id: 21, name: 'India', hasChild: true },
    { id: 22, pid: 21, name: 'Assam' },
    { id: 23, pid: 21, name: 'Bihar' },
    { id: 24, pid: 21, name: 'Tamil Nadu' },
    { id: 25, pid: 21, name: 'Punjab' }
];
export let disabledListData: { [key: string]: Object }[] = [
    { id: 1, name: 'Australia', hasChild: true, expanded: true },
    { id: 2, pid: 1, name: 'New South Wales', isSelected: true },
    { id: 3, pid: 1, name: 'Victoria', htmlAttributes: { class: 'e-disable' }},
    { id: 4, pid: 1, name: 'South Australia' },
    { id: 6, pid: 1, name: 'Western Australia' },
    { id: 7, name: 'Brazil', hasChild: true },
    { id: 8, pid: 7, name: 'Paraná',htmlAttributes: { class: 'e-disable' } },
    { id: 9, pid: 7, name: 'Ceará' ,isSelected: true }, 
    { id: 10, pid: 7, name: 'Acre' },
    { id: 11, name: 'China', hasChild: true },
    { id: 12, pid: 11, name: 'Guangzhou' },
    { id: 13, pid: 11, name: 'Shanghai' },
    { id: 14, pid: 11, name: 'Beijing' },
    { id: 15, pid: 11, name: 'Shantou' },
];
export let filteredlistData: { [key: string]: Object }[] = [
    { id: 21, name: 'India', hasChild: true,expanded: true },
    { id: 22, pid: 21, name: 'Assam' },
    { id: 23, pid: 21, name: 'Bihar' },
    { id: 24, pid: 21, name: 'Tamil Nadu' },
    { id: 25, pid: 21, name: 'Punjab' }
];

export let localDataString: { [key: string]: Object }[] = [
    { "id": '1', "name": "Australia", "hasChildren": true, expanded: true },
    { "id": "2", "pid": "1", "name": 'New South Wales' },
    { "id": "3", "pid": "1", "name": 'Victoria' },
    { "id": "4", "pid": "1", "name": 'South Australia' },
    { "id": "6", "pid": "1", "name": 'Western Australia' },
    { "id": "7", "name": 'Brazil', "hasChildren": true },
    { "id": 8, "pid": 7, "name": 'Paraná' },
    { "id": 9, "pid": 7, "name": 'Ceará' },
    { "id": 10, "pid": 7, "name": 'Acre' },
    { "id": '11', "name": "China", "hasChildren": true },
    { "id": '12', "pid": '11', "name": "Guangzhou" },
    { "id": '13', "pid": '11', "name": "Shanghai" },
    { "id": '14', "pid": '11', "name": "Beijing" },
    { "id": '15', "pid": '11', "name": "Shantou" },
    { "id": '16', "name": "France", "hasChildren": true },
    { "id": '17', "pid": '16', "name": "Pays de la Loire" },
    { "id": '18', "pid": '16', "name": "Aquitaine" },
    { "id": '19', "pid": '16', "name": "Brittany" },
    { "id": '20', "pid": '16', "name": "Lorraine" },
    { "id": '21', "name": "India", "hasChildren": true },
    { "id": '22', "pid": '21', "name": "Assam" },
    { "id": '23', "pid": '21', "name": "Bihar" },
    { "id": '24', "pid": '21', "name": "Tamil Nadu" }

]


export let localData1: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: true, nodeUrl: 'http://npmci.syncfusion.com/', nodeImage1: 'base/spec/images/Shooting.png', nodeExpanded1: true },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3', icons: 'file' },
    { nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, hasChild: true, nodeImage1: 'base/spec/images/Shooting.png' },
    { nodeId: '02-01', nodePid: '02', nodeText: 'Naturals.mp4', icons: 'file', image: 'base/spec/images/Shooting.png' },
    { nodeId: '02-02', nodePid: '02', nodeText: 'Wild.mpeg', icons: 'file' },
    { nodeId: '03', nodeText: 'Documents', icons: 'folder', hasChild: true },
    { nodeId: '03-01', nodePid: '03', nodeText: 'Environment Pollution.docx', icons: 'file' },
    { nodeId: '03-02', nodePid: '03', nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
    { nodeId: '03-03', nodePid: '03', nodeText: 'Global Warming.ppt', icons: 'file' },
    { nodeId: '03-04', nodePid: '03', nodeText: 'Social Network.pdf', icons: 'file' },
    { nodeId: '03-05', nodePid: '03', nodeText: 'Youth Empowerment.pdf', icons: 'file' },
    { nodeId: '04', nodeText: 'Pictures', icons: 'folder', hasChild: true, nodeExpanded: 'true', },
    { nodeId: '04-01', nodePid: '04', nodeText: 'Camera Roll', icons: 'folder', hasChild: true, nodeExpanded: true },
    { nodeId: '04-01-01', nodePid: '04-01', nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
    { nodeId: '04-01-02', nodePid: '04-01', nodeText: 'WIN_20160726_094118.JPG', icons: 'file' },
    { nodeId: '04-01-03', nodePid: '04-01', nodeText: 'WIN_20160726_094119.JPG', icons: 'file' },
    { nodeId: '04-02', nodePid: '04', nodeText: 'Wind.jpg', icons: 'file' },
    { nodeId: '04-03', nodePid: '04', nodeText: 'Stone.jpg', icons: 'file' },
    { nodeId: '04-04', nodePid: '04', nodeText: 'Home.jpg', icons: 'file' },
    { nodeId: '04-05', nodePid: '04', nodeText: 'Bridge.png', icons: 'file' },
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true, nodeExpanded1: true },
    { nodeId: '05-01', nodePid: '05', nodeText: 'UI-Guide.pdf', icons: 'file' },
    { nodeId: '05-02', nodePid: '05', nodeText: 'Tutorials.zip', icons: 'file' },
    { nodeId: '05-03', nodePid: '05', nodeText: 'Game.exe', icons: 'file' },
    { nodeId: '05-04', nodePid: '05', nodeText: 'TypeScript.7z', icons: 'file' },
];

export let localData2: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: true, nodeUrl: 'http://npmci.syncfusion.com/',
        subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subTooltip: 'This is Pictures node', subHasChild: false, subExpanded: true, subUrl: 'http://ej2.syncfusion.com/demos/',
    },
    {
        nodeId: '01-01', nodePid: '01', nodeText: 'Wind.jpg', hasChild: 'true',
        subId: '21-01', subPid: '21', subText: 'Gouttes.mp3', subHasChild: 'true'
    },
    {
        nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: 'true',
        subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr
    },
];

export let remoteData: Object[] = [
    {
        OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, OrderDate: new Date(8364186e5),
        ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye',
        ShipRegion: 'CJ', ShipPostalCode: '51100', ShipCountry: 'France', Freight: 32.38, Verified: !0, Image: 'base/spec/images/Shooting.png', nodeSelected: true, nodeUrl: 'http://npmci.syncfusion.com/',
    },
    {
        OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, OrderDate: new Date(836505e6),
        ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
        ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
    },
    {
        OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, OrderDate: new Date(8367642e5),
        ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
        ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0, HtmlAttr: nodeAttr
    },
    {
        OrderID: 10251, CustomerID: 'VICTE', EmployeeID: 3, OrderDate: new Date(8367642e5),
        ShipName: 'Victuailles en stock', ShipCity: 'Lyon', ShipAddress: '2, rue du Commerce',
        ShipRegion: 'CJ', ShipPostalCode: '69004', ShipCountry: 'France', Freight: 41.34, Verified: !0
    },
    {
        OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 4, OrderDate: new Date(8368506e5),
        ShipName: 'Suprêmes délices', ShipCity: 'Charleroi', ShipAddress: 'Boulevard Tirou, 255',
        ShipRegion: 'CJ', ShipPostalCode: 'B-6000', ShipCountry: 'Belgium', Freight: 51.3, Verified: !0
    },
    {
        OrderID: 10253, CustomerID: 'HANAR', EmployeeID: 3, OrderDate: new Date(836937e6),
        ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
        ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 58.17, Verified: !0
    },
    {
        OrderID: 10254, CustomerID: 'CHOPS', EmployeeID: 5, OrderDate: new Date(8370234e5),
        ShipName: 'Chop-suey Chinese', ShipCity: 'Bern', ShipAddress: 'Hauptstr. 31',
        ShipRegion: 'CJ', ShipPostalCode: '3012', ShipCountry: 'Switzerland', Freight: 22.98, Verified: !1
    },
    {
        OrderID: 10255, CustomerID: 'RICSU', EmployeeID: 9, OrderDate: new Date(8371098e5),
        ShipName: 'Richter Supermarkt', ShipCity: 'Genève', ShipAddress: 'Starenweg 5',
        ShipRegion: 'CJ', ShipPostalCode: '1204', ShipCountry: 'Switzerland', Freight: 148.33, Verified: !0
    },
    {
        OrderID: 10256, CustomerID: 'WELLI', EmployeeID: 3, OrderDate: new Date(837369e6),
        ShipName: 'Wellington Importadora', ShipCity: 'Resende', ShipAddress: 'Rua do Mercado, 12',
        ShipRegion: 'SP', ShipPostalCode: '08737-363', ShipCountry: 'Brazil', Freight: 13.97, Verified: !1
    },
    {
        OrderID: 10257, CustomerID: 'HILAA', EmployeeID: 4, OrderDate: new Date(8374554e5),
        ShipName: 'HILARION-Abastos', ShipCity: 'San Cristóbal', ShipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35',
        ShipRegion: 'Táchira', ShipPostalCode: '5022', ShipCountry: 'Venezuela', Freight: 81.91, Verified: !0
    },
    {
        OrderID: 10258, CustomerID: 'ERNSH', EmployeeID: 1, OrderDate: new Date(8375418e5),
        ShipName: 'Ernst Handel', ShipCity: 'Graz', ShipAddress: 'Kirchgasse 6',
        ShipRegion: 'CJ', ShipPostalCode: '8010', ShipCountry: 'Austria', Freight: 140.51, Verified: !0
    },
    {
        OrderID: 10259, CustomerID: 'CENTC', EmployeeID: 4, OrderDate: new Date(8376282e5),
        ShipName: 'Centro comercial Moctezuma', ShipCity: 'México D.F.', ShipAddress: 'Sierras de Granada 9993',
        ShipRegion: 'CJ', ShipPostalCode: '05022', ShipCountry: 'Mexico', Freight: 3.25, Verified: !1
    },
    {
        OrderID: 10260, CustomerID: 'OTTIK', EmployeeID: 4, OrderDate: new Date(8377146e5),
        ShipName: 'Ottilies Käseladen', ShipCity: 'Köln', ShipAddress: 'Mehrheimerstr. 369',
        ShipRegion: 'CJ', ShipPostalCode: '50739', ShipCountry: 'Germany', Freight: 55.09, Verified: !0
    },
    {
        OrderID: 10261, CustomerID: 'QUEDE', EmployeeID: 4, OrderDate: new Date(8377146e5),
        ShipName: 'Que Delícia', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua da Panificadora, 12',
        ShipRegion: 'RJ', ShipPostalCode: '02389-673', ShipCountry: 'Brazil', Freight: 3.05, Verified: !1
    },
    {
        OrderID: 10262, CustomerID: 'RATTC', EmployeeID: 8, OrderDate: new Date(8379738e5),
        ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.',
        ShipRegion: 'NM', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 48.29, Verified: !0,
    }
];

export let remoteData1_1: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeImage1: 'base/spec/images/Shooting.png', nodeSelected: true, },
    { nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, hasChild: true, nodeImage1: 'base/spec/images/Shooting.png' },
    { nodeId: '03', nodeText: 'Documents', icons: 'folder', hasChild: true },
    { nodeId: '04', nodeText: 'Pictures', icons: 'folder', hasChild: true, nodeExpanded: 'true', nodeSelected: true, },
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true },
];

export let remoteData2: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/',
        subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subTooltip: 'This is Pictures node', subHasChild: false, subUrl: 'http://ej2.syncfusion.com/demos/',
    },
    {
        nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
        subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr
    },
];

export let filteredremoteData2: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/',
    }
];

export let remoteData3_1: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', nodeUrl: 'http://npmci.syncfusion.com/', nodeImage1: 'base/spec/images/Shooting.png',nodeSelected: true ,
        nodeChild: [
            { nodeId: '01-01', nodeText: 'Gouttes.mp3', nodeIcon: 'file',nodeSelected: true  }
        ]
    },
    {
        nodeId: '02', nodeText: 'Videos', nodeIcon: 'folder', nodeHtmlAttr: nodeAttr, nodeImage1: 'base/spec/images/Shooting.png',
        nodeChild: [
            { nodeId: '02-01', nodeText: 'Naturals.mp4', nodeIcon: 'file' },
            { nodeId: '02-02', nodeText: 'Wild.mpeg', nodeIcon: 'file' },
        ]
    },
];

export let remoteData2_1: { [key: string]: Object }[] = [
    {
        nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
        subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr
    },
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true',
        subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subTooltip: 'This is Pictures node', subHasChild: false
    },
];


