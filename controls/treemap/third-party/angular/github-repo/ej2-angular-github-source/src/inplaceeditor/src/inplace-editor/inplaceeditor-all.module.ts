import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InPlaceEditorComponent } from './inplaceeditor.component';
import { InPlaceEditorModule } from './inplaceeditor.module';
import {AutoComplete, ColorPicker, ComboBox, DateRangePicker, MultiSelect, Rte, Slider, TimePicker} from '@syncfusion/ej2-inplace-editor'


export const AutoCompleteService: ValueProvider = { provide: 'InPlace-EditorAutoComplete', useValue: AutoComplete};
export const ColorPickerService: ValueProvider = { provide: 'InPlace-EditorColorPicker', useValue: ColorPicker};
export const ComboBoxService: ValueProvider = { provide: 'InPlace-EditorComboBox', useValue: ComboBox};
export const DateRangePickerService: ValueProvider = { provide: 'InPlace-EditorDateRangePicker', useValue: DateRangePicker};
export const MultiSelectService: ValueProvider = { provide: 'InPlace-EditorMultiSelect', useValue: MultiSelect};
export const RteService: ValueProvider = { provide: 'InPlace-EditorRte', useValue: Rte};
export const SliderService: ValueProvider = { provide: 'InPlace-EditorSlider', useValue: Slider};
export const TimePickerService: ValueProvider = { provide: 'InPlace-EditorTimePicker', useValue: TimePicker};

/**
 * NgModule definition for the InPlaceEditor component with providers.
 */
@NgModule({
    imports: [CommonModule, InPlaceEditorModule],
    exports: [
        InPlaceEditorModule
    ],
    providers:[
        AutoCompleteService,
        ColorPickerService,
        ComboBoxService,
        DateRangePickerService,
        MultiSelectService,
        RteService,
        SliderService,
        TimePickerService
    ]
})
export class InPlaceEditorAllModule { }