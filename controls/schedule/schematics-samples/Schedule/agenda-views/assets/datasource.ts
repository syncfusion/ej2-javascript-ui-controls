export function generateObject(start: number = new Date(2017, 6, 1).getTime(), end: number = new Date(2018, 6, 31).getTime()): Object[] {
    let data: Object[] = [];
    let names: string[] = [
        'Story Time for Kids', 'Camping with Turtles', 'Wildlife Warriors', 'Parrot Talk', 'Birds of Prey', 'Croco World',
        'Venomous Snake Hunt', 'Face Painting & Drawing events', 'Pony Rides', 'Feed the Giants', 'Jungle Treasure Hunt',
        'Endangered Species Program', 'Black Cockatoos Playtime', 'Walk with Jungle King', 'Trained Climbers', 'Playtime with Chimpanzees',
        'Meet a small Mammal', 'Amazon Fish Feeding', 'Elephant Ride'
    ];
    let dayCount: number = 1000 * 60 * 60;
    for (let a: number = start, id: number = 1; a < end; a += (dayCount * 24) * 2) {
        let count: number = Math.floor((Math.random() * 9) + 1);
        for (let b: number = 0; b < count; b++) {
            let hour: number = Math.floor(Math.random() * 100) % 24;
            let minutes: number = Math.round((Math.floor(Math.random() * 100) % 60) / 5) * 5;
            let nCount: number = Math.floor(Math.random() * names.length);
            let startDate: Date = new Date(new Date(a).setHours(hour, minutes));
            let endDate: Date = new Date(startDate.getTime() + (dayCount * 2.5));
            data.push({
                Id: id,
                Subject: names[nCount],
                StartTime: startDate,
                EndTime: endDate,
                IsAllDay: (id % 10) ? false : true
            });
            id++;
        }
    }
    return data;
}