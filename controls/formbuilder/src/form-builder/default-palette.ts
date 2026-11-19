import { PaletteItem } from './types/form-schema';
import { ComponentCategory } from './model/base';
import { FormWidgetType } from './model/base';

/** @private */
export type DefaultPalette = {
  [key in ComponentCategory]?: PaletteItem[];
};

/** @private */
export const defaultPalette: DefaultPalette = {
  [ComponentCategory.Basic]: [
    { type: FormWidgetType.Textbox },
    { type: FormWidgetType.Textarea },
    { type: FormWidgetType.Checkbox },
    { type: FormWidgetType.Radio },
    { type: FormWidgetType.Number },
    { type: FormWidgetType.InputMask },
    { type: FormWidgetType.Dropdown },
    { type: FormWidgetType.MultiSelect },
    { type: FormWidgetType.Date },
    { type: FormWidgetType.Button }
  ],

  [ComponentCategory.Advanced]: [
    { type: FormWidgetType.CheckboxGroup},
    { type: FormWidgetType.DateTime },
    { type: FormWidgetType.Time },
    { type: FormWidgetType.DateRange },
    { type: FormWidgetType.Switch },
    { type: FormWidgetType.Rating },
    { type: FormWidgetType.SplitButton },
    { type: FormWidgetType.RangeSlider },
    { type: FormWidgetType.Signature },
    { type: FormWidgetType.ImageEditor },
    { type: FormWidgetType.FileUpload },
    { type: FormWidgetType.ColorPicker },
    { type: FormWidgetType.RichTextEditor},
    { type: FormWidgetType.DataGrid }
  ],

  [ComponentCategory.Layout]: [
    { type: FormWidgetType.Message },
    { type: FormWidgetType.Panel },
    { type: FormWidgetType.Table },
    { type: FormWidgetType.Tabs },
    { type: FormWidgetType.Card },
    { type: FormWidgetType.StaticHtml }
  ]
}
