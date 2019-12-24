/**
 * Maps Tooltip
 */
import { Maps, MapsTooltip, Legend, ITooltipRenderEventArgs, ILoadEventArgs, DataLabel, MapAjax} from '../../src/index';
import { world_cup } from '../MapData/SouthAmerica_Countries';
import { world_Map } from '../MapData/worldMapDashboard';
Maps.Inject(MapsTooltip, Legend, DataLabel);

    let maps: Maps = new Maps({
        titleSettings: {
            text: 'Finalist in Cricket World Cup',
            textStyle: {
                size: '16px'
            }
        },
        layers: [
            {
                shapeData: world_Map,
                shapePropertyPath: ["admin", "name", "continent", "iso_3166_2", "iso_3166_3", "iso_3166_numeric" , "fips"],
                shapeDataPath: 'column2',
                dataSource: [
                    {"column2":"AS","column1":34213612},
                    {"column2":"AU","column1":106314},
                    {"column2":"RS","column1":145872256},
                    {"column2":"RU","column1":888927},
                    {"column2":"SA","column1":139563574}
                ],
                shapeSettings: {
					valuePath: 'column2',
                    colorValuePath: 'column1',
					colorMapping: [{
						from: 799,
						to: 1476601220,
						color: ["#ffc2da", "#F67280"]
					}]
                },
				tooltipSettings: {
					visible: true,
					valuePath: 'column2'
				},
				dataLabelSettings: {
					visible: true,
					labelPath: 'column2'
				}
            }
        ]
    });
    maps.appendTo('#container');
