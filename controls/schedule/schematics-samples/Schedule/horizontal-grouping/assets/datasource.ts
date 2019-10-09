
export function generateEvents(): Object[] {
        let subjectCollection: string[] = ['Barcelona to Los Angeles', 'Los Angeles to Barcelona'];
        let collections: Object[] = [];
        let dataCollections: number[] = [1, 2, 3];
        let id: number = 1;
        for (let data of dataCollections) {
            let startDate: Date = new Date(2018, 3, 1);
            startDate.setMilliseconds(1000 * 60 * 60 * .5 * (data - 1));
            let lastDate: Date = new Date((+startDate) + (1000 * 60 * 60 * 24 * 30));
            for (let date: Date = startDate; date.getTime() < lastDate.getTime(); date = new Date(date.getTime() + (1000 * 60 * 60 * 5))) {
                let strDate: Date = new Date(+date);
                let endDate: Date = new Date((+strDate) + (1000 * 60 * 60 * (2.5 + (0.5 * data))));
                collections.push({
                    Id: id,
                    Subject: subjectCollection[id % 2],
                    StartTime: new Date(+strDate),
                    EndTime: new Date(+endDate),
                    AirlineId: data
                });
                id += 1;
            }
        }
        return collections;
    }