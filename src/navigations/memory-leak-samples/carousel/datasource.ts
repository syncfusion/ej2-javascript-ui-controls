import { Carousel } from '../../src/carousel/index';

let carouselObj: Carousel;
document.getElementById('render').addEventListener('click', renderCarousel);
document.getElementById('destroy').addEventListener('click', destoryCarousel);
const carouselItems: Record<string, string | number>[] = [
    {
        ID: 1,
        Title: 'Birds',
        Content: 'Birds are a group of warm-blooded vertebrates constituting the class Aves, characterized by feathers, toothless beaked jaws, the laying of hard-shelled eggs, a high metabolic rate, a four-chambered heart, and a strong yet lightweight skeleton. Birds live worldwide and range in size from the 5.5 cm (2.2 in) bee hummingbird to the 2.8 m (9 ft 2 in) ostrich. There are about ten thousand living species, more than half of which are passerine, or "perching" birds.',
        ImgPath: 'images/bird.jpg'
    }, {
        ID: 2,
        Title: 'Nature',
        Content: 'Nature, in the broadest sense, is the natural, physical, material world or universe. "Nature" can refer to the phenomena of the physical world, and also to life in general. The study of nature is a large, if not the only, part of science. Although humans are part of nature, human activity is often understood as a separate category from other natural phenomena.',
        ImgPath: 'images/nature.jpg'
    }, {
        ID: 3,
        Title: 'Twin Towers',
        Content: 'The Twin Towers Correctional Facility, also referred to in the media as Twin Towers Jail, is a complex in Los Angeles, California.[1] The facility is located at 450 Bauchet Street, in Los Angeles, California and is operated by the Los Angeles County Sheriffs Department. The facility consists of two towers, a medical services building, and the Los Angeles County Medical Center Jail Ward.',
        ImgPath: 'images/night-view.jpg'
    }, {
        ID: 4,
        Title: 'Sea View',
        Content: 'The sea, connected as the world ocean or simply the ocean, is the body of salty water that covers approximately 71 percent of the Earth surface. The word sea is also used to denote second-order sections of the sea, such as the Mediterranean Sea, as well as certain large, entirely landlocked, saltwater lakes, such as the Caspian Sea.',
        ImgPath: 'images/sea-view.jpg'
    }, {
        ID: 5,
        Title: 'Snowfall',
        Content: 'Snow comprises individual ice crystals that grow while suspended in the atmosphere—usually within clouds—and then fall, accumulating on the ground where they undergo further changes.[2] It consists of frozen crystalline water throughout its life cycle, starting when, under suitable conditions, the ice crystals form in the atmosphere, increase to millimeter size, precipitate and accumulate on surfaces, then metamorphose in place, and ultimately melt, slide or sublimate away.',
        ImgPath: 'images/snowfall.jpg'
    }
];

function renderCarousel(): void {
    carouselObj = new Carousel({
        dataSource: carouselItems,
        itemTemplate: '#itemTemplate',
        showPlayButton: false
    });
    carouselObj.appendTo(document.getElementById('carousel'));
}

function destoryCarousel(): void {
    if (carouselObj) {
        carouselObj.destroy();
        carouselObj = null;
    }
}
