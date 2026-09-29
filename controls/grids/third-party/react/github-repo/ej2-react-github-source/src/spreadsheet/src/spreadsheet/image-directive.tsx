import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ImageModel } from '@syncfusion/ej2-spreadsheet';



export class ImageDirective extends ComplexBase<ImageModel & { children?: React.ReactNode }, ImageModel> {
    public static moduleName: string = 'image';
}

export class ImagesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'image';
    public static moduleName: string = 'images';
}
