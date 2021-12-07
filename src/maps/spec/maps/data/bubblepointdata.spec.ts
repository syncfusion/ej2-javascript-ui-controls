/**
 * Countries population
 */
/* eslint-disable */
export let data: any = [
    { 'name': 'Oroville', 'value': bubblesize(32358260), 'color': '#7F38A0 ' },
	 { 'name': 'Malpur', 'value': bubblesize(32358260), 'color': 'red' },
      { 'name': 'San Luis Obispo', 'value': bubblesize(32358260), 'color': 'green' }
];
function bubblesize(value: number): number  {
    let max: number = 1347565324;
    let min: number = 324366;
    let maxBox: number = 70 * 70 * 2 * Math.PI;
    let minBox: number = 3 * 3 * 2 * Math.PI;
    let box: number = (value - min) / (max - min) * (maxBox - minBox) + minBox;
    if (box < minBox) {
        box = minBox;
    }
    return Math.sqrt(box / (Math.PI * 2)) / 2;
}
    