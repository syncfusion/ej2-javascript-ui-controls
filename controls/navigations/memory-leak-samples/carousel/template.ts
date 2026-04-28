import { Carousel, SlideChangedEventArgs } from '../../src/carousel/index';
import { removeClass, addClass } from '@syncfusion/ej2-base';

document.getElementById('render').addEventListener('click', renderCarousel);
document.getElementById('destroy').addEventListener('click', destoryCarousel);

let carouselObj: Carousel;

function renderCarousel(): void {
    carouselObj = new Carousel({
        items: [
            { template: '#itemTemplate' },
            { template: '<img src="images/nature.jpg" alt="image" style="height:100%;width:100%;" />' },
            { template: '<img src="images/night-view.jpg" alt="image" style="height:100%;width:100%;" />' },
            { template: '<img src="images/sea-view.jpg" alt="image" style="height:100%;width:100%;" />' },
            { template: '<img src="images/snowfall.jpg" alt="image" style="height:100%;width:100%;" />' }
        ],
        showPlayButton: true,
        selectedIndex: 2,
        showIndicators: true,
        previousButtonTemplate: '#arrowsTemplate',
        nextButtonTemplate: '#arrowsTemplate',
        indicatorsTemplate: '#indicatorTemplate',
        playButtonTemplate: '#playButtonTemplate',
        slideChanged: (args: SlideChangedEventArgs) => {
            const indicators: Element = carouselObj.element.querySelector('.e-carousel-indicators');
            removeClass(indicators.querySelectorAll('.indicator'), 'active');
            addClass([indicators.querySelector('[indicator-index="' + args.currentIndex + '"]')], 'active');
        }
    });
    carouselObj.appendTo(document.getElementById('carousel'));
}

function destoryCarousel(): void {
    if (carouselObj) {
        carouselObj.destroy();
        carouselObj = null;
    }
}
