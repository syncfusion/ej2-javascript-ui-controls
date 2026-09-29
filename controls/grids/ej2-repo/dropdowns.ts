import * as index from '@syncfusion/ej2-dropdowns';
index.DropDownList.Inject( index.VirtualScroll);
index.ComboBox.Inject( index.VirtualScroll);
index.AutoComplete.Inject( index.VirtualScroll);
index.MultiSelect.Inject( index.CheckBoxSelection,index.VirtualScroll);
index.ListBox.Inject( index.CheckBoxSelection);
export * from '@syncfusion/ej2-dropdowns';
