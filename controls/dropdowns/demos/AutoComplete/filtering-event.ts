import { AutoComplete } from '../../src/auto-complete/index';
import { Query } from '@syncfusion/ej2-data';

//define the array of complex data
let searchData: { [key: string]: Object; }[] = [
    { name: 'Albania', code: 'C1' }, { name: 'Algeria', code: 'C2' }, { name: 'Austria', code: 'C3' },
    { name: 'Australia', code: 'C4' }, { name: 'Argentina', code: 'C5' }, { name: 'Armenia', code: 'C6' },
    { name: 'Bahrain', code: 'C7' }, { name: 'Belgium', code: 'C8' }, { name: 'Belize', code: 'C9' },
    { name: 'Bulgaria', code: 'C10' }, { name: 'Burma', code: 'C11' }, { name: 'Canada', code: 'C12' },
    { name: 'China', code: 'C13' }, { name: 'Colombia', code: 'C14' }, { name: 'Comoros', code: 'C15' },
    { name: 'Croatia', code: 'C16' }, { name: 'Estonia', code: 'C17' }, { name: 'Ethiopia', code: 'C18' },
    { name: 'Egypt', code: 'C19' }, { name: 'France', code: 'C20' }, { name: 'Finland', code: 'C21' },
    { name: 'Ghana', code: 'C22' }, { name: 'Germany', code: 'C23' }, { name: 'Guinea', code: 'C24' },
    { name: 'Guyana', code: 'C25' }, { name: 'Hong Kong', code: 'C26' }, { name: 'Hungary', code: 'C27' },
    { name: 'India', code: 'C28' }, { name: 'Iceland', code: 'C29' }, { name: 'Iran', code: 'C30' },
    { name: 'Iraq', code: 'C31' }, { name: 'Ireland', code: 'C32' }, { name: 'Japan', code: 'C33' },
    { name: 'Jamaica', code: 'C34' }, { name: 'Kazakhstan', code: 'C35' }, { name: 'Kenya', code: 'C36' },
    { name: 'Latvia', code: 'C37' }, { name: 'Liberia', code: 'C38' }, { name: 'Libya', code: 'C39' },
    { name: 'Malaysia', code: 'C40' }, { name: 'Mongolia', code: 'C41' }, { name: 'Mexico', code: 'C42' },
    { name: 'Nepal', code: 'C43' }, { name: 'Netherlands', code: 'C44' }, { name: 'Niger', code: 'C45' },
    { name: 'Nigeria', code: 'C46' }, { name: 'Norway', code: 'C47' }, { name: 'Oman', code: 'C48' },
    { name: 'Pakistan', code: 'C49' }, { name: 'Panama', code: 'C50' }, { name: 'Poland', code: 'C51' },
    { name: 'Philippines', code: 'C52' }, { name: 'Russia', code: 'C53' }, { name: 'Romania', code: 'C54' },
    { name: 'Serbia', code: 'C55' }, { name: 'Samoa', code: 'C56' }, { name: 'South Africa', code: 'C57' },
    { name: 'Spain', code: 'C58' }, { name: 'Swaziland', code: 'C59' }, { name: 'Tajikistan', code: 'C60' },
    { name: 'Thailand', code: 'C61' }, { name: 'Taiwan', code: 'C62' }, { name: 'Ukraine', code: 'C63' },
    { name: 'United Kingdom', code: 'C64' }, { name: 'Vietnam', code: 'C65' }, { name: 'Zambia', code: 'C66' }];

//initiates the component
let filter: AutoComplete = new AutoComplete({
    // bind the country data to dataSource property
    dataSource: searchData,
    // maps the appropriate column to fields property
    fields: {  value: "name" },
    //set the placeholder to AutoComplete input
    placeholder: "Find a country",
    //set height to suggestion list
    popupHeight: '250px',
    //Bind the filter event
    filtering: function (e: any) {
        e.preventDefaultAction = true;
        let data: { [key: string]: Object; }[] = searchData.filter((v: { [key: string]: string; }) => {
            let value: string = v.name.toLowerCase();
            let text: string = e.text.toLowerCase();
            if ((LevenshteinDistance(text, text.length, value.replace(/\s/g, ''), value.replace(/\s/g, '').length) <= 2) ||
                new RegExp("^" + e.text, "i").test(value)) {
                return true;
            } else {
                return false;
            }
        });
        e.updateData(data, null);
    }
});
filter.appendTo('#list');

function LevenshteinDistance(s: string, sLength: number, t: string, tLength: number): number {
    if (sLength == 0) { return tLength; }
    if (tLength == 0) { return sLength; }
    let cost: number = (s[sLength - 1] == t[tLength - 1]) ? 0 : 1;
    return Math.min(LevenshteinDistance(s, sLength - 1, t, tLength) + 1,
        LevenshteinDistance(s, sLength, t, tLength - 1) + 1,
        LevenshteinDistance(s, sLength - 1, t, tLength - 1) + cost);
}