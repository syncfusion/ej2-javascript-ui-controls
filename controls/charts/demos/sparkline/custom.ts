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
        { x: 0, xval: 'AUDI', yval: 1 },
        { x: 1, xval: 'BMW', yval: 5 },
        { x: 2, xval: 'BUICK', yval: -1 },
        { x: 3, xval: 'CETROEN', yval: -6 },
        { x: 4, xval: 'CHEVROLET', yval: 0 },
        { x: 5, xval: 'FIAT', yval: 1 },
        { x: 6, xval: 'FORD', yval: -2 },
        { x: 7, xval: 'HONDA', yval: 7 },
        { x: 8, xval: 'HYUNDAI', yval: -9 },
        { x: 9, xval: 'JEEP', yval: 0 },
        { x: 10, xval: 'KIA', yval: -10 },
        { x: 11, xval: 'MAZDA', yval: 3 },
        { x: 12, xval: 'MERCEDES', yval: 13 },
        { x: 13, xval: 'NISSAN', yval: 5 },
        { x: 14, xval: 'OPEL/VHALL', yval: -6 },
        { x: 15, xval: 'PEUGEOT', yval: 0 },
        { x: 16, xval: 'RENAULT', yval: 7 },
        { x: 17, xval: 'SKODA', yval: 5 },
        { x: 18, xval: 'SUBARU', yval: 5 },
        { x: 19, xval: 'SUZUKI', yval: 11 },
        { x: 20, xval: 'TOYOTA', yval: 5 },
        { x: 21, xval: 'VOLKSWAGEN', yval: 3 },
    ],
    xName: 'xval', yName: 'yval',
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