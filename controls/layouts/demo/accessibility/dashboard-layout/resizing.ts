import { DashboardLayout } from '../../../src/dashboard-layout/dashboard-layout';

let portlet: DashboardLayout = new DashboardLayout({
    columns:12,        
    allowResizing: true,  
    panels: [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 },
    { "sizeX": 3, "sizeY": 2, "row": 0, "col": 1 },
    { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4 },
    { "sizeX": 1, "sizeY": 1, "row": 1, "col": 0 },
    { "sizeX": 2, "sizeY": 1, "row": 2, "col": 0 },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 2 },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 3 }
    ]
});

portlet.appendTo('#dashboard_layout');