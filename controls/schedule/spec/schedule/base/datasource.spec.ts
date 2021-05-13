/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataManager, Query } from '@syncfusion/ej2-data';
import { extend } from '@syncfusion/ej2-base';
import { CallbackFunction } from '../../../src/schedule/base/interface';

/**
 * Schedule datasource spec
 */

export const defaultData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Paris',
        StartTime: new Date(2017, 9, 29, 10, 0),
        EndTime: new Date(2017, 9, 29, 11, 30),
        IsAllDay: false
    }, {
        Id: 2,
        Subject: 'Meeting - 1',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 12, 30),
        IsAllDay: false
    }, {
        Id: 3,
        Subject: 'Meeting - 2',
        StartTime: new Date(2017, 9, 30, 11, 0),
        EndTime: new Date(2017, 9, 30, 14, 30),
        IsAllDay: false
    }, {
        Id: 4,
        StartTime: new Date(2017, 9, 31),
        EndTime: new Date(2017, 10, 1),
        IsAllDay: true
    }, {
        Id: 5,
        Subject: 'Conference - 2',
        StartTime: new Date(2017, 9, 31, 22, 0),
        EndTime: new Date(2017, 10, 1, 0, 0),
        IsAllDay: false
    }, {
        Id: 6,
        Subject: 'Conference - 3',
        StartTime: new Date(2017, 10, 1, 9, 30),
        EndTime: new Date(2017, 10, 1, 11, 45),
        IsAllDay: false
    }, {
        Id: 7,
        Subject: 'Conference - 4',
        StartTime: new Date(2017, 10, 1, 10, 30),
        EndTime: new Date(2017, 10, 1, 12, 45),
        IsAllDay: false
    }, {
        Id: 8,
        Subject: 'Travelling',
        StartTime: new Date(2017, 10, 1, 11, 30),
        EndTime: new Date(2017, 10, 1, 13, 45),
        IsAllDay: false
    }, {
        Id: 9,
        Subject: 'Vacation',
        StartTime: new Date(2017, 10, 2, 10, 0),
        EndTime: new Date(2017, 10, 2, 12, 30),
        IsAllDay: false
    }, {
        Id: 10,
        Subject: 'Conference',
        StartTime: new Date(2017, 10, 2, 15, 30),
        EndTime: new Date(2017, 10, 2, 18, 45),
        IsAllDay: false
    }, {
        Id: 11,
        Subject: 'Vacation',
        StartTime: new Date(2017, 10, 3, 10, 15),
        EndTime: new Date(2017, 10, 3, 14, 45),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
        IsAllDay: false
    }, {
        Id: 12,
        Subject: 'Conference',
        StartTime: new Date(2017, 10, 4, 9, 30),
        EndTime: new Date(2017, 10, 5, 5, 45),
        IsAllDay: false
    }, {
        Id: 13,
        StartTime: new Date(2017, 10, 5, 10, 0),
        EndTime: new Date(2017, 10, 5, 11, 30),
        IsAllDay: false
    }, {
        Id: 14,
        Subject: 'Same Time',
        StartTime: new Date(2017, 10, 5, 10, 0),
        EndTime: new Date(2017, 10, 5, 11, 30),
        IsAllDay: false
    }, {
        Id: 15,
        Subject: 'Same Time',
        StartTime: new Date(2017, 10, 5, 10, 0),
        EndTime: new Date(2017, 10, 5, 11, 30),
        IsAllDay: false
    }, {
        Id: 16,
        Subject: 'Same Time',
        StartTime: new Date(2017, 10, 5, 10, 0),
        EndTime: new Date(2017, 10, 5, 11, 30),
        IsAllDay: false
    }, {
        Id: 17,
        Subject: 'Same Time',
        StartTime: new Date(2017, 10, 5, 10, 0),
        EndTime: new Date(2017, 10, 5, 11, 30),
        IsAllDay: false
    }, {
        Id: 18,
        Subject: 'Same Time',
        StartTime: new Date(2017, 10, 5, 10, 0),
        EndTime: new Date(2017, 10, 5, 11, 30),
        IsAllDay: false
    }, {
        Id: 19,
        Subject: 'Meeting - 1',
        StartTime: new Date(2017, 10, 6),
        EndTime: new Date(2017, 10, 7),
        IsAllDay: true
    }, {
        Id: 20,
        Subject: 'Meeting - 2',
        StartTime: new Date(2017, 10, 6, 11, 0),
        EndTime: new Date(2017, 10, 6, 14, 30),
        IsAllDay: false
    }, {
        Id: 21,
        Subject: 'Conference - 1',
        StartTime: new Date(2017, 10, 7, 22, 0),
        EndTime: new Date(2017, 10, 8, 20, 0),
        IsAllDay: true
    }, {
        Id: 22,
        Subject: 'Conference - 2',
        StartTime: new Date(2017, 10, 7, 22, 0),
        EndTime: new Date(2017, 10, 14, 23, 0),
        IsAllDay: false
    }, {
        Id: 23,
        Subject: 'Conference - 3',
        StartTime: new Date(2017, 10, 8, 9, 30),
        EndTime: new Date(2017, 10, 9, 11, 45),
        IsAllDay: true
    }, {
        Id: 24,
        Subject: 'Conference - 3 - A',
        StartTime: new Date(2017, 10, 8, 9, 30),
        EndTime: new Date(2017, 10, 8, 10, 0),
        IsAllDay: true
    }, {
        Id: 25,
        Subject: 'Conference - 3 - B',
        StartTime: new Date(2017, 10, 8, 10, 0),
        EndTime: new Date(2017, 10, 8, 10, 30),
        IsAllDay: false
    }, {
        Id: 26,
        Subject: 'Conference - 4',
        StartTime: new Date(2017, 10, 8, 10, 30),
        EndTime: new Date(2017, 10, 8, 12, 45),
        IsAllDay: false
    }, {
        Id: 27,
        Subject: 'Travelling',
        StartTime: new Date(2017, 10, 8, 11, 30),
        EndTime: new Date(2017, 10, 8, 13, 45),
        IsAllDay: false
    }, {
        Id: 28,
        Subject: 'Vacation',
        StartTime: new Date(2017, 10, 9, 10, 0),
        EndTime: new Date(2017, 10, 9, 12, 30),
        IsAllDay: false
    }, {
        Id: 29,
        Subject: 'Conference',
        StartTime: new Date(2017, 10, 9, 15, 30),
        EndTime: new Date(2017, 10, 9, 18, 45),
        IsAllDay: false
    }, {
        Id: 30,
        Subject: 'Vacation',
        StartTime: new Date(2017, 10, 10, 10, 15),
        EndTime: new Date(2017, 10, 10, 14, 45),
        IsAllDay: false
    }, {
        Id: 31,
        Subject: 'Conference',
        StartTime: new Date(2017, 10, 11, 9, 30),
        EndTime: new Date(2017, 10, 11, 10, 45),
        IsAllDay: false
    }, {
        Id: 32,
        Subject: 'Paris',
        StartTime: new Date(2017, 10, 12, 10, 0),
        EndTime: new Date(2017, 10, 12, 11, 30),
        IsAllDay: true
    }, {
        Id: 33,
        Subject: 'Meeting - 1',
        StartTime: new Date(2017, 10, 13, 10, 0),
        EndTime: new Date(2017, 10, 13, 12, 30),
        IsAllDay: false
    }, {
        Id: 34,
        Subject: 'Meeting - 2',
        StartTime: new Date(2017, 10, 13, 11, 0),
        EndTime: new Date(2017, 10, 13, 14, 30),
        IsAllDay: false
    }, {
        Id: 35,
        Subject: 'Conference - 1',
        StartTime: new Date(2017, 10, 14, 22, 0),
        EndTime: new Date(2017, 10, 15, 2, 30),
        IsAllDay: false
    }, {
        Id: 36,
        Subject: 'Conference - 2',
        StartTime: new Date(2017, 10, 14, 22, 0),
        EndTime: new Date(2017, 10, 15, 0, 0),
        IsAllDay: false
    }, {
        Id: 37,
        Subject: 'Conference - 3',
        StartTime: new Date(2017, 10, 15, 9, 30),
        EndTime: new Date(2017, 10, 15, 11, 45),
        IsAllDay: false
    }, {
        Id: 38,
        Subject: 'Conference - 4',
        StartTime: new Date(2017, 10, 15, 10, 30),
        EndTime: new Date(2017, 10, 15, 12, 45),
        IsAllDay: false
    }, {
        Id: 39,
        Subject: 'Travelling',
        StartTime: new Date(2017, 10, 15, 11, 30),
        EndTime: new Date(2017, 10, 15, 13, 45),
        IsAllDay: false
    }, {
        Id: 40,
        Subject: 'Vacation',
        StartTime: new Date(2017, 10, 16, 10, 0),
        EndTime: new Date(2017, 10, 16, 12, 30),
        IsAllDay: false
    }, {
        Id: 41,
        Subject: 'Conference',
        StartTime: new Date(2017, 10, 16, 15, 30),
        EndTime: new Date(2017, 10, 16, 18, 45),
        IsAllDay: false
    }, {
        Id: 42,
        Subject: 'Vacation',
        StartTime: new Date(2017, 10, 17, 10, 15),
        EndTime: new Date(2017, 10, 17, 14, 45),
        IsAllDay: false
    }, {
        Id: 43,
        Subject: 'Conference',
        StartTime: new Date(2017, 10, 18, 9, 30),
        EndTime: new Date(2017, 10, 18, 10, 45),
        IsAllDay: false
    }
];

export const blockData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Meeting with CEO',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 11, 30),
        IsAllDay: false,
        IsBlock: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 2,
        Subject: 'Holiday',
        StartTime: new Date(2017, 10, 1),
        EndTime: new Date(2017, 10, 2),
        IsAllDay: false,
        IsBlock: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 3,
        Subject: 'Vacation',
        StartTime: new Date(2017, 9, 22, 11, 0),
        EndTime: new Date(2017, 9, 24, 10, 0),
        IsAllDay: false,
        IsBlock: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 4,
        Subject: 'Server Refreshing',
        StartTime: new Date(2017, 10, 4),
        EndTime: new Date(2017, 10, 6),
        IsAllDay: true,
        IsBlock: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 5,
        Subject: 'Infrastructure Work',
        StartTime: new Date(2017, 9, 27, 11, 0),
        EndTime: new Date(2017, 9, 29, 9, 0),
        IsAllDay: false,
        IsBlock: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 6,
        Subject: 'Holiday-Trip',
        StartTime: new Date(2017, 10, 8),
        EndTime: new Date(2017, 10, 11),
        IsAllDay: false,
        IsBlock: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 7,
        Subject: 'Refreshment',
        StartTime: new Date(2017, 10, 13, 10, 0),
        EndTime: new Date(2017, 10, 13, 12, 0),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
        IsAllDay: false,
        IsBlock: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 8,
        Subject: 'General Meeting',
        StartTime: new Date(2017, 9, 31, 9, 30),
        EndTime: new Date(2017, 9, 31, 11, 30),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 9,
        Subject: 'Client Meeting',
        StartTime: new Date(2017, 10, 3, 8, 0),
        EndTime: new Date(2017, 10, 3, 10, 30),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 10,
        Subject: 'Conference',
        StartTime: new Date(2017, 10, 2, 13, 30),
        EndTime: new Date(2017, 10, 2, 14, 45),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 11,
        Subject: 'Review',
        StartTime: new Date(2017, 9, 25, 11, 15),
        EndTime: new Date(2017, 9, 25, 13, 45),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 12,
        Subject: 'Shopping',
        StartTime: new Date(2017, 9, 26, 8, 30),
        EndTime: new Date(2017, 9, 26, 10, 45),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 13,
        Subject: 'Review-2',
        StartTime: new Date(2017, 10, 7, 11, 15),
        EndTime: new Date(2017, 10, 7, 13, 45),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 14,
        Subject: 'Greetings',
        StartTime: new Date(2017, 10, 7, 8, 30),
        EndTime: new Date(2017, 10, 7, 10, 45),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 15,
        Subject: 'Vacation',
        StartTime: new Date(2017, 9, 29, 11, 0),
        EndTime: new Date(2017, 9, 31, 10, 0),
        IsAllDay: false,
        IsBlock: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 16,
        Subject: 'Holiday-Trip',
        StartTime: new Date(2017, 10, 2),
        EndTime: new Date(2017, 10, 5),
        IsAllDay: false,
        IsBlock: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 17,
        Subject: 'Refreshment',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 12, 0),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
        IsAllDay: false,
        IsBlock: true,
        HallId: 1,
        RoomId: 2,
        OwnerId: 2
    }, {
        Id: 18,
        Subject: 'Review',
        StartTime: new Date(2017, 9, 31, 11, 15),
        EndTime: new Date(2017, 9, 31, 13, 45),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 19,
        Subject: 'Shopping',
        StartTime: new Date(2017, 9, 29, 8, 30),
        EndTime: new Date(2017, 9, 29, 10, 45),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 20,
        Subject: 'Review-2',
        StartTime: new Date(2017, 10, 1, 12, 0),
        EndTime: new Date(2017, 10, 1, 13, 45),
        IsAllDay: false,
        HallId: 1,
        RoomId: 2,
        OwnerId: 2
    }, {
        Id: 21,
        Subject: 'Greetings',
        StartTime: new Date(2017, 10, 2, 8, 30),
        EndTime: new Date(2017, 10, 2, 10, 0),
        IsAllDay: false,
        HallId: 1,
        RoomId: 2,
        OwnerId: 2
    }
];

const msPerDay: number = 86400000;
const msPerHour: number = 3600000;
const currentTime: number = new Date().setMinutes(0, 0, 0);
export const readonlyEventsData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Project Workflow Analysis',
        StartTime: new Date(currentTime + msPerDay * -2 + msPerHour * 2),
        EndTime: new Date(currentTime + msPerDay * -2 + msPerHour * 4),
        IsReadonly: true
    }, {
        Id: 2,
        Subject: 'Project Requirement Planning',
        StartTime: new Date(currentTime + msPerDay * -1 + msPerHour * 2),
        EndTime: new Date(currentTime + msPerDay * -1 + msPerHour * 4),
        IsReadonly: true
    }, {
        Id: 3,
        Subject: 'Meeting with Developers',
        StartTime: new Date(currentTime + msPerDay * -1 + msPerHour * -3),
        EndTime: new Date(currentTime + msPerDay * -1 + msPerHour * -1),
        IsReadonly: true
    }, {
        Id: 4,
        Subject: 'Team Fun Activities',
        StartTime: new Date(currentTime + msPerHour * -4),
        EndTime: new Date(currentTime + msPerHour * -2),
        IsReadonly: true
    }, {
        Id: 5,
        Subject: 'Quality Analysis',
        StartTime: new Date(currentTime + msPerHour * 1),
        EndTime: new Date(currentTime + msPerHour * 3),
        IsReadonly: true
    }, {
        Id: 6,
        Subject: 'Customer meeting – John Mackenzie',
        StartTime: new Date(currentTime + msPerHour * 5),
        EndTime: new Date(currentTime + msPerHour * 6),
        IsReadonly: false
    }, {
        Id: 7,
        Subject: 'Meeting with Core team',
        StartTime: new Date(currentTime + msPerHour * 9),
        EndTime: new Date(currentTime + msPerHour * 10),
        IsReadonly: false
    }, {
        Id: 8,
        Subject: 'Project Review',
        StartTime: new Date(currentTime + msPerDay * 1 + msPerHour * 3),
        EndTime: new Date(currentTime + msPerDay * 1 + msPerHour * 5),
        IsReadonly: false
    }, {
        Id: 9,
        Subject: 'Project demo meeting with Andrew',
        StartTime: new Date(currentTime + msPerDay * 1 + msPerHour * -4),
        EndTime: new Date(currentTime + msPerDay * 1 + msPerHour * -3),
        IsReadonly: false
    }, {
        Id: 10,
        Subject: 'Online Hosting of Project',
        StartTime: new Date(currentTime + msPerDay * 2 + msPerHour * 4),
        EndTime: new Date(currentTime + msPerDay * 2 + msPerHour * 6),
        IsReadonly: false
    }
];

export const dragResizeData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Paris Conference',
        StartTime: new Date(2018, 6, 1, 10, 0),
        EndTime: new Date(2018, 6, 1, 11, 30),
        IsAllDay: false,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 2,
        Subject: 'Daily Meeting',
        StartTime: new Date(2018, 6, 2, 11, 15),
        EndTime: new Date(2018, 6, 2, 12, 30),
        AllDay: false,
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 3,
        Subject: 'General Meeting',
        StartTime: new Date(2018, 6, 3, 11, 0),
        EndTime: new Date(2018, 6, 3, 12, 45),
        IsAllDay: false,
        RoomId: 2,
        OwnerId: 2
    }, {
        Id: 4,
        Subject: 'Board Meeting',
        StartTime: new Date(2018, 6, 4, 9, 0),
        EndTime: new Date(2018, 6, 4, 11, 0),
        IsAllDay: false,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 5,
        Subject: 'Holiday',
        StartTime: new Date(2018, 6, 5, 10, 30),
        EndTime: new Date(2018, 6, 5, 11, 30),
        IsAllDay: false,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 6,
        Subject: 'Vacation',
        StartTime: new Date(2018, 6, 6, 12, 15),
        EndTime: new Date(2018, 6, 6, 13, 30),
        IsAllDay: false,
        RoomId: 2,
        OwnerId: 2
    }, {
        Id: 7,
        Subject: 'Entertainment',
        StartTime: new Date(2018, 6, 7, 11, 0),
        EndTime: new Date(2018, 6, 7, 12, 30),
        IsAllDay: false,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 8,
        Subject: 'Event 1',
        StartTime: new Date(2018, 6, 2),
        EndTime: new Date(2018, 6, 3),
        IsAllDay: true,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 9,
        Subject: 'Event 2',
        StartTime: new Date(2018, 6, 4),
        EndTime: new Date(2018, 6, 6),
        IsAllDay: true,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 10,
        Subject: 'Event 3',
        StartTime: new Date(2018, 6, 6, 10),
        EndTime: new Date(2018, 6, 8, 11),
        IsAllDay: false,
        RoomId: 2,
        OwnerId: 2
    }
];

export const stringData: Record<string, any>[] = [
    {
        Id: '1',
        Subject: 'Event1',
        StartTime: new Date(2017, 9, 31, 10, 0),
        EndTime: new Date(2017, 9, 31, 11, 0)
    },
    {
        Id: '2',
        Subject: 'Event2',
        StartTime: new Date(2017, 9, 29, 10, 0),
        EndTime: new Date(2017, 9, 29, 11, 0)
    },
    {
        Id: '3',
        Subject: 'Event3',
        StartTime: new Date(2017, 9, 30, 10, 0),
        EndTime: new Date(2017, 9, 30, 11, 0)
    },
    {
        Id: 'recEvent',
        Subject: 'Event4',
        StartTime: new Date(2017, 9, 30, 12, 0),
        EndTime: new Date(2017, 9, 30, 13, 0),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
    }
];

export const sampleData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Explosion of Betelgeuse Star',
        StartTime: new Date(2018, 1, 16, 9, 30),
        EndTime: new Date(2018, 1, 16, 11, 0),
        CategoryColor: '#1aaa55'
    }, {
        Id: 2,
        Subject: 'Thule Air Crash Report',
        StartTime: new Date(2018, 1, 12, 12, 0),
        EndTime: new Date(2018, 1, 12, 14, 0),
        CategoryColor: '#357cd2'
    }, {
        Id: 3,
        Subject: 'Blue Moon Eclipse',
        StartTime: new Date(2018, 1, 13, 9, 30),
        EndTime: new Date(2018, 1, 13, 11, 0),
        CategoryColor: '#7fa900'
    }, {
        Id: 4,
        Subject: 'Meteor Showers in 2018',
        StartTime: new Date(2018, 1, 14, 13, 0),
        EndTime: new Date(2018, 1, 14, 14, 30),
        CategoryColor: '#ea7a57'
    }, {
        Id: 5,
        Subject: 'Milky Way as Melting pot',
        StartTime: new Date(2018, 1, 15, 12, 0),
        EndTime: new Date(2018, 1, 15, 14, 0),
        CategoryColor: '#00bdae'
    }, {
        Id: 6,
        Subject: 'Mysteries of Bermuda Triangle',
        StartTime: new Date(2018, 1, 15, 9, 30),
        EndTime: new Date(2018, 1, 15, 11, 0),
        CategoryColor: '#f57f17'
    }];

export const tooltipData: Record<string, any>[] = [
    {
        Id: 1,
        StartTime: new Date(2017, 11, 31, 10, 0),
        EndTime: new Date(2018, 0, 1, 11, 30),
        IsAllDay: false,
        Description: 'Tooltip Testing',
        Location: 'Chennai'
    }, {
        Id: 2,
        Subject: 'AllDay Event',
        StartTime: new Date(2018, 0, 1),
        EndTime: new Date(2018, 0, 2),
        IsAllDay: true,
        Description: 'Tooltip Testing',
        Location: 'Chennai'
    }, {
        Id: 3,
        Subject: 'Normal Event',
        StartTime: new Date(2018, 0, 3, 10, 0),
        EndTime: new Date(2018, 0, 3, 11, 0),
        IsAllDay: false,
        Description: 'Tooltip Testing'
    }, {
        Id: 4,
        Subject: 'AllDay Spanned Event',
        StartTime: new Date(2018, 0, 6, 10, 0),
        EndTime: new Date(2018, 0, 8, 10, 30),
        IsAllDay: false,
        Description: 'Tooltip Testing',
        Location: 'Chennai'
    }, {
        Id: 5,
        Subject: 'Normal Spanned Event',
        StartTime: new Date(2018, 0, 4, 10, 0),
        EndTime: new Date(2018, 0, 5, 9, 30),
        IsAllDay: false,
        Description: 'Tooltip Testing',
        Location: 'Chennai'
    }
];

export const timezoneData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Paris',
        StartTime: new Date(2017, 9, 16, 10, 0),
        EndTime: new Date(2017, 9, 16, 11, 30),
        IsAllDay: true,
        Location: 'India',
        Description: 'Summer vacation planned for outstation.',
        StartTimezone: 'America/New_York',
        EndTimezone: 'America/New_York'
    }, {
        Id: 2,
        Subject: 'Meeting - 1',
        StartTime: new Date(2017, 9, 17, 10, 0),
        EndTime: new Date(2017, 9, 19, 12, 30),
        IsAllDay: false,
        StartTimezone: 'America/New_York'
    }, {
        Id: 3,
        Subject: 'Meeting - 2',
        StartTime: new Date(2017, 9, 19, 14, 0),
        EndTime: new Date(2017, 9, 19, 16, 30),
        IsAllDay: false,
        EndTimezone: 'America/New_York'
    }, {
        Id: 4,
        Subject: 'Conference - 1',
        StartTime: new Date(2017, 9, 20, 9, 30),
        EndTime: new Date(2017, 9, 20, 10, 45),
        IsAllDay: false
    }
];

export const testBlockData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Block Event',
        StartTime: new Date(2017, 10, 2, 10),
        IsBlock: true,
        EndTime: new Date(2017, 10, 2, 12)
    }, {
        Id: 2,
        Subject: 'Spanned - Less than 24 hour',
        StartTime: new Date(2017, 10, 1, 12, 30),
        EndTime: new Date(2017, 10, 2, 1, 30)
    }, {
        Id: 3,
        Subject: 'Spanned - Greater than 24 hour',
        StartTime: new Date(2017, 10, 1, 2),
        EndTime: new Date(2017, 10, 8, 4)
    }, {
        Id: 4,
        Subject: 'Allday event',
        StartTime: new Date(2017, 10, 3),
        EndTime: new Date(2017, 10, 4),
        IsAllDay: true
    }, {
        Id: 5,
        Subject: 'Allday Spanned event',
        StartTime: new Date(2017, 10, 3),
        EndTime: new Date(2017, 10, 10),
        IsAllDay: true
    }, {
        Id: 6,
        Subject: 'Allday across the month',
        StartTime: new Date(2017, 10, 16),
        EndTime: new Date(2018, 0, 1),
        IsAllDay: true
    }, {
        Id: 7,
        Subject: 'Recurrence every 2 days',
        StartTime: new Date(2017, 10, 13, 11),
        EndTime: new Date(2017, 10, 13, 12),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=1'
    }
];

export const testData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Normal Event',
        StartTime: new Date(2017, 10, 2, 10),
        EndTime: new Date(2017, 10, 2, 12)
    }, {
        Id: 2,
        Subject: 'Spanned - Less than 24 hour',
        StartTime: new Date(2017, 10, 1, 12, 30),
        EndTime: new Date(2017, 10, 2, 1, 30)
    }, {
        Id: 3,
        Subject: 'Spanned - Greater than 24 hour',
        StartTime: new Date(2017, 10, 1, 2),
        EndTime: new Date(2017, 10, 8, 4)
    }, {
        Id: 4,
        Subject: 'Allday event',
        StartTime: new Date(2017, 10, 3),
        EndTime: new Date(2017, 10, 4),
        IsAllDay: true
    }, {
        Id: 5,
        Subject: 'Allday Spanned event',
        StartTime: new Date(2017, 10, 3),
        EndTime: new Date(2017, 10, 10),
        IsAllDay: true
    }, {
        Id: 6,
        Subject: 'Allday across the month',
        StartTime: new Date(2017, 10, 16),
        EndTime: new Date(2018, 0, 1),
        IsAllDay: true
    }, {
        Id: 7,
        Subject: 'Recurrence every 2 days',
        StartTime: new Date(2017, 10, 13, 11),
        EndTime: new Date(2017, 10, 13, 12),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=1'
    }
];

/**
 * Method to generate resources dynamically
 *
 * @param {number} startId Accepts start Id
 * @param {number} endId Accepts end Id
 * @param {string} text Accepts resource anme
 * @param {boolean} isAddGroupId Accepts the level grouping
 * @param {number} groupStartId Accepts the group start Id
 * @param {number} groupEndId Accepts the group end Id
 * @returns {Object[]} Returns the collection of resource datas
 * @private
 */
export function generateResourceData(startId: number = 1, endId: number = 100, text: string = '', isAddGroupId: boolean = false, groupStartId?: number, groupEndId?: number): Record<string, any>[] {
    const data: Record<string, any>[] = [];
    const resData: Record<string, any>[] = [
        { text: 'Nancy', color: '#ffaa00' },
        { text: 'Steven', color: '#f8a398' },
        { text: 'Michael', color: '#7499e1' }
    ];
    for (let a: number = startId; a <= endId; a++) {
        const n: number = Math.floor(Math.random() * resData.length);
        data.push({ Id: a, Text: text + a + '', Color: resData[n].color });
    }
    if (isAddGroupId) {
        let i: number = groupStartId;
        for (const d of data) {
            d.GroupID = i; // Math.floor(Math.random() * (groupEndId - groupStartId+1) + groupStartId);
            d.Text += '_' + d.GroupID;
            i++;
            if (i > groupEndId) {
                i = groupStartId;
            }
        }
    }
    return data;
}

/**
 * Methods to add resource fields
 *
 * @param {Object[]} eventData Accepts the collection of datas
 * @param {string} field Accepts the field name
 * @param {number} start Accepts the start number ID
 * @param {number} end Accepts the end number ID
 * @param {string} groupField Accepts the group field
 * @param {number} groupStart Accepts the group start ID
 * @param {number} groupEnd Accepts the group end ID
 * @param {Object[]} resData Accepts the collection of datas
 * @returns {void}
 * @private
 */
// eslint-disable-next-line max-len
export function addResourceField(eventData: Record<string, any>[], field: string, start: number, end: number, groupField?: string, groupStart?: number, groupEnd?: number, resData?: Record<string, any>[]): void {
    if (!groupField) {
        let i: number = start;
        for (const data of eventData) {
            data[field] = i;
            i++;
            if (i > end) {
                i = start;
            }
        }
    } else {
        const dm: DataManager = new DataManager({ json: eventData });
        const dm1: DataManager = new DataManager({ json: resData });
        for (let a: number = groupStart; a <= groupEnd; a++) {
            const eve: Record<string, any>[] = dm.executeLocal(new Query().where(groupField, 'equal', a)) as Record<string, any>[];
            const filteredRes: Record<string, any>[] = dm1.executeLocal(new Query().where('GroupID', 'equal', a).select(['Id'])) as Record<string, any>[];
            const possibleIds: number[] = (filteredRes as Record<string, any>[]).map((a: Record<string, any>) => a.Id as number);
            const addField: CallbackFunction = (events: Record<string, any>[], list: number[]) => {
                let index: number = 0;
                for (let i: number = 0; i < events.length; i++) {
                    events[i][field] = list[index];
                    index++;
                    if (index >= list.length) {
                        index = 0;
                    }
                }
            };
            addField(eve, possibleIds);
        }
    }
}

/**
 * Method to generate events data dynamically
 *
 * @param {Date} startDate Accepts the start date
 * @param {Date} endDate Accepts the end date
 * @param {number} eventCount Accepts the event count
 * @returns {Object[]} Returns the collection of event datas
 * @private
 */
export function generateEventData(startDate: Date, endDate: Date, eventCount: number): Record<string, any>[] {
    const data: Record<string, any>[] = [];
    const names: string[] = [
        'Bering Sea Gold', 'Technology', 'Maintenance', 'Meeting', 'Travelling', 'Annual Conference', 'Birthday Celebration',
        'Farewell Celebration', 'Wedding Aniversary', 'Alaska: The Last Frontier', 'Deadest Catch', 'Sports Day',
        'MoonShiners', 'Close Encounters', 'HighWay Thru Hell', 'Daily Planet', 'Cash Cab', 'Basketball Practice',
        'Rugby Match', 'Guitar Class', 'Music Lessons', 'Doctor checkup', 'Brazil - Mexico', 'Opening ceremony', 'Final presentation'
    ];
    const msPerHour: number = 1000 * 60 * 60;
    let id: number = 1;
    const incMs: number = (msPerHour * 24) * 1;
    const generate: CallbackFunction = () => {
        const start: number = startDate.getTime();
        const end: number = endDate.getTime();
        for (let a: number = start; a < end; a += incMs) {
            const count: number = Math.floor((Math.random() * 9) + 1);
            for (let b: number = 0; b < count; b++) {
                const hour: number = Math.floor(Math.random() * 100) % 24;
                const minutes: number = Math.round((Math.floor(Math.random() * 100) % 60) / 5) * 5;
                const nCount: number = Math.floor(Math.random() * names.length);
                const startDate: Date = new Date(new Date(a).setHours(hour, minutes));
                const endDate: Date = new Date(startDate.getTime() + (msPerHour * 2.5));
                data.push({
                    Id: id,
                    Subject: names[nCount],
                    StartTime: startDate,
                    EndTime: endDate,
                    IsAllDay: (id % 10) ? false : true
                });
                if (data.length >= eventCount) {
                    return;
                }
                id++;
            }
        }
    };
    while (data.length < eventCount) {
        generate();
    }
    return data;
}

/**
 * Method to clone the datasource objects
 *
 * @param {Object[]} datas Accepts the original datasource
 * @returns {Object[]} Returns the cloned datasource
 * @private
 */
export function cloneDataSource(datas: Record<string, any>[]): Record<string, any>[] {
    const dataSrc: Record<string, any>[] = [];
    for (const data of datas) {
        dataSrc.push(extend({}, data) as Record<string, any>);
    }
    return dataSrc;
}

/**
 * Method to generate events data dynamically
 *
 * @returns {Object[]} Returns the collection of event datas
 * @private
 */
export function generateObject(): Record<string, any>[] {
    const data: Record<string, any>[] = [];
    const names: string[] = [
        'Bering Sea Gold', 'Technology', 'Maintenance', 'Meeting', 'Travelling', 'Annual Conference', 'Birthday Celebration',
        'Farewell Celebration', 'Wedding Aniversary', 'Alaska: The Last Frontier', 'Deadest Catch', 'Sports Day',
        'MoonShiners', 'Close Encounters', 'HighWay Thru Hell', 'Daily Planet', 'Cash Cab', 'Basketball Practice',
        'Rugby Match', 'Guitar Class', 'Music Lessons', 'Doctor checkup', 'Brazil - Mexico', 'Opening ceremony', 'Final presentation'
    ];
    const start: number = new Date(2017, 0, 1).getTime();
    const end: number = new Date(2018, 11, 31).getTime();
    const dayCount: number = 1000 * 60 * 60;
    for (let a: number = start, id: number = 3; a < end; a += (dayCount * 24) * 2) {
        const count: number = Math.floor((Math.random() * 9) + 1);
        for (let b: number = 0; b < count; b++) {
            const hour: number = Math.floor(Math.random() * 100) % 24;
            const minutes: number = Math.round((Math.floor(Math.random() * 100) % 60) / 5) * 5;
            const nCount: number = Math.floor(Math.random() * names.length);
            const startDate: Date = new Date(new Date(a).setHours(hour, minutes));
            const endDate: Date = new Date(startDate.getTime() + (dayCount * 2.5));
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
    const longerEvent: Record<string, any> = {
        Id: 0,
        StartTime: new Date(2017, 0, 1),
        EndTime: new Date(2017, 0, 10),
        IsAllDay: true,
        Location: 'Chennai'
    };
    const occurrenceEvent: Record<string, any> = {
        Id: 1,
        StartTime: new Date(2017, 0, 1),
        EndTime: new Date(2017, 0, 10),
        IsAllDay: true,
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
        RecurrenceId: 0
    };
    const recurrenceEvent: Record<string, any> = {
        Id: 2,
        StartTime: new Date(2017, 0, 1),
        EndTime: new Date(2017, 0, 10),
        IsAllDay: true,
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1'
    };
    data.push(longerEvent);
    data.push(occurrenceEvent);
    data.push(recurrenceEvent);
    return data;
}

export const resourceData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Nancy',
        StartTime: new Date(2018, 3, 1, 10, 0),
        EndTime: new Date(2018, 3, 1, 12, 30),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 2,
        Subject: 'Michael',
        StartTime: new Date(2018, 3, 1, 10, 0),
        EndTime: new Date(2018, 3, 1, 12, 30),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 3,
        Subject: 'Steven',
        StartTime: new Date(2018, 3, 1, 10, 0),
        EndTime: new Date(2018, 3, 1, 12, 30),
        IsAllDay: false,
        HallId: 1,
        RoomId: 2,
        OwnerId: 2
    }, {
        Id: 4,
        Subject: 'Meeting',
        StartTime: new Date(2018, 3, 4, 14, 0),
        EndTime: new Date(2018, 3, 4, 15, 30),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 5,
        Subject: 'Conference',
        StartTime: new Date(2018, 3, 3, 8, 0),
        EndTime: new Date(2018, 3, 3, 9, 30),
        IsAllDay: false,
        HallId: 1,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 6,
        Subject: 'Break Time',
        StartTime: new Date(2018, 3, 5, 13, 0),
        EndTime: new Date(2018, 3, 5, 14, 0),
        IsAllDay: false,
        HallId: 1,
        RoomId: 2,
        OwnerId: 2
    }, {
        Id: 7,
        Subject: 'Holiday',
        StartTime: new Date(2018, 3, 5),
        EndTime: new Date(2018, 3, 7),
        IsAllDay: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 8,
        Subject: 'Sick Leave',
        StartTime: new Date(2018, 3, 5),
        EndTime: new Date(2018, 3, 6),
        IsAllDay: true,
        HallId: 1,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 9,
        Subject: 'Weekend',
        StartTime: new Date(2018, 3, 7),
        EndTime: new Date(2018, 3, 9),
        IsAllDay: true,
        HallId: 1,
        RoomId: 2,
        OwnerId: 2
    }
];

export const resourceGroupData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Meeting',
        StartTime: new Date(2018, 3, 1, 10, 0),
        EndTime: new Date(2018, 3, 1, 12, 30),
        IsAllDay: false,
        RoomId: [1, 2],
        OwnerId: [1, 2, 3]
    }, {
        Id: 2,
        Subject: 'Conference',
        StartTime: new Date(2018, 3, 4, 12, 0),
        EndTime: new Date(2018, 3, 4, 13, 30),
        IsAllDay: false,
        RoomId: [1],
        OwnerId: [1, 3]
    }, {
        Id: 3,
        Subject: 'Travelling',
        StartTime: new Date(2018, 3, 5),
        EndTime: new Date(2018, 3, 7),
        IsAllDay: true,
        RoomId: [1, 2],
        OwnerId: [1, 2]
    }, {
        Id: 4,
        Subject: 'Events - Within a day',
        StartTime: new Date(2018, 4, 1, 10, 0),
        EndTime: new Date(2018, 4, 1, 12, 30),
        IsAllDay: false,
        RoomId: [2, 3],
        OwnerId: [2, 3]
    }, {
        Id: 5,
        Subject: 'Spanned Event - Less than 24',
        StartTime: new Date(2018, 3, 30, 18, 0),
        EndTime: new Date(2018, 4, 1, 10, 30),
        IsAllDay: false,
        RoomId: [1, 2],
        OwnerId: [4, 2]
    }, {
        Id: 6,
        Subject: 'Spanned Event - Greater than 24',
        StartTime: new Date(2018, 4, 1, 18, 0),
        EndTime: new Date(2018, 4, 3, 10, 30),
        IsAllDay: false,
        RoomId: [3],
        OwnerId: [6, 3]
    }, {
        Id: 7,
        Subject: 'Spanned Event - Previous week',
        StartTime: new Date(2018, 3, 27, 15, 0),
        EndTime: new Date(2018, 3, 30, 12, 30),
        IsAllDay: false,
        RoomId: [2],
        OwnerId: [5, 8]
    }, {
        Id: 8,
        Subject: 'Spanned  Event - Same week',
        StartTime: new Date(2018, 3, 30, 10, 0),
        EndTime: new Date(2018, 4, 3, 13, 0),
        IsAllDay: false,
        RoomId: [2, 3],
        OwnerId: [2, 5, 9]
    }, {
        Id: 9,
        Subject: 'Spanned Event - Next week',
        StartTime: new Date(2018, 4, 2, 15, 30),
        EndTime: new Date(2018, 4, 8, 18, 0),
        IsAllDay: false,
        RoomId: [1],
        OwnerId: [6]
    }, {
        Id: 10,
        Subject: 'Recurrence Event - Previous week',
        StartTime: new Date(2018, 3, 28, 10, 15),
        EndTime: new Date(2018, 4, 1, 11, 45),
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=SA;INTERVAL=1;COUNT=3',
        IsAllDay: false,
        RoomId: [1, 3],
        OwnerId: [4, 6, 7, 10]
    }, {
        Id: 11,
        Subject: 'All Day Event - Current date',
        StartTime: new Date(2018, 4, 1),
        EndTime: new Date(2018, 4, 2),
        IsAllDay: true,
        RoomId: [3],
        OwnerId: [3, 6, 9]
    }, {
        Id: 12,
        Subject: 'All Day Event - Previous week',
        StartTime: new Date(2018, 3, 26, 10, 0),
        EndTime: new Date(2018, 3, 30, 11, 30),
        IsAllDay: true,
        RoomId: [1],
        OwnerId: [1, 4, 7]
    }, {
        Id: 13,
        Subject: 'All Day Event - Next week',
        StartTime: new Date(2018, 4, 4, 10, 0),
        EndTime: new Date(2018, 4, 8, 11, 30),
        IsAllDay: true,
        RoomId: [2],
        OwnerId: [2, 5, 8]
    }, {
        Id: 14,
        Subject: 'Recurrence Event - Same day',
        StartTime: new Date(2018, 4, 1, 10, 15),
        EndTime: new Date(2018, 4, 1, 14, 45),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=3',
        IsAllDay: false,
        RoomId: [1, 2],
        OwnerId: [1, 8, 10]
    }, {
        Id: 15,
        Subject: 'Recurrence Event - Less than 24',
        StartTime: new Date(2018, 4, 3, 15, 0),
        EndTime: new Date(2018, 4, 4, 10, 45),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=3',
        IsAllDay: false,
        RoomId: [1, 3],
        OwnerId: [7, 10]
    }, {
        Id: 16,
        Subject: 'Recurrence Event - Greater than 24',
        StartTime: new Date(2018, 3, 30, 15, 0),
        EndTime: new Date(2018, 4, 2, 16, 45),
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=1;COUNT=3',
        IsAllDay: false,
        RoomId: [1, 2, 3],
        OwnerId: [2, 4, 10, 7]
    }, {
        Id: 17,
        Subject: 'Recurrence Event - Next week',
        StartTime: new Date(2018, 4, 3, 2, 0),
        EndTime: new Date(2018, 4, 7, 16, 45),
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=FR;INTERVAL=1;COUNT=5',
        IsAllDay: false,
        RoomId: [1, 2, 3],
        OwnerId: [1, 2, 3]
    }, {
        Id: 18,
        Subject: 'Recurrence Event - Same day',
        StartTime: new Date(2018, 4, 1, 10, 15),
        EndTime: new Date(2018, 4, 1, 14, 45),
        IsAllDay: false,
        RoomId: [1, 2, 3],
        OwnerId: [2, 4, 6]
    }
];

export const timelineData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Events - Within a day',
        StartTime: new Date(2018, 4, 1, 10, 0),
        EndTime: new Date(2018, 4, 1, 12, 30),
        IsAllDay: false
    }, {
        Id: 2,
        Subject: 'Spanned Event - Less than 24',
        StartTime: new Date(2018, 3, 30, 18, 0),
        EndTime: new Date(2018, 4, 1, 10, 30),
        IsAllDay: false
    }, {
        Id: 3,
        Subject: 'Spanned Event - Greater than 24',
        StartTime: new Date(2018, 4, 1, 18, 0),
        EndTime: new Date(2018, 4, 3, 10, 30),
        IsAllDay: false
    }, {
        Id: 4,
        Subject: 'Spanned Event - Previous week',
        StartTime: new Date(2018, 3, 27, 15, 0),
        EndTime: new Date(2018, 3, 30, 12, 30),
        IsAllDay: false
    }, {
        Id: 5,
        Subject: 'Spanned  Event - Same week',
        StartTime: new Date(2018, 3, 30, 10, 0),
        EndTime: new Date(2018, 4, 3, 13, 0),
        IsAllDay: false
    }, {
        Id: 6,
        Subject: 'Spanned Event - Next week',
        StartTime: new Date(2018, 4, 2, 15, 30),
        EndTime: new Date(2018, 4, 8, 18, 0),
        IsAllDay: false
    }, {
        Id: 7,
        Subject: 'Recurrence Event - Previous week',
        StartTime: new Date(2018, 3, 28, 10, 15),
        EndTime: new Date(2018, 4, 1, 11, 45),
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=SA;INTERVAL=1;COUNT=3',
        IsAllDay: false
    }, {
        Id: 8,
        Subject: 'All Day Event - Current date',
        StartTime: new Date(2018, 4, 1),
        EndTime: new Date(2018, 4, 2),
        IsAllDay: true
    }, {
        Id: 9,
        Subject: 'All Day Event - Previous week',
        StartTime: new Date(2018, 3, 26, 10, 0),
        EndTime: new Date(2018, 3, 30, 11, 30),
        IsAllDay: true
    }, {
        Id: 10,
        Subject: 'All Day Event - Next week',
        StartTime: new Date(2018, 4, 4, 10, 0),
        EndTime: new Date(2018, 4, 8, 11, 30),
        IsAllDay: true
    }, {
        Id: 11,
        Subject: 'Same Time',
        StartTime: new Date(2018, 4, 1, 13, 0),
        EndTime: new Date(2018, 4, 1, 14, 0),
        IsAllDay: false
    }, {
        Id: 12,
        Subject: 'Same Time',
        StartTime: new Date(2018, 4, 1, 13, 0),
        EndTime: new Date(2018, 4, 1, 14, 0),
        IsAllDay: false
    }, {
        Id: 13,
        Subject: 'Same Time',
        StartTime: new Date(2018, 4, 1, 13, 0),
        EndTime: new Date(2018, 4, 1, 14, 0),
        IsAllDay: false
    }, {
        Id: 14,
        Subject: 'Same Time',
        StartTime: new Date(2018, 4, 1, 13, 0),
        EndTime: new Date(2018, 4, 1, 14, 0),
        IsAllDay: false
    }, {
        Id: 15,
        Subject: 'Same Time',
        StartTime: new Date(2018, 4, 1, 13, 0),
        EndTime: new Date(2018, 4, 1, 14, 0),
        IsAllDay: false
    }, {
        Id: 16,
        Subject: 'Same Time',
        StartTime: new Date(2018, 4, 1, 13, 0),
        EndTime: new Date(2018, 4, 1, 14, 0),
        IsAllDay: false
    }, {
        Id: 17,
        Subject: 'Same Time',
        StartTime: new Date(2018, 4, 1, 13, 0),
        EndTime: new Date(2018, 4, 1, 14, 0),
        IsAllDay: false
    }, {
        Id: 18,
        Subject: 'Recurrence Event - Same day',
        StartTime: new Date(2018, 4, 1, 10, 15),
        EndTime: new Date(2018, 4, 1, 14, 45),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=3',
        IsAllDay: false
    }, {
        Id: 19,
        Subject: 'Recurrence Event - Less than 24',
        StartTime: new Date(2018, 4, 3, 15, 0),
        EndTime: new Date(2018, 4, 4, 10, 45),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=3',
        IsAllDay: false
    }, {
        Id: 20,
        Subject: 'Recurrence Event - Greater than 24',
        StartTime: new Date(2018, 3, 30, 15, 0),
        EndTime: new Date(2018, 4, 2, 16, 45),
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=1;COUNT=3',
        IsAllDay: false
    }, {
        Id: 21,
        Subject: 'Recurrence Event - Next week',
        StartTime: new Date(2018, 4, 3, 2, 0),
        EndTime: new Date(2018, 4, 7, 16, 45),
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=FR;INTERVAL=1;COUNT=3',
        IsAllDay: false
    }
];

export const timelineResourceData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Events - Within a day',
        StartTime: new Date(2018, 4, 1, 10, 0),
        EndTime: new Date(2018, 4, 1, 12, 30),
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }, {
        Id: 2,
        Subject: 'Spanned Event - Less than 24',
        StartTime: new Date(2018, 3, 30, 18, 0),
        EndTime: new Date(2018, 4, 1, 10, 30),
        IsAllDay: false,
        FId: 2,
        HallId: 2,
        RoomId: 2,
        OwnerId: 2
    }, {
        Id: 3,
        Subject: 'Spanned Event - Greater than 24',
        StartTime: new Date(2018, 4, 1, 18, 0),
        EndTime: new Date(2018, 4, 3, 10, 30),
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 3
    }, {
        Id: 4,
        Subject: 'Spanned Event - Previous week',
        StartTime: new Date(2018, 3, 27, 15, 0),
        EndTime: new Date(2018, 3, 30, 12, 30),
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 4
    }, {
        Id: 5,
        Subject: 'Spanned  Event - Same week',
        StartTime: new Date(2018, 3, 30, 10, 0),
        EndTime: new Date(2018, 4, 3, 13, 0),
        IsAllDay: false,
        FId: 2,
        HallId: 2,
        RoomId: 2,
        OwnerId: 5
    }, {
        Id: 6,
        Subject: 'Spanned Event - Next week',
        StartTime: new Date(2018, 4, 2, 15, 30),
        EndTime: new Date(2018, 4, 8, 18, 0),
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 6
    }, {
        Id: 7,
        Subject: 'Recurrence Event - Previous week',
        StartTime: new Date(2018, 3, 28, 10, 15),
        EndTime: new Date(2018, 4, 1, 11, 45),
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=SA;INTERVAL=1;COUNT=3',
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 7
    }, {
        Id: 8,
        Subject: 'All Day Event - Current date',
        StartTime: new Date(2018, 4, 1),
        EndTime: new Date(2018, 4, 2),
        IsAllDay: true,
        FId: 2,
        HallId: 2,
        RoomId: 2,
        OwnerId: 8
    }, {
        Id: 9,
        Subject: 'All Day Event - Previous week',
        StartTime: new Date(2018, 3, 26, 10, 0),
        EndTime: new Date(2018, 3, 30, 11, 30),
        IsAllDay: true,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 9
    }, {
        Id: 10,
        Subject: 'All Day Event - Next week',
        StartTime: new Date(2018, 4, 4, 10, 0),
        EndTime: new Date(2018, 4, 8, 11, 30),
        IsAllDay: true,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 10
    }, {
        Id: 11,
        Subject: 'Recurrence Event - Same day',
        StartTime: new Date(2018, 4, 1, 10, 15),
        EndTime: new Date(2018, 4, 1, 14, 45),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=3',
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 10
    }, {
        Id: 12,
        Subject: 'Recurrence Event - Less than 24',
        StartTime: new Date(2018, 4, 3, 15, 0),
        EndTime: new Date(2018, 4, 4, 10, 45),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=3',
        IsAllDay: false,
        FId: 2,
        HallId: 2,
        RoomId: 2,
        OwnerId: 5
    }, {
        Id: 13,
        Subject: 'Recurrence Event - Greater than 24',
        StartTime: new Date(2018, 3, 30, 15, 0),
        EndTime: new Date(2018, 4, 2, 16, 45),
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=1;COUNT=3',
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 4
    }, {
        Id: 14,
        Subject: 'Recurrence Event - Next week',
        StartTime: new Date(2018, 4, 3, 2, 0),
        EndTime: new Date(2018, 4, 7, 16, 45),
        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=FR;INTERVAL=1;COUNT=3',
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 6
    }, {
        Id: 15,
        Subject: 'Recurrence Event - Same day',
        StartTime: new Date(2018, 4, 1, 10, 15),
        EndTime: new Date(2018, 4, 1, 14, 45),
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 10
    }
];

export const levelBasedData: Record<string, any>[] = [
    {
        Id: 1,
        Subject: 'Events - Within a day',
        StartTime: new Date(2018, 4, 1, 10, 0),
        EndTime: new Date(2018, 4, 1, 12, 30),
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1
    }, {
        Id: 2,
        Subject: 'Spanned Event - Less than 24',
        StartTime: new Date(2018, 3, 30, 18, 0),
        EndTime: new Date(2018, 4, 1, 10, 30),
        IsAllDay: false,
        FId: 2,
        HallId: 2,
        RoomId: 2
    }, {
        Id: 3,
        Subject: 'Spanned Event - Greater than 24',
        StartTime: new Date(2018, 4, 1, 18, 0),
        EndTime: new Date(2018, 4, 3, 10, 30),
        IsAllDay: false,
        FId: 1
    }, {
        Id: 4,
        Subject: 'Spanned Event - Previous week',
        StartTime: new Date(2018, 3, 27, 15, 0),
        EndTime: new Date(2018, 4, 2, 12, 30),
        IsAllDay: false,
        FId: 1,
        HallId: 1
    }, {
        Id: 5,
        Subject: 'Recurrence  Event',
        StartTime: new Date(2018, 4, 1, 10, 0),
        EndTime: new Date(2018, 4, 1, 13, 0),
        IsAllDay: false,
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
        FId: 2,
        HallId: 2,
        RoomId: 2,
        OwnerId: 4
    }, {
        Id: 6,
        Subject: 'Spanned Event - Next week',
        StartTime: new Date(2018, 4, 1, 15, 30),
        EndTime: new Date(2018, 4, 8, 18, 0),
        IsAllDay: false,
        FId: 1,
        HallId: 1,
        RoomId: 1,
        OwnerId: 1
    }
];

/**
 * Method to generate data for year view
 *
 * @param {number} count Accepts the number of events data count
 * @param {Date} date Accepts the event start date
 * @param {number} yearCount Accepts the number of years
 * @returns {Object[]} Returns the collection of event datas
 * @private
 */
export function yearDataGenerator(count: number = 100, date: Date = new Date(), yearCount: number = 0): Record<string, any>[] {
    const startDate: Date = new Date(date.getFullYear(), 0, 1);
    const endDate: Date = new Date(date.getFullYear() + yearCount, 11, 31);
    const dateCollections: Record<string, any>[] = [];
    for (let a: number = 0, id: number = 1; a < count; a++) {
        const start: Date = new Date(Math.random() * (endDate.getTime() - startDate.getTime()) + startDate.getTime());
        const end: Date = new Date(new Date(start.getTime()).setHours(start.getHours() + 1));
        dateCollections.push({
            Id: id,
            Subject: id.toString(),
            StartTime: new Date(start.getTime()),
            EndTime: new Date(end.getTime()),
            IsAllDay: (id % 10) ? true : false,
            ProjectId: (id % 3) + 1,
            TaskId: (id % 6) + 1
        });
        id++;
    }
    return dateCollections;
}

/**
 * Method to generate resources event dynamically
 *
 * @param {Date} start Accepts the start Date
 * @param {number} resCount Accepts resource count
 * @param {number} overlapCount Accepts resource anme
 * @returns {Object[]} Returns the collection of resource datas
 * @private
 */
export function generateEvents(start: Date, resCount: number, overlapCount: Number) {
    let data = [];
    let id = 1;
    for (let i = 0; i < resCount; i++) {
        let random = 0;
        for (let j = 0; j < overlapCount; j++) {
            let startDate = new Date(start.getTime() + random * (1000 * 60));
            let endDate = new Date(startDate.getTime() + 15 * (1000 * 60));
            data.push({
                Id: id,
                Subject: "Event #" + id,
                StartTime: startDate,
                EndTime: endDate,
                IsAllDay: false,
                ResourceId: i + 1
            });
            id++;
            random = random + 15;
        }
    }
    console.log('data returned');
    return data;
}

/**
 * Method to generate resource data dynamically
 *
 * @param {number} start Accepts the start number
 * @param {number} endId Accepts resource count
 * @param {string} text Accepts resource anme
 * @returns {Object[]} Returns the collection of resource datas
 * @private
 */

export function generateResourceDatasource(startId: number, endId: number, text: string) {
    let data = [];
    let colors = [
        "#ff8787",
        "#9775fa",
        "#748ffc",
        "#3bc9db",
        "#69db7c",
        "#fdd835",
        "#748ffc",
        "#9775fa",
        "#df5286",
        "#7fa900",
        "#fec200",
        "#5978ee",
        "#00bdae",
        "#ea80fc"
    ];
    for (let a = startId; a <= endId; a++) {
        let n = Math.floor(Math.random() * colors.length);
        data.push({
            Id: a,
            Text: text + " " + a,
            Color: colors[n]
        });
    }
    return data;
}
/**
 * Method to generate data for all day
 *
 * @param {number} count Accepts the number of events data count
 * @param {Date} date Accepts the event start date
 * @returns {Object[]} Returns the collection of event datas
 * @private
 */
 export function generateAllDayData(count: number = 30, date: Date = new Date()): Record<string, any>[] {
    const dateCollections: Record<string, any>[] = [];
    for (let i: number = 0; i < count; i++) {
        dateCollections.push({
                Id: i + 1,
                Subject: "Appointment " + i,
                StartTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6),
                EndTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12),
                IsAllDay: true
            });
    }
    return dateCollections;
}
