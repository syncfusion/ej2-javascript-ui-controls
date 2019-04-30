import { Sparkline  } from '../../src/sparkline/sparkline';
import { SparklineTooltip, ISparklineLoadEventArgs, SparklineTheme } from '../../src/sparkline/index'
import { EmitType } from '@syncfusion/ej2-base';
Sparkline.Inject(SparklineTooltip);
let percentage: Sparkline = new Sparkline({
    load: (args: ISparklineLoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.sparkline.theme = <SparklineTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    },
    height: '200px',
    width: '180px',
    lineWidth: 1,
    type: 'Column',
    valueType: 'Category',
    dataSource: [
        { x: 1, yval: 5 },
        { x: 2, yval: 6 },
        { x: 3, yval: 5 },
        { x: 4, yval: 7 },
        { x: 5, yval: 4 },
        { x: 6, yval: 3 },
        { x: 7, yval: 9 },
        { x: 8, yval: 5 },
        { x: 9, yval: 6 },
        { x: 10, yval: 5 },
        { x: 11, yval: 7 },
        { x: 12, yval: 8 },
        { x: 13, yval: 4 },
        { x: 14, yval: 5 },
        { x: 15, yval: 3 },
        { x: 16, yval: 4 },
        { x: 17, yval: 11 },
        { x: 18, yval: 10 },
    ],
    xName: 'x', yName: 'yval',
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
    tooltipSettings: {
        format: '${xval}: ${yval}',
        trackLineSettings: {
            color: 'red',
            width: 1
        }
    }
});
percentage.appendTo('#percentage');
document.getElementById('tooltip').onchange =(args:Event) =>{
    let visible: boolean =(<HTMLInputElement>document.getElementById('tooltip')).checked;
    percentage.tooltipSettings.visible = visible;
    percentage.refresh();
}
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