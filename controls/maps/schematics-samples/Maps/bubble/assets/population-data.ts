//tslint:disable
export let internetUsers: any = [
    { 'rank': 1, 'name': 'China', 'value': bubblesize(746662194), 'color': '#7F38A0', 'population': 746662194},
    { 'rank': 2, 'name': 'India', 'value': bubblesize(391292635), 'color': '#7F38A0 ', 'population': 391292635 },
    { 'rank': 3, 'name': 'United States', 'value': bubblesize(245436423), 'color': '#99295D ','population': 245436423 },
    { 'rank': 4, 'name': 'Brazil', 'value': bubblesize(123927230), 'color': '#364A98','population': 123927230 },
    { 'rank': 5, 'name': 'Japan', 'value': bubblesize(117528631), 'color': '#7F38A0 ','population': 117528631 },
    { 'rank': 6, 'name': 'Russia', 'value': bubblesize(110003284), 'color': '#2E769F','population': 110003284 },
    { 'rank': 7, 'name': 'Mexico', 'value': bubblesize(75937568), 'color': '#99295D ','population': 75937568 },
    { 'rank': 8, 'name': 'Germany', 'value': bubblesize(73436503), 'color': '#2E769F', 'population': 73436503 },
    { 'rank': 9, 'name': 'Indonesia', 'value': bubblesize(66244991), 'color': '#7F38A0 ', 'population': 66244991 },
    { 'rank': 10, 'name': 'United Kingdom', 'value': bubblesize(62354410), 'color': '#2E769F', 'population': 62354410 },
    { 'rank': 11, 'name': 'Philippines', 'value': bubblesize(57342723), 'color': '#7F38A0 ', 'population': 57342723 },
    { 'rank': 12, 'name': 'France', 'value': bubblesize(55413854), 'color': '#2E769F', 'population': 55413854 },
    { 'rank': 13, 'name': 'Nigeria', 'value': bubblesize(47743541), 'color': '#816F28', 'population': 47743541 },
    { 'rank': 14, 'name': 'South Africa', 'value': bubblesize(47094267), 'color': '#816F28', 'population': 47094267 },
    { 'rank': 15, 'name': 'Turkey', 'value': bubblesize(46395500), 'color': '#2E769F', 'population': 46395500 },
    { 'rank': 16, 'name': 'Vietnam', 'value': bubblesize(43974618), 'color': '#7F38A0 ', 'population': 43974618 },
    { 'rank': 17, 'name': 'Iran', 'value': bubblesize(42731675), 'color': '#7F38A0 ', 'population': 42731675 },
    { 'rank': 18, 'name': 'Egypt', 'value': bubblesize(37519531), 'color': '#816F28', 'population': 37519531 },
    { 'rank': 19, 'name': 'Spain', 'value': bubblesize(37337607), 'color': '#2E769F', 'population': 37337607 },
    { 'rank': 20, 'name': 'Italy', 'value': bubblesize(36442438), 'color': '#2E769F', 'population': 36442438 },
    { 'rank': 21, 'name': 'Thailand', 'value': bubblesize(32710169), 'color': '#7F38A0 ', 'population': 32710169 },
    { 'rank': 22, 'name': 'Canada', 'value': bubblesize(32602776), 'color': '#99295D ', 'population': 32602776 },
    { 'rank': 23, 'name': 'Argentina', 'value': bubblesize(30758972), 'color': '#364A98', 'population': 30758972 },
    { 'rank': 24, 'name': 'South Africa', 'value': bubblesize(30248355), 'color': '#816F28', 'population': 30248355 },
    { 'rank': 25, 'name': 'Pakistan', 'value': bubblesize(29965859), 'color': '#7F38A0 ', 'population': 29965859 },
    { 'rank': 26, 'name': 'Bangladesh', 'value': bubblesize(29738660), 'color': '#7F38A0 ', 'population': 29738660 },
    { 'rank': 27, 'name': 'Colombia', 'value': bubblesize(28287098), 'color': '#364A98', 'population': 28287098 },
    { 'rank': 28, 'name': 'Poland', 'value': bubblesize(28018492), 'color': '#2E769F', 'population': 28018492 },
    { 'rank': 29, 'name': 'Malaysia', 'value': bubblesize(24572446), 'color': '#7F38A0 ', 'population': 24572446 },
    { 'rank': 30, 'name': 'Saudi Arabia', 'value': bubblesize(23803319), 'color': '#7F38A0 ', 'population': 23803319 },

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
    