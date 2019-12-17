/**
 * sparkline sample 
 */
import { Sparkline } from '../../src/sparkline/sparkline';
import { SparklineTooltip } from '../../src/sparkline/rendering/sparkline-tooltip';
import { ISparklinePointEventArgs } from '../../src/sparkline/model/interface';
Sparkline.Inject(SparklineTooltip);

let sparkline: Sparkline = new Sparkline({
    height: '50px',
    width: '90%',
    lineWidth: 2,
    type: 'Column',
    valueType: 'Category',
    fill: '#3C78EF',
    negativePointColor: '#fc5070',
    format: 'n',
    useGroupingSeparator: true,
    dataSource: [
        { x: 0, xval: '2005', yval: 24090440 },
        { x: 1, xval: '2006', yval: 23264080 },
        { x: 2, xval: '2007', yval: 20434180 },
        { x: 3, xval: '2008', yval: 21007310 },
        { x: 4, xval: '2009', yval: 21262640 },
        { x: 5, xval: '2010', yval: 21515750 },
        { x: 6, xval: '2011', yval: 21766710 },
        { x: 7, xval: '2012', yval: 22015580 },
        { x: 8, xval: '2013', yval: 22262500 },
        { x: 9, xval: '2014', yval: 22507620 },
    ],
    xName: 'xval', yName: 'yval',
    pointRendering: (args: ISparklinePointEventArgs) => {
        if (args.pointIndex === 1) {
            args.border.color = 'green';
            args.border.width = 2;
        }
    }
});
sparkline.appendTo('#container');
