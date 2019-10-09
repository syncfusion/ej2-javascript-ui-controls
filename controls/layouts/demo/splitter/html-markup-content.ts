import { Splitter } from '../../src/splitter/splitter';

let splitObj: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '30%', content: "<div class='content'><h3 class='h3'>PARIS </h3>Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism...</div>" },
        { size: '40%', content: "<div class='content'><h3 class='h3'>CAMEMBERT </h3>The village in the Orne département of Normandy where the famous French cheese is originated from.</div>" },
        { size: '30%', content: "<div class='content'><h3 class='h3'>GRENOBLE </h3>The capital city of the French Alps and a major scientific center surrounded by many ski resorts, host of the Winter Olympics in 1968.</div>" }
    ],
    width: '100%'
});
splitObj.appendTo('#splitter');