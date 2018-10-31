import { Sparkline  } from '../../src/sparkline/sparkline';
import { SparklineTooltip, ISparklineLoadEventArgs, SparklineTheme } from '../../src/sparkline/index'
import { EmitType } from '@syncfusion/ej2-base';
Sparkline.Inject(SparklineTooltip);


    let datetime: Sparkline = new Sparkline({
        load: (args: ISparklineLoadEventArgs) => {
            let theme: string = location.hash.split('/')[1];
            theme = theme ? theme : 'Material';
            args.sparkline.theme = <SparklineTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
        },
        height: '100px',
        width: '170px',
        lineWidth: 1,
        fill: '#3C78EF',
        type: 'Column',
        valueType: 'DateTime',
        dataSource: [
            { xDate: new Date(2018, 0, 1), x: 0, yval: 4 },
            { xDate: new Date(2018, 0, 2), x: 1, yval: 4.5 },
            { xDate: new Date(2018, 0, 3), x: 2, yval: 8 },
            { xDate: new Date(2018, 0, 4), x: 3, yval: 7 },
            { xDate: new Date(2018, 0, 5), x: 4, yval: 6 },
            { xDate: new Date(2018, 0, 8), x: 5, yval: 8 },
            { xDate: new Date(2018, 0, 9), x: 6, yval: 8 },
            { xDate: new Date(2018, 0, 10), x: 7, yval: 6.5 },
            { xDate: new Date(2018, 0, 11), x: 8, yval: 4 },
            { xDate: new Date(2018, 0, 12), x: 9, yval: 5.5 },
            { xDate: new Date(2018, 0, 15), x: 10, yval: 8 },
            { xDate: new Date(2018, 0, 16), x: 11, yval: 6 },
            { xDate: new Date(2018, 0, 17), x: 12, yval: 6.5 },
            { xDate: new Date(2018, 0, 18), x: 13, yval: 7.5 },
            { xDate: new Date(2018, 0, 19), x: 14, yval: 7.5 },
            { xDate: new Date(2018, 0, 22), x: 15, yval: 4 },
            { xDate: new Date(2018, 0, 23), x: 16, yval: 8 },
            { xDate: new Date(2018, 0, 24), x: 17, yval: 6 },
            { xDate: new Date(2018, 0, 25), x: 18, yval: 7.5 },
            { xDate: new Date(2018, 0, 26), x: 19, yval: 4.5 },
            { xDate: new Date(2018, 0, 29), x: 20, yval: 6 },
            { xDate: new Date(2018, 0, 30), x: 21, yval: 5 },
            { xDate: new Date(2018, 0, 31), x: 22, yval: 7 }
        ],
        tooltipSettings: {
            visible: true,
            format: '${xDate} : ${yval}hrs'
        },
        xName: 'xDate', yName: 'yval'
    });
    datetime.appendTo('#datetime');
    let category: Sparkline = new Sparkline({
        load: (args: ISparklineLoadEventArgs) => {
            let theme: string = location.hash.split('/')[1];
            theme = theme ? theme : 'Material';
            args.sparkline.theme = <SparklineTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
        },
        height: '100px',
        width: '170px',
        lineWidth: 1,
        type: 'Column',
        fill: '#3C78EF',
        valueType: 'Category',
        dataSource: [
            { x: 0, xval: 'Robert', yval: 60 },
            { x: 1, xval: 'Andrew', yval: 65 },
            { x: 2, xval: 'Suyama', yval: 70 },
            { x: 3, xval: 'Michael', yval: 80 },
            { x: 4, xval: 'Janet', yval: 55 },
            { x: 5, xval: 'Davolio', yval: 90 },
            { x: 6, xval: 'Fuller', yval: 75 },
            { x: 7, xval: 'Nancy', yval: 85 },
            { x: 8, xval: 'Margaret', yval: 77 },
            { x: 9, xval: 'Steven', yval: 68 },
            { x: 10, xval: 'Laura', yval: 96 },
            { x: 11, xval: 'Elizabeth', yval: 57 }
        ],
        tooltipSettings: {
            visible: true,
            format: '${xval} : ${yval}%'
        },
        xName: 'xval', yName: 'yval'
    });
    category.appendTo('#category');
    let numeric: Sparkline = new Sparkline({
        load: (args: ISparklineLoadEventArgs) => {
            let theme: string = location.hash.split('/')[1];
            theme = theme ? theme : 'Material';
            args.sparkline.theme = <SparklineTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
        },
        height: '100px',
        width: '170px',
        lineWidth: 1,
        type: 'Column',
        fill: '#3C78EF',
        valueType: 'Numeric',
        dataSource: [
            { x: 1, xval: 2010, yval: 190 },
            { x: 2, xval: 2011, yval: 165 },
            { x: 3, xval: 2012, yval: 158 },
            { x: 4, xval: 2013, yval: 175 },
            { x: 5, xval: 2014, yval: 200 },
            { x: 6, xval: 2015, yval: 180 },
            { x: 7, xval: 2016, yval: 210 }
        ],
        tooltipSettings: {
            visible: true,
            format: '${x} : $${yval}'
        },
        xName: 'x', yName: 'yval'
    });
    numeric.appendTo('#numeric');