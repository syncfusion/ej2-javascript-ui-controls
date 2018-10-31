/**
 * dropdownlist Sample
 */
import { MultiSelect } from '../../src/multi-select/index';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import { L10n, setCulture, } from '@syncfusion/ej2-base';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from './../../src/drop-down-base/index';

MultiSelect.Inject(CheckBoxSelection);
 

let noRecords: string;

    let msObject1: MultiSelect = new MultiSelect({
        placeholder:"Select vegetables",
    mode: 'CheckBox',
    showSelectAll: true,
    showDropDownIcon: true,
    });

    // render initialized MultiSelect
    msObject1.appendTo('#ulElement');