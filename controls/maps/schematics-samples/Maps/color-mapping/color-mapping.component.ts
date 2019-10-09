//tslint:disable
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { MapsTheme, Maps, Zoom, Legend,  MapsTooltip, ILoadEventArgs } from '@syncfusion/ej2-angular-maps';
import { world_map } from './assets/world-map';

Maps.Inject(Zoom, Legend, MapsTooltip);
@Component({
    selector: 'control-content',
    templateUrl: 'color-mapping.component.html',
    styleUrls: ['color-mapping.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class MapsProjectionComponent {
    @ViewChild('maps')
    public maps: Maps;
    public load = (args: ILoadEventArgs) => {
        let theme: string = location.hash.split('/')[1];
        theme = theme ? theme : 'Material';
        args.maps.theme = <MapsTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    }
    public zoomSettings: object= {
        enable: false
    };
    public legendSettings: object = { visible: true };

    public titleSettings: object = {
        text: 'Members of the UN Security Council',
        titleStyle: { size: '16px' },
        subtitleSettings: {
            text: '- In 2017',
            titleStyle: { alignment: 'Far' }
        }
    };

    public layers: object[] =  [
        {
            shapeData: world_map,
            shapeDataPath: 'Country',
            shapePropertyPath: 'name',
            dataSource : [
                { Country: 'China', Membership: 'Permanent' },
                { Country: 'France', Membership: 'Permanent' },
                { Country: 'Russia', Membership: 'Permanent' },
                { Country: 'United Kingdom', Membership: 'Permanent' },
                { Country: 'United States', Membership: 'Permanent' },
                { Country: 'Bolivia', Membership: 'Non-Permanent' },
                { Country: 'Eq. Guinea', Membership: 'Non-Permanent' },
                { Country: 'Ethiopia', Membership: 'Non-Permanent' },
                { Country: 'Côte d Ivoire', Membership: 'Permanent' },
                { Country: 'Kazakhstan', Membership: 'Non-Permanent' },
                { Country: 'Kuwait', Membership: 'Non-Permanent' },
                { Country: 'Netherlands', Membership: 'Non-Permanent' },
                { Country: 'Peru', Membership: 'Non-Permanent' },
                { Country: 'Poland', Membership: 'Non-Permanent' },
                { Country: 'Sweden', Membership: 'Non-Permanent' },
                ],
            tooltipSettings: {
                visible: true,
                valuePath: 'Country',
            },
            shapeSettings: {
                fill: '#E5E5E5',
                colorMapping: [
                    {
                        value: 'Permanent',
                        color: '#EDB46F'
                    },
                    {
                        color: '#F1931B',
                        value: 'Non-Permanent'
                    }
                ],
                colorValuePath: 'Membership'
            }
        }
    ];
}