import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ChartModel } from '@syncfusion/ej2-spreadsheet';



export class ChartDirective extends ComplexBase<ChartModel & { children?: React.ReactNode }, ChartModel> {
    public static moduleName: string = 'chart';
}

export class ChartsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'chart';
    public static moduleName: string = 'charts';
}
