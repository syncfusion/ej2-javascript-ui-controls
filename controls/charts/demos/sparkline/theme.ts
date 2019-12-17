import { Sparkline  } from '../../src/sparkline/sparkline';
import { SparklineTheme, SparklineTooltip } from '../../src/sparkline/index';
Sparkline.Inject(SparklineTooltip)
let percentage: Sparkline = new Sparkline({
    height: '200px',
    width: '200px',
    lineWidth: 1,
    type: 'Column',
    valueType: 'Numeric',
    dataSource: [2,3,6,0,-2,-5,8,1,-1],
    dataLabelSettings: { visible: ['All'] },
    rangeBandSettings: [{
        startRange: 4,
        endRange: 5
    }],
    tooltipSettings: { visible: true, trackLineSettings: { visible: true } },
    axisSettings: {
        lineSettings: {
            width: 2
        }
    },
    markerSettings: {
        visible: ['All']
    },
});
percentage.appendTo('#container');
document.getElementById('theme').onchange = () => {
    var value = (<HTMLInputElement>document.getElementById('theme')).value;
    percentage.theme= value as SparklineTheme; 
    percentage.refresh();
}