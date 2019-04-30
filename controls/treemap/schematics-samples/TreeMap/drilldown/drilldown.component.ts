//tslint:disable
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { TreeMap, TreeMapTooltip, IDrillStartEventArgs, ITreeMapTooltipRenderEventArgs } from '@syncfusion/ej2-angular-treemap';
import { DrillDown } from './assets/drilldown-sample';
import { ILoadEventArgs, TreeMapTheme } from '@syncfusion/ej2-angular-treemap';
TreeMap.Inject(TreeMapTooltip);

@Component({
    selector: 'control-content',
    templateUrl: 'drilldown.component.html',
    styleUrls: ['drilldown.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreemapDrillDownComponent {
    @ViewChild('treemap')
    public treemap: TreeMap;
    public load = (args: ILoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.treemap.theme = <TreeMapTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
    public drillStart = (args: IDrillStartEventArgs) => {
        if (args.item[Object.keys(args.item)[0]].length === 1) {
            args.treemap.levels[2].showHeader = true;
        }else {
            args.treemap.levels[2].showHeader = false;
        }
    }
    tooltipRendering = (args: ITreeMapTooltipRenderEventArgs) => {
        //tslint:disable-next-line
        if (args.item['groupIndex'] !== 2 ) {
            args.cancel = true;
        }
    }
        public palette: string[] = ['#9999ff', '#CCFF99', '#FFFF99', '#FF9999', '#FF99FF', '#FFCC66'];
        public titleSettings: object = {
            text: 'List of countries by population',
            textStyle: { size: '15px'}
        };
        public dataSource: object[] = DrillDown;
        public weightValuePath: string = 'Population';
        public tooltipSettings: object = {
            visible: true,
            format: '${Name} : ${Population}'
        };
        public leafItemSettings: object = {
            labelPath: 'Name',
            showLabels: false,
            labelStyle: { size: '0px' },
            border: { color: 'black', width: 0.5 }
        };
        border: object = {
            color: 'black',
            width: 0.5
        };
};