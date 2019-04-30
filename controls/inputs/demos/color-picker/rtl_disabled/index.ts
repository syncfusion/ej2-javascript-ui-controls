import { ColorPicker } from './../../../src/color-picker/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';

L10n.load({
    'ar': {
        'colorpicker': { 
            "Apply":"تطبيق",
            "Cancel":"إلغاء",
            "ModeSwitcher": "مفتاح كهربائي الوضع"
        }
    }
});

enableRipple(true);

//RTL ColorPicker sample
let colorPicker: ColorPicker = new ColorPicker({ value: '#df760d', locale: 'ar', enableRtl: true }, '#rtl');

//Disabled ColorPicker sample
colorPicker = new ColorPicker({ disabled: true }, '#disabled');