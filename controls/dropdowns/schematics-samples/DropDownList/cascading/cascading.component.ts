/**
 * DropDownList Cascading Sample
 */
import { Component, ViewChild } from '@angular/core';
import { Query } from '@syncfusion/ej2-data';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
    selector: 'control-content',
    templateUrl: 'cascading.component.html',
    styleUrls: ['cascading.component.css']
})

export class CascadingDropDownListComponent {
    // define the country DropDownList data
    public country: { [key: string]: Object }[] = [
        { CountryName: 'Australia', CountryId: '2' },
        { CountryName: 'United States', CountryId: '1' }
    ];
    // define the state DropDownList data
    public state: { [key: string]: Object }[] = [
        { StateName: 'New York', CountryId: '1', StateId: '101' },
        { StateName: 'Queensland', CountryId: '2', StateId: '104' },
        { StateName: 'Tasmania ', CountryId: '2', StateId: '105' },
        { StateName: 'Victoria', CountryId: '2', StateId: '106' },
        { StateName: 'Virginia ', CountryId: '1', StateId: '102' },
        { StateName: 'Washington', CountryId: '1', StateId: '103' }
    ];
    // define the city DropDownList data
    public cities: { [key: string]: Object }[] = [
        { CityName: 'Aberdeen', StateId: '103', CityId: 207 },
        { CityName: 'Alexandria', StateId: '102', CityId: 204 },
        { CityName: 'Albany', StateId: '101', CityId: 201 },
        { CityName: 'Beacon ', StateId: '101', CityId: 202 },
        { CityName: 'Brisbane ', StateId: '104', CityId: 211 },
        { CityName: 'Cairns', StateId: '104', CityId: 212 },
        { CityName: 'Colville ', StateId: '103', CityId: 208 },
        { CityName: 'Devonport', StateId: '105', CityId: 215 },
        { CityName: 'Emporia', StateId: '102', CityId: 206 },
        { CityName: 'Geelong', StateId: '106', CityId: 218 },
        { CityName: 'Hampton ', StateId: '102', CityId: 205 },
        { CityName: 'Healesville ', StateId: '106', CityId: 217 },
        { CityName: 'Hobart', StateId: '105', CityId: 213 },
        { CityName: 'Launceston ', StateId: '105', CityId: 214 },
        { CityName: 'Lockport', StateId: '101', CityId: 203 },
        { CityName: 'Melbourne', StateId: '106', CityId: 216 },
        { CityName: 'Pasco', StateId: '103', CityId: 209 },
        { CityName: 'Townsville', StateId: '104', CityId: 210 }
    ];
    // maps the country columns to fields property
    public countryFields: Object = { value: 'CountryId', text: 'CountryName' };
    // maps the state columns to fields property
    public stateFields: Object = { value: 'StateId', text: 'StateName' };
    // maps the city columns to fields property
    public cityFields: Object = { text: 'CityName', value: 'CityId' };
    // set the placeholder to DropDownList input element
    public countryWaterMark: string = 'Select a country';
    public stateWaterMark: string = 'Select a state';
    public cityWaterMark: string = 'Select a city';
    @ViewChild('countryList')
    // country DropDownList instance
    public countryObj: DropDownListComponent;
    @ViewChild('stateList')
    // state DropDownList instance
    public stateObj: DropDownListComponent;
    @ViewChild('cityList')
    // city DropDownList instance
    public cityObj: DropDownListComponent;
    public onChange1(): void {
        this.stateObj.enabled = true;
        // query the data source based on country DropDownList selected value
        let tempQuery: Query = new Query().where('CountryId', 'equal', this.countryObj.value);
        this.stateObj.query = tempQuery;
        // clear the existing selection.
        this.stateObj.text = null;
        // bind the property changes to state DropDownList
        this.stateObj.dataBind();
        // clear the existing selection.
        this.cityObj.text = null;
        this.cityObj.enabled = false;
        // bind the property changes to city DropDownList
        this.cityObj.dataBind();
    }
    public onChange2(): void {
        this.cityObj.enabled = true;
        // query the data source based on state DropDownList selected value
        let tempQuery1: Query = new Query().where('StateId', 'equal', this.stateObj.value);
        this.cityObj.query = tempQuery1;
        // clear the existing selection.
        this.cityObj.text = null;
        // bind the property changes to city DropDownList
        this.cityObj.dataBind();
    }
}
