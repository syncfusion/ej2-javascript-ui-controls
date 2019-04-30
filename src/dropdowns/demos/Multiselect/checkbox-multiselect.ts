/**
 * MultiSelect Sample
 */
import { MultiSelect, RemoveEventArgs } from '../../src/multi-select/index';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { CheckBox } from '@syncfusion/ej2-buttons';

let searchData: { [key: string]: Object; }[] = [
    { index: "s1", country: "Alaska" }, { index: "s2", country: "California" },
    { index: "s3", country: "Florida" }, { index: "s4", country: "Georgia" }
];

let filter: MultiSelect = new MultiSelect({
    dataSource: searchData,
    // map the appropriate column
    fields: { text: "country", value: "index" },
    // set placeholder to MultiSelect input element
    placeholder: "Select countries",
    closePopupOnSelect: false,
    itemTemplate: "<label class='label-for'><input type='checkbox' class='item-checkbox'/>${country}</label>",
    mode: 'Delimiter',
    open: function () {
        renderCheckBox(filter);
    },
    select: function () {
        overrideStyle(filter);
    },
    blur: function () {
        overrideStyle(filter);
    },
    removed: function (e:RemoveEventArgs) {
        let element: HTMLElement = (filter as any).ulElement.querySelector('li[data-value="' + (e.itemData as any)[filter.fields.value] + '"]');
        if (element && (e.e.target as HTMLElement).classList.contains('e-chips-close')) {
            let checkbox: CheckBox = (element.querySelector('.e-checkbox') as any).ej2_instances[0];
            checkbox.checked = false;
        }
        if (filter.value && filter.value.length > 0) {
            (filter as any).inputElement.classList.remove('e-ms-override');
        }
    }
});
filter.appendTo('#select');


function overrideStyle(self: MultiSelect) {
    let element: HTMLElement = <HTMLElement>document.querySelector('.e-delim-view');
    if (self.value && self.value.length > 0) {
        (self as any).inputElement.classList.add('e-ms-override');
        element.classList.add('e-ms-override');
    } else {
        element.classList.remove('e-ms-override');
        (self as any).inputElement.classList.remove('e-ms-override');
    }
    element.innerHTML = 'Selected ' + (filter.value.length) + ' country';
}

function renderCheckBox(self: MultiSelect) {
    let items: HTMLElement[] = <HTMLElement[] & NodeListOf<Element>>(self as any).ulElement.querySelectorAll('.label-for');
    if (!items[0].firstElementChild.classList.contains('e-control')) {
        for (let i = 0; items.length > i; i++) {
            let checkbox = new CheckBox();
            checkbox.appendTo(items[i].firstElementChild as any);
            items[i].setAttribute('for', checkbox.element.id);
        }
    }
    refreshCheckSelection(self);
}

function refreshCheckSelection(self: MultiSelect) {
    let value: string | number | boolean;
    let element: HTMLElement;
    if (self.value && self.value.length > 0) {
        for (let index: number = 0; self.value[index]; index++) {
            value = self.value[index];
            element = <HTMLElement>(self as any).ulElement.querySelector('li[data-value="' + value + '"]');
            if (element) {
                let checkbox = (element.querySelector('.e-checkbox') as any).ej2_instances[0];
                checkbox.checked = true;
            }
        }
    }
}
