import { ComplexBase } from '@syncfusion/ej2-react-base';
import { SmithchartSeriesModel } from '@syncfusion/ej2-charts';



export class SmithchartSeriesDirective extends ComplexBase<SmithchartSeriesModel & { children?: React.ReactNode }, SmithchartSeriesModel> {
    public static moduleName: string = 'smithchartSeries';
}

export class SmithchartSeriesCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'series';
    public static moduleName: string = 'smithchartSeriesCollection';
}
