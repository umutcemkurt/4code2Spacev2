import moment from "moment";

export const homeworks = [
    {
        id: 1,
        advisor_id: "7eb7c859-1347-4317-96b6-9476a7e2ba3c",
        homework_type_id : 1,
        homework_content_list : [
            {contentTypeId : 1, score:500},
            {contentTypeId : 2, score:200}

        ],
        deadline: moment().minute(0).second(0).millisecond(0),
        students: []
        
    },
    {
        id: 2,
        advisor_id: "7eb7c859-1347-4317-96b6-9476a7e2ba3c",
        homework_type_id : 1,
        homework_content_list : [
            {contentTypeId : 1, score:500},
            {contentTypeId : 2, score:200}

        ],
        deadline: moment().minute(0).second(0).millisecond(0),
        students: []
        
    },
    {
        id: 3,
        advisor_id: "7eb7c859-1347-4317-96b6-9476a7e2ba3c",
        homework_type_id : 1,
        homework_content_list : [
            {contentTypeId : 1, score:500},
            {contentTypeId : 2, score:200}

        ],
        deadline: moment().add(5 , 'days').second(0).millisecond(0),
        students: []
        
    },
    {
        id: 4,
        advisor_id: "7eb7c859-1347-4317-96b6-9476a7e2ba3c",
        homework_type_id : 1,
        homework_content_list : [
            {contentTypeId : 1, score:500},
            {contentTypeId : 2, score:200}

        ],
        deadline: moment().add(2 , 'months').second(0).millisecond(0),
        students: []
        
    },
    {
        id: 5,
        advisor_id: "7eb7c859-1347-4317-96b6-9476a7e2ba3c",
        homework_type_id : 1,
        homework_content_list : [
            {contentTypeId : 1, score:500},
            {contentTypeId : 2, score:200}

        ],
        deadline: moment().subtract(5 , 'days').second(0).millisecond(0),
        students: []
        
    }
]