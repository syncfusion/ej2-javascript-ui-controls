import { Sparkline  } from '../../src/sparkline/sparkline';
import { SparklineTooltip, ISparklineLoadEventArgs, SparklineTheme } from '../../src/sparkline/index'
import { EmitType } from '@syncfusion/ej2-base';
let percentage: Sparkline = new Sparkline({
    height: '200px',
    width: '180px',
    lineWidth: 1,
    type: 'Area',
    valueType: 'Numeric',
    dataSource: [2,3,6,0,-2,-5,8,1,-1],
    axisSettings: {
        lineSettings: {
            color: 'red',
            width: 2
        }
    },
    markerSettings: {
        fill: 'red',
        size: 5
    },
});
percentage.appendTo('#percentage');
document.getElementById('markerwithall').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('markerwithall')).checked;
    percentage.markerSettings.visible = (visible)? ['All']:[];
    percentage.refresh();
}
document.getElementById('labelwithall').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('labelwithall')).checked;
    percentage.dataLabelSettings.visible = (visible)? ['All']:[];
    percentage.refresh();
}
document.getElementById('markerwithnegative').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('markerwithnegative')).checked;
    percentage.markerSettings.visible = (visible)? ['Negative']:[];
    percentage.refresh();
}
document.getElementById('labelwithnegative').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('labelwithnegative')).checked;
    percentage.dataLabelSettings.visible = (visible)? ['Negative']:[];
    percentage.refresh();
}
document.getElementById('markerwithfirst').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('markerwithfirst')).checked;
    percentage.markerSettings.visible = (visible)? ['Start']:[];
    percentage.refresh();
}
document.getElementById('labelwithlast').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('labelwithfirst')).checked;
    percentage.dataLabelSettings.visible = (visible)? ['Start']:[];
    percentage.refresh();
}
document.getElementById('markerwithlast').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('markerwithlast')).checked;
    percentage.markerSettings.visible = (visible)? ['End']:[];
    percentage.refresh();
}
document.getElementById('labelwithlast').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('labelwithlast')).checked;
    percentage.dataLabelSettings.visible = (visible)? ['End']:[];
    percentage.refresh();
}
document.getElementById('markerwithhigh').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('markerwithhigh')).checked;
    percentage.markerSettings.visible = (visible)? ['High']:[];
    percentage.refresh();
}
document.getElementById('labelwithhigh').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('labelwithhigh')).checked;
    percentage.dataLabelSettings.visible = (visible)? ['High']:[];
    percentage.refresh();
}
document.getElementById('markerwithlow').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('markerwithlow')).checked;
    percentage.markerSettings.visible = (visible)? ['Low']:[];
    percentage.refresh();
}
document.getElementById('labelwithlow').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('labelwithlow')).checked;
    percentage.dataLabelSettings.visible = (visible)? ['Low']:[];
    percentage.refresh();
}
document.getElementById('trackline').onchange =(args:Event) =>{
let visible:boolean =(<HTMLInputElement>document.getElementById('trackline')).checked
percentage.tooltipSettings.trackLineSettings.visible = visible;
percentage.refresh();
}
document.getElementById('axisline').onchange =(args:Event) =>{
    let visible:boolean =(<HTMLInputElement>document.getElementById('axisline')).checked
    percentage.tooltipSettings.trackLineSettings.visible = visible;
    percentage.refresh();
    }