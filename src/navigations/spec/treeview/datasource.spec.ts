let nodeAttr: { [key: string]: string } = {'class': 'firstnode', 'style': 'background: red'};
let subAttr: { [key: string]: string } = {'class': 'customnode', 'style': 'background: blue'};
export let hierarchicalData: any = [
    { id: 1, text: "Artwork", iconCss: 'folder', imageUrl: 'base/spec/images/Shooting.png', tooltip: 'This is Artwork node', selected: true, navigateUrl: 'http://npmci.syncfusion.com/',
        child: [
            { id: 2, text: "Abstract",
                child: [
                    { id: 3, text: "2 Acrylic Mediums" },
                    { id: 4, text: "Creative Acrylic" },
                    { id: 5, text: "Modern Painting" },
                    { id: 6, text: "Canvas Art" },
                    { id: 7, text: "Black white" },
                ]
            },
            { id: 8, text: "Children",
                child: [
                    { id: 9, text: "Preschool Crafts" },
                    { id: 10, text: "School-age Crafts" },
                    { id: 11, text: "Fabulous Toddler" },
                ]
            },
            { id: 12, text: "Comic / Cartoon",
                child: [
                    { id: 13, text: "Batman" },
                    { id: 14, text: "Adventures of Superman" },
                    { id: 15, text: "Super boy" },
                ]
            },
        ]
    },
    { id: 16, text: "Books", htmlAttributes: nodeAttr,
        child: [
            { id: 17, text: "Comics",
                child: [
                    { id: 18, text: "The Flash" },
                    { id: 19, text: "Human Target" },
                    { id: 20, text: "Birds of Prey" },
                ]
            },
            { id: 21, text: "Entertaining" },
            { id: 22, text: "Design" },
        ]
    },
    { id: 23, text: "Music", expanded: true,
        child: [
            { id: 24, text: "Classical", expanded: 'true',
                child: [
                    { id: 25, text: "Avant-Garde" },
                    { id: 26, text: "Medieval" },
                    { id: 27, text: "Orchestral" },
                ]
            },
            { id: 28, text: "Mass" },
            { id: 29, text: "Folk" },
        ]
    },
    { id: 30, text: "Games" }
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
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/',
        subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png',  subTooltip: 'This is Pictures node', subExpanded: true, subUrl: 'http://ej2.syncfusion.com/demos/',
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
        nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder',  nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
        subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr,
    },
];

export let hierarchicalData3: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', image: 'base/spec/images/Shooting.png', attr: nodeAttr, nodeSelected1: true,
        nodeChild: [
            { nodeId: '01-01', nodeText: 'Gouttes.mp3' }
        ]
    },
    {
        nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'base/spec/images/Shooting.png',
        nodeChild: [
            { nodeId: '02-01', nodeText: 'Naturals.mp4', icons: 'file', image: 'base/spec/images/Shooting.png' },
            { nodeId: '02-02', nodeText: 'Wild.mpeg', icons: 'file' },
        ]
    },
    {
        nodeId: '03', nodeText: 'Documents', icons: 'folder',
        nodeChild: [
            { nodeId: '03-01', nodeText: 'Environment Pollution.docx', icons: 'file' },
            { nodeId: '03-02', nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
            { nodeId: '03-03', nodeText: 'Global Warming.ppt', icons: 'file' },
            { nodeId: '03-04', nodeText: 'Social Network.pdf', icons: 'file' },
            { nodeId: '03-05', nodeText: 'Youth Empowerment.pdf', icons: 'file' },
        ]
    },
    {
        nodeId: '04', nodeText: 'Pictures', icons: 'folder', nodeExpanded1: true, nodeSelected1: true,
        nodeChild: [
            {
                nodeId: '04-01', nodeText: 'Camera Roll', icons: 'folder', nodeExpanded1: true, nodeSelected1: true,
                nodeChild: [
                    { nodeId: '04-01-01', nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
                    {
                        nodeId: '04-01-02', nodeText: 'WIN_20160726_094118.JPG', icons: 'file', nodeExpanded1: true, 
                        nodeChild: [
                            { nodeId: '04-01-03', nodeText: 'WIN_20160726_094119.JPG', icons: 'file' }
                        ]
                    },
                ]
            },
            { nodeId: '04-02', nodeText: 'Wind.jpg', icons: 'file' },
            { nodeId: '04-03', nodeText: 'Stone.jpg', icons: 'file' },
            { nodeId: '04-04', nodeText: 'Home.jpg', icons: 'file' },
            { nodeId: '04-05', nodeText: 'Bridge.png', icons: 'file' }
        ]
    },
    {
        nodeId: '05', nodeText: 'Downloads', icons: 'folder',
        nodeChild: [
            { nodeId: '05-01', nodeText: 'UI-Guide.pdf', icons: 'file',  nodeSelected: true, },
            { nodeId: '05-02', nodeText: 'Tutorials.zip', icons: 'file' },
            { nodeId: '05-03', nodeText: 'Game.exe', icons: 'file' },
            { nodeId: '05-04', nodeText: 'TypeScript.7z', icons: 'file' },
        ]
    },
    { nodeId: '06', nodeText: 'Home', icons: 'folder', nodeChild: [] },
    { nodeId: '06', nodeText: 'App-Data', icons: 'folder', nodeChild: null},
    { nodeText: 'Content', icons: 'folder', hasChildren: true },
    { nodeId: '07', nodeText: 'App-start', icons: 'folder' },
];

export let hierarchicalData4: { [key: string]: Object }[] = [
    {
        nodeId: '11', nodeText: 'Music', iconCss: 'folder', imageUrl: 'base/spec/images/Shooting.png', tooltip: 'This is Music node', selected: true, expanded: true,
        nodeChild: [
            { 
                nodeId: '11-01', nodeText: 'Wind.jpg', navigateUrl: 'http://npmci.syncfusion.com/',
            }
        ],
    },
    {
        nodeId: '12', nodeText: 'Downloads', htmlAttributes: nodeAttr, nodeChild: [
            { nodeId: '12-01', nodeText: 'Home.jpg' },
        ]
    },
];

export let hierarchicalData5: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', image: 'base/spec/images/Shooting.png', attr: nodeAttr, nodeSelected1: true,
        nodeChild: [
            { nodeId: '01-01', nodeText: 'Gouttes.mp3' }
        ]
    },
    {
        nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'base/spec/images/Shooting.png',
        nodeChild: [
            { nodeId: '02-01', nodeText: 'Naturals.mp4', icons: 'file', image: 'base/spec/images/Shooting.png' },
            { nodeId: '02-02', nodeText: 'Wild.mpeg', icons: 'file' },
        ]
    },
    {
        nodeId: '03', nodeText: 'Documents', icons: 'folder',
        nodeChild: [
            { nodeId: '03-01', nodeText: 'Environment Pollution.docx', icons: 'file' },
            { nodeId: '03-02', nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
            { nodeId: '03-03', nodeText: 'Global Warming.ppt', icons: 'file' },
            { nodeId: '03-04', nodeText: 'Social Network.pdf', icons: 'file' },
            { nodeId: '03-05', nodeText: 'Youth Empowerment.pdf', icons: 'file' },
        ]
    },
    {
        nodeId: '04', nodeText: 'Pictures', icons: 'folder', nodeExpanded1: true, nodeSelected1: true,
        nodeChild: [
            {
                nodeId: '04-01', nodeText: 'Camera Roll', icons: 'folder', nodeExpanded1: true, nodeSelected1: true,
                nodeChild: [
                    { nodeId: '04-01-01', nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
                    {
                        nodeId: '04-01-02', nodeText: 'WIN_20160726_094118.JPG', icons: 'file', nodeExpanded1: true, 
                        nodeChild: [
                            { nodeId: '04-01-03', nodeText: 'WIN_20160726_094119.JPG', icons: 'file' }
                        ]
                    },
                ]
            },
            { nodeId: '04-02', nodeText: 'Wind.jpg', icons: 'file' },
            { nodeId: '04-03', nodeText: 'Stone.jpg', icons: 'file' },
            { nodeId: '04-04', nodeText: 'Home.jpg', icons: 'file' },
            { nodeId: '04-05', nodeText: 'Bridge.png', icons: 'file' }
        ]
    },
    {
        nodeId: '05', nodeText: 'Downloads', icons: 'folder',
        nodeChild: [
            { nodeId: '05-01', nodeText: 'UI-Guide.pdf', icons: 'file',  nodeSelected: true, },
            { nodeId: '05-02', nodeText: 'Tutorials.zip', icons: 'file' },
            { nodeId: '05-03', nodeText: 'Game.exe', icons: 'file' },
            { nodeId: '05-04', nodeText: 'TypeScript.7z', icons: 'file' },
        ]
    }
];

export var localData: { [key: string]: Object }[] = [
    { id: 1, text: "Artwork", iconCss: 'folder', imageUrl: 'base/spec/images/Shooting.png', tooltip: 'This is Artwork node', hasChildren: true, selected: 'true', navigateUrl: 'http://npmci.syncfusion.com/', },
    { id: 2, parentID: 1, text: "Abstract", hasChildren: true },
    { id: 3, parentID: 2, text: "2 Acrylic Mediums" },
    { id: 4, parentID: 2, text: "Creative Acrylic" },
    { id: 5, parentID: 2, text: "Modern Painting" },
    { id: 6, parentID: 2, text: "Canvas Art" },
    { id: 7, parentID: 2, text: "Black white" },
    { id: 8, parentID: 1, text: "Children", hasChildren: true },
    { id: 9, parentID: 8, text: "Preschool Crafts" },
    { id: 10, parentID: 8, text: "School-age Crafts" },
    { id: 11, parentID: 8, text: "Fabulous Toddler" },
    { id: 12, parentID: 1, text: "Comic / Cartoon" , hasChildren: true },
    { id: 13, parentID: 12, text: "Batman" },
    { id: 14, parentID: 12, text: "Adventures of Superman" },
    { id: 15, parentID: 12, text: "Super boy" },
    { id: 16, text: "Books", htmlAttributes: nodeAttr, hasChildren: true },
    { id: 17, parentID: 16, text: "Comics", hasChildren: true },
    { id: 18, parentID: 17, text: "The Flash" },
    { id: 19, parentID: 17, text: "Human Target" },
    { id: 20, parentID: 17, text: "Birds of Prey" },
    { id: 21, parentID: 16, text: "Entertaining" },
    { id: 22, parentID: 16, text: "Design" },
    { id: 23, text: "Music", hasChildren: true, expanded: true },
    { id: 24, parentID: 23, text: "Classical", hasChildren: true, expanded: 'true' },
    { id: 25, parentID: 24, text: "Avant-Garde" },
    { id: 26, parentID: 24, text: "Medieval" },
    { id: 27, parentID: 24, text: "Orchestral" },
    { id: 28, parentID: 23, text: "Mass" },
    { id: 29, parentID: 23, text: "Folk" },
    { id: 30, text: "Games" }
];

export let localData1: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: true, nodeUrl: 'http://npmci.syncfusion.com/', nodeImage1: 'base/spec/images/Shooting.png', nodeExpanded1: true },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3', icons: 'file' },
    { nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, hasChild: true, nodeImage1: 'base/spec/images/Shooting.png' },
    { nodeId: '02-01', nodePid: '02',nodeText: 'Naturals.mp4', icons: 'file', image: 'base/spec/images/Shooting.png' },
    { nodeId: '02-02', nodePid: '02',nodeText: 'Wild.mpeg', icons: 'file' },
    { nodeId: '03', nodeText: 'Documents', icons: 'folder', hasChild: true },
    { nodeId: '03-01', nodePid: '03',nodeText: 'Environment Pollution.docx', icons: 'file' },
    { nodeId: '03-02', nodePid: '03',nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
    { nodeId: '03-03', nodePid: '03',nodeText: 'Global Warming.ppt', icons: 'file' },
    { nodeId: '03-04', nodePid: '03',nodeText: 'Social Network.pdf', icons: 'file' },
    { nodeId: '03-05', nodePid: '03',nodeText: 'Youth Empowerment.pdf', icons: 'file' },
    { nodeId: '04', nodeText: 'Pictures', icons: 'folder', hasChild: true, nodeExpanded: 'true', },
    { nodeId: '04-01', nodePid: '04',nodeText: 'Camera Roll', icons: 'folder', hasChild: true, nodeExpanded: true },
    { nodeId: '04-01-01', nodePid: '04-01',nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
    { nodeId: '04-01-02', nodePid: '04-01',nodeText: 'WIN_20160726_094118.JPG', icons: 'file' },
    { nodeId: '04-01-03', nodePid: '04-01',nodeText: 'WIN_20160726_094119.JPG', icons: 'file' },
    { nodeId: '04-02', nodePid: '04',nodeText: 'Wind.jpg', icons: 'file' },
    { nodeId: '04-03', nodePid: '04',nodeText: 'Stone.jpg', icons: 'file' },
    { nodeId: '04-04', nodePid: '04',nodeText: 'Home.jpg', icons: 'file' },
    { nodeId: '04-05', nodePid: '04',nodeText: 'Bridge.png', icons: 'file' },
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true, nodeExpanded1: true },
    { nodeId: '05-01', nodePid: '05',nodeText: 'UI-Guide.pdf', icons: 'file' },
    { nodeId: '05-02', nodePid: '05',nodeText: 'Tutorials.zip', icons: 'file' },
    { nodeId: '05-03', nodePid: '05',nodeText: 'Game.exe', icons: 'file' },
    { nodeId: '05-04', nodePid: '05',nodeText: 'TypeScript.7z', icons: 'file' },
];

export let localData2: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: true, nodeUrl: 'http://npmci.syncfusion.com/',
      subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png',  subTooltip: 'This is Pictures node', subHasChild: false, subExpanded: true, subUrl: 'http://ej2.syncfusion.com/demos/', },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Wind.jpg', hasChild: 'true',
      subId: '21-01', subPid: '21', subText: 'Gouttes.mp3', subHasChild: 'true' },
    { nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder',  nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: 'true',
      subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr },
];

export let localData3: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', image: 'base/spec/images/Shooting.png', attr: nodeAttr, hasChild: true, nodeSelected1: true, },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3' },
    { nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'base/spec/images/Shooting.png', hasChild: true },
    { nodeId: '02-01', nodePid: '02',nodeText: 'Naturals.mp4', icons: 'file', image: 'base/spec/images/Shooting.png' },
    { nodeId: '02-02', nodePid: '02',nodeText: 'Wild.mpeg', icons: 'file' },
    { nodeId: '03', nodeText: 'Documents', icons: 'folder', hasChild: true },
    { nodeId: '03-01', nodePid: '03',nodeText: 'Environment Pollution.docx', icons: 'file' },
    { nodeId: '03-02', nodePid: '03',nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
    { nodeId: '03-03', nodePid: '03',nodeText: 'Global Warming.ppt', icons: 'file' },
    { nodeId: '03-04', nodePid: '03',nodeText: 'Social Network.pdf', icons: 'file' },
    { nodeId: '03-05', nodePid: '03',nodeText: 'Youth Empowerment.pdf', icons: 'file' },
    { nodeId: '04', nodeText: 'Pictures', icons: 'folder', hasChild: true, nodeExpanded1: true, nodeSelected1: true, },
    { nodeId: '04-01', nodePid: '04',nodeText: 'Camera Roll', icons: 'folder', hasChild: true, nodeExpanded1: true, nodeSelected1: true, },
    { nodeId: '04-01-01', nodePid: '04-01',nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
    { nodeId: '04-01-02', nodePid: '04-01',nodeText: 'WIN_20160726_094118.JPG', icons: 'file', hasChild: true, nodeExpanded1: true, },
    { nodeId: '04-01-03', nodePid: '04-01-02',nodeText: 'WIN_20160726_094119.JPG', icons: 'file' },
    { nodeId: '04-02', nodePid: '04',nodeText: 'Wind.jpg', icons: 'file' },
    { nodeId: '04-03', nodePid: '04',nodeText: 'Stone.jpg', icons: 'file' },
    { nodeId: '04-04', nodePid: '04',nodeText: 'Home.jpg', icons: 'file' },
    { nodeId: '04-05', nodePid: '04',nodeText: 'Bridge.png', icons: 'file' },
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true },
    { nodeId: '05-01', nodePid: '05',nodeText: 'UI-Guide.pdf', icons: 'file', nodeSelected: true, },
    { nodeId: '05-02', nodePid: '05',nodeText: 'Tutorials.zip', icons: 'file' },
    { nodeId: '05-03', nodePid: '05',nodeText: 'Game.exe', icons: 'file' },
    { nodeId: '05-04', nodePid: '05',nodeText: 'TypeScript.7z', icons: 'file' },
    { nodeId: '06', nodeText: 'Home', icons: 'folder', hasChild: true },
    { nodeId: '06', nodeText: 'App-Data', icons: 'folder', hasChild: "true"},
    { nodeText: 'Content', icons: 'folder', hasChild: "true" },
    { nodeId: '07', nodeText: 'App-start', icons: 'folder' },
];

export let localData4: { [key: string]: Object }[] = [
    { nodeId: '11', nodeText: 'Music', iconCss: 'folder', imageUrl: 'base/spec/images/Shooting.png', tooltip: 'This is Music node', selected: true, expanded: true, hasChildren: true },
    { nodeId: '11-01', nodeText: 'Wind.jpg', nodePid: '11', navigateUrl: 'http://npmci.syncfusion.com/' },
    { nodeId: '12', nodeText: 'Downloads', nodePid: '0', htmlAttributes: nodeAttr },
    { nodeId: '12-01', nodeText: 'Home.jpg', nodePid: '12' },
];

export let localData5: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: true, nodeUrl: 'http://npmci.syncfusion.com/', nodeImage1: 'base/spec/images/Shooting.png', nodeExpanded1: true },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3', icons: 'file' },
    { nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, hasChild: true, nodeImage1: 'base/spec/images/Shooting.png' },
    { nodeId: '02-01', nodePid: '02',nodeText: 'Naturals.mp4', icons: 'file', image: 'base/spec/images/Shooting.png' },
    { nodeId: '02-02', nodePid: '02',nodeText: 'Wild.mpeg', icons: 'file' },
    { nodeId: '03', nodeText: 'Documents', icons: 'folder', hasChild: true },
    { nodeId: '03-01', nodePid: '03',nodeText: 'Environment Pollution.docx', icons: 'file' },
    { nodeId: '03-02', nodePid: '03',nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
    { nodeId: '03-03', nodePid: '03',nodeText: 'Global Warming.ppt', icons: 'file' },
    { nodeId: '03-04', nodePid: '03',nodeText: 'Social Network.pdf', icons: 'file' },
    { nodeId: '03-05', nodePid: '03',nodeText: 'Youth Empowerment.pdf', icons: 'file' },
    { nodeId: '04', nodeText: 'Pictures', icons: 'folder', hasChild: true, nodeExpanded: 'true', },
    { nodeId: '04-01', nodePid: '04',nodeText: 'Camera Roll', icons: 'folder', hasChild: true, nodeExpanded: true },
    { nodeId: '04-01-01', nodePid: '04-01',nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
    { nodeId: '04-01-02', nodePid: '04-01',nodeText: 'WIN_20160726_094118.JPG', icons: 'file' },
    { nodeId: '04-01-03', nodePid: '04-01',nodeText: 'WIN_20160726_094119.JPG', icons: 'file' },
    { nodeId: '04-02', nodePid: '04',nodeText: 'Wind.jpg', icons: 'file' },
    { nodeId: '04-03', nodePid: '04',nodeText: 'Stone.jpg', icons: 'file' },
    { nodeId: '04-04', nodePid: '04',nodeText: 'Home.jpg', icons: 'file' },
    { nodeId: '04-05', nodePid: '04',nodeText: 'Bridge.png', icons: 'file' },
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true, nodeExpanded: true },
    { nodeId: '05-01', nodePid: '05',nodeText: 'UI-Guide.pdf', icons: 'file' },
    { nodeId: '05-02', nodePid: '05',nodeText: 'Tutorials.zip', icons: 'file' },
    { nodeId: '05-03', nodePid: '05',nodeText: 'Game.exe', icons: 'file' },
    { nodeId: '05-04', nodePid: '05',nodeText: 'TypeScript.7z', icons: 'file' },
];

export let localData6: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', isChecked: true, hasChild: true },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3' },
    { nodeId: '02', nodeText: 'Videos', hasChild: true },
    { nodeId: '02-01', nodePid: '02',nodeText: 'Naturals.mp4', isChecked: false },
    { nodeId: '02-02', nodePid: '02',nodeText: 'Wild.mpeg' },
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

export let remoteData1: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true,  nodeImage1: 'base/spec/images/Shooting.png' },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3', icons: 'file' },
    { nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, hasChild: true, nodeImage1: 'base/spec/images/Shooting.png' },
    { nodeId: '02-01', nodePid: '02',nodeText: 'Naturals.mp4', icons: 'file', image: 'base/spec/images/Shooting.png' },
    { nodeId: '02-02', nodePid: '02',nodeText: 'Wild.mpeg', icons: 'file' },
    { nodeId: '03', nodeText: 'Documents', icons: 'folder', hasChild: true },
    { nodeId: '03-01', nodePid: '03',nodeText: 'Environment Pollution.docx', icons: 'file' },
    { nodeId: '03-02', nodePid: '03',nodeText: 'Global Water, Sanitation, & Hygiene.docx', icons: 'file' },
    { nodeId: '03-03', nodePid: '03',nodeText: 'Global Warming.ppt', icons: 'file' },
    { nodeId: '03-04', nodePid: '03',nodeText: 'Social Network.pdf', icons: 'file' },
    { nodeId: '03-05', nodePid: '03',nodeText: 'Youth Empowerment.pdf', icons: 'file' },
    { nodeId: '04', nodeText: 'Pictures', icons: 'folder', hasChild: true, nodeExpanded: 'true', },
    { nodeId: '04-01', nodePid: '04',nodeText: 'Camera Roll', icons: 'folder', hasChild: true, nodeExpanded: true },
    { nodeId: '04-01-01', nodePid: '04-01',nodeText: 'WIN_20160726_094117.JPG', icons: 'file' },
    { nodeId: '04-01-02', nodePid: '04-01',nodeText: 'WIN_20160726_094118.JPG', icons: 'file' },
    { nodeId: '04-01-03', nodePid: '04-01',nodeText: 'WIN_20160726_094119.JPG', icons: 'file' },
    { nodeId: '04-02', nodePid: '04',nodeText: 'Wind.jpg', icons: 'file' },
    { nodeId: '04-03', nodePid: '04',nodeText: 'Stone.jpg', icons: 'file' },
    { nodeId: '04-04', nodePid: '04',nodeText: 'Home.jpg', icons: 'file' },
    { nodeId: '04-05', nodePid: '04',nodeText: 'Bridge.png', icons: 'file' },
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true },
    { nodeId: '05-01', nodePid: '05',nodeText: 'UI-Guide.pdf', icons: 'file' },
    { nodeId: '05-02', nodePid: '05',nodeText: 'Tutorials.zip', icons: 'file' },
    { nodeId: '05-03', nodePid: '05',nodeText: 'Game.exe', icons: 'file' },
    { nodeId: '05-04', nodePid: '05',nodeText: 'TypeScript.7z', icons: 'file' },
];

export let remoteData2: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/',
      subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png',  subTooltip: 'This is Pictures node', subHasChild: false, subUrl: 'http://ej2.syncfusion.com/demos/', },
    { nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder',  nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
      subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr },
];

export let remoteData2_1: { [key: string]: Object }[] = [
    { nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder',  nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
      subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr },
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true',
      subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png',  subTooltip: 'This is Pictures node', subHasChild: false },
];

export let remoteData2_2: { [key: string]: Object }[] = [
    { nodeId: '02-01', nodeText: 'Naturals.mp4', icons: 'file', image: 'base/spec/images/Shooting.png' },
    { nodeId: '02-02', nodeText: 'Wild.mpeg', icons: 'file' }
];

export let remoteData2_3: { [key: string]: Object }[] = [
    { nodeId: '03-01', nodeText: 'Videos', icons: 'file', image: 'base/spec/images/Shooting.png' },
    { nodeId: '03-02', nodeText: 'Pictures', icons: 'file' }
];

export let remoteData1_1: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true,  nodeImage1: 'base/spec/images/Shooting.png', nodeSelected: true, },
    { nodeId: '02', nodeText: 'Videos', icons: 'folder', image: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, hasChild: true, nodeImage1: 'base/spec/images/Shooting.png' },
    { nodeId: '03', nodeText: 'Documents', icons: 'folder', hasChild: true },
    { nodeId: '04', nodeText: 'Pictures', icons: 'folder', hasChild: true, nodeExpanded: 'true', nodeSelected: true, },
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true },
];
export let remoteData3_1: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', nodeUrl: 'http://npmci.syncfusion.com/', nodeImage1: 'base/spec/images/Shooting.png',
        nodeChild: [
            { nodeId: '01-01', nodeText: 'Gouttes.mp3', nodeIcon: 'file' }
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

 export let expandIconParentData: { [key: string]: Object }[] = [
        { id: '01', name: 'Users', hasChild: true }
];

export let expandIconChildData: any[] = [
      { id: '02', name: 'Admin' },
      { id: '03', name: 'End user' }
];