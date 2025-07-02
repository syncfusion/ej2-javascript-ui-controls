import { Carousel } from '../../src/carousel/index';

let carouselObj: Carousel;

document.getElementById('render').addEventListener('click', renderCarousel);
document.getElementById('destroy').addEventListener('click', destoryCarousel);

function renderCarousel(): void {
    carouselObj = new Carousel({
        items: [
            { template: '<figure class="img-container"><img src="images/bird.jpg" alt="bird" style="height:100%;width:100%;" /><figcaption class="img-caption">Showing 1 of 5</figcaption></figure>' },
            { template: '<figure class="img-container"><img src="images/nature.jpg" alt="nature" style="height:100%;width:100%;" /><figcaption class="img-caption">Showing 2 of 5</figcaption></figure>' },
            { template: '<figure class="img-container"><img src="images/night-view.jpg" alt="night-view" style="height:100%;width:100%;" /><figcaption class="img-caption">Showing 3 of 5</figcaption></figure>' },
            { template: '<figure class="img-container"><img src="images/sea-view.jpg" alt="sea-view" style="height:100%;width:100%;" /><figcaption class="img-caption">Showing 4 of 5</figcaption></figure>' },
            { template: '<figure class="img-container"><img src="images/snowfall.jpg" alt="snowfall" style="height:100%;width:100%;" /><figcaption class="img-caption">Showing 5 of 5</figcaption></figure>' }
        ],
        loop: true,
        autoPlay: true
    });
    carouselObj.appendTo(document.getElementById('carousel'));
}

function destoryCarousel(): void {
    if (carouselObj) {
        carouselObj.destroy();
        carouselObj = null;
    }
}
