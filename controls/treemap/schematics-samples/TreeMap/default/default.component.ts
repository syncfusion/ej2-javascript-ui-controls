//tslint:disable
import { Component, ViewEncapsulation } from '@angular/core';
import { TreeMap, TreeMapTooltip, TreeMapLegend } from '@syncfusion/ej2-angular-treemap';
import { CarSales } from './assets/car-sale';
import { IItemMoveEventArgs, ILoadEventArgs, TreeMapTheme, IItemClickEventArgs } from '@syncfusion/ej2-angular-treemap';

TreeMap.Inject(TreeMapTooltip, TreeMapLegend);

@Component({
    selector: 'control-content',
    templateUrl: 'default.component.html',
    styleUrls: ['default.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreemapDefaultComponent {
    public itemMove= (args: IItemMoveEventArgs) => {
        args.item['data'].Sales = args.item['weight'];
        args.treemap.tooltipSettings.format = args.item['groupIndex'] === 0 ? 'Country: ${Continent}<br>Sales: ${Sales}' :
            'Country: ${Continent}<br>Company: ${Company}<br>Sales: ${Sales}';
    }
    public itemClick= (args: IItemClickEventArgs) => {
        args.item['data'].Sales = args.item['weight'];
        args.treemap.tooltipSettings.format = args.item['groupIndex'] === 0 ? 'Country: ${Continent}<br>Sales: ${Sales}' :
            'Country: ${Continent}<br>Company: ${Company}<br>Sales: ${Sales}';
    }
    public load = (args: ILoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.treemap.theme = <TreeMapTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
    titleSettings: object = {
        text: 'Car Sales by Country - 2017',
        textStyle: {
            size: '15px'
        }
    };
     public tooltipSettings: object = {
        visible: true,
        format: 'Country: ${Continent}<br>Company: ${Company}<br>Sales: ${Sales}'
    };
    public legendSettings: object = {
        visible: true,
        position: 'Top',
        shape: 'Rectangle'
    };
    dataSource: object[] = CarSales;
    weightValuePath: string = 'Sales';
     palette: string[] = ['#C33764', '#AB3566', '#993367', '#853169', '#742F6A', '#632D6C', '#532C6D', '#412A6F', '#312870', '#1D2671'];
     leafItemSettings: object = {
        labelPath: 'Company',
        border: { color: 'white', width: 0.5 }
    };
    border: object = {
        color: 'white',
        width: 0.5
    };
    constructor() {
        //code
    };
}