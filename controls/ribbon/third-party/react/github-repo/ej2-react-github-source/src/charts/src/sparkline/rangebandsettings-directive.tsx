import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RangeBandSettingsModel } from '@syncfusion/ej2-charts';



export class RangeBandSettingDirective extends ComplexBase<RangeBandSettingsModel & { children?: React.ReactNode }, RangeBandSettingsModel> {
    public static moduleName: string = 'rangeBandSetting';
}

export class RangeBandSettingsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'rangeBandSettings';
    public static moduleName: string = 'rangeBandSettings';
}
