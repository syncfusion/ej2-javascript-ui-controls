/**
 * sparkline sample 
 */
import { Sparkline, } from '../../src/sparkline/sparkline';
import { ISeriesRenderingEventArgs, SparklineTooltip, SparklineTheme} from '../../src/sparkline/index'
import { EmitType } from '@syncfusion/ej2-base';
Sparkline.Inject(SparklineTooltip);
let sparkload: EmitType<ISeriesRenderingEventArgs> = (args: ISeriesRenderingEventArgs) => {
args.lineWidth = 40;
};
let sparkline: Sparkline = new Sparkline({
    height: '50px',
    width: '90%',
    lineWidth: 2,
    type: 'Line',
    valueType: 'Category',
    fill: '#3C78EF',
    seriesRendering: sparkload,
    negativePointColor: '#fc5070',
    format: 'n',
    useGroupingSeparator: true,
    dataSource: [
        { x: 0, xval: '2005', yval: 20090440 },
        { x: 1, xval: '2006', yval: 20264080 },
        { x: 2, xval: '2007', yval: 20434180 },
        { x: 3, xval: '2008', yval: 21007310 },
        { x: 4, xval: '2009', yval: 21262640 },
        { x: 5, xval: '2010', yval: 21515750 },
        { x: 6, xval: '2011', yval: 21766710 },
        { x: 7, xval: '2012', yval: 22015580 },
        { x: 8, xval: '2013', yval: 22262500 },
        { x: 9, xval: '2014', yval: 22507620 },
    ],
    tooltipSettings: {
        visible: true,
        format: '${xval} : ${yval}',
        trackLineSettings: {
            visible: true,
            color: '#fc5070',
            width: 2
        }
    },
    xName: 'xval', yName: 'yval'
});
sparkline.appendTo('#container');
