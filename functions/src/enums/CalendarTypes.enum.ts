export enum CalendarTypes {

    Homeworks = 0,
    Events = 1,
    Holidays = 2

}

export  function getCalendar(type:CalendarTypes){

    return calendars[type] 

}

export const calendars = [
    {
        id     : '1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc',
        title  : 'Ödevler',
        color  : '#14B8A6',
        visible: true
    },
    {
        id     : '5dab5f7b-757a-4467-ace1-305fe07b11fe',
        title  : 'Etkinlikler',
        color  : '#6366F1',
        visible: true
    },
    {
        id     : '09887870-f85a-40eb-8171-1b13d7a7f529',
        title  : 'Tatiller',
        color  : '#EC4899',
        visible: true
    }
    /*
EC4899 pembe
6366F1 mavi
14B8A6 teal
    */
];