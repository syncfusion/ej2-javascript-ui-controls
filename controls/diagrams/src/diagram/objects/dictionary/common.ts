/* eslint-disable @typescript-eslint/ban-types */
import { PortShapes, DecoratorShapes, SegmentThumbShapes } from '../../enum/enum';
import { DecoratorModel } from '../connector-model';
import { IconShapeModel } from '../icon-model';


/**
 *ShapeDictionary defines the shape of the default nodes and ports \
 *
 * @returns { string }     ShapeDictionary defines the shape of the default nodes and ports.\
 * @param {PortShapes} shape - provide the element value.
 *
 * @private
 */
export function getPortShape(shape: PortShapes): string {
    return portShapes[shape.toString()];
}
/**
 *ShapeDictionary defines the shape of the default nodes and ports \
 *
 * @returns { string }     ShapeDictionary defines the shape of the default nodes and ports.\
 * @param {DecoratorShapes} shape - provide the element value.
 * @param {DecoratorModel} decorator - provide the element value.
 
 *
 * @private
 */
export function getDecoratorShape(shape: DecoratorShapes, decorator: DecoratorModel): string {
    if (shape === 'Custom') {
        return decorator.pathData;
    }
    return decoratorShapes[shape];
}

export function getSegmentThumbShapeHorizontal(shapes : SegmentThumbShapes)
    {
    return segmentThumbShapeHorizontal[shapes];
    }
export function getSegmentThumbShapeVertical(shapes :SegmentThumbShapes)
    {
    return segmentThumbShapeVertical[shapes];
    }

/**
 *sets the path data for different icon shapes \
 *
 * @returns { string }     sets the path data for different icon shapes\
 * @param {IconShapeModel} icon - provide the element value.
 *
 * @private
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


// eslint-disable-next-line prefer-const
let portShapes: {} = {
    'X': 'M14,14 L106,106 M106,14 L14,106',
    'Circle': 'M0,50 A50,50,0 1 1 100,50 A50,50,0 1 1 0,50 Z',
    'Square': 'M0,0 L10,0 L10,10 L0,10 z'
};

// eslint-disable-next-line prefer-const
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
let segmentThumbShapeHorizontal:{}={

    'Square': 'M0,0 L10,0 L10,10 L0,10 z',
    'Rhombus' : 'M10,5 L5,10 L0,5 L5,0 L10,5 Z ',
    'Rectangle' : 'M0,0 L15,0 L15,10 L0,10 z ',
    'OpenArrow': 'M15.9,23 L5,16 L15.9,9 L17,10.7 L8.7,16 L17,21.3Z',
    'Fletch': 'M9.82,0 C9.82,0,6.61,5,10,10 C10,10,7.71,5,0,5 C0,5,6.61,5,9.82,0 Z ',
    'OpenFetch': 'M0.71,5.71 C0.29,5.71,0,5.43,0,5 C0,4.57,0.29,4.29,0.71,4.29 C8.5,4.29,8.57,0.71,8.57,0.71 C8.57,0.29,8.86,0,9.29,0 C9.719999999999999,0,10,0.29,10,0.71 C10,0.93,9.93,5.71,0.71,5.71 C0.71,5.71,0.71,5.71,0.71,5.71 Z M9.29,10 C8.93,10,8.57,9.71,8.57,9.29 C8.57,9.14,8.36,5.71,0.71,5.71 C0.29,5.71,0,5.36,0,5 C0,4.64,0.29,4.29,0.71,4.29 C0.71,4.29,0.71,4.29,0.71,4.29 C9.93,4.29,10,9.07,10,9.29 C10,9.71,9.71,10,9.29,10 Z ',
    'IndentedArrow': 'M10,0 C10,0,6.25,4.58,10,10 L0,5 L10,0 Z ',
    'OutdentedArrow': 'M8,0 C8,0,12.5,5,8,10 L0,5 L8,0 Z ',
    'DoubleArrow': 'M19,10 L19,22 L13,16Z M12,10 L12,22 L6,16Z',
    'Arrow': 'M15,10 L15,22 L5,16Z',
    'Diamond':  'M10,5 L5,10 L0,5 L5,0 L10,5 Z  ',
    'Circle': 'M10,5 C10,7.76,7.76,10,5,10 C2.24,10,0,7.76,0,5 C0,2.24,2.24,0,5,0 C7.76,0,10,2.24,10,5 Z ',
    'Ellipse':'M15,5 C15,7.76,11.64,10,7.5,10 C3.36,10,0,7.76,0,5 C0,2.24,3.36,0,7.5,0 C11.64,0,15,2.24,15,5 Z  '
};
let segmentThumbShapeVertical:{}={
    'Square': 'M0,0 L10,0 L10,10 L0,10 z',
    'Rhombus': 'M10,5 L5,10 L0,5 L5,0 L10,5 Z ',
    'Rectangle': 'M0,0 L15,0 L15,10 L0,10 z',
    'OpenArrow': 'M23,15.9 L16,5 L9,15.9 L10.7,17 L16,8.7 L21,17.3Z',
    'Fletch': 'M9.82,0 C9.82,0,6.61,5,10,10 C10,10,7.71,5,0,5 C0,5,6.61,5,9.82,0 Z ',
    'OpenFetch': 'M0.71,5.71 C0.29,5.71,0,5.43,0,5 C0,4.57,0.29,4.29,0.71,4.29 C8.5,4.29,8.57,0.71,8.57,0.71 C8.57,0.29,8.86,0,9.29,0 C9.719999999999999,0,10,0.29,10,0.71 C10,0.93,9.93,5.71,0.71,5.71 C0.71,5.71,0.71,5.71,0.71,5.71 Z M9.29,10 C8.93,10,8.57,9.71,8.57,9.29 C8.57,9.14,8.36,5.71,0.71,5.71 C0.29,5.71,0,5.36,0,5 C0,4.64,0.29,4.29,0.71,4.29 C0.71,4.29,0.71,4.29,0.71,4.29 C9.93,4.29,10,9.07,10,9.29 C10,9.71,9.71,10,9.29,10 Z ',
    'IndentedArrow': 'M10,0 C10,0,6.25,4.58,10,10 L0,5 L10,0 Z ',
    'OutdentedArrow': 'M8,0 C8,0,12.5,5,8,10 L0,5 L8,0 Z ',
    'DoubleArrow': 'M10,19 L22,19 L16,13Z M10,12 L22,12 L16,6Z',
    'Arrow': 'M10,15 L22,15 L16,5Z',
    'Diamond': 'M10,5 L5,10 L0,5 L5,0 L10,5 Z ' ,
    'Circle': 'M10,5 C10,7.76,7.76,10,5,10 C2.24,10,0,7.76,0,5 C0,2.24,2.24,0,5,0 C7.76,0,10,2.24,10,5 Z ',
    'Ellipse':'M15,5 C15,7.76,11.64,10,7.5,10 C3.36,10,0,7.76,0,5 C0,2.24,3.36,0,7.5,0 C11.64,0,15,2.24,15,5 Z   '
};
