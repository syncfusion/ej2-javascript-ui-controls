import { ComplexBase } from '@syncfusion/ej2-react-base';
import { CarouselItemModel } from '@syncfusion/ej2-navigations';

export interface CarouselItemDirTypecast {
    template?: string | Function | any;
}
/**
 * `CarouselItemDirective` represent a item of the React Carousel. 
 * It must be contained in a Carousel component(`CarouselComponent`). 
 * ```tsx
 * <CarouselComponent> 
 *   <CarouselItemsDirective>
 *    <CarouselItemDirective template='#item1'></CarouselItemDirective>
 *    <CarouselItemDirective template='#item2'></CarouselItemDirective>
 *   </CarouselItemsDirective>
 * </CarouselComponent>
 * ```
 */
export class CarouselItemDirective extends ComplexBase<CarouselItemModel| CarouselItemDirTypecast & { children?: React.ReactNode }, CarouselItemModel| CarouselItemDirTypecast> {
    public static moduleName: string = 'carouselItem';
}

export class CarouselItemsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'items';
    public static moduleName: string = 'carouselItems';
}
