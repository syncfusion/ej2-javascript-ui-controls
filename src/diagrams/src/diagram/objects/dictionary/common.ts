import { PortShapes, DecoratorShapes } from '../../enum/enum';
import { DecoratorModel } from '../connector-model';
import { IconShapeModel } from '../icon-model';

/**
 * ShapeDictionary defines the shape of the default nodes and ports
 */
/** @private */
export function getPortShape(shape: PortShapes): string {
    return portShapes[shape.toString()];
}
/** @private */
export function getDecoratorShape(shape: DecoratorShapes, decorator: DecoratorModel): string {
    if (shape === 'Custom') {
        return decorator.pathData;
    }
    return decoratorShapes[shape];
}

/**
 * @private
 * @param icon 
 * sets the path data for different icon shapes
 */
export function getIconShape(icon: IconShapeModel): string {
    let data: string;
    switch (icon.shape) {
        case 'Minus':
            data = 'M0,50 L100,50';
            break;
        case 'Plus':
            data = 'M0,-50 L0,50 M-50,0 L50,0';
            break;
        case 'ArrowUp':
            data = 'M0,100 L50,0 L100,100 Z';
            break;
        case 'ArrowDown':
            data = 'M0,0 L50,100 L100,0 Z';
            break;
        case 'Path':
            data = icon.pathData;
            break;
    }
    return data;
}

let portShapes: {} = {
    'X': 'M14,14 L106,106 M106,14 L14,106',
    'Circle': 'M0,50 A50,50,0 1 1 100,50 A50,50,0 1 1 0,50 Z',
    'Square': 'M0,0 L10,0 L10,10 L0,10 z',
};

let decoratorShapes: {} = {
    'OpenArrow': 'M15.9,23 L5,16 L15.9,9 L17,10.7 L8.7,16 L17,21.3Z',
    'Square': 'M0,0 L10,0 L10,10 L0,10 z',
    'Fletch': 'M14.8,10c0,0-3.5,6,0.2,12c0,0-2.5-6-10.9-6C4.1,16,11.3,16,14.8,10z',
    'OpenFetch': 'M6,17c-0.6,0-1-0.4-1-1s0.4-1,1-1c10.9,0,11-5,11-5' +
        'c0-0.6,0.4-1,1-1s1,0.4,1,1C19,10.3,18.9,17,6,17C6,17,6,17,6,17z ' +
        'M18,23c-0.5,0-1-0.4-1-1c0-0.2-0.3-5-11-5c-0.6,0-1-0.5-1-1s0.4-1,1-1c0,0,0,0,0,0' +
        'c12.9,0,13,6.7,13,7    C19,22.6,18.6,23,18,23z',
    'IndentedArrow': 'M17,10c0,0-4.5,5.5,0,12L5,16L17,10z',
    'OutdentedArrow': 'M14.6,10c0,0,5.4,6,0,12L5,16L14.6,10z',
    'DoubleArrow': 'M19,10 L19,22 L13,16Z M12,10 L12,22 L6,16Z',
    'Arrow': 'M15,10 L15,22 L5,16Z',
    'Diamond': 'M12,23l-7-7l7-7l6.9,7L12,23z',
    'Circle': 'M0,50 A50,50,0 1 1 100,50 A50,50,0 1 1 0,50 Z'
};
