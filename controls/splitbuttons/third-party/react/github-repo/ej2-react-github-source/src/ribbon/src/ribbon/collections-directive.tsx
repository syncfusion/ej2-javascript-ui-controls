import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RibbonCollectionModel } from '@syncfusion/ej2-ribbon';



export class RibbonCollectionDirective extends ComplexBase<RibbonCollectionModel & { children?: React.ReactNode }, RibbonCollectionModel> {
    public static moduleName: string = 'ribbonCollection';
}

export class RibbonCollectionsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'collections';
    public static moduleName: string = 'ribbonCollections';
}
