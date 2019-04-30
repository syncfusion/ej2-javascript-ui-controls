import { Sortable } from '../../../src/sortable/index';
import { createElement } from '@syncfusion/ej2-base';

/**
 * Sortable event sample
 */
new Sortable(document.getElementById('event'), {
    placeHolder: (): HTMLElement => {
        return createElement('div', { className: 'e-place-holder e-item' });
    },
    dragStart: (e: any): void => {
        console.log('DragStart event:');
        console.log('Event:');
        console.log(e.event);
        console.log('Element:');
        console.log(e.element);
        console.log('Target:');
        console.log(e.target);
    },
    drag: (e: any): void => {
        console.log('Drag event:');
        console.log('Event:');
        console.log(e.event);
        console.log('Element:');
        console.log(e.element);
        console.log('Target:');
        console.log(e.target);
    },
    drop: (e: any): void => {
        console.log('Drop event:');
        console.log('Event:');
        console.log(e.event);
        console.log('Element:');
        console.log(e.element);
        console.log('Target:');
        console.log(e.target);
        console.log('PreviousIndex:');
        console.log(e.previousIndex);
        console.log('CurrentIndex:');
        console.log(e.currentIndex);
        console.log('DroppedElement:');
        console.log(e.droppedElement);
        console.log('Helper:');
        console.log(e.helper);
    }
});
