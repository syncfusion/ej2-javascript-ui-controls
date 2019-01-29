import { DashboardLayout } from '../../src/dashboardlayout/dashboardlayout';
var portlet = new DashboardLayout({
    columns:12,        
    allowDragging: true,
    allowPushing: false,
    allowFloating: false,    
    panels: [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0 },
    { "sizeX": 3, "sizeY": 2, "row": 0, "col": 1 },
    { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4 },
    { "sizeX": 1, "sizeY": 1, "row": 1, "col": 0 },
    { "sizeX": 2, "sizeY": 1, "row": 2, "col": 0 },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 2 },
    { "sizeX": 1, "sizeY": 1, "row": 2, "col": 3 },
    { "sizeX": 4, "sizeY": 1, "row": 3, "col": 0 }
    ]
});
portlet.appendTo('#portlet_default');
document.getElementById('floating').onclick = function () {
    var obj: any = (<any>document.getElementById('portlet_default')).ej2_instances[0];
    if (obj.floating) {
        obj.floating = false;
    } else {
        obj.floating = true;
    }
}
document.getElementById('pushing').onclick = function () {
    var obj: any = (<any>document.getElementById('portlet_default')).ej2_instances[0];
    if (obj.pushing) {
        obj.pushing = false;
    } else {
        obj.pushing = true;
    }
}