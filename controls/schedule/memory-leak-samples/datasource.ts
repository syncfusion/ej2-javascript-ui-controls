export let webinarData: Object[] = [
    {
        Id: 1,
        Subject: 'Environment Day',
        Tags: 'Eco day, Forest conserving, Earth & its resources',
        Description: 'A day that creates awareness to promote the healthy planet and reduce the air pollution crisis on nature earth.',
        StartTime: new Date(2018, 1, 12, 9, 0),
        EndTime: new Date(2018, 1, 12, 10, 0),
        ImageName: 'environment-day',
        PrimaryColor: '#1aaa55',
        SecondaryColor: '#47bb76'
    }, {
        Id: 2,
        Subject: 'Health Day',
        Tags: 'Reduce mental stress, Follow good food habits',
        Description: 'A day that raises awareness on different health issues. It marks the anniversary of the foundation of WHO.',
        StartTime: new Date(2018, 1, 13, 9, 0),
        EndTime: new Date(2018, 1, 13, 10, 0),
        ImageName: 'health-day',
        PrimaryColor: '#357cd2',
        SecondaryColor: '#5d96db'
    }, {
        Id: 3,
        Subject: 'Cancer Day',
        Tags: 'Life threatening cancer effects, Palliative care',
        Description: 'A day that raises awareness on cancer and its preventive measures. Early detection saves life.',
        StartTime: new Date(2018, 1, 14, 9, 0),
        EndTime: new Date(2018, 1, 14, 10, 0),
        ImageName: 'cancer-day',
        PrimaryColor: '#7fa900',
        SecondaryColor: '#a4c932'
    }, {
        Id: 4,
        Subject: 'Happiness Day',
        Tags: 'Stress-free, Smile, Resolve frustration and bring happiness',
        Description: 'A general idea is to promote happiness and smile around the world.',
        StartTime: new Date(2018, 1, 15, 9, 0),
        EndTime: new Date(2018, 1, 15, 10, 0),
        ImageName: 'happiness-day',
        PrimaryColor: '#ea7a57',
        SecondaryColor: '#ee9478'
    }, {
        Id: 5,
        Subject: 'Tourism Day',
        Tags: 'Diverse cultural heritage, strengthen peace',
        Description: 'A day that raises awareness on the role of tourism and its effect on social and economic values.',
        StartTime: new Date(2018, 1, 16, 9, 0),
        EndTime: new Date(2018, 1, 16, 10, 0),
        ImageName: 'tourism-day',
        PrimaryColor: '#00bdae',
        SecondaryColor: '#32cabe'
    }
];

export let scheduleData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Explosion of Betelgeuse Star',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 10, 9, 30),
        EndTime: new Date(2021, 0, 10, 11, 0),
        CategoryColor: '#1aaa55'
    }, {
        Id: 2,
        Subject: 'Thule Air Crash Report',
        Location: 'Newyork City',
        StartTime: new Date(2021, 0, 11, 12, 0),
        EndTime: new Date(2021, 0, 11, 14, 0),
        CategoryColor: '#357cd2'
    }, {
        Id: 3,
        Subject: 'Blue Moon Eclipse',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 12, 9, 30),
        EndTime: new Date(2021, 0, 12, 11, 0),
        CategoryColor: '#7fa900'
    }, {
        Id: 4,
        Subject: 'Meteor Showers in 2021',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 13, 13, 0),
        EndTime: new Date(2021, 0, 13, 14, 30),
        CategoryColor: '#ea7a57'
    }, {
        Id: 5,
        Subject: 'Milky Way as Melting pot',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 14, 12, 0),
        EndTime: new Date(2021, 0, 14, 14, 0),
        CategoryColor: '#00bdae'
    }, {
        Id: 6,
        Subject: 'Mysteries of Bermuda Triangle',
        Location: 'Bermuda',
        StartTime: new Date(2021, 0, 14, 9, 30),
        EndTime: new Date(2021, 0, 14, 11, 0),
        CategoryColor: '#f57f17'
    }, {
        Id: 7,
        Subject: 'Glaciers and Snowflakes',
        Location: 'Himalayas',
        StartTime: new Date(2021, 0, 15, 11, 0),
        EndTime: new Date(2021, 0, 15, 12, 30),
        CategoryColor: '#1aaa55'
    }, {
        Id: 8,
        Subject: 'Life on Mars',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 16, 9, 0),
        EndTime: new Date(2021, 0, 16, 10, 0),
        CategoryColor: '#357cd2'
    }, {
        Id: 9,
        Subject: 'Alien Civilization',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 18, 11, 0),
        EndTime: new Date(2021, 0, 18, 13, 0),
        CategoryColor: '#7fa900'
    }, {
        Id: 10,
        Subject: 'Wildlife Galleries',
        Location: 'Africa',
        StartTime: new Date(2021, 0, 20, 11, 0),
        EndTime: new Date(2021, 0, 20, 13, 0),
        CategoryColor: '#ea7a57'
    }, {
        Id: 11,
        Subject: 'Best Photography 2021',
        Location: 'London',
        StartTime: new Date(2021, 0, 21, 9, 30),
        EndTime: new Date(2021, 0, 21, 11, 0),
        CategoryColor: '#00bdae'
    }, {
        Id: 12,
        Subject: 'Smarter Puppies',
        Location: 'Sweden',
        StartTime: new Date(2021, 0, 8, 10, 0),
        EndTime: new Date(2021, 0, 8, 11, 30),
        CategoryColor: '#f57f17'
    }, {
        Id: 13,
        Subject: 'Myths of Andromeda Galaxy',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 6, 10, 30),
        EndTime: new Date(2021, 0, 6, 12, 30),
        CategoryColor: '#1aaa55'
    }, {
        Id: 14,
        Subject: 'Aliens vs Humans',
        Location: 'Research Centre of USA',
        StartTime: new Date(2021, 0, 5, 10, 0),
        EndTime: new Date(2021, 0, 5, 11, 30),
        CategoryColor: '#357cd2'
    }, {
        Id: 15,
        Subject: 'Facts of Humming Birds',
        Location: 'California',
        StartTime: new Date(2021, 0, 19, 9, 30),
        EndTime: new Date(2021, 0, 19, 11, 0),
        CategoryColor: '#7fa900'
    }, {
        Id: 16,
        Subject: 'Sky Gazers',
        Location: 'Alaska',
        StartTime: new Date(2021, 0, 22, 11, 0),
        EndTime: new Date(2021, 0, 22, 13, 0),
        CategoryColor: '#ea7a57'
    }, {
        Id: 17,
        Subject: 'The Cycle of Seasons',
        Location: 'Research Centre of USA',
        StartTime: new Date(2021, 0, 11, 5, 30),
        EndTime: new Date(2021, 0, 11, 7, 30),
        CategoryColor: '#00bdae'
    }, {
        Id: 18,
        Subject: 'Space Galaxies and Planets',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 11, 17, 0),
        EndTime: new Date(2021, 0, 11, 18, 30),
        CategoryColor: '#f57f17'
    }, {
        Id: 19,
        Subject: 'Lifecycle of Bumblebee',
        Location: 'San Fransisco',
        StartTime: new Date(2021, 0, 14, 6, 0),
        EndTime: new Date(2021, 0, 14, 7, 30),
        CategoryColor: '#7fa900'
    }, {
        Id: 20,
        Subject: 'Alien Civilization',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 14, 16, 0),
        EndTime: new Date(2021, 0, 14, 18, 0),
        CategoryColor: '#ea7a57'
    }, {
        Id: 21,
        Subject: 'Alien Civilization',
        Location: 'Space Centre USA',
        StartTime: new Date(2021, 0, 10, 14, 0),
        EndTime: new Date(2021, 0, 10, 16, 0),
        CategoryColor: '#ea7a57'
    }, {
        Id: 22,
        Subject: 'The Cycle of Seasons',
        Location: 'Research Centre of USA',
        StartTime: new Date(2021, 0, 12, 14, 30),
        EndTime: new Date(2021, 0, 12, 16, 0),
        CategoryColor: '#00bdae'
    }, {
        Id: 23,
        Subject: 'Sky Gazers',
        Location: 'Greenland',
        StartTime: new Date(2021, 0, 15, 14, 30),
        EndTime: new Date(2021, 0, 15, 16, 0),
        CategoryColor: '#ea7a57'
    }, {
        Id: 24,
        Subject: 'Facts of Humming Birds',
        Location: 'California',
        StartTime: new Date(2021, 0, 16, 12, 30),
        EndTime: new Date(2021, 0, 16, 14, 30),
        CategoryColor: '#7fa900'
    }
];

export let eventsData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Server Maintenance',
        StartTime: new Date(2021, 1, 11, 10, 0),
        EndTime: new Date(2021, 1, 11, 11, 30),
        EventType: 'maintenance',
        City: 'Seattle',
        CategoryColor: '#1aaa55'
    }, {
        Id: 2,
        Subject: 'Art & Painting Gallery',
        StartTime: new Date(2021, 1, 12, 12, 0),
        EndTime: new Date(2021, 1, 12, 14, 0),
        EventType: 'public-event',
        City: 'Costa Rica',
        CategoryColor: '#357cd2'
    }, {
        Id: 3,
        Subject: 'Dany Birthday Celebration',
        StartTime: new Date(2021, 1, 13, 10, 0),
        EndTime: new Date(2021, 1, 13, 11, 30),
        EventType: 'family-event',
        City: 'Kirkland',
        CategoryColor: '#7fa900'
    }, {
        Id: 4,
        Subject: 'John Wedding Anniversary',
        StartTime: new Date(2021, 1, 14, 9, 0),
        EndTime: new Date(2021, 1, 14, 10, 0),
        EventType: 'family-event',
        City: 'Redmond',
        CategoryColor: '#ea7a57'
    }, {
        Id: 5,
        Subject: 'ISA Annual Conference',
        StartTime: new Date(2021, 1, 15, 10, 0),
        EndTime: new Date(2021, 1, 15, 11, 30),
        EventType: 'commercial-event',
        City: 'USA',
        CategoryColor: '#00bdae'
    }, {
        Id: 6,
        Subject: 'Equipment Maintenance',
        StartTime: new Date(2021, 1, 16, 12, 0),
        EndTime: new Date(2021, 1, 16, 14, 0),
        EventType: 'maintenance',
        City: 'Seattle',
        CategoryColor: '#f57f17'
    }, {
        Id: 7,
        Subject: 'Aircraft Maintenance',
        StartTime: new Date(2021, 1, 17, 10, 0),
        EndTime: new Date(2021, 1, 17, 11, 30),
        EventType: 'maintenance',
        City: 'Seattle',
        CategoryColor: '#1aaa55'
    }, {
        Id: 8,
        Subject: 'Facilities Maintenance',
        StartTime: new Date(2021, 1, 19, 9, 30),
        EndTime: new Date(2021, 1, 19, 11, 0),
        EventType: 'maintenance',
        City: 'Seattle',
        CategoryColor: '#357cd2'
    }, {
        Id: 9,
        Subject: 'Britto Birthday Celebration',
        StartTime: new Date(2021, 1, 21, 11, 0),
        EndTime: new Date(2021, 1, 21, 13, 0),
        EventType: 'family-event',
        City: 'Greenland',
        CategoryColor: '#7fa900'
    }, {
        Id: 10,
        Subject: 'Justin Wedding Anniversary',
        StartTime: new Date(2021, 1, 22, 9, 30),
        EndTime: new Date(2021, 1, 22, 11, 0),
        EventType: 'family-event',
        City: 'Finland',
        CategoryColor: '#ea7a57'
    }, {
        Id: 11,
        Subject: 'AIEA Annual Meet',
        StartTime: new Date(2021, 1, 9, 10, 0),
        EndTime: new Date(2021, 1, 9, 11, 30),
        EventType: 'commercial-event',
        City: 'USA',
        CategoryColor: '#00bdae'
    }, {
        Id: 12,
        Subject: 'AAN Conference',
        StartTime: new Date(2021, 1, 7, 10, 30),
        EndTime: new Date(2021, 1, 7, 12, 30),
        EventType: 'commercial-event',
        City: 'USA',
        CategoryColor: '#f57f17'
    }, {
        Id: 13,
        Subject: 'Photography Gallery',
        StartTime: new Date(2021, 1, 5, 10, 0),
        EndTime: new Date(2021, 1, 5, 11, 30),
        EventType: 'public-event',
        City: 'Chennai',
        CategoryColor: '#1aaa55'
    }, {
        Id: 14,
        Subject: 'Beach Clean-up',
        StartTime: new Date(2021, 1, 14, 12, 0),
        EndTime: new Date(2021, 1, 14, 14, 0),
        EventType: 'public-event',
        City: 'Mumbai',
        CategoryColor: '#357cd2'
    }, {
        Id: 15,
        Subject: 'Turtle Walk',
        StartTime: new Date(2021, 1, 19, 13, 0),
        EndTime: new Date(2021, 1, 19, 14, 30),
        EventType: 'public-event',
        City: 'Costa Rica',
        CategoryColor: '#7fa900'
    }, {
        Id: 16,
        Subject: 'Silent Walk for Cancer day',
        StartTime: new Date(2021, 1, 22, 13, 0),
        EndTime: new Date(2021, 1, 22, 14, 30),
        EventType: 'public-event',
        City: 'Chennai',
        CategoryColor: '#ea7a57'
    }, {
        Id: 17,
        Subject: 'Beach Clean-up',
        StartTime: new Date(2021, 1, 13, 14, 0),
        EndTime: new Date(2021, 1, 13, 16, 0),
        EventType: 'public-event',
        City: 'Mumbai',
        CategoryColor: '#357cd2'
    }, {
        Id: 18,
        Subject: 'Photography Gallery',
        StartTime: new Date(2021, 1, 15, 14, 0),
        EndTime: new Date(2021, 1, 15, 16, 0),
        EventType: 'public-event',
        City: 'Chennai',
        CategoryColor: '#1aaa55'
    }
];
