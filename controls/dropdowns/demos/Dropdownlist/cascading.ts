/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';
import { Query } from '@syncfusion/ej2-data';


    let country: { [key: string]: Object }[] = [
        { countryName: 'United States', countryId: '1' },
        { countryName: 'Australia', countryId: '2' }
    ];
    let state: { [key: string]: Object }[] = [
        { stateName: 'New York', countryId: '1', stateId: '101' },
        { stateName: 'Virginia ', countryId: '1', stateId: '102' },
        { stateName: 'Washington', countryId: '1', stateId: '103' },
        { stateName: 'Queensland', countryId: '2', stateId: '104' },
        { stateName: 'Tasmania ', countryId: '2', stateId: '105' },
        { stateName: 'Victoria', countryId: '2', stateId: '106' }
    ];
    let cities: { [key: string]: Object }[] = [
        { cityName: 'Albany', stateId: '101', cityId: 201 },
        { cityName: 'Beacon ', stateId: '101', cityId: 202 },
        { cityName: 'Lockport', stateId: '101', cityId: 203 },
        { cityName: 'Alexandria', stateId: '102', cityId: 204 },
        { cityName: 'Hampton ', stateId: '102', cityId: 205 },
        { cityName: 'Emporia', stateId: '102', cityId: 206 },
        { cityName: 'Aberdeen', stateId: '103', cityId: 207 },
        { cityName: 'Colville ', stateId: '103', cityId: 208 },
        { cityName: 'Pasco', stateId: '103', cityId: 209 },
        { cityName: 'Townsville', stateId: '104', cityId: 210 },
        { cityName: 'Brisbane ', stateId: '104', cityId: 211 },
        { cityName: 'Cairns', stateId: '104', cityId: 212 },
        { cityName: 'Hobart', stateId: '105', cityId: 213 },
        { cityName: 'Launceston ', stateId: '105', cityId: 214 },
        { cityName: 'Devonport', stateId: '105', cityId: 215 },
        { cityName: 'Melbourne', stateId: '106', cityId: 216 },
        { cityName: 'Healesville ', stateId: '106', cityId: 217 },
        { cityName: 'Geelong', stateId: '106', cityId: 218 }
    ];
    let listObj: DropDownList = new DropDownList({
        dataSource: country,
        fields: { value: 'countryId', text: 'countryName' },
        change: () => {
            listObj1.enabled = true;
            let tempQuery: Query = new Query().where('countryId', 'equal', listObj.value);
            listObj1.query = tempQuery;
            listObj1.dataBind();
            listObj1.value = null;
            listObj2.value = null;
            listObj2.enabled = false;
        },
        width: '250px',
        placeholder: 'Select a country',
        popupWidth: '250px',
        popupHeight: '83px'
    });
    listObj.appendTo('#list');


    let listObj1: DropDownList = new DropDownList({
        dataSource: state,
        fields: { value: 'stateId', text: 'stateName' },
        enabled: false,
        change: () => {
            listObj2.enabled = true;
            let tempQuery1: Query = new Query().where('stateId', 'equal', listObj1.value);
            listObj2.query = tempQuery1;
            listObj2.dataBind();
            listObj2.value = null;
        },
        width: '250px',
        placeholder: 'Select a state',
        popupWidth: '250px',
        popupHeight: '123px'
    });
    listObj1.appendTo('#list2');


    let listObj2: DropDownList = new DropDownList({
        dataSource: cities,
        fields: { text: 'cityName' },
        enabled: false,
        width: '250px',
        placeholder: 'Select a city',
        popupWidth: '250px',
        popupHeight: '123px'
    });
    listObj2.appendTo('#list3');