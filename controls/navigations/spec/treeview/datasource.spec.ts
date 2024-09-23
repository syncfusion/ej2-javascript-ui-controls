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

export const hierarchicalDataWithSelectable: { [key: string]: Object }[] = [
    {
        nodeId: '01', selectable: false, nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/', nodeImage1: 'base/spec/images/Shooting.png',
        nodeChild: [
            { nodeId: '01-01', nodeText: 'Gouttes.mp3', nodeIcon: 'file' }
        ]
    },
    {
        nodeId: '02', selectable: true, nodeText: 'Videos', nodeIcon: 'folder', nodeHtmlAttr: nodeAttr, nodeImage1: 'base/spec/images/Shooting.png',
        nodeChecked: true,
        nodeChild: [
            { nodeId: '02-01', nodeText: 'Naturals.mp4', nodeIcon: 'file' },
            { nodeId: '02-02', nodeText: 'Wild.mpeg', nodeIcon: 'file' },
        ]
    },
    {
        nodeId: '03', selectable: true, nodeText: 'Documents', nodeIcon: 'folder',
        nodeChild: [
            { nodeId: '03-01', nodeText: 'Environment Pollution.docx', nodeIcon: 'file' },
            { nodeId: '03-02', nodeText: 'Global Water, Sanitation, & Hygiene.docx', nodeIcon: 'file' },
            { nodeId: '03-03', nodeText: 'Global Warming.ppt', nodeIcon: 'file' },
            { nodeId: '03-04', nodeText: 'Social Network.pdf', nodeIcon: 'file' },
            { nodeId: '03-05', nodeText: 'Youth Empowerment.pdf', nodeIcon: 'file' },
        ]
    },
    {
        nodeId: '04', selectable: true, nodeText: 'Pictures', nodeIcon: 'folder', nodeExpanded: true,
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
        nodeId: '05', selectable: true, nodeText: 'Downloads', nodeIcon: 'folder', nodeExpanded1: true,
        nodeChild: [
            { nodeId: '05-01', nodeText: 'UI-Guide.pdf', nodeIcon: 'file' },
            { nodeId: '05-02', nodeText: 'Tutorials.zip', nodeIcon: 'file' },
            { nodeId: '05-03', nodeText: 'Game.exe', nodeIcon: 'file' },
            { nodeId: '05-04', nodeText: 'TypeScript.7z', nodeIcon: 'file' },
        ]
    },
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

export let hierarchicalData6: { [key: string]: Object }[] = [
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
            { nodeId: '05-02', nodeText: 'Tutorials.zip', icons: 'file', nodeChecked: true },
            { nodeId: '05-03', nodeText: 'Game.exe', icons: 'file' },
            { nodeId: '05-04', nodeText: 'TypeScript.7z', icons: 'file' },
        ]
    }
];

export var checkboxData  = [
    { id: '01', name: 'Local Disk (C:)', expanded: true,
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

export let hierarchicalData7: { [key: string]: Object; }[] = [
    {
        code: "AF", name: "Africa", countries: [
            { code: "NGA", name: "Nigeria" },
            { code: "EGY", name: "Egypt" },
            { code: "ZAF", name: "South Africa" }
        ]
    },
    {
        code: "AS", name: "Asia", countries: [
            { code: "CHN", name: "China" },
            { code: "IND", name: "India"},
            { code: "JPN", name: "Japan" }
        ]
    },
    {
        code: "EU", name: "Europe", countries: [
            { code: "DNK", name: "Denmark" },
            { code: "FIN", name: "Finland" },
            { code: "AUT", name: "Austria" }
        ]
    },
   
];

export let hierarchicalData8: { [key: string]: Object; }[] = [
    {
      orgId: 1,
      id: 1,
      function: "Administration",
      expanded: true,
      childs: []
    },
    {
      orgId: 1,
      id: 2,
      function: "Purchasing",
      expanded: true,
      childs: []
    },
    {
      orgId: 1,
      id: 3,
      function: "Security",
      expanded: true,
      childs: [
        {
          orgId: 1,
          id: 4,
          function: "Security Criteria Maintenance",
          isChecked: false,
          expanded: true,
          childs: [
            {
              orgId: 1,
              id: 7,
              function: "View Only",
              isChecked: true,
              expanded: false,
              childs: []
            },
            {
              orgId: 1,
              id: 8,
              function: "Update",
              isChecked: false,
              expanded: false,
              childs: []
            }
          ]
        },
        {
          orgId: 1,
          id: 5,
          function: "User Groups",
          expanded: true,
          childs: [
            {
              orgId: 1,
              id: 9,
              function: "View Only",
              expanded: false,
              childs: []
            },
            {
              orgId: 1,
              id: 10,
              function: "Create/Update",
              expanded: false,
              childs: []
            }
          ]
        },
        {
          orgId: 1,
          id: 6,
          function: "Users",
          expanded: true,
          childs: [
            {
              orgId: 1,
              id: 11,
              function: "View Only",
              expanded: false,
              childs: []
            },
            {
              orgId: 1,
              id: 12,
              function: "Create/Update",
              expanded: false,
              childs: []
            }
          ]
        }
      ]
    }
  ];

  export let hierarchicalData9: { [key: string]: Object }[] = [
    {
        nodeId: '11', nodeText: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem, expedita, ea consequatur nesciunt error cum laudantium, doloribus quae consectetur architecto quibusdam fugit recusandae beatae deserunt distinctio molestias quam nostrum sapiente.', iconCss: 'folder', imageUrl: 'base/spec/images/Shooting.png', tooltip: 'This is Music node', selected: true, expanded: true,
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

export let hierarchicalData10: { [key: string]: Object; }[] = [
    {
        id: 1, function: "Administration", expanded: true,
        childs: [
            {
                id: 7,
                function: "View Only",
            },
            {
                id: 8,
                function: "Update",htmlAttributes: { class: 'e-disable' }
            },
            {
                id: 9,
                function: "View Only",
            },
            {
                id: 10,
                function: "Update",
            }
        ]
    },
    {
        orgId: 1, id: 2, function: "Purchasing",
        childs: [
            {
                id: 11,
                function: "View Only",
            },
            {
                id: 12,
                function: "Update",htmlAttributes: { class: 'e-disable' }
            },
            {
                id: 13,
                function: "View Only",
            },
            {
                id: 14,
                function: "Update",
            }
        ]
    },
];

export let localDataHtmlAttributes: { [key: string]: Object }[] = [
    { id: 1, name: 'Australia', hasChild: true, expanded: true, htmlAttributes: { id: 'custom' } },
    { id: 2, pid: 1, name: 'New South Wales', htmlAttributes: { id: 'custom1' } },
    { id: 3, pid: 1, name: 'Victoria' },
    { id: 4, pid: 1, name: 'South Australia' },
    { id: 6, pid: 1, name: 'Western Australia' },
    { id: 7, name: 'Brazil', hasChild: true },
    { id: 8, pid: 7, name: 'Paraná' },
    { id: 9, pid: 7, name: 'Ceará' },
    { id: 10, pid: 7, name: 'Acre' },
];

export let localData10: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem, expedita, ea consequatur nesciunt error cum laudantium, doloribus quae consectetur architecto quibusdam fugit recusandae beatae deserunt distinctio molestias quam nostrum sapi',
    hasChild: true,},
    { nodeId: '01-01', nodePid: '01', nodeText: 'Wind.jpg'},
    { nodeId: '02', nodeText: 'Downloads'},
];

export let localData11: { [key: string]: Object }[] = [
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
    { nodeId: '05', nodeText: 'Downloads', icons: 'folder', hasChild: true },
    { nodeId: '05-01', nodePid: '05',nodeText: 'UI-Guide.pdf', icons: 'file', hasChild: true, },
    { nodeId: '05-01-01', nodePid: '05-01',nodeText: 'Tutorials.zip', icons: 'file' },
    { nodeId: '05-01-02', nodePid: '05-01',nodeText: 'Game.exe', icons: 'file' },
    { nodeId: '05-01-03', nodePid: '05-01',nodeText: 'TypeScript.7z', icons: 'file' },
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

export let localData7: { [key: string]: Object }[] = [
    { id: 1, name: 'Australia', hasChild: true, expanded: true },
    { id: 2, pid: 1, name: 'New South Wales' },
    { id: 3, pid: 1, name: 'Victoria'  },
    { id: 4, pid: 1, name: 'South Australia' },
    { id: 6, pid: 1, name: 'Western Australia' },
    { id: 7, name: 'Brazil', hasChild: true },
    { id: 8, pid: 7, name: 'Paraná'  },
    { id: 9, pid: 7, name: 'Ceará'  },
    { id: 10, pid: 7, name: 'Acre' },
    { id: 11, name: 'China', hasChild: true },
    { id: 12, pid: 11, name: 'Guangzhou' ,isChecked: true},
    { id: 13, pid: 11, name: 'Shanghai', isChecked: true },
    { id: 14, pid: 11, name: 'Beijing', isChecked: true },
    { id: 15, pid: 11, name: 'Shantou',isChecked: true },
    { id: 16, name: 'France', hasChild: true , isChecked: false},
    { id: 17, pid: 16, name: 'Pays de la Loire' },
    { id: 18, pid: 16, name: 'Aquitaine' },
    { id: 19, pid: 16, name: 'Brittany' },
    { id: 20, pid: 16, name: 'Lorraine' },
    { id: 21, name: 'India', hasChild: true },
    { id: 22, pid: 21, name: 'Assam' },
    { id: 23, pid: 21, name: 'Bihar'},
    { id: 24, pid: 21, name: 'Tamil Nadu', hasChild: true },
    {id: 26, pid: 24, name: 'chennai', isChecked: true},
    {id: 27, pid: 24, name: "TVL", isChecked: true},
    { id: 25, pid: 21, name: 'Punjab' }
];

export let localData8: { [key: string]: Object }[] = [
    { id: 1, name: "Australia", hasChild: true, expanded: true },
    { id: 2, pid: 1, name: "New South Wales" },
    { id: 3, pid: 1, name: "Victoria", isSelected: true },
    { id: 4, pid: 1, name: "South Australia", isSelected: true },
    { id: 6, pid: 1, name: "Western Australia" },
    { id: 7, name: "Brazil", hasChild: true },
    { id: 8, pid: 7, name: "Paraná" },
    { id: 9, pid: 7, name: "Ceará" },
    { id: 10, pid: 7, name: "Acre" },
    { id: 11, name: "China", hasChild: true },
    { id: 12, pid: 11, name: "Guangzhou" },
    { id: 13, pid: 11, name: "Shanghai" },
    { id: 14, pid: 11, name: "Beijing" },
    { id: 15, pid: 11, name: "Shantou" },
    { id: 16, name: "France", hasChild: true },
    { id: 17, pid: 16, name: "Pays de la Loire" },
    { id: 18, pid: 16, name: "Aquitaine" },
    { id: 19, pid: 16, name: "Brittany" },
    { id: 20, pid: 16, name: "Lorraine" },
    { id: 21, name: "India", hasChild: true },
    { id: 22, pid: 21, name: "Assam" },
    { id: 23, pid: 21, name: "Bihar" },
    { id: 24, pid: 21, name: "Tamil Nadu" },
    { id: 25, pid: 21, name: "Punjab" }
];
export let localData9: { [key: string]: Object }[] = [
    { "id": '1', "name": "Australia", "hasChildren": true, "isSelected": false, expanded: true },
    { "id": '7', "name": "Brazil", "hasChildren": true, "isSelected": true },
    { "id": '11', "name": "China", "hasChildren": true, "isSelected": true },
    { "id": '12', "pid": '11', "name": "Guangzhou", "isSelected": true },
    { "id": '13', "pid": '11', "name": "Shanghai", "isSelected": true },
    { "id": '14', "pid": '11', "name": "Beijing", "isSelected": true },
    { "id": '15', "pid": '11', "name": "Shantou", "isSelected": true },
    { "id": '16', "name": "France", "hasChildren": true, "isSelected": true },
    { "id": '17', "pid": '16', "name": "Pays de la Loire", "isSelected": true },
    { "id": '18', "pid": '16', "name": "Aquitaine", "isSelected": true },
    { "id": '19', "pid": '16', "name": "Brittany", "isSelected": true },
    { "id": '20', "pid": '16', "name": "Lorraine", "isSelected": true },
    { "id": '21', "name": "India", "hasChildren": true, "isSelected": true },
    { "id": '22', "pid": '21', "name": "Assam", "isSelected": true },
    { "id": '23', "pid": '21', "name": "Bihar", "isSelected": true },
    { "id": '24', "pid": '21', "name": "Tamil Nadu", "isSelected": true },
    { "id": '25', "pid": '21', "name": "Punjab", "isSelected": true },
    { "id": '26', "pid": '8', "name": "Pays de la Loire", "hasChildren": true, "isSelected": true },
    {
      "id": '27', "pid": '8', "name": "Aquitaine",
      "hasChildren": true, "isSelected": true
    },
    { "id": '28', "pid": '9', "name": "Brittany", "isSelected": true },
    { "id": '29', "pid": '9', "name": "Lorraine", "isSelected": true },
    { "id": '30', "pid": '26', "name": "Assam", "isSelected": true },
    { "id": '31', "pid": '26', "name": "Bihar", "isSelected": true },
    { "id": '32', "pid": '27', "name": "Tamil Nadu", "isSelected": true },
    { "id": '33', "pid": '27', "name": "Punjab", "isSelected": true },
    { "id": '8', "pid": '7', "name": "Paraná", "hasChildren": true, "isSelected": true },
    { "id": '9', "pid": '7', "name": "Ceará", "hasChildren": true, "isSelected": true },
    { "id": '10', "pid": '7', "name": "Acre", "isSelected": true },
    { "id": '35', "name": "Sidney", "pid": '1', "hasChildren": true, "isSelected": false, expanded: true },
    { "id": '36', "name": "New South Wales", "pid": '1', "hasChildren": true, "isSelected": false },
    { "id": '37', "name": "child-1", "pid": '35', "hasChildren": true, "isSelected": true },
    { "id": '38', "name": "child-2", "pid": '35', "hasChildren": true, "isSelected": true }
]

export let checkData: { [key: string]: Object }[] = [
    { id: 1, name: 'Australia', hasChild: true, expanded: true },
        { id: 2, pid: 1, name: 'New South Wales', hasChild: true },
        { id: 3, pid: 1, name: 'Victoria' },
        { id: 4, pid: 1, name: 'South Australia' },
        { id: 6, pid: 1, name: 'Western Australia' },
        { id: 26, pid: 2, name: 'New South Wales' },
        { id: 27, pid: 2, name: 'Victoria' },
        { id: 28, pid: 2, name: 'South Australia' },
        { id: 29, pid: 2, name: 'Western Australia' },
        { id: 7, name: 'Brazil', hasChild: true },
        { id: 8, pid: 7, name: 'Paraná' },
        { id: 9, pid: 7, name: 'Ceará' },
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
]

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
export let updatedAddNodes: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true,  nodeImage1: 'base/spec/images/Shooting.png' },
    { nodeId: '01-01', nodePid: '01', nodeText: 'Gouttes.mp3', icons: 'file' },
    { nodeId: 'a12', nodeText: 'Santa maria'},
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
export let updatedAddNodes1: { [key: string]: Object }[] = [
    {
        nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/',
        subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subTooltip: 'This is Pictures node', subHasChild: false, subUrl: 'http://ej2.syncfusion.com/demos/',
    },
    { nodeId: '03', nodeText: 'Rain', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/' },
    {
        nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
        subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr
    },
];
export let remoteData2: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/',
      subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png',  subTooltip: 'This is Pictures node', subHasChild: false, subUrl: 'http://ej2.syncfusion.com/demos/', },
    { nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder',  nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
      subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr },
];

export let deletedRemoteData: { [key: string]: Object }[] = [

    { nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder',  nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
      subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr },
];

export let updatedremoteNode_1: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Rain', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/'}
];
export let updatedremoteNode_2: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/'}
];
export let updatedremoteNode_3: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music node', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true', nodeUrl: 'http://npmci.syncfusion.com/'}
];

export let updatedremoteNode_4: { [key: string]: Object }[] = [
    { nodeId: '02', nodeText: 'Downloads1', nodeIcon: 'folder',  nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true}
];
export let updatedremoteNode_5: { [key: string]: Object }[] = [
    { nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder',  nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true}
];

export let remoteData2_1: { [key: string]: Object }[] = [
    { nodeId: '02', nodeText: 'Downloads', nodeIcon: 'folder',  nodeImage: 'base/spec/images/Shooting.png', nodeHtmlAttr: nodeAttr, subSelected: true,
      subId: '22', subText: 'Videos', subIcon: 'file', subImage: 'base/spec/images/Cricket.png', subHtmlAttr: subAttr },
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true',
      subId: '21', subText: 'Pictures', subIcon: 'file', subImage: 'base/spec/images/Cricket.png',  subTooltip: 'This is Pictures node', subHasChild: false },
];

export let updatedremoteNode_6: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music node', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true'}
];

export let updatedremoteNode_7: { [key: string]: Object }[] = [
    { nodeId: '01', nodeText: 'Music', nodeIcon: 'folder', nodeImage: 'base/spec/images/Shooting.png',  nodeTooltip: 'This is Music node', hasChild: true, nodeSelected: 'true'}
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
export let remoteData4: Object[] = [
    { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 1, Freight: 32.38 },
    { OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 2, Freight: 11.61 },
    { OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 3, Freight: 65.83 }
];

export let remoteData4_1: Object[] = [
    { nodeId: '01', ContactName: 'Paul Henriot', EmployeeID: 4, ContactTitle: 'Accounting Manager' }
];
export let remoteData4_2: Object[] = [    
    { nodeId: '02', ContactName: 'Karin Josephs', EmployeeID: 5, ContactTitle: 'Marketing Manager' }
];
export let remoteData4_3: Object[] = [
    { nodeId: '03', ContactName: 'Mario Pontes', EmployeeID: 6, ContactTitle: 'Accounting Manager' }
];

 export let expandIconParentData: { [key: string]: Object }[] = [
        { id: '01', name: 'Users', hasChild: true }
];

export let expandIconChildData: any[] = [
      { id: '02', name: 'Admin' },
      { id: '03', name: 'End user' }
];

export let XSSData: any = [
    { id: 1, text: 'text1<style>body{background:rgb(0, 0, 255)}</style>' },
    { id: 2, text: 'text2' },
]

export let XSSnestedData: any = [
    {
        id: '01', text: 'Music<style>body{background:rgb(0, 0, 255)}</style>', icon: 'folder',
        child: [
            { id: '01-01', text: 'Gouttes.mp3', icon: 'file' }
        ]
    },
    {
        id: '02', text: 'Videos', icon: 'folder',
        child: [
            { id: '02-01', text: 'Naturals.mp4', icon: 'file' },
            { id: '02-02', text: 'Wild.mpeg', icon: 'file' },
        ]
    },
    {
        id: '03', text: 'Documents', icon: 'folder',
        child: [
            { id: '03-01', text: 'Environment Pollution.docx', icon: 'file' },
            { id: '03-02', text: 'Global Water, Sanitation, & Hygiene.docx', icon: 'file' },
            { id: '03-03', text: 'Global Warming.ppt', icon: 'file' },
            { id: '03-04', text: 'Social Network.pdf', icon: 'file' },
            { id: '03-05', text: 'Youth Empowerment.pdf', icon: 'file' },
        ]
    }];

export let autoCheckData: any = [
        {hasChildren: true,id: "FY 2006",name: "FY 2006", isSelected: false},
        {hasChildren: true,id: "FY 2007",name: "FY 2007", isSelected: true},
        {hasChildren: true,id: "FY 2008",name: "FY 2008", isSelected: true},
        {hasChildren: true,id: "FY 2009",name: "FY 2009", isSelected: true},
        {hasChildren: true,id: "FY 2011",name: "FY 2011", isSelected: true},
        {hasChildren: true,isSelected: false,id: "H1 FY 2006",pid: "FY 2006",name: "H1 FY 2006"},
        {hasChildren: true,isSelected: true, id: "H2 FY 2006",pid: "FY 2006",name: "H2 FY 2006"},
        {hasChildren: true,isSelected: false,id: "Q1 FY 2006",pid: "H1 FY 2006",name: "Q1 FY 2006"},
        {hasChildren: true,isSelected: true,id: "Q2 FY 2006",pid: "H1 FY 2006",name: "Q2 FY 2006"}
    ];

export let autoCheckHierarcialData: any = [
        {hasChildren: true,id: "FY 2006",name: "FY 2006", isSelected: false , child: [
            {hasChildren: true,isSelected: false,id: "H1 FY 2006",name: "H1 FY 2006",child:[
                {hasChildren: true,isSelected: false,id: "Q1 FY 2006",name: "Q1 FY 2006"},
                {hasChildren: true,isSelected: true,id: "Q2 FY 2006",name: "Q2 FY 2006"}
            ]},
            {hasChildren: true,isSelected: true, id: "H2 FY 2006",name: "H2 FY 2006"},
        ]},
        {hasChildren: true,id: "FY 2007",name: "FY 2007", isSelected: true},
        {hasChildren: true,id: "FY 2008",name: "FY 2008", isSelected: true},
        {hasChildren: true,id: "FY 2009",name: "FY 2009", isSelected: true},
        {hasChildren: true,id: "FY 2011",name: "FY 2011", isSelected: true},
    ];

export let dynamicChangeCheckbox: any = [
    { id: 1, name: 'Discover Music', hasChild: true, expanded: true },
        { id: 2, pid: 1, name: 'Hot Singles', customField: 'treeviewField' },
        { id: 3, pid: 1, name: 'Rising Artists', customField: 'treeviewField' },
        { id: 4, pid: 1, name: 'Live Music', hasChild: true },
        { id: 26, pid: 4, name: 'Test' },
        { id: 7, name: 'Sales and Events', hasChild: true },
        { id: 8, pid: 7, name: '100 Albums - $5 Each' },
        { id: 9, pid: 7, name: 'Hip-Hop and R&B Sale' },
        { id: 10, pid: 7, name: 'CD Deals' },
        { id: 25, pid: 7, name: 'Hot Singles' },
        { id: 27, pid: 7, name: 'Test' },
];
