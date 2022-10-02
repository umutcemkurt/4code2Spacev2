import { random } from "app/core/Utils/Utilties";

  
export const schools = [



    {
        schoolId: 1,
        size: 1250,
        schoolName: 'Istek okullari Beşiktaş ',
        avgAnalysis: {
            series: [
                {
                    name: 'Değer',
                    data: [random(10,99), random(10,99), random(10,99), random(10,99), random(10,99)]
                },
         
            ]
        },
        manager: "Ahmet Acer"
    },
    {
        schoolId: 2,
        size: 1000,
        schoolName: 'Istek okullari Beylikdüzü ',
        avgAnalysis: {
            series: [
                {
                    name: 'Değer',
                    data: [random(10,99), random(10,99), random(10,99), random(10,99), random(10,99)]
                }
            ]
        },
        manager: "Yunus Emre"
    },
    {
        schoolId: 3,
        size: 978,
        schoolName: 'Istek okullari Şişli ',
        avgAnalysis: {
            series: [
                {
                    name: 'Değer',
                    data: [random(10,99), random(10,99), random(10,99), random(10,99), random(10,99)]
                }
            ]
        },
        manager: "Asgar Yüksel"
    },
    {
        schoolId: 4,
        size: 1458,
        schoolName: 'Doğa Koleji Beşiktaş',
        avgAnalysis: {
            series: [
                {
                    name: 'Değer',
                    data: [random(10,99), random(10,99), random(10,99), random(10,99), random(10,99)]
                }
            ]
        },
        manager: "Rüzgar Alperen Avcı"
    },
    {
        schoolId: 5,
        size: 1250,
        schoolName: 'Doğa Koleji Şişli ',
        avgAnalysis: {
            series: [
                {
                    name: 'Değer',
                    data: [random(10,99), random(10,99), random(10,99), random(10,99), random(10,99)]
                }
            ]
        },
        manager: "Furkan Yıldırım"
    },
    {
        schoolId: 6,
        size: 3272,
        schoolName: 'Uğur Okulları Topçular',
        avgAnalysis: {
            series: [
                {
                    name: 'Değer',
                    data: [random(10,99), random(10,99), random(10,99), random(10,99), random(10,99)]
                }
            ]
        },
        manager: "Mustafa Özdemir"
    },
   





]

export const teams = [
    {
        teamId :1,
        schoolId: 1,
        fullName: "Oğuz kiraz",
        email: "Oguzkiraz@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :2,
        schoolId: 1,
        fullName: "Furkan Meriç",
        email: "furkanmeric@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :3,
        schoolId: 1,
        fullName: "aslan salari",
        email: "aslansalari@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :4,
        schoolId: 1,
        fullName: "nisa muharremoglu",
        email: "nisamuharremoglu@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :5,
        schoolId: 2,
        fullName: "Umut Cem Kurt",
        email: "umutcemkurt@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :6,
        schoolId: 2,
        fullName: "Berfin Şengezer",
        email: "berfin@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :7,
        schoolId: 2,
        fullName: "Elif Şensoy",
        email: "elif@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :8,
        schoolId: 2,
        fullName: "Hüseyin Korkmaz",
        email: "huseyin@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :9,
        schoolId: 2,
        fullName: "Eren Avcı",
        email: "attacktitan@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :10,
        schoolId: 3,
        fullName: "İrem Altındağ",
        email: "irem@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :11,
        schoolId: 3,
        fullName: "Ahmet Yılmaz",
        email: "ahmet@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :12,
        schoolId: 3,
        fullName: "Mehmet Yılmaz",
        email: "ahmet@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },   {
        teamId :13,
        schoolId: 3,
        fullName: "Gizem Öztürk",
        email: "gizem@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :14,
        schoolId: 3,
        fullName: "Mustafa Ateş",
        email: "mustafa@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :15,
        schoolId: 4,
        fullName: "Hakan Taşıyan",
        email: "hakan@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
    {
        teamId :16,
        schoolId: 4,
        fullName: "Rana Adıgüzel",
        email: "rana@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },   {
        teamId :17,
        schoolId: 4,
        fullName: "Çağlar Zorbilmez",
        email: "plazma@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },   {
        teamId :18,
        schoolId: 4,
        fullName: "Fatma Saları",
        email: "fatma@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },   {
        teamId :19,
        schoolId: 4,
        fullName: "Enes Ordulu",
        email: "enes@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },   {
        teamId :20,
        schoolId: 4,
        fullName: "Ramazan Ay",
        email: "ramazan@gmail.com",
        perms:[
            "CLA-000", "CLA-002", "CLA-003", "HMT-000",
        "NTF-100", 'NTF-001', 'SUP-100', 'SUP-200' ,
        ]
    },
]