import { DashboardLayout } from '../../src/dashboardlayout/dashboardlayout';
let portlet: DashboardLayout = new DashboardLayout({
    columns:7,        
    cellSpacing:[5,5],
    allowDragging: true,
    enableRtl:true,
});
portlet.appendTo('#portlet_default');
