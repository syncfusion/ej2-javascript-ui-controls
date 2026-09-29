import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RichTextModel } from '@syncfusion/ej2-spreadsheet';



export class RichTextDirective extends ComplexBase<RichTextModel & { children?: React.ReactNode }, RichTextModel> {
    public static moduleName: string = 'richText';
}

export class RichTextsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'richText';
    public static moduleName: string = 'richTexts';
}
