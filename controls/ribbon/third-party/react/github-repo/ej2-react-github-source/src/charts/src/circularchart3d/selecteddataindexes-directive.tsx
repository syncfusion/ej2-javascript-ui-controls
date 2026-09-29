import { ComplexBase } from '@syncfusion/ej2-react-base';
import { IndexesModel } from '@syncfusion/ej2-charts';



export class CircularChart3DSelectedDataIndexDirective extends ComplexBase<IndexesModel & { children?: React.ReactNode }, IndexesModel> {
    public static moduleName: string = 'circularChart3DSelectedDataIndex';
}

export class CircularChart3DSelectedDataIndexesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'selectedDataIndexes';
    public static moduleName: string = 'circularChart3DSelectedDataIndexes';
}
