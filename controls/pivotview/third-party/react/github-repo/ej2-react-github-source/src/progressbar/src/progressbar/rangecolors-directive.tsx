import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RangeColorModel } from '@syncfusion/ej2-progressbar';



export class RangeColorDirective extends ComplexBase<RangeColorModel & { children?: React.ReactNode }, RangeColorModel> {
    public static moduleName: string = 'rangeColor';
}

export class RangeColorsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'rangeColors';
    public static moduleName: string = 'rangeColors';
}
