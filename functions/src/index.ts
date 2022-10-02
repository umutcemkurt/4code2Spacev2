import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as nodeMailer from 'nodemailer';

// import * as env from "../../src/environments/environment";

import cors = require('cors');
import { cloneDeep } from "lodash";
import { categories } from "./data/datas";
import { AverageMibdans, Mibdans } from "./models/AverageMibdans/AverageMibdans";
import { EmailParams } from "./models/emailParams";
import { EmailFactory } from "./EmailSender/EmailFactory";
import { CalendarTypes, getCalendar } from "./enums/CalendarTypes.enum";
import { calculateYesterdayOrTomorow } from "./utilties/utilties";
import { environment } from "./utilties/environment";
import { AnalyticalData } from "./models/AnalyticalData";
import { groupBy } from "lodash";

import { MeiliSearch } from 'meilisearch'
import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore";
import { Change } from "firebase-functions";
import { Common } from "./enums/Common.enum";





const _cors = cors({ origin: "*" })
admin.initializeApp({
    credential: admin.credential.cert({
        clientEmail: 'firebase-adminsdk-ppjaz@ritimus-game.iam.gserviceaccount.com',
        projectId: environment.ritimusID,
        privateKey: environment.privateKey
    })
})
const fn = functions.region("europe-west1")

const db = admin.firestore()

const fs = admin.firestore;

const auth = admin.auth();

const remoteConfig = admin.remoteConfig();

const client = new fs.v1.FirestoreAdminClient({})
const bucket = 'gs://ritimus-game.appspot.com'
const meiliSearch = new MeiliSearch({ host: "https://meili.ritimus.com/", apiKey: 'ritimus' })


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//



export const helloWorld = functions.https.onCall((request, response) => {

    meiliSearch.index("test").addDocuments([
        {
            test: '1234', annen: 'baban', sayi: 1, bool: true, date: new Date(), obj: {
                objTest1: 1,
                objTest2: 2
            },
        }
    ]).then(res => {
        let a = res
        let b = a
        b
    })
});




export const playersDocListener = fn.firestore.document("/players/{playerId}").onCreate(async (snap, _context) => {

    // console.log("PARENT ID:   " + snap.ref.parent.id) 


    //   console.log("doc Id ---  "  + context.params.playerId + " --- " + snap.ref.id + ' ---  ' + snap.data().id )

    let player = snap.data()

    if (!player.targetedIntelligenceIDs) {
        snap.ref.update({ targetedIntelligenceIDs: [] })
    }

    if (!player.targetedSolvingIDs) {
        snap.ref.update({ targetedSolvingIDs: [] })
    }

    if (!player.baseSkillIDs) {
        snap.ref.update({
            baseSkillIDs: [
                0, 1, 2, 3
            ]
        })
    }

    if (player.mibdansLog[0] == null) {


        snap.ref.update({ mibdansLog: [] })
    }

    if (!player.mibdans) {
        snap.ref.update({ mibdans: player.mibdansLog.pop() })
        snap.ref.update({ mibdansLog: player.mibdansLog });

    }

    if (!player.rankings) {
        let playerCount = ((await db.collection("shards").doc("players").get()).data() as any).count
        snap.ref.update({
            rankings: {
                Visual: playerCount,
                Logic: playerCount,
                Verbal: playerCount,
                Harmonic: playerCount,
                Kinesthetic: playerCount,
                Analytical: playerCount,
                Creative: playerCount,
                Adaptive: playerCount,
                Lateral: playerCount,
                LearningBased: playerCount,
                GeneralRanking: playerCount,

                Visual_Score: 0,
                Logic_Score: 0,
                Verbal_Score: 0,
                Harmonic_Score: 0,
                Kinesthetic_Score: 0,
                Analytical_Score: 0,
                Creative_Score: 0,
                Adaptive_Score: 0,
                Lateral_Score: 0,
                LearningBased_Score: 0,
                GeneralRanking_Score: 0,

                Visual_Grade: player.grade,
                Logic_Grade: player.grade,
                Verbal_Grade: player.grade,
                Harmonic_Grade: player.grade,
                Kinesthetic_Grade: player.grade,
                Analytical_Grade: player.grade,
                Creative_Grade: player.grade,
                Adaptive_Grade: player.grade,
                Lateral_Grade: player.grade,
                LearningBased_Grade: player.grade,
                GeneralRanking_Grade: player.grade,
            }
        })

    } else if (player.rankings.General) {
        snap.ref.update({
            rankings: {
                ...player.rankings,

                GeneralRanking: player.rankings.General,
                Visual_Score: 0,
                Logic_Score: 0,
                Verbal_Score: 0,
                Harmonic_Score: 0,
                Kinesthetic_Score: 0,
                Analytical_Score: 0,
                Creative_Score: 0,
                Adaptive_Score: 0,
                Lateral_Score: 0,
                LearningBased_Score: 0,
                GeneralRanking_Score: 0,
                Visual_Grade: player.grade,
                Logic_Grade: player.grade,
                Verbal_Grade: player.grade,
                Harmonic_Grade: player.grade,
                Kinesthetic_Grade: player.grade,
                Analytical_Grade: player.grade,
                Creative_Grade: player.grade,
                Adaptive_Grade: player.grade,
                Lateral_Grade: player.grade,
                LearningBased_Grade: player.grade,
                GeneralRanking_Grade: player.grade,

            }
        })
    }

    updateId(snap.ref.parent.id, snap.ref.id)

    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)

    player.id = snap.id
    // addMeili(snap.ref.parent.id , player ,snap.id)
})

export const playersUpdateListener = fn.firestore.document("/players/{playerId}").onUpdate(async (snap, context) => {

    let player = snap.after.data()


    try {
        if (!player.targetedIntelligenceIDs) {
            snap.after.ref.update({ targetedIntelligenceIDs: [] })
        }

        if (!player.targetedSolvingIDs) {
            snap.after.ref.update({ targetedSolvingIDs: [] })
        }

        if (!player.id) {
            snap.after.ref.update({ id: snap.after.id })
        }

        if (!player.baseSkillIDs) {
            snap.after.ref.update({
                baseSkillIDs: [
                    0, 1, 2, 3
                ]
            })
        }

        if (player.mibdansLog[0] == null) {



            snap.after.ref.update({ mibdansLog: [] })



        }

        if (!player.mibdans) {
            snap.after.ref.update({ mibdans: player.mibdansLog.pop() })
            snap.after.ref.update({ mibdansLog: player.mibdansLog });

        }

        if (!player.rankings) {
            let playerCount = ((await db.collection("shards").doc("players").get()).data() as any).count
            snap.after.ref.update({
                rankings: {
                    Visual: playerCount,
                    Logic: playerCount,
                    Verbal: playerCount,
                    Harmonic: playerCount,
                    Kinesthetic: playerCount,
                    Analytical: playerCount,
                    Creative: playerCount,
                    Adaptive: playerCount,
                    Lateral: playerCount,
                    LearningBased: playerCount,
                    GeneralRanking: playerCount,

                    Visual_Score: 0,
                    Logic_Score: 0,
                    Verbal_Score: 0,
                    Harmonic_Score: 0,
                    Kinesthetic_Score: 0,
                    Analytical_Score: 0,
                    Creative_Score: 0,
                    Adaptive_Score: 0,
                    Lateral_Score: 0,
                    LearningBased_Score: 0,
                    GeneralRanking_Score: 0,

                    Visual_Grade: player.grade,
                    Logic_Grade: player.grade,
                    Verbal_Grade: player.grade,
                    Harmonic_Grade: player.grade,
                    Kinesthetic_Grade: player.grade,
                    Analytical_Grade: player.grade,
                    Creative_Grade: player.grade,
                    Adaptive_Grade: player.grade,
                    Lateral_Grade: player.grade,
                    LearningBased_Grade: player.grade,
                    GeneralRanking_Grade: player.grade,
                }
            })

        } else if (player.rankings.General) {
            snap.after.ref.update({
                rankings: {
                    ...player.rankings,

                    GeneralRanking: player.rankings.General,
                    Visual_Score: 0,
                    Logic_Score: 0,
                    Verbal_Score: 0,
                    Harmonic_Score: 0,
                    Kinesthetic_Score: 0,
                    Analytical_Score: 0,
                    Creative_Score: 0,
                    Adaptive_Score: 0,
                    Lateral_Score: 0,
                    LearningBased_Score: 0,
                    GeneralRanking_Score: 0,
                    Visual_Grade: player.grade,
                    Logic_Grade: player.grade,
                    Verbal_Grade: player.grade,
                    Harmonic_Grade: player.grade,
                    Kinesthetic_Grade: player.grade,
                    Analytical_Grade: player.grade,
                    Creative_Grade: player.grade,
                    Adaptive_Grade: player.grade,
                    Lateral_Grade: player.grade,
                    LearningBased_Grade: player.grade,
                    GeneralRanking_Grade: player.grade,

                }
            })
        }

        updateMetaData(snap, player.id, context.auth?.uid, { updated: fs.Timestamp.now(), confirm: false, isDeleted: false })



    } catch (err) {
        db.collection('errors').add({
            playerID: player.id,
            func: "playerUpdateListener",
            date: fs.Timestamp.now()
        })
    }

    // player.activity.map((t:any) => t.id = player.id)

    // updateMeili(snap.after.ref.parent.id , player)



})



export const playerDeleteListener = fn.firestore.document('/players/{playerId}').onDelete((snap, _context) => {

    decreaseCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    deleteMeili(snap.ref.parent.id, snap.id)
})

export const usersDocListener = fn.firestore.document("/users/{userId}").onCreate((snap, _context) => {

    let item = snap.data()
    item.id = snap.id
    addMeili(snap.ref.parent.id, snap.data(), snap.id)
    // console.log("PARENT ID:   " + snap.ref.parent.id)
    updateId(snap.ref.parent.id, snap.ref.id)

    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)

})

export const userUpdateListener = fn.firestore.document('/users/{userId}').onUpdate((snap, _context) => {

    const user = snap.after.data()
    updateMeili(snap.after.ref.parent.id, user)

})


export const userDeleteListener = fn.firestore.document('/users/{userId}').onDelete((snap, _context) => {

    decreaseCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    deleteMeili(snap.ref.parent.id, snap.id)

})

export const schoolDocListener = fn.firestore.document("/schools/{schoolsId}").onCreate((snap, _context) => {
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)

    // console.log("PARENT ID:   " + snap.ref.parent.id)
    updateId(snap.ref.parent.id, snap.ref.id)

    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)

})

export const schoolDeleteListener = fn.firestore.document('/schools/{schoolsId}').onDelete((snap, _context) => {

    decreaseCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    // deleteMeili(snap.ref.parent.id , snap.id)

})
export const notificationsDocListener = fn.firestore.document("/notifications/{notificationsId}").onCreate((snap, _context) => {

    //   console.log("PARENT ID:   " + snap.ref.parent.id)
    updateId(snap.ref.parent.id, snap.ref.id)
    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)

    snap.ref.update({ created: snap.createTime })
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)


})

export const notificationsDeleteListener = fn.firestore.document('/notifications/{notificationsId}').onDelete((snap, _context) => {

    decreaseCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    // deleteMeili(snap.ref.parent.id , snap.id)

})

export const classroomsDocListener = fn.firestore.document("/classrooms/{classroomsId}").onCreate((snap, _context) => {

    //  console.log("PARENT ID:   " + snap.ref.parent.id)
    updateId(snap.ref.parent.id, snap.ref.id)

    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)

    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)

})

export const classroomsDeleteListener = fn.firestore.document('/classrooms/{classroomsId}').onDelete((snap, _context) => {

    decreaseCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    // deleteMeili(snap.ref.parent.id , snap.id)

})

export const activationDocLisnter = fn.firestore.document("/activations/{activationId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)


})
export const avatarDocLisnter = fn.firestore.document("/avatars/{avatarId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)

})
export const gamesDocLisnter = fn.firestore.document("/games/{gamesId}").onCreate(async (snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    let item = snap.data()
    item.id = snap.id

    delete item['note']
    delete item['priority']

    if (item.statusID != -1) {
        let result = await setGamesToRemoteConfig(item)

        if (result.isError) {
            db.collection("errors").add({
                date: fs.Timestamp.now(),
                func: "gamesUpdateListener",
                error: result.error
            }).then()
            return
        }
    }


    addMeili(snap.ref.parent.id, snap.data(), snap.id)
})

export const gamesUpdateLisnter = fn.firestore.document("/games/{gamesId}").onUpdate(async (snap, _context) => {

    let item = snap.after.data()
    item.id = snap.after.id

    delete item['note']
    delete item['priority']

    let result = await setGamesToRemoteConfig(item)

    if (result.isError) {
        db.collection("errors").add({
            date: fs.Timestamp.now(),
            func: "gamesUpdateListener",
            error: result.error
        }).then()

        return
    }
    updateMeili(snap.after.ref.parent.id, item)
})
export const invoicesDocLisnter = fn.firestore.document("/invoices/{invoiceId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)
})
export const levelsDocLisnter = fn.firestore.document("/levels/{levelId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)
})
export const possesionsDocLisnter = fn.firestore.document("/possessions/{possesionId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)
})
export const problemsDocLisnter = fn.firestore.document("/problems/{problemId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)
})
export const scoresDocLisnter = fn.firestore.document("/scores/{scoreId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data(),snap.id)
})
export const subscriptionsDocLisnter = fn.firestore.document("/subscriptions/{subscriptionId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)


    let item = snap.data()
    item.id = snap.id
    addMeili(snap.ref.parent.id, snap.data(), snap.id)
})
export const corporateStaffsDocLisnter = fn.firestore.document("/corporateStaffs/{corporateStaffId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    let item = snap.data()
    item.id = snap.id
    addMeili(snap.ref.parent.id, snap.data(), snap.id)

})
export const corporateDeleteListener = fn.firestore.document('/corporate/{corporateStaffId}').onDelete((snap, _context) => {

    decreaseCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    deleteMeili(snap.ref.parent.id, snap.id)

})

export const ticketsDocLisnter = fn.firestore.document("/tickets/{ticketId}").onCreate((snap, _context) => {
    updateId(snap.ref.parent.id, snap.ref.id)
    let item = snap.data()
    item.id = snap.id
    // addMeili(snap.ref.parent.id , snap.data() , snap.id)


})

export const calendarEventsDocListener = fn.firestore.document("/calendarEvents/{calendarEventId}").onCreate((snap, _context) => {

    //  console.log("PARENT ID:   " + snap.ref.parent.id)
    updateId(snap.ref.parent.id, snap.ref.id)

    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    let item = snap.data()
    item.id = snap.id
    addMeili(snap.ref.parent.id, snap.data(), snap.id)

})

export const calendarEventsDeleteListener = fn.firestore.document('/calendarEvents/{calendarEventId}').onDelete((snap, _context) => {

    decreaseCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    deleteMeili(snap.ref.parent.id, snap.id)

})
export const homeworksDocListener = fn.firestore.document("/homeworks/{homeworksId}").onCreate((snap, _context) => {

    //  console.log("PARENT ID:   " + snap.ref.parent.id)
    updateId(snap.ref.parent.id, snap.ref.id)


    let homework = snap.data()


    _addNotification(homework.assigneeId, _context.auth?.uid || homework.advisorId, {
        title: "Yeni Ödev",
        content: "Bir adet yeni ödeviniz var."
    })


    db.collection("players").doc(homework.assigneeId).get().then(res => {


        const player: any = res.data()
        _addEvent(CalendarTypes.Homeworks, homework.assigneeId, undefined, {
            startDate: fs.Timestamp.now().toDate().toISOString(),
            endDate: homework.deadline.toDate().toISOString(),
            schoolID: player.studentInfo.schoolID,
            text: 'Bir ödevin var!',
            desc: `${player.studentInfo.fullname} Bir ödevin var. ${homework.deadline.toDate().toLocaleDateString('tr')} tarihine kadar yapmalısın`
        })
        console.log('gonderdim')

    })

    incrementCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    let item = snap.data()
    item.id = snap.id
    addMeili(snap.ref.parent.id, snap.data(), snap.id)




})
/*
export const playerSchedule = fn.pubsub.schedule("every 12 hours synchronized").timeZone('Europe/Istanbul').onRun(async context => {


    let players: any[] = (await db.collection("players").get()).docs.map(t => t.data())

    let month = new Date().getMonth()




    let orderablePlayers = []
    for (let index = 0; index < players.length; index++) {

        const player = players[index];

        if (player.mibdans.timestamp.toDate().getMonth() != month) {
            continue;
        }



        let avatar = (await db.collection("avatars").where("playerID", "==", player.id).get()).docs.map(t => t.data())[0]

        let streak = 0

        let today = new Date().setHours(0, 0, 0, 0)

        while (
            player.activity[player.activity - 1 - streak].logDate.toDate().setHours(0, 0, 0, 0) == today
        ) {
            today = calculateYesterdayOrTomorow(new Date(today))
            streak++

        }




        let mibdans = player.mibdans

        let intelligences = mibdans.intelligences
        let problemSolvingSkills = mibdans.problemSolvingSkills

        let orderablePlayer: any = {
            playerID: player.id,
            avatar: avatar,
            dayStreak: streak,
            grade: player.grade,
            player: player,
            generalRanking: {
                totalRawPoints: 0,
                difficulty: 0

            }
        }

        for (let intel of intelligences) {
            let lastIntel = player.mibdansLog[player.mibdansLog.length - 1].intelligences.find((t: any) => t.title == intel.title)
            let lastTotalRawPoints = (intel.totalRawPoints - lastIntel.totalRawPoints)

            orderablePlayer[intel.title] = {
                totalRawPoints: lastTotalRawPoints,
                difficulty: intel.difficulty
            }

            orderablePlayer.generalRanking.totalRawPoints += lastTotalRawPoints
            orderablePlayer.generalRanking.difficulty += intel.difficulty

        }

        orderablePlayer.generalRanking.totalRawPoints = orderablePlayer.generalRanking.totalRawPoints / intelligences.length
        orderablePlayer.generalRanking.difficulty = orderablePlayer.generalRanking.difficulty / intelligences.length

        let totalTotalRawPoint = 0
        let totalDifficulty = 0

        for (let skill of problemSolvingSkills) {
            let lastSkill = player.mibdansLog[player.mibdansLog.length - 1].intelligences.find((t: any) => t.title == skill.title)
            let lastTotalRawPoints = (skill.totalRawPoints - lastSkill.totalRawPoints)

            orderablePlayer[skill.title] = {
                totalRawPoints: lastTotalRawPoints,
                difficulty: skill.difficulty
            }

            totalTotalRawPoint += totalTotalRawPoint
            totalDifficulty += skill.difficulty

        }


        orderablePlayer.generalRanking.totalRawPoints += totalTotalRawPoint / problemSolvingSkills.length
        orderablePlayer.generalRanking.difficulty += totalDifficulty / problemSolvingSkills.length

        orderablePlayer.generalRanking.totalRawPoints /= 2
        orderablePlayer.generalRanking.difficulty /= 2

        orderablePlayers.push(orderablePlayer)

    }

    let Visual, Logic, Verbal, Harmonic, Kinesthetic, Analytical, Creative, Adaptive, Lateral, LearningBased, GeneralRanking


    Visual = orderablePlayers.sort((a, b) => b.Visual.totalRawPoints - a.Visual.totalRawPoints).slice(0, 50)
    Logic = orderablePlayers.sort((a, b) => b.Logic.totalRawPoints - a.Logic.totalRawPoints).slice(0, 50)
    Verbal = orderablePlayers.sort((a, b) => b.Verbal.totalRawPoints - a.Verbal.totalRawPoints).slice(0, 50)
    Harmonic = orderablePlayers.sort((a, b) => b.Harmonic.totalRawPoints - a.Harmonic.totalRawPoints).slice(0, 50)
    Kinesthetic = orderablePlayers.sort((a, b) => b.Kinesthetic.totalRawPoints - a.Kinesthetic.totalRawPoints).slice(0, 50)
    Analytical = orderablePlayers.sort((a, b) => b.Analytical.totalRawPoints - a.Analytical.totalRawPoints).slice(0, 50)
    Creative = orderablePlayers.sort((a, b) => b.Creative.totalRawPoints - a.Creative.totalRawPoints).slice(0, 50)
    Adaptive = orderablePlayers.sort((a, b) => b.Adaptive.totalRawPoints - a.Adaptive.totalRawPoints).slice(0, 50)
    Lateral = orderablePlayers.sort((a, b) => b.Lateral.totalRawPoints - a.Lateral.totalRawPoints).slice(0, 50)
    LearningBased = orderablePlayers.sort((a, b) => b.LearningBased.totalRawPoints - a.LearningBased.totalRawPoints).slice(0, 50)
    GeneralRanking = orderablePlayers.sort((a, b) => b.generalRanking.totalRawPoints - a.generalRanking.totalRawPoints).slice(0, 50)


    let year = new Date().getFullYear()

    let todayOfCurrentMonth = new Date(year, month, 1)

    let season = await db.collection("seasons").where("startDate", "==", fs.Timestamp.fromDate(todayOfCurrentMonth)).get()
    let seasonData: { id: string, name: string, startDate: FirebaseFirestore.Timestamp, intelligenceRanking: any, solvingRanking: any, generalRanking: any[] }

    if (season.empty) {
        let newSeason = {
            id: db.doc("").id,
            name: "",
            startDate: fs.Timestamp.fromDate(todayOfCurrentMonth),
            intelligenceRanking: {},
            solvingRanking: {},
            generalRanking: []

        }

        await db.collection('seasons').doc(newSeason.id).set(newSeason)

        seasonData = newSeason

    } else {
        seasonData = (season.docs.map(t => t.data())[0] as any)
    }


    seasonData.generalRanking = GeneralRanking

    seasonData.intelligenceRanking["Visual"] = []

    Visual.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.Visual.totalRawPoints,
            difficulty: t.Visual.difficulty,

        }
        seasonData.intelligenceRanking["Visual"].push(seasonPlayerInfo)

    })

    Logic.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.Logic.totalRawPoints,
            difficulty: t.Logic.difficulty,

        }
        seasonData.intelligenceRanking["Logic"].push(seasonPlayerInfo)

    })

    Verbal.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.Verbal.totalRawPoints,
            difficulty: t.Verbal.difficulty,

        }
        seasonData.intelligenceRanking["Verbal"].push(seasonPlayerInfo)

    })


    Harmonic.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.Harmonic.totalRawPoints,
            difficulty: t.Harmonic.difficulty,

        }
        seasonData.intelligenceRanking["Harmonic"].push(seasonPlayerInfo)

    })


    Kinesthetic.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.Kinesthetic.totalRawPoints,
            difficulty: t.Kinesthetic.difficulty,

        }
        seasonData.intelligenceRanking["Kinesthetic"].push(seasonPlayerInfo)

    })

    Analytical.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.Analytical.totalRawPoints,
            difficulty: t.Analytical.difficulty,

        }
        seasonData.solvingRanking["Analytical"].push(seasonPlayerInfo)

    })
    Creative.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.Creative.totalRawPoints,
            difficulty: t.Creative.difficulty,

        }
        seasonData.solvingRanking["Creative"].push(seasonPlayerInfo)

    })
    Lateral.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.Lateral.totalRawPoints,
            difficulty: t.Lateral.difficulty,

        }
        seasonData.solvingRanking["Lateral"].push(seasonPlayerInfo)

    })
    LearningBased.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.LearningBased.totalRawPoints,
            difficulty: t.LearningBased.difficulty,

        }
        seasonData.solvingRanking["LearningBased"].push(seasonPlayerInfo)

    })
    Adaptive.forEach(t => {

        let seasonPlayerInfo: {
            playerID: string, grade: number, gender: number, displayName: string, avatar: any, dayStreak: number,
            point: number, difficulty: number
        } = {
            playerID: t.player.id,
            grade: t.player.grade,
            gender: t.player.gender,
            displayName: t.player.displayName,
            avatar: t.avatar,
            dayStreak: t.dayStreak,
            point: t.Adaptive.totalRawPoints,
            difficulty: t.Adaptive.difficulty,

        }
        seasonData.solvingRanking["Adaptive"].push(seasonPlayerInfo)

    })


    db.collection("seasons").doc(seasonData.id).update(seasonData)





})
*/

function _addEvent(calendarType: CalendarTypes, playerId: string, recurrenceRule = '', data: any) {

    const event = {
        allDay: true,
        calendarID: getCalendar(calendarType).id,
        description: data.desc,
        startDate: data.startDate,
        endDate: data.endDate,
        playerID: playerId,
        recurrenceRule: recurrenceRule,
        schoolID: data.schoolID,
        text: data.text
    }

    db.collection("calendarEvents").add(event).then()
}
function _addNotification(playerID: string, senderID: string, data: any) {

    const notification = {
        created: fs.Timestamp.now(),
        notifcationStatusID: 0,
        notificationTitle: data.title,
        notificationContent: data.content,
        notificationTypeID: 1,
        playerID: playerID,
        senderID: senderID
    }

    db.collection("notifications").add(notification).then()


}



export const homeworksDeleteListener = fn.firestore.document('/homeworks/{homeworksid}').onDelete((snap, _context) => {

    decreaseCounter(snap.ref.firestore, snap.ref, snap.ref.parent.id)
    deleteMeili(snap.ref.parent.id, snap.id)

})



function decreaseCounter(_db: FirebaseFirestore.Firestore, _ref: any, doc_Id: any) {

    const shard_ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = db.collection('shards').doc(doc_Id);


    // Update count
    return shard_ref.update("count", fs.FieldValue.increment(-1)).then(() => null);
}

function incrementCounter(_db: FirebaseFirestore.Firestore, _ref: any, doc_Id: any) {

    const shard_ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> = db.collection('shards').doc(doc_Id);



    // Update count
    return shard_ref.update("count", fs.FieldValue.increment(1)).then(_data => console.log(doc_Id + " - mobilden guncellendim"));
}

function addMeili(parentId: string, data: any, id: string) {
    meiliSearch.index(parentId).addDocuments([
        { ...data, id: id }
    ]).then()
}
function updateMeili(parentId: string, data: any) {
    meiliSearch.index(parentId).updateDocuments([data], { primaryKey: 'id' }).then()
}

function deleteMeili(parentId: string, docId: string) {
    meiliSearch.index(parentId).deleteDocument(docId)
}
function updateId(parentId: string, docId: string) {
    db.collection(parentId).doc(docId).update({ id: docId })
}
export const sayHello = fn.https.onCall((_data, _context) => {

    console.log(_data)
    console.log(_context)
})

export const sendEmail = fn.https.onRequest((req, res) => {
    _cors(req, res, async () => {

        try {
            let params: EmailParams
            if (typeof req.body.data === "string") {

                params = JSON.parse(req.body.data);
            } else {
                params = req.body.data
            }

            if (typeof params.data == "string") {
                params.data = JSON.parse(params.data)
            }

            let selector = new EmailFactory()
            let html = await selector.selectEmail(params.pattern).getHtml(params.data)



            const transporter = nodeMailer.createTransport(
                {
                    service: "yandex",
                    auth: {

                        user: "noreply@ritimus.com",
                        pass: "c5ZY-eR6cAn+8Za",

                    },
                    secure: true,
                    logger: true,
                    transactionLog: true, // include SMTP traffic in the logs
                }
            );

            const message = {
                from: 'RitimUS <noreply@ritimus.com>',
                to: params.toName + " <" + params.toMail + ">",
                subject: params.subject,
                text: "",
                // HTML body
                html: html
            };

            return transporter.sendMail(message, (error, _info) => {
                if (error) {
                    console.log('Error occurred');
                    console.log(error.message);
                    return res.status(200).send({
                        data: {
                            error: true,

                            message: error.message
                        }
                    })
                }


                console.log("gonderdim")
                return res.status(200).send({
                    data: {
                        error: false,

                        message: _info.messageId
                    }
                })
            })
        } catch (error) {

            let err = (error as any)
            return res.status(200).send({
                data: {
                    error: true,
                    message: err.message
                }
            })
        }



    })
})

export const addAdmin = fn.https.onCall((_data, _context) => {


    console.log("calistim")
    debugger


})


export const setGamesRemoteConfig = fn.https.onCall(async (data, _context) => {


    let result = await setGamesToRemoteConfig(data)


    return result
    /*   try {
  
          let temp:any = await remoteConfig.getTemplate()
  
          let gamesObj = JSON.parse(temp.parameters["Ritimus2_0_Games"].defaultValue.value);
  
          gamesObj[data.gameID] = data
       
          temp.parameters["Ritimus2_0_Games"].defaultValue.value = JSON.stringify(gamesObj)
  
          let publish = await remoteConfig.publishTemplate(temp)
  
          return {
              isError: false, etag: publish.etag
          };
      }
      catch (error) {
          return {
              isError: true, error: error
          };
      }
   */


    // android remote

})


export const addNotification = fn.https.onCall(async (data, context) => {

    let _data = cloneDeep(data)

    try {

        if (Array.isArray(data.playerID)) {
            for (let index = 0; index < data.playerID.length; index++) {
                const element = data.playerID[index];
                _data.playerID = element

                await db.collection("notifications").add(_data)



            }
        } else {
            await db.collection("notifications").add(_data)

        }



        return null
    } catch (error) {
        return { isError: true, error: error }
    }


})

export const getStudents = fn.https.onCall(async (data, context) => {


    try {
        let studentIds = await (await db.collection("classrooms").where("advisorId", "==", data).get()).docs.map(t => t.data()["students"])

        let students: any[] = []
        studentIds.forEach(async t => {

            let student = await (await db.collection("users").doc(t).get()).data()

            students.push(student)


        })

        return students


    } catch (error) {
        return error
    }


})

export const getSendNotifications = fn.https.onCall(async (data, context) => {

    try {
        let sendNotifications: any = await (await db.collection('notifications').where("senderID", "==", data).get()).docs.map(t => t.data())

        for (let index = 0; index < sendNotifications.length; index++) {
            const element = sendNotifications[index];

            let player = await (await db.collection("players").doc(element.playerID).get()).data()

            element.player = player

        }

        return sendNotifications
    } catch (error) {
        return error
    }


})


export const addPossesion = fn.https.onCall(async (data, context) => {

    try {

        let configData = cloneDeep(data)

        delete configData['imageUrl']
        delete configData['isDeleted']

        let temp: any = (await remoteConfig.getTemplate())

        let possessionClass = JSON.parse(temp.parameters['Possesions'].defaultValue.value)

        let category = selectPropertyName(configData.categoryId)

        possessionClass[category.name].push(configData)

        temp.parameters["Possesions"].defaultValue.value = JSON.stringify(possessionClass)

        await remoteConfig.publishTemplate(temp)


        // await db.collection("possessions").add(data)
        return {
            ok: true
        }





    } catch (error) {
        return error
    }
})

export const editPossesion = fn.https.onCall(async (data, context) => {

    try {

        let configData = cloneDeep(data)

        delete configData['imageUrl']
        delete configData['isDeleted']

        let temp: any = (await remoteConfig.getTemplate())

        let possessionClass = JSON.parse(temp.parameters['Possesions'].defaultValue.value)

        let category = selectPropertyName(configData.categoryId)

        let index = possessionClass[category.name].findIndex((t: any) => t.id == configData.id)

        possessionClass[category.name][index] = configData

        temp.parameters["Possesions"].defaultValue.value = JSON.stringify(possessionClass)

        await remoteConfig.publishTemplate(temp)


        // await db.collection("possessions").add(data)
        return {
            ok: true
        }


    } catch (error) {
        return error
    }

})

export const generateCode = fn.https.onCall((data, context) => {

    const type = data.type

    let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    try {
        if (type == 1) {


            return db.collection("corporateStaffs").get().then((res) => {


                if (res.empty) {
                    return 'RIT00001'
                }


                let sortedArr = res.docs.sort((t, y) => t.createTime.seconds - y.createTime.seconds)

                const lastItem = sortedArr[sortedArr.length - 1]

                let lastCode = (lastItem.data()).code.toLowerCase()

                let str = ''
                for (let i of lastCode) {
                    if (isNaN(i)) {
                        let alpIndex = alphabet.indexOf(i);
                        if (alpIndex == (alphabet.length - 1)) {
                            str += alphabet[0];
                        }
                        else {
                            str += alphabet[alpIndex + 1];
                        }
                    }
                    else {
                        if (i == 9) {
                            str += alphabet[0];
                        }
                        else {
                            str += Number(i) + 1;
                        }
                    }
                }
                const code = str.toUpperCase();
                return code;





                //     debugger

            })


        } else if (type == 2) {
            let param = data.data
            let returnData = new Set()

            const uid = () => {
                return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
                    + Math.random().toString(16).slice(2)
                    + Date.now().toString(16).slice(4);
            };

            while (param.quantity != returnData.size) {
                let str = ""

                str += uid().slice(0, 8).toUpperCase()
                returnData.add(str)
            }

            return Array.from(returnData)



        }
    } catch (error) {
        return error
    }



})

export const getFAQ = fn.https.onCall(async (data, context) => {

    if (!data) {
        return {
            message: "Parametre eksik"
        }
    }

    try {
        let temp = await remoteConfig.getTemplate()

        let faq: any = temp.parameters[data]


        return JSON.parse(faq.defaultValue.value)

    } catch (error) {
        return error
    }




})

export const addFAQHeader = fn.https.onCall(async (data, context) => {


    try {
        let temp: any = (await remoteConfig.getTemplate())

        let faqs = temp.parameters["corporateFAQs"]

        let tempData: any[] = JSON.parse(faqs.defaultValue.value)

        tempData.push(data)

        faqs.defaultValue.value = JSON.stringify(tempData)

        await remoteConfig.publishTemplate(temp)

        return { ok: true }
    } catch (error) {
        return error
    }


})

export const editFAQHeader = fn.https.onCall(async (data, context) => {


    try {
        let temp: any = (await remoteConfig.getTemplate())

        let faqs = temp.parameters["corporateFAQs"]

        let tempData: any[] = JSON.parse(faqs.defaultValue.value)

        let header = tempData.find(t => t.id == data.id)

        header.header = data.header

        faqs.defaultValue.value = JSON.stringify(tempData)

        await remoteConfig.publishTemplate(temp)

        return { ok: true }
    } catch (error) {
        return error
    }


})

export const deleteFAQHeader = fn.https.onCall(async (data, context) => {


    try {
        let temp: any = (await remoteConfig.getTemplate())

        let faqs = temp.parameters["corporateFAQs"]

        let tempData: any[] = JSON.parse(faqs.defaultValue.value)

        let headerIndex = tempData.findIndex(t => t.id == data.id)

        tempData.splice(headerIndex, 1)

        faqs.defaultValue.value = JSON.stringify(tempData)

        await remoteConfig.publishTemplate(temp)

        return { ok: true }
    } catch (error) {
        return error
    }


})
export const addFAQ = fn.https.onCall(async (data, context) => {


    try {
        let temp: any = (await remoteConfig.getTemplate())

        let faqs = temp.parameters["corporateFAQs"]

        let tempData: any[] = JSON.parse(faqs.defaultValue.value)

        let header: any = tempData.find(t => t.id == data.parentId)

        if (header.faqs) {

            header.faqs.push(data)
        } else {
            header.faqs = [
                data
            ]
        }


        faqs.defaultValue.value = JSON.stringify(tempData)

        await remoteConfig.publishTemplate(temp)

        return { ok: true }
    } catch (error) {
        return error
    }


})

export const editFAQ = fn.https.onCall(async (data, context) => {


    try {
        let temp: any = (await remoteConfig.getTemplate())

        let faqs = temp.parameters["corporateFAQs"]

        let tempData: any[] = JSON.parse(faqs.defaultValue.value)

        let header: any = tempData.find(t => t.id == data.parentId)

        let faqIndex = header.faqs.findIndex((t: any) => t.id == data.id)


        header.faqs[faqIndex] = data

        faqs.defaultValue.value = JSON.stringify(tempData)

        await remoteConfig.publishTemplate(temp)

        return { ok: true }
    } catch (error) {
        return error
    }


})

export const deleteFAQ = fn.https.onCall(async (data, context) => {


    try {
        let temp: any = (await remoteConfig.getTemplate())

        let faqs = temp.parameters["corporateFAQs"]

        let tempData: any[] = JSON.parse(faqs.defaultValue.value)

        let header: any = tempData.find(t => t.id == data.parentId)

        let faqIndex = header.faqs.findIndex((t: any) => t.id == data.id)


        header.faqs.splice(faqIndex, 1)

        faqs.defaultValue.value = JSON.stringify(tempData)

        await remoteConfig.publishTemplate(temp)

        return { ok: true }
    } catch (error) {
        return error
    }


})

export const testSchedular = fn.pubsub.schedule("every 12 hours synchronized").timeZone("Europe/Istanbul").onRun(async (context) => {



    db.collection('players').get().then(res => {


        let players = res.docs.map(t => t.data())

        let mibdansArr: AverageMibdans[] = []
        let firstClass = []
        let secondClass = []
        let thirdClass = []
        let forthClass = []

        let playersVisual = { diff: 0, totalRows: 0 }
        let playersLogic = { diff: 0, totalRows: 0 }
        let playersVerbal = { diff: 0, totalRows: 0 }
        let playersHarmonic = { diff: 0, totalRows: 0 }
        let playersKinesthetic = { diff: 0, totalRows: 0 }

        let playersAnalytical = { diff: 0, totalRows: 0 }
        let playersCreative = { diff: 0, totalRows: 0 }
        let playersAdaptive = { diff: 0, totalRows: 0 }
        let playersLearningBased = { diff: 0, totalRows: 0 }
        let playersLateral = { diff: 0, totalRows: 0 }

        let allPlayerCount = 0

        for (let player of players) {

            let playerMibdans = player.mibdansLog.pop()
            let int = playerMibdans.intelligences
            let pss = playerMibdans.problemSolvingSkills

            let playerTsDate = playerMibdans.timestamp.toDate()

            let now = new Date()

            let sixtyDayAgo = new Date(new Date().setDate(now.getDate() - 60))



            if (playerTsDate >= sixtyDayAgo) {
                allPlayerCount++

                switch (player.grade) {
                    case 1:
                        firstClass.push({ int: int, pss: pss })
                        break;
                    case 2:
                        secondClass.push({ int: int, pss: pss })
                        break;
                    case 3:
                        thirdClass.push({ int: int, pss: pss })
                        break;
                    case 4:
                        forthClass.push({ int: int, pss: pss })
                        break;
                }

                for (let item of int) {


                    switch (item.title) {
                        case "Visual":
                            playersVisual.diff += item.difficulty || 0
                            playersVisual.totalRows += item.totalRawPoints || 0
                            break;

                        case "Verbal":
                            playersVerbal.diff += item.difficulty || 0
                            playersVerbal.totalRows += item.totalRawPoints || 0
                            break;
                        case "Kinesthetic":
                            playersKinesthetic.diff += item.difficulty || 0
                            playersKinesthetic.totalRows += item.totalRawPoints || 0
                            break;

                        case "Harmonic":
                            playersHarmonic.diff += item.difficulty || 0
                            playersKinesthetic.totalRows += item.totalRawPoints || 0
                            break;
                        case "Logic":
                            playersLogic.diff += item.difficulty || 0
                            playersKinesthetic.totalRows += item.totalRawPoints || 0
                            break;


                    }

                }

                for (let item of pss) {

                    switch (item.title) {
                        case "Adaptive":
                            playersAdaptive.diff += item.difficulty || 0 || 0
                            playersAdaptive.totalRows += item.totalRawPoints || 0
                            break;

                        case "Analytical":
                            playersAnalytical.diff += item.difficulty || 0
                            playersAnalytical.totalRows += item.totalRawPoints || 0
                            break;
                        case "Creative":
                            playersCreative.diff += item.difficulty || 0
                            playersCreative.totalRows += item.totalRawPoints || 0
                            break;

                        case "Lateral":
                            playersLateral.diff += item.difficulty || 0
                            playersLateral.totalRows += item.totalRawPoints || 0
                            break;
                        case "LearningBased":
                            playersLearningBased.diff += item.difficulty || 0
                            playersLearningBased.totalRows += item.totalRawPoints || 0
                            break;


                    }

                }



            }




        }




        let intMibdans: Mibdans = {
            typeId: 1,
            title: "inttelligents",
            report: [
                { title: "Visual", avgDifficulty: (playersVisual.diff / allPlayerCount), avgTotalRowPoints: (playersVisual.totalRows / allPlayerCount), typeId: 0 },
                { title: "Logic", avgDifficulty: (playersLogic.diff / allPlayerCount), avgTotalRowPoints: (playersLogic.totalRows / allPlayerCount), typeId: 1 },
                { title: "Verbal", avgDifficulty: (playersVerbal.diff / allPlayerCount), avgTotalRowPoints: (playersVerbal.totalRows / allPlayerCount), typeId: 2 },
                { title: "Harmonic", avgDifficulty: (playersHarmonic.diff / allPlayerCount), avgTotalRowPoints: (playersHarmonic.totalRows / allPlayerCount), typeId: 3 },
                { title: "Kinesthetic", avgDifficulty: (playersKinesthetic.diff / allPlayerCount), avgTotalRowPoints: (playersKinesthetic.totalRows / allPlayerCount), typeId: 4 }
            ]

        }
        let pssMibdans: Mibdans = {
            typeId: 2,
            title: "Problem Solving Skill",
            report: [
                { title: "Analytical ", avgDifficulty: (playersAnalytical.diff / allPlayerCount), avgTotalRowPoints: (playersAnalytical.totalRows / allPlayerCount), typeId: 0 },
                { title: "Creative", avgDifficulty: (playersCreative.diff / allPlayerCount), avgTotalRowPoints: (playersCreative.totalRows / allPlayerCount), typeId: 1 },
                { title: "Adaptive", avgDifficulty: (playersAdaptive.diff / allPlayerCount), avgTotalRowPoints: (playersAdaptive.totalRows / allPlayerCount), typeId: 2 },
                { title: "LearningBased", avgDifficulty: (playersLearningBased.diff / allPlayerCount), avgTotalRowPoints: (playersLearningBased.totalRows / allPlayerCount), typeId: 3 },
                { title: "Lateral", avgDifficulty: (playersLateral.diff / allPlayerCount), avgTotalRowPoints: (playersLateral.totalRows / allPlayerCount), typeId: 4 }
            ]
        }


        let allPlayerMibdans: AverageMibdans = {
            className: "Tum Siniflarin Ortalamasi",
            classTypeId: 0,
            data: [
                intMibdans,
                pssMibdans
            ]
        }

        mibdansArr.push(allPlayerMibdans)

        let firstClassVisual = { diff: 0, totalRows: 0 }
        let firstClassLogic = { diff: 0, totalRows: 0 }
        let firstClassVerbal = { diff: 0, totalRows: 0 }
        let firstClassHarmonic = { diff: 0, totalRows: 0 }
        let firstClassKinesthetic = { diff: 0, totalRows: 0 }

        let firstClassAnalytical = { diff: 0, totalRows: 0 }
        let firstClassCreative = { diff: 0, totalRows: 0 }
        let firstClassAdaptive = { diff: 0, totalRows: 0 }
        let firstClassLearningBased = { diff: 0, totalRows: 0 }
        let firstClassLateral = { diff: 0, totalRows: 0 }

        for (let player of firstClass) {

            for (let item of player.int) {


                switch (item.title) {
                    case "Visual":
                        firstClassVisual.diff += item.difficulty || 0
                        firstClassVisual.totalRows += item.totalRawPoints || 0
                        break;

                    case "Verbal":
                        firstClassVerbal.diff += item.difficulty || 0
                        firstClassVerbal.totalRows += item.totalRawPoints || 0
                        break;
                    case "Kinesthetic":
                        firstClassKinesthetic.diff += item.difficulty || 0
                        firstClassKinesthetic.totalRows += item.totalRawPoints || 0
                        break;

                    case "Harmonic":
                        firstClassHarmonic.diff += item.difficulty || 0
                        firstClassHarmonic.totalRows += item.totalRawPoints || 0
                        break;
                    case "Logic":
                        firstClassLogic.diff += item.difficulty || 0
                        firstClassLogic.totalRows += item.totalRawPoints || 0
                        break;


                }

            }

            for (let item of player.pss) {

                switch (item.title) {
                    case "Adaptive":
                        firstClassAdaptive.diff += item.difficulty || 0
                        firstClassAdaptive.totalRows += item.totalRawPoints || 0
                        break;

                    case "Analytical":
                        firstClassAnalytical.diff += item.difficulty || 0
                        firstClassAnalytical.totalRows += item.totalRawPoints || 0
                        break;
                    case "Creative":
                        firstClassCreative.diff += item.difficulty || 0
                        firstClassCreative.totalRows += item.totalRawPoints || 0
                        break;

                    case "Lateral":
                        firstClassLateral.diff += item.difficulty || 0
                        firstClassLateral.totalRows += item.totalRawPoints || 0
                        break;
                    case "LearningBased":
                        firstClassLearningBased.diff += item.difficulty || 0
                        firstClassLearningBased.totalRows += item.totalRawPoints || 0
                        break;


                }

            }

        }

        let firsClassIntMibdans: Mibdans = {
            typeId: 1,
            title: "inttelligents",
            report: [
                { title: "Visual", avgDifficulty: (firstClassVisual.diff / firstClass.length), avgTotalRowPoints: (firstClassVisual.totalRows / firstClass.length), typeId: 0 },
                { title: "Logic", avgDifficulty: (firstClassLogic.diff / firstClass.length), avgTotalRowPoints: (firstClassLogic.totalRows / firstClass.length), typeId: 1 },
                { title: "Verbal", avgDifficulty: (firstClassVerbal.diff / firstClass.length), avgTotalRowPoints: (firstClassVerbal.totalRows / firstClass.length), typeId: 2 },
                { title: "Harmonic", avgDifficulty: (firstClassHarmonic.diff / firstClass.length), avgTotalRowPoints: (firstClassHarmonic.totalRows / firstClass.length), typeId: 3 },
                { title: "Kinesthetic", avgDifficulty: (firstClassKinesthetic.diff / firstClass.length), avgTotalRowPoints: (firstClassKinesthetic.totalRows / firstClass.length), typeId: 4 }
            ]

        }
        let firstClassPssMibdans: Mibdans = {
            typeId: 2,
            title: "Problem Solving Skill",
            report: [
                { title: "Analytical ", avgDifficulty: (firstClassAnalytical.diff / firstClass.length), avgTotalRowPoints: (firstClassAnalytical.totalRows / firstClass.length), typeId: 0 },
                { title: "Creative", avgDifficulty: (firstClassCreative.diff / firstClass.length), avgTotalRowPoints: (firstClassCreative.totalRows / firstClass.length), typeId: 1 },
                { title: "Adaptive", avgDifficulty: (firstClassAdaptive.diff / firstClass.length), avgTotalRowPoints: (firstClassAdaptive.totalRows / firstClass.length), typeId: 2 },
                { title: "LearningBased", avgDifficulty: (firstClassLearningBased.diff / firstClass.length), avgTotalRowPoints: (firstClassLearningBased.totalRows / firstClass.length), typeId: 3 },
                { title: "Lateral", avgDifficulty: (firstClassLateral.diff / firstClass.length), avgTotalRowPoints: (firstClassLateral.totalRows / firstClass.length), typeId: 4 }
            ]
        }


        let firstClassMibdans: AverageMibdans = {
            className: "1.Siniflarin ortalamasi",
            classTypeId: 1,
            data: [
                firsClassIntMibdans,
                firstClassPssMibdans
            ]
        }

        mibdansArr.push(firstClassMibdans)

        let secondClassVisual = { diff: 0, totalRows: 0 }
        let secondClassLogic = { diff: 0, totalRows: 0 }
        let secondClassVerbal = { diff: 0, totalRows: 0 }
        let secondClassHarmonic = { diff: 0, totalRows: 0 }
        let secondClassKinesthetic = { diff: 0, totalRows: 0 }

        let secondClassAnalytical = { diff: 0, totalRows: 0 }
        let secondClassCreative = { diff: 0, totalRows: 0 }
        let secondClassAdaptive = { diff: 0, totalRows: 0 }
        let secondClassLearningBased = { diff: 0, totalRows: 0 }
        let secondClassLateral = { diff: 0, totalRows: 0 }

        for (let player of secondClass) {

            for (let item of player.int) {


                switch (item.title) {
                    case "Visual":
                        secondClassVisual.diff += item.difficulty || 0
                        secondClassVisual.totalRows += item.totalRawPoints || 0
                        break;

                    case "Verbal":
                        secondClassVerbal.diff += item.difficulty || 0
                        secondClassVerbal.totalRows += item.totalRawPoints || 0
                        break;
                    case "Kinesthetic":
                        secondClassKinesthetic.diff += item.difficulty || 0
                        secondClassKinesthetic.totalRows += item.totalRawPoints || 0
                        break;

                    case "Harmonic":
                        secondClassHarmonic.diff += item.difficulty || 0
                        secondClassHarmonic.totalRows += item.totalRawPoints || 0
                        break;
                    case "Logic":
                        secondClassLogic.diff += item.difficulty || 0
                        secondClassLogic.totalRows += item.totalRawPoints || 0
                        break;


                }

            }

            for (let item of player.pss) {

                switch (item.title) {
                    case "Adaptive":
                        secondClassAdaptive.diff += item.difficulty || 0
                        secondClassAdaptive.totalRows += item.totalRawPoints || 0
                        break;

                    case "Analytical":
                        secondClassAnalytical.diff += item.difficulty || 0
                        secondClassAnalytical.totalRows += item.totalRawPoints || 0
                        break;
                    case "Creative":
                        secondClassCreative.diff += item.difficulty || 0
                        secondClassCreative.totalRows += item.totalRawPoints || 0
                        break;

                    case "Lateral":
                        secondClassLateral.diff += item.difficulty || 0
                        secondClassLateral.totalRows += item.totalRawPoints || 0
                        break;
                    case "LearningBased":
                        secondClassLearningBased.diff += item.difficulty || 0
                        secondClassLearningBased.totalRows += item.totalRawPoints || 0
                        break;


                }

            }

        }

        let secondClassIntMibdans: Mibdans = {
            typeId: 1,
            title: "inttelligents",
            report: [
                { title: "Visual", avgDifficulty: (secondClassVisual.diff / secondClass.length), avgTotalRowPoints: (secondClassVisual.totalRows / secondClass.length), typeId: 0 },
                { title: "Logic", avgDifficulty: (secondClassLogic.diff / secondClass.length), avgTotalRowPoints: (secondClassLogic.totalRows / secondClass.length), typeId: 1 },
                { title: "Verbal", avgDifficulty: (secondClassVerbal.diff / secondClass.length), avgTotalRowPoints: (secondClassVerbal.totalRows / secondClass.length), typeId: 2 },
                { title: "Harmonic", avgDifficulty: (secondClassHarmonic.diff / secondClass.length), avgTotalRowPoints: (secondClassHarmonic.totalRows / secondClass.length), typeId: 3 },
                { title: "Kinesthetic", avgDifficulty: (secondClassKinesthetic.diff / secondClass.length), avgTotalRowPoints: (secondClassKinesthetic.totalRows / secondClass.length), typeId: 4 }
            ]

        }
        let secondClassPssMibdans: Mibdans = {
            typeId: 2,
            title: "Problem Solving Skill",
            report: [
                { title: "Analytical ", avgDifficulty: (secondClassAnalytical.diff / secondClass.length), avgTotalRowPoints: (secondClassAnalytical.totalRows / secondClass.length), typeId: 0 },
                { title: "Creative", avgDifficulty: (secondClassCreative.diff / secondClass.length), avgTotalRowPoints: (secondClassCreative.totalRows / secondClass.length), typeId: 1 },
                { title: "Adaptive", avgDifficulty: (secondClassAdaptive.diff / secondClass.length), avgTotalRowPoints: (secondClassAdaptive.totalRows / secondClass.length), typeId: 2 },
                { title: "LearningBased", avgDifficulty: (secondClassLearningBased.diff / secondClass.length), avgTotalRowPoints: (secondClassLearningBased.totalRows / secondClass.length), typeId: 3 },
                { title: "Lateral", avgDifficulty: (secondClassLateral.diff / secondClass.length), avgTotalRowPoints: (secondClassLateral.totalRows / secondClass.length), typeId: 4 }
            ]
        }


        let secondClassMibdans: AverageMibdans = {
            className: "2.Siniflarin ortalamasi",
            classTypeId: 2,
            data: [
                secondClassIntMibdans,
                secondClassPssMibdans
            ]
        }

        mibdansArr.push(secondClassMibdans)

        let thirdClassVisual = { diff: 0, totalRows: 0 }
        let thirdClassLogic = { diff: 0, totalRows: 0 }
        let thirdClassVerbal = { diff: 0, totalRows: 0 }
        let thirdClassHarmonic = { diff: 0, totalRows: 0 }
        let thirdClassKinesthetic = { diff: 0, totalRows: 0 }

        let thirdClassAnalytical = { diff: 0, totalRows: 0 }
        let thirdClassCreative = { diff: 0, totalRows: 0 }
        let thirdClassAdaptive = { diff: 0, totalRows: 0 }
        let thirdClassLearningBased = { diff: 0, totalRows: 0 }
        let thirdClassLateral = { diff: 0, totalRows: 0 }

        for (let player of thirdClass) {

            for (let item of player.int) {


                switch (item.title) {
                    case "Visual":
                        thirdClassVisual.diff += item.difficulty || 0
                        thirdClassVisual.totalRows += item.totalRawPoints || 0
                        break;

                    case "Verbal":
                        thirdClassVerbal.diff += item.difficulty || 0
                        thirdClassVerbal.totalRows += item.totalRawPoints || 0
                        break;
                    case "Kinesthetic":
                        thirdClassKinesthetic.diff += item.difficulty || 0
                        thirdClassKinesthetic.totalRows += item.totalRawPoints || 0
                        break;

                    case "Harmonic":
                        thirdClassHarmonic.diff += item.difficulty || 0
                        thirdClassHarmonic.totalRows += item.totalRawPoints || 0
                        break;
                    case "Logic":
                        thirdClassLogic.diff += item.difficulty || 0
                        thirdClassLogic.totalRows += item.totalRawPoints || 0
                        break;


                }

            }

            for (let item of player.pss) {

                switch (item.title) {
                    case "Adaptive":
                        thirdClassAdaptive.diff += item.difficulty || 0
                        thirdClassAdaptive.totalRows += item.totalRawPoints || 0
                        break;

                    case "Analytical":
                        thirdClassAnalytical.diff += item.difficulty || 0
                        thirdClassAnalytical.totalRows += item.totalRawPoints || 0
                        break;
                    case "Creative":
                        thirdClassCreative.diff += item.difficulty || 0
                        thirdClassCreative.totalRows += item.totalRawPoints || 0
                        break;

                    case "Lateral":
                        thirdClassLateral.diff += item.difficulty || 0
                        thirdClassLateral.totalRows += item.totalRawPoints || 0
                        break;
                    case "LearningBased":
                        thirdClassLearningBased.diff += item.difficulty || 0
                        thirdClassLearningBased.totalRows += item.totalRawPoints || 0
                        break;


                }

            }

        }

        let thirdClassIntMibdans: Mibdans = {
            typeId: 1,
            title: "inttelligents",
            report: [
                { title: "Visual", avgDifficulty: (thirdClassVisual.diff / thirdClass.length), avgTotalRowPoints: (thirdClassVisual.totalRows / thirdClass.length), typeId: 0 },
                { title: "Logic", avgDifficulty: (thirdClassLogic.diff / thirdClass.length), avgTotalRowPoints: (thirdClassLogic.totalRows / thirdClass.length), typeId: 1 },
                { title: "Verbal", avgDifficulty: (thirdClassVerbal.diff / thirdClass.length), avgTotalRowPoints: (thirdClassVerbal.totalRows / thirdClass.length), typeId: 2 },
                { title: "Harmonic", avgDifficulty: (thirdClassHarmonic.diff / thirdClass.length), avgTotalRowPoints: (thirdClassHarmonic.totalRows / thirdClass.length), typeId: 3 },
                { title: "Kinesthetic", avgDifficulty: (thirdClassKinesthetic.diff / thirdClass.length), avgTotalRowPoints: (thirdClassKinesthetic.totalRows / thirdClass.length), typeId: 4 }
            ]

        }
        let thirdClassPssMibdans: Mibdans = {
            typeId: 2,
            title: "Problem Solving Skill",
            report: [
                { title: "Analytical ", avgDifficulty: (thirdClassAnalytical.diff / thirdClass.length), avgTotalRowPoints: (thirdClassAnalytical.totalRows / thirdClass.length), typeId: 0 },
                { title: "Creative", avgDifficulty: (thirdClassCreative.diff / thirdClass.length), avgTotalRowPoints: (thirdClassCreative.totalRows / thirdClass.length), typeId: 1 },
                { title: "Adaptive", avgDifficulty: (thirdClassAdaptive.diff / thirdClass.length), avgTotalRowPoints: (thirdClassAdaptive.totalRows / thirdClass.length), typeId: 2 },
                { title: "LearningBased", avgDifficulty: (thirdClassLearningBased.diff / thirdClass.length), avgTotalRowPoints: (thirdClassLearningBased.totalRows / thirdClass.length), typeId: 3 },
                { title: "Lateral", avgDifficulty: (thirdClassLateral.diff / thirdClass.length), avgTotalRowPoints: (thirdClassLateral.totalRows / thirdClass.length), typeId: 4 }
            ]
        }


        let thirdClassMibdans: AverageMibdans = {
            className: "3.Siniflarin ortalamasi",
            classTypeId: 3,
            data: [
                thirdClassIntMibdans,
                thirdClassPssMibdans
            ]
        }

        mibdansArr.push(thirdClassMibdans)

        let forthClassVisual = { diff: 0, totalRows: 0 }
        let forthClassLogic = { diff: 0, totalRows: 0 }
        let forthClassVerbal = { diff: 0, totalRows: 0 }
        let forthClassHarmonic = { diff: 0, totalRows: 0 }
        let forthClassKinesthetic = { diff: 0, totalRows: 0 }

        let forthClassAnalytical = { diff: 0, totalRows: 0 }
        let forthClassCreative = { diff: 0, totalRows: 0 }
        let forthClassAdaptive = { diff: 0, totalRows: 0 }
        let forthClassLearningBased = { diff: 0, totalRows: 0 }
        let forthClassLateral = { diff: 0, totalRows: 0 }

        for (let player of forthClass) {

            for (let item of player.int) {


                switch (item.title) {
                    case "Visual":
                        forthClassVisual.diff += item.difficulty || 0
                        forthClassVisual.totalRows += item.totalRawPoints || 0
                        break;

                    case "Verbal":
                        forthClassVerbal.diff += item.difficulty || 0
                        forthClassVerbal.totalRows += item.totalRawPoints || 0
                        break;
                    case "Kinesthetic":
                        forthClassKinesthetic.diff += item.difficulty || 0
                        forthClassKinesthetic.totalRows += item.totalRawPoints || 0
                        break;

                    case "Harmonic":
                        forthClassHarmonic.diff += item.difficulty || 0
                        forthClassHarmonic.totalRows += item.totalRawPoints || 0
                        break;
                    case "Logic":
                        forthClassLogic.diff += item.difficulty || 0
                        forthClassLogic.totalRows += item.totalRawPoints || 0
                        break;


                }

            }

            for (let item of player.pss) {

                switch (item.title) {
                    case "Adaptive":
                        forthClassAdaptive.diff += item.difficulty || 0
                        forthClassAdaptive.totalRows += item.totalRawPoints || 0
                        break;

                    case "Analytical":
                        forthClassAnalytical.diff += item.difficulty || 0
                        forthClassAnalytical.totalRows += item.totalRawPoints || 0
                        break;
                    case "Creative":
                        forthClassCreative.diff += item.difficulty || 0
                        forthClassCreative.totalRows += item.totalRawPoints || 0
                        break;

                    case "Lateral":
                        forthClassLateral.diff += item.difficulty || 0
                        forthClassLateral.totalRows += item.totalRawPoints || 0
                        break;
                    case "LearningBased":
                        forthClassLearningBased.diff += item.difficulty || 0
                        forthClassLearningBased.totalRows += item.totalRawPoints || 0
                        break;


                }

            }

        }

        let forthClassIntMibdans: Mibdans = {
            typeId: 1,
            title: "inttelligents",
            report: [
                { title: "Visual", avgDifficulty: (forthClassVisual.diff / forthClass.length), avgTotalRowPoints: (forthClassVisual.totalRows / forthClass.length), typeId: 0 },
                { title: "Logic", avgDifficulty: (forthClassLogic.diff / forthClass.length), avgTotalRowPoints: (forthClassLogic.totalRows / forthClass.length), typeId: 1 },
                { title: "Verbal", avgDifficulty: (forthClassVerbal.diff / forthClass.length), avgTotalRowPoints: (forthClassVerbal.totalRows / forthClass.length), typeId: 2 },
                { title: "Harmonic", avgDifficulty: (forthClassHarmonic.diff / forthClass.length), avgTotalRowPoints: (forthClassHarmonic.totalRows / forthClass.length), typeId: 3 },
                { title: "Kinesthetic", avgDifficulty: (forthClassKinesthetic.diff / forthClass.length), avgTotalRowPoints: (forthClassKinesthetic.totalRows / forthClass.length), typeId: 4 }
            ]

        }
        let forthClassPssMibdans: Mibdans = {
            typeId: 2,
            title: "Problem Solving Skill",
            report: [
                { title: "Analytical ", avgDifficulty: (forthClassAnalytical.diff / forthClass.length), avgTotalRowPoints: (forthClassAnalytical.totalRows / forthClass.length), typeId: 0 },
                { title: "Creative", avgDifficulty: (forthClassCreative.diff / forthClass.length), avgTotalRowPoints: (forthClassCreative.totalRows / forthClass.length), typeId: 1 },
                { title: "Adaptive", avgDifficulty: (forthClassAdaptive.diff / forthClass.length), avgTotalRowPoints: (forthClassAdaptive.totalRows / forthClass.length), typeId: 2 },
                { title: "LearningBased", avgDifficulty: (forthClassLearningBased.diff / forthClass.length), avgTotalRowPoints: (forthClassLearningBased.totalRows / forthClass.length), typeId: 3 },
                { title: "Lateral", avgDifficulty: (forthClassLateral.diff / forthClass.length), avgTotalRowPoints: (forthClassLateral.totalRows / forthClass.length), typeId: 4 }
            ]
        }


        let forthClassMibdans: AverageMibdans = {
            className: "4.Siniflarin ortalamasi",
            classTypeId: 4,
            data: [
                forthClassIntMibdans,
                forthClassPssMibdans
            ]
        }

        mibdansArr.push(forthClassMibdans)

        db.collection("analysis").doc("averageMibdans").set({ averageMibdans: mibdansArr }).then().catch()



    })






})



export const deleteField = fn.https.onCall((data, context) => {

    return db.collection(data.collection).get().then(async res => {
        try {
            let obj: any = {}

            obj[data.key] = fs.FieldValue.delete()

            let promiseArr: Promise<any>[] = []

            res.forEach(t => promiseArr.push(t.ref.update(obj)))


            await Promise.all(promiseArr)

            return true
        } catch (error) {
            return error
        }


    })

})

export const deletePlayer = fn.https.onCall(async (data, context) => {

    try {
        let playerId = data.playerID

        let homeworkRef = await db.collection("homeworks").where("assigneeId", "==", playerId).get()
        let avatarsRef = await db.collection("avatars").where("playerID", "==", playerId).get()
        let calendarEventsRef = await db.collection("calendarEvents").where("playerID", "==", playerId).get()
        let scoresRef = await db.collection("scores").where("playerID", "==", playerId).get()
        let notificationsRef = await db.collection("notifications").where("playerID", "==", playerId).get()
        let classroomsRef = await db.collection("classrooms").where("students", "array-contains", playerId).get()


        homeworkRef.empty ? "" : homeworkRef.docs.forEach(async t => await t.ref.delete())
        avatarsRef.empty ? "" : avatarsRef.docs.forEach(async t => await t.ref.delete())
        calendarEventsRef.empty ? "" : calendarEventsRef.docs.forEach(async t => await t.ref.delete())
        scoresRef.empty ? "" : scoresRef.docs.forEach(async t => await t.ref.delete())
        notificationsRef.empty ? "" : notificationsRef.docs.forEach(async t => await t.ref.delete())

        if (!classroomsRef.empty) {
            let classrooms = classroomsRef.docs.map(t => t.data())

            for (let _class of classrooms) {

                _class.students.splice(_class.students.findIndex((t: any) => t === playerId), 1)

                await db.collection("classrooms").doc(_class.id).update(_class)
            }

        }

        await db.collection("players").doc(playerId).update({
            displayName: Common.deletedPlayer,
            metadata: {
                author: playerId,
                isDeleted: true,
                updated: fs.Timestamp.now()
            }
        })

        return {
            error: false
        }





    } catch (error) {
        return {
            error: true,
            err: error
        }

    }

})

// export const changeAllDocuments = fn.https.onCall(async (data, context) => {


// try {
//     let collectionRef = (await db.collection("players").get())

//     let collection: any[] = collectionRef.docs.map(t => t.data())


//     for (let item of collection) {


//         if (item.mibdansLog.length == 0) {
//             item.mibdansLog.push(item.mibdans)
//             await db.collection("players").doc(item.id).update({mibdansLog:item.mibdansLog})

//         }


//     }
//     return {ok:true}


// } catch (error) {
//     return {ok:false , error:error}
// }






// })

export const getHatamale = fn.https.onCall(async (data, context) => {

    let player: any = (await db.collection("players").doc(data.playerID).get()).data()

    let qq = []

    for (let index = 1; index < 11; index++) {

        console.log(index)
        let a
        if (index < 5) {
            let i = index * -1

            a = (await db.collection("players").where("rankings." + data.rankType, "==", player.rankings[data.rankType] + i).limit(1).get()).docs.map(t => t.data())[0]
        } else if (index == 5) {
            a = player


        } else {
            a = (await db.collection("players").where("rankings." + data.rankType, "==", player.rankings[data.rankType] + (index == 10 ? 5 : index % 5)).limit(1).get()).docs.map(t => t.data())[0]


        }

        qq.push(a)
    }

    return qq


})

export const calculateScoreRankings = fn.runWith({
    timeoutSeconds: 540,
    memory: "1GB"
}).pubsub.schedule('0 3 * * *').timeZone('Europe/Istanbul').onRun(async (context) => {

    try {
        await _calculateScoreRankings()

        return { ok: true }
    } catch (error) {
        return { ok: false, error: error }
    }


})

export const scheduleDatabaseBackup = fn.pubsub.schedule('every 24 hours').timeZone("Europe/Istanbul").onRun((context) => {


    try {

        return client.auth.sign(environment.privateKey).then(res => {


            const databaseName = client.databasePath(
                process.env['GCLOUD_PROJECT'] || 'ritimus-game',
                '(default)'
            );

            return client
                .exportDocuments({
                    name: databaseName,
                    outputUriPrefix: bucket + "/backups/" + new Date().toISOString(),
                    // Leave collectionIds empty to export all collections
                    // or define a list of collection IDs:
                    // collectionIds: ['users', 'posts']
                    collectionIds: [],

                })
                .then(responses => {
                    const response = responses[0];
                    console.log(`Operation Name: ${response['name']}`);
                    return response;
                })
                .catch(err => {
                    console.error(err);
                });


        })


    } catch (error) {
        return db.collection("shards").doc('backupErrors').collection("errors").add({ error })
    }


})


export const calculateClassroomAnalytic = fn.pubsub.schedule('0 7 * * *').timeZone("Europe/Istanbul").onRun(async (context) => {

    let errorClassroom
    try {
        let classroomRef = await db.collection("classrooms").get()

        let classrooms = classroomRef.docs.map(t => t.data())

        for (let classroom of classrooms) {

            errorClassroom = classroom

            if (classroom.students.length == 0) {
                continue
            }

            let searchArr = []
            while (classroom.students.length > 10) {

                let arr = classroom.students.splice(10)

                searchArr.push(arr)

            }

            searchArr.push(classroom.students)

            let players: any[] = []
            for (let students of searchArr) {
                let playersRef = await db.collection("players").where('id', "in", students).get()

                let _players = playersRef.docs.map(t => t.data())

                players = [
                    ...players,
                    ..._players
                ]


            }




            let calculateblePlayers = []

            for (let player of players) {


                let playerAnalytic = getPlayerAnalytic(player)

                let obj = {
                    player: player,
                    intelDiffBalance: playerAnalytic.intelDiffBalance.pop(),
                    problemDiffBalance: playerAnalytic.problemDiffBalance.pop(),
                    intelScoreBalance: playerAnalytic.intelScoreBalance.pop(),
                    problemScoreBalance: playerAnalytic.problemScoreBalance.pop()
                }

                calculateblePlayers.push(obj)


            }
            //debugger



            let returnData = {

                intelDiffBalance: [

                    createGraphData(classroom.className)
                ],
                problemDiffBalance: [

                    createGraphData(classroom.className)

                ],
                intelScoreBalance: [
                    createGraphData(classroom.className)

                ],

                problemScoreBalance: [
                    createGraphData(classroom.className)

                ]

            }




            calcAvgDataAnalysisType("intelDiffBalance", calculateblePlayers, returnData);


            calcAvgDataAnalysisType("problemDiffBalance", calculateblePlayers, returnData);


            calcAvgDataAnalysisType("intelScoreBalance", calculateblePlayers, returnData);


            calcAvgDataAnalysisType("problemScoreBalance", calculateblePlayers, returnData);


            classroom.analysis = returnData





        }

        await updateBulkData("classrooms", classrooms)

    } catch (error) {

        console.log(errorClassroom)
        console.log(error)


    }







})

export const calculateSchoolAnalytic = fn.pubsub.schedule('0 8 * * *').timeZone('Europe/Istanbul').onRun(async (context) => {

    let errorSchoolId
    try {
        let classroomsRef = await db.collection('classrooms').get()

        let classrooms: any[] = classroomsRef.docs.map(t => t.data())


        let schoolArr = groupBy(classrooms, (t) => t.schoolId)

        loop1:
        for (let schoolId in schoolArr) {

            errorSchoolId = schoolId
            const classroomsBySchool = schoolArr[schoolId]

            console.log(classroomsBySchool)



            let calculatableSchool: { schoolId: string, analysis: AnalyticalData } = {
                schoolId: schoolId,
                analysis: new AnalyticalData()
            }

            createSchoolAnalyticalData(calculatableSchool);



            let index = 0

            for (let i = 0; i < classroomsBySchool.length; i++) {
                if (!classroomsBySchool[i].analysis) {
                    continue loop1
                    index = i;
                    break;
                } else {
                }
            }


            calculateSchoolAnalyticalData(index, 'intelDiffBalance', classroomsBySchool, calculatableSchool)
            calculateSchoolAnalyticalData(index, 'intelScoreBalance', classroomsBySchool, calculatableSchool)
            calculateSchoolAnalyticalData(index, 'problemDiffBalance', classroomsBySchool, calculatableSchool)
            calculateSchoolAnalyticalData(index, 'problemScoreBalance', classroomsBySchool, calculatableSchool)



            await db.collection("schools").doc(calculatableSchool.schoolId).update({ analysis: { ...calculatableSchool.analysis } })







            // for (let i = 0; i < classroomsBySchool[0].analysis['intelDiffBalance'].data.length; i++) {

            //     let avgData = 0;

            //     for (let j = 0; j < calculateblePlayers.length; j++) {
            //         const element = calculateblePlayers[j];

            //         avgData += Number(element[analysisType].data[i]);



            //     }

            //     avgData /= calculateblePlayers[0][analysisType].data.length;

            //     returnData[analysisType][0].data.push(Number(avgData.toFixed(2)));


            // }







        }
    } catch (error) {
        errorSchoolId
        console.log(error)

    }




})


export const toggleGame = fn.https.onCall(async (data, context) => {



    let temp: any = (await remoteConfig.getTemplate())

    let gamesClass = JSON.parse(temp.parameters['Ritimus2_0_Games'].defaultValue.value)

    gamesClass[data.gameID].statusID = data.disabled ? 0 : 1

    temp.parameters["Ritimus2_0_Games"].defaultValue.value = JSON.stringify(gamesClass)


    await remoteConfig.publishTemplate(temp)

    return gamesClass




})

export const storageTest = fn.storage.object().onFinalize((res) => {

    let fileName = res.name?.split("/")[0]

    if (fileName == 'possessions-android-bundle' || fileName == 'possessions-ios-bundle') {
        db.collection("shards").doc('possessionsCheckDate').set({
            date: res.updated
        })
    }


})


export const addLocalization = fn.https.onCall(async (data, context) => {




    try {
        let slug = cloneDeep(data.slug)

        let result = await setLocalizationToRemoteConfig(data, slug);


        await db.collection("shards").doc("slugs").update({ slugs: fs.FieldValue.arrayUnion(slug) })



        return result

    } catch (error) {
        return error
    }



})

export const updateLocalization = fn.https.onCall(async (data , context) => {


    try {
        
        const slug:any = cloneDeep(data.slug)
        const slugKey:any = cloneDeep(data.slugKey)


        let result = await setLocalizationToRemoteConfig(data , slug , slugKey)

       let slugRef = await db.collection("shards").doc("slugs").get()

        let slugs:any = slugRef.data()

        
        slugs.slugs[slugs.slugs.indexOf(slugKey)] = slug

       await slugRef.ref.update(slugs)

        return result


    } catch (error) {
        return error
    }


})

export const deleteLocalization = fn.https.onCall(async(data , context) => {


    try {
        let temp:any = (await remoteConfig.getTemplate());
        let localizationClass = JSON.parse(temp.parameters['Localization'].defaultValue.value)
        let keys = Object.keys(localizationClass)


        for (let index = 0; index < keys.length; index++) {
            const element = keys[index];

            delete localizationClass[element][data]
            


        }


        temp.parameters['Localization'].defaultValue.value = JSON.stringify(localizationClass)
        await remoteConfig.publishTemplate(temp)


      await  db.collection("shards").doc('slugs').update({slugs: fs.FieldValue.arrayRemove(data)})


        return localizationClass




    } catch (error) {
        return
    }

})


export const addLanguageToLocalization = fn.https.onCall(async (data, context) => {

try {
    
    let temp:any = (await remoteConfig.getTemplate());

    let localizationClass = JSON.parse(temp.parameters['Localization'].defaultValue.value)

    localizationClass[data] = {};

    let slugs:any = (await db.collection("shards").doc("slugs").get()).data()

    for (let index = 0; index < slugs.slugs.length; index++) {
        const element = slugs.slugs[index];

        localizationClass[data][element] = "";

        
    }

    
    temp.parameters['Localization'].defaultValue.value = JSON.stringify(localizationClass)
    await remoteConfig.publishTemplate(temp)

    return localizationClass


} catch (error) {
    return error
}

})

export const doItSomething = fn.https.onCall(async (data, context) => {




    // let ref = await db.collection("subscriptions").get()

    //  let subData:any[] = ref.docs.map(t => t.data())


    //     for (let index = 0; index < subData.length; index++) {
    //         const element = subData[index];


    //         if (element.receipt == "" && element.subscriptionTypeID == 1) {
    //             subData[index].receipt = 'PROMO'
    //         }

    //     }

    // meiliSearch.index("subscriptions").addDocuments( subData, {primaryKey: 'id'}).then((res) => console.log(res)).catch((err) => console.log("HATA" , err))




    /*    try {
           let playerRef = await db.collection("players").doc('pggHw1eWaWLXu2Xwxi3h').get()
   
           let player: any = playerRef.data()
   
   
           let sametHocaRef = await db.collection("players").doc('6lvWmUoRxVtG9NqKzGPt').get()
   
           let sametHocaProblem: any = (sametHocaRef.data() as any).mibdans.intelligences[0].problems[0]
   
   
   
   
           let intel = player.mibdans.intelligences
           let solving = player.mibdans.problemSolvingSkills
   
   
           for (let item of intel) {
   
               for (let index = 0; index < 150; index++) {
                   item.problems.push(sametHocaProblem)
   
               }
   
   
           }
   
           for (let item of solving) {
               for (let index = 0; index < 150; index++) {
                   item.problems.push(sametHocaProblem)
   
               }
           }
   
           await playerRef.ref.update({ mibdans: player.mibdans })
   
   
           return { ok: true }
   
       } catch (error) {
           return { ok: false, err: error }
       }
   
   
   
    */







    // MIBDANS SILME
    // let errorPlayer = {}
    // try {
    //     const playersRef = await db.collection("players").get()


    //     let players: any = playersRef.docs.map(t => t.data())



    //     for (let player of players) {

    //         errorPlayer = player

    //         let newMibdansLog:any[] = cloneDeep(player.mibdansLog)

    //         for (let index = 0; index < player.mibdansLog.length; index++) {
    //             const element = player.mibdansLog[index];


    //             let date:Date = element.timestamp.toDate()

    //             if (date.getMonth() == 5) {
    //                 element.timestamp =  fs.Timestamp.fromDate(new Date(2022,4 , 1))
    //             }

    //         }


    //         player.mibdansLog = newMibdansLog



    //         await db.collection('players').doc(player.id).update({ mibdansLog: player.mibdansLog }) 



    //     }

    //     return { ok: true }
    // } catch (error) {
    //     errorPlayer
    //     return { ok: false }
    // }








})

export const getAuthUserById = fn.https.onCall((data, context) => {



    return auth.getUser(data.uid).then(res => {


        return res
    })


})


export const deleteUser = fn.https.onCall(async (data, context) => {


    try {
        await db.collection("users").doc(data.userId).update({
            email: "deleted_user", statusID: -1
        })
        await auth.deleteUser(data.userId)

        return {
            ok: true
        }

    } catch (error) {
        return error
    }

})

export const setSettings = fn.https.onCall(async (data, context) => {


    let temp: any = (await remoteConfig.getTemplate())

    try {
        for (let index = 0; index < data.length; index++) {
            const element: { value: any, key: string, type: string } = data[index];


            if (element.type == 'object') {
                let obj: any = {}

                const settingObj = element.value
                for (let settingKey in settingObj) {

                    const val = settingObj[settingKey]

                    obj[settingKey] = val.value

                }

                temp.parameters[element.key].defaultValue.value = JSON.stringify(obj)


            } else {
                temp.parameters[element.key].defaultValue.value = "" + element.value
            }

        }





        return await (await remoteConfig.publishTemplate(temp)).etag
    } catch (error) {
        return error
    }





})

export const synchronizeGames = fn.https.onCall(async (data, context) => {


    let temp: any = (await remoteConfig.getTemplate())

    let errorGame
    try {
        let gamesClass = JSON.parse(temp.parameters['Ritimus2_0_Games'].defaultValue.value)

        let dbGames = await db.collection("games").get()



        let entries = Object.entries(gamesClass)

        for (let index = 0; index < entries.length; index++) {
            const element: any = entries[index];

            errorGame = element

            if (dbGames.docs.includes(element[0])) {

                await db.collection("games").doc(element[0]).update(element[1]).then()
            } else {
                await db.collection("games").doc(element[0]).set(element[1]).then()

            }
        }


    } catch (error) {
        return db.collection('errors').add({
            func: 'synchronizeGames',
            date: fs.Timestamp.now(),
            errorGame: errorGame,
            error: error
        })
    }
    return { ok: true }








})

async function setLocalizationToRemoteConfig(data: any, slug: any , key = "") {
    let temp: any = (await remoteConfig.getTemplate())

    let localizationClass = JSON.parse(temp.parameters['Localization'].defaultValue.value)
    delete data['slug'];
    if (key) {
        delete data['slugKey']
    }

    let entries = Object.entries(data);


    for (let index = 0; index < entries.length; index++) {
        const element = entries[index];

        if (key) {
            delete localizationClass[element[0]][key]


        }
            
            localizationClass[element[0]][slug] = element[1];
        


    }

    temp.parameters['Localization'].defaultValue.value = JSON.stringify(localizationClass)
    await remoteConfig.publishTemplate(temp)

    return localizationClass

}

function createSchoolAnalyticalData(calculatableSchool: { schoolId: string; analysis: AnalyticalData; }) {
    calculatableSchool.analysis.intelDiffBalance = [
        {
            name: 'Değer',
            data: []
        }
    ];
    calculatableSchool.analysis.intelScoreBalance = [
        {
            name: 'Değer',
            data: []
        }
    ];
    calculatableSchool.analysis.problemDiffBalance = [
        {
            name: 'Değer',
            data: []
        }
    ];
    calculatableSchool.analysis.problemScoreBalance = [
        {
            name: 'Değer',
            data: []
        }
    ];
}

function calculateSchoolAnalyticalData(index: number,
    analysisType: "intelDiffBalance" | "problemDiffBalance" | "intelScoreBalance" | "problemScoreBalance",
    classroomsBySchool: any,
    calculatableSchool: any
) {

    for (let item of classroomsBySchool) {

        for (let i = 0; i < item.analysis[analysisType][0].data.length; i++) {

            let avgData = 0
            let classCount = 0
            for (let classroom of classroomsBySchool) {

                if (classroom.students.length == 0 || !classroom.analysis) {
                    continue
                }

                avgData += Number(classroom.analysis[analysisType][0].data[i])
                classCount++


            }

            calculatableSchool.analysis[analysisType][0].data.push(Number((avgData / classCount).toFixed(2)))



        }


    }



}

function calcAvgDataAnalysisType(analysisType: "intelDiffBalance" | "problemDiffBalance" | "intelScoreBalance" | "problemScoreBalance", calculateblePlayers: { player: FirebaseFirestore.DocumentData; intelDiffBalance: any; problemDiffBalance: any; intelScoreBalance: any; problemScoreBalance: any; }[], returnData: { intelDiffBalance: { name: string; data: any[]; }[]; problemDiffBalance: { name: string; data: any[]; }[]; intelScoreBalance: { name: string; data: any[]; }[]; problemScoreBalance: { name: string; data: any[]; }[]; }) {
    for (let i = 0; i < calculateblePlayers[0][analysisType].data.length; i++) {

        let avgData = 0;

        for (let j = 0; j < calculateblePlayers.length; j++) {
            const element = calculateblePlayers[j];

            avgData += Number(element[analysisType].data[i]);



        }

        avgData /= calculateblePlayers[0][analysisType].data.length;

        returnData[analysisType][0].data.push(Number(avgData.toFixed(2)));


    }
}

async function updateBulkData(collection: string, data: any[]) {

    var batch = db.bulkWriter()
    let promises: Promise<any>[] = []
    let counter = 0;


    data.forEach(item => {

        counter++

        let docRef = db.collection(collection).doc(item.id)


        batch.update(docRef, item)

        if (counter >= 500) {
            promises.push(batch.flush());
            counter = 0;
            batch = db.bulkWriter();
        }
        if (counter) {

            promises.push(batch.flush());

        }


    })
    try {

        await Promise.all(promises);
    } catch (error) {
        console.log("----------hata---------")
        throw (error)
    }


}

function getPlayerAnalytic(player: any) {


    console.log(player)

    let analyticData = new AnalyticalData()

    let lastMibdans = cloneDeep(player.mibdansLog).pop()
    let mibdans = cloneDeep(player.mibdans)

    let intelObj = createGraphData()
    let intelScoreObj = createGraphData()
    for (let i = 0; i < mibdans.intelligences.length; i++) {

        // debugger
        let intel = mibdans.intelligences[i]
        let lastIntel = { totalRawPoints: 0 }

        if (lastMibdans) {
            lastIntel = lastMibdans.intelligences[i]
        }

        intelObj.data.push(intel.difficulty)
        intelScoreObj.data.push(

            intel.totalRawPoints - lastIntel.totalRawPoints

        )



    }

    analyticData.intelDiffBalance.push(intelObj)
    analyticData.intelScoreBalance.push(intelScoreObj)

    let problemObj = createGraphData()
    let problemScoreObj = createGraphData()

    for (let i = 0; i < mibdans.problemSolvingSkills.length; i++) {

        let problem = mibdans.problemSolvingSkills[i]
        let lastProblem = { totalRawPoints: 0 }

        if (lastMibdans) {
            lastProblem = lastMibdans.problemSolvingSkills[i]
        }
        problemObj.data.push(problem.difficulty)

        problemScoreObj.data.push(

            problem.totalRawPoints - lastProblem.totalRawPoints

        )

    }

    analyticData.problemDiffBalance.push(problemObj)
    analyticData.problemScoreBalance.push(problemScoreObj)


    return analyticData

}

function createGraphData(name = 'Değer') {

    return Object.assign({}, { name: name, data: new Array() })

}


async function _calculateScoreRankings() {

    let players = (await db.collection("players").get()).docs.map(t => t.data());
    //  let classes: { firstClass: any[], secondClass: any[], thirdClass: any[], fourthClass: any[] } = { firstClass: [], secondClass: [], thirdClass: [], fourthClass: [] }
    let errorPlayer
    try {

        let month = new Date().getMonth();
        let orderablePlayers = [];


        for (let index = 0; index < players.length; index++) {
            const player = players[index];
            errorPlayer = player

            if (player.displayName == Common.deletedPlayer) {
                await meiliSearch.index("scoreBoardInfos").deleteDocument(player.id)
                continue;
            }

            if (player.mibdans == null || Object.keys(player.mibdans).length == 0) {
                await db.collection("players").doc(player.id).update({
                    rankings: {
                        Visual: players.length,
                        Logic: players.length,
                        Verbal: players.length,
                        Harmonic: players.length,
                        Kinesthetic: players.length,
                        Analytical: players.length,
                        Creative: players.length,
                        Adaptive: players.length,
                        LearningBased: players.length,
                        Lateral: players.length,
                        GeneralRanking: players.length
                    }
                });
                continue
            }
            if (player.mibdans.timestamp.toDate().getMonth() != month) {
                await db.collection("players").doc(player.id).update({
                    rankings: {
                        Visual: players.length,
                        Logic: players.length,
                        Verbal: players.length,
                        Harmonic: players.length,
                        Kinesthetic: players.length,
                        Analytical: players.length,
                        Creative: players.length,
                        Adaptive: players.length,
                        LearningBased: players.length,
                        Lateral: players.length,
                        GeneralRanking: players.length
                    }
                })
                continue;
            }


            //    let avatar = (await db.collection("avatars").where("playerID", "==", player.id).get()).docs.map(t => t.data())[0];
            let streak = 0;
            let today = new Date().setHours(0, 0, 0, 0);

            if (!player.activity || player.activity.length == 0 || !player.activity[player.activity.length - 1 - streak].logDate) {
                await db.collection("players").doc(player.id).update({
                    rankings: {
                        Visual: players.length,
                        Logic: players.length,
                        Verbal: players.length,
                        Harmonic: players.length,
                        Kinesthetic: players.length,
                        Analytical: players.length,
                        Creative: players.length,
                        Adaptive: players.length,
                        LearningBased: players.length,
                        Lateral: players.length,
                        GeneralRanking: players.length
                    }
                })
                continue
            }


            while (player.activity[player.activity.length - 1 - streak].logDate.toDate().setHours(0, 0, 0, 0) == today) {
                today = calculateYesterdayOrTomorow(new Date(today));
                streak++;
                // errorStreak = streak
                if (player.activity.length == streak) {
                    break
                }
            }
            let mibdans = player.mibdans;
            let intelligences = mibdans.intelligences;
            let problemSolvingSkills = mibdans.problemSolvingSkills;
            let orderablePlayer: any = {
                playerID: player.id,
                dayStreak: streak,
                grade: player.grade,
                player: player,
                GeneralRanking: {
                    totalRawPoints: 0,
                    difficulty: 0
                }
            };
            for (let intel of intelligences) {

                let lastIntel = { totalRawPoints: 0 }

                if (player.mibdansLog.length > 0) {
                    lastIntel = player.mibdansLog[player.mibdansLog.length - 1].intelligences.find((t: any) => t.title == intel.title);

                }
                let lastTotalRawPoints = (intel.totalRawPoints - lastIntel.totalRawPoints);
                orderablePlayer[intel.title] = {
                    totalRawPoints: lastTotalRawPoints,
                    difficulty: intel.difficulty
                };
                orderablePlayer.GeneralRanking.totalRawPoints += lastTotalRawPoints;
                orderablePlayer.GeneralRanking.difficulty += intel.difficulty;
            }
            orderablePlayer.GeneralRanking.totalRawPoints = orderablePlayer.GeneralRanking.totalRawPoints / intelligences.length;
            orderablePlayer.GeneralRanking.difficulty = orderablePlayer.GeneralRanking.difficulty / intelligences.length;
            let totalTotalRawPoint = 0;
            let totalDifficulty = 0;
            for (let skill of problemSolvingSkills) {


                let lastSkill = { totalRawPoints: 0 }

                if (player.mibdansLog.length > 0) {

                    lastSkill = player.mibdansLog[player.mibdansLog.length - 1].problemSolvingSkills.find((t: any) => t.title == skill.title);
                }

                let lastTotalRawPoints = (skill.totalRawPoints - lastSkill.totalRawPoints);
                orderablePlayer[skill.title] = {
                    totalRawPoints: lastTotalRawPoints,
                    difficulty: skill.difficulty

                };
                totalTotalRawPoint += totalTotalRawPoint;
                totalDifficulty += skill.difficulty;
            }
            orderablePlayer.GeneralRanking.totalRawPoints += totalTotalRawPoint / problemSolvingSkills.length;
            orderablePlayer.GeneralRanking.difficulty += totalDifficulty / problemSolvingSkills.length;
            orderablePlayer.GeneralRanking.totalRawPoints /= 2;
            orderablePlayer.GeneralRanking.difficulty /= 2;

            // switch (player.grade) {
            //     case 1:

            //         classes.firstClass.push(orderablePlayer)
            //         break;

            //     case 2:
            //         classes.secondClass.push(orderablePlayer)

            //         break
            //     case 3:
            //         classes.thirdClass.push(orderablePlayer)

            //         break
            //     case 4:
            //         classes.fourthClass.push(orderablePlayer)

            //         break

            // }
            orderablePlayers.push(orderablePlayer);
        }

        let Visual, Logic, Verbal, Harmonic, Kinesthetic, Analytical, Creative, Adaptive, Lateral, LearningBased, GeneralRanking;

        Visual = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'Visual'))
        Logic = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'Logic'))
        Verbal = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'Verbal'))
        Harmonic = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'Harmonic'))
        Kinesthetic = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'Kinesthetic'))
        Analytical = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'Analytical'))
        Creative = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'Creative'))
        Adaptive = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'Adaptive'))
        Lateral = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'Lateral'))
        LearningBased = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'LearningBased'))
        GeneralRanking = cloneDeep(orderablePlayers).sort((a: any, b: any) => compare(a, b, 'GeneralRanking'))

        let meiliPlayers = []
        for (let player of orderablePlayers) {
            let rankings = {
                Visual: Visual.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                Logic: Logic.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                Verbal: Verbal.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                Harmonic: Harmonic.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                Kinesthetic: Kinesthetic.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                Analytical: Analytical.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                Creative: Creative.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                Adaptive: Adaptive.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                Lateral: Lateral.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                LearningBased: LearningBased.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                GeneralRanking: GeneralRanking.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
                Visual_Score: Visual.find((t: { playerID: any; }) => t.playerID == player.playerID).Visual.totalRawPoints,
                Logic_Score: Logic.find((t: { playerID: any; }) => t.playerID == player.playerID).Logic.totalRawPoints,
                Verbal_Score: Verbal.find((t: { playerID: any; }) => t.playerID == player.playerID).Verbal.totalRawPoints,
                Harmonic_Score: Harmonic.find((t: { playerID: any; }) => t.playerID == player.playerID).Harmonic.totalRawPoints,
                Kinesthetic_Score: Kinesthetic.find((t: { playerID: any; }) => t.playerID == player.playerID).Kinesthetic.totalRawPoints,
                Analytical_Score: Analytical.find((t: { playerID: any; }) => t.playerID == player.playerID).Analytical.totalRawPoints,
                Creative_Score: Creative.find((t: { playerID: any; }) => t.playerID == player.playerID).Creative.totalRawPoints,
                Adaptive_Score: Adaptive.find((t: { playerID: any; }) => t.playerID == player.playerID).Adaptive.totalRawPoints,
                Lateral_Score: Lateral.find((t: { playerID: any; }) => t.playerID == player.playerID).Lateral.totalRawPoints,
                LearningBased_Score: LearningBased.find((t: { playerID: any; }) => t.playerID == player.playerID).LearningBased.totalRawPoints,
                GeneralRanking_Score: GeneralRanking.find((t: { playerID: any; }) => t.playerID == player.playerID).GeneralRanking.totalRawPoints,
                Visual_Grade: player.grade,
                Logic_Grade: player.grade,
                Verbal_Grade: player.grade,
                Harmonic_Grade: player.grade,
                Kinesthetic_Grade: player.grade,
                Analytical_Grade: player.grade,
                Creative_Grade: player.grade,
                Adaptive_Grade: player.grade,
                Lateral_Grade: player.grade,
                LearningBased_Grade: player.grade,
                GeneralRanking_Grade: player.grade,
            }
            let obj = {
                playerID: player.playerID,
                displayName: player.player.displayName,
                ...rankings
            }
            meiliPlayers.push(obj)
            await db.collection("players").doc(player.playerID).update({ rankings: rankings })
        }
        await meiliSearch.index("scoreBoardInfos").updateDocuments(meiliPlayers, { primaryKey: 'playerID' })
        console.log("Meiliye ekledim")

        // for(let item of Object.keys(classes)){

        //     let Visual, Logic, Verbal, Harmonic, Kinesthetic, Analytical, Creative, Adaptive, Lateral, LearningBased, GeneralRanking;



        //     Visual = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'Visual'))
        //     Logic = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'Logic'))
        //     Verbal = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'Verbal'))
        //     Harmonic = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'Harmonic'))
        //     Kinesthetic = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'Kinesthetic'))
        //     Analytical = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'Analytical'))
        //     Creative = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'Creative'))
        //     Adaptive = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'Adaptive'))
        //     Lateral = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'Lateral'))
        //     LearningBased = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'LearningBased'))
        //     GeneralRanking = cloneDeep((classes as any)[item]).sort((a: any, b: any) => compare(a, b, 'GeneralRanking'))

        //     for (let player of (classes as any)[item]) {

        //         let rankings = {

        //             Visual: Visual.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             Logic: Logic.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             Verbal: Verbal.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             Harmonic: Harmonic.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             Kinesthetic: Kinesthetic.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             Analytical: Analytical.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             Creative: Creative.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             Adaptive: Adaptive.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             Lateral: Lateral.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             LearningBased: LearningBased.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,
        //             GeneralRanking: GeneralRanking.findIndex((t: { playerID: any; }) => t.playerID == player.playerID) + 1,

        //             Visual_Score: Visual.find((t: { playerID: any; }) => t.playerID == player.playerID).Visual.totalRawPoints,
        //             Logic_Score: Logic.find((t: { playerID: any; }) => t.playerID == player.playerID).Logic.totalRawPoints,
        //             Verbal_Score: Verbal.find((t: { playerID: any; }) => t.playerID == player.playerID).Verbal.totalRawPoints,
        //             Harmonic_Score: Harmonic.find((t: { playerID: any; }) => t.playerID == player.playerID).Harmonic.totalRawPoints,
        //             Kinesthetic_Score: Kinesthetic.find((t: { playerID: any; }) => t.playerID == player.playerID).Kinesthetic.totalRawPoints,
        //             Analytical_Score: Analytical.find((t: { playerID: any; }) => t.playerID == player.playerID).Analytical.totalRawPoints,
        //             Creative_Score: Creative.find((t: { playerID: any; }) => t.playerID == player.playerID).Creative.totalRawPoints,
        //             Adaptive_Score: Adaptive.find((t: { playerID: any; }) => t.playerID == player.playerID).Adaptive.totalRawPoints,
        //             Lateral_Score: Lateral.find((t: { playerID: any; }) => t.playerID == player.playerID).Lateral.totalRawPoints,
        //             LearningBased_Score: LearningBased.find((t: { playerID: any; }) => t.playerID == player.playerID).LearningBased.totalRawPoints,
        //             GeneralRanking_Score: GeneralRanking.find((t: { playerID: any; }) => t.playerID == player.playerID).GeneralRanking.totalRawPoints,

        //             Visual_Grade: player.grade,
        //             Logic_Grade: player.grade,
        //             Verbal_Grade: player.grade,
        //             Harmonic_Grade: player.grade,
        //             Kinesthetic_Grade: player.grade,
        //             Analytical_Grade: player.grade,
        //             Creative_Grade: player.grade,
        //             Adaptive_Grade: player.grade,
        //             Lateral_Grade: player.grade,
        //             LearningBased_Grade: player.grade,
        //             GeneralRanking_Grade: player.grade,
        //         }

        //         await db.collection("players").doc(player.playerID).update({ rankings: rankings })


        //     }




        // }




        let year = new Date().getFullYear();
        let todayOfCurrentMonth = new Date(year, month, 1);
        let season = await db.collection("seasons").where("startDate", "==", fs.Timestamp.fromDate(todayOfCurrentMonth)).get();

        if (season.empty) {
            let newSeason = {
                id: db.collection("_").doc().id,
                name: "",
                startDate: fs.Timestamp.fromDate(todayOfCurrentMonth),
                intelligenceRanking: {},
                solvingRanking: {},
                generalRanking: []
            };
            await db.collection('seasons').doc(newSeason.id).set(newSeason);

        }






    } catch (err) {
        const error: any = err
        errorPlayer

        if (error.message.includes("intelligences") || error.message.includes("problemSolvingSkills")) {
            for (let item of players) {
                if (item.mibdansLog.length == 0) {
                    item.mibdansLog.push(item.mibdans)
                    await db.collection("players").doc(item.id).update({ mibdansLog: item.mibdansLog })

                }
            }

            _calculateScoreRankings()

        } else {
            throw {
                error,
                errorPlayer
            }
        }

    }


}

async function setGamesToRemoteConfig(data: any) {
    try {

        let temp: any = await remoteConfig.getTemplate()

        let gamesObj = JSON.parse(temp.parameters["Ritimus2_0_Games"].defaultValue.value);


        if (data.statusID == -1) {

            delete gamesObj[data.gameID]

        } else {

            gamesObj[data.gameID] = data
        }


        temp.parameters["Ritimus2_0_Games"].defaultValue.value = JSON.stringify(gamesObj)

        let publish = await remoteConfig.publishTemplate(temp)

        return {
            isError: false, etag: publish.etag
        };
    }
    catch (error) {
        return {
            isError: true, error: error
        };
    }
}

function updateMetaData(snap: Change<QueryDocumentSnapshot>, docId: string, authorId: string | undefined, args: any) {


    snap.after.ref.update({
        metadata: {
            authorId: authorId || docId,
            ...args
        }
    }).then()
    // console.log({parentId , docId , authorId , args})
    // db.collection(parentId).doc(docId).update({
    //     metadata: {
    //         author: authorId || docId,
    //         confirm: false,
    //         ...args
    //     }
    // }).then()
}

function selectPropertyName(categoryId: any) {

    return categories[categoryId]
}

// function createAndroidTemple(data: any, obj: any): object {


//     obj[data.internalId] = {
//         bundleUrl: data.android.bundleUrl,
//         bundleCRC: data.android.crc,
//         bundleHash: data.android.hash
//     }

//     return obj

// }

// function createIosTemple(data: any, obj: any): object {


//     obj[data.internalId] = {
//         bundleUrl: data.ios.bundleUrl,
//         bundleCRC: data.ios.crc,
//         bundleHash: data.ios.hash
//     }

//     return obj

// }


function compare(a: any, b: any, state: string) {
    if (a[state].totalRawPoints < b[state].totalRawPoints) {
        return 1;
    } else if (a[state].totalRawPoints > b[state].totalRawPoints) {
        return -1;
    } else {
        return 0;
    }
}

// function findDuplicates(array: any[]) {

//     let indexList = []

//     return array.filter((item, index) => {

//         if (array.indexOf(item) == index) {
//             indexList.push(index)
//             return true

//         }

//         return false

//     })



// }




/* WEBGL FONKSIYONLARI */

export const WebGLGetCollection = fn.https.onRequest(async (req, res) => {

    res.status(404).append("Access-Control-Allow-Origin", "*").append('Access-Control-Allow-Headers', '*').send({ annen: 'validen' })






})


export const WGGetCollection = fn.https.onRequest((req, res) => {


    const data = (req.body.data as string)


    db.collection(data).get().then(_res => {

        let collection = _res.docs.map(t => t.data())

        webGLSend(req,res, collection)

    })




})

export const WGGetDocument = fn.https.onRequest((req, res) => {

    const data = JSON.parse((req.body.data as string))


    let collection : FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> | FirebaseFirestore.Query<FirebaseFirestore.DocumentData>
    = db.collection(data.collectionName)

    if (data.id) {
        (collection as FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> ).doc(data.id).get().then(_res => {

            const _data = _res.data()


            webGLSend(req ,res, _data)

        })
    } else if (Array.isArray(data.queryFilter)) {



        for (let index = 0; index < data.queryFilter.length; index++) {
            const element = data.queryFilter[index];

          collection =  collection.where(element.fieldName, element.operator, element.fieldValue)

        }


        collection.get().then(_res => {

            const _data = _res.docs.map(t => t.data())


            webGLSend(req,res, _data)

        })
    }




})

export const WGAddDocument = fn.https.onRequest((req, res) => {

    const data = JSON.parse((req.body.data as string))

    db.collection(data.collectionName).add(data.value).then((_res) => {


        webGLSend(req ,res, _res.id)


    })



})

export const WGUpdateDocument = fn.https.onRequest((req, res) => {

    const data = JSON.parse((req.body.data as string))

    db.collection(data.collectionName).doc(data.id).update(data.value).then((_res) => {


        webGLSend(req, res, true)


    })



})

export const WGDeletePlayer = fn.https.onRequest(async (req, res) => {

    const playerId: string = (req.body.data as string)

    // YAPILMAYA DEVAM EDILECEK

    let homeworkRef = await db.collection("homeworks").where("assigneeId", "==", playerId).get()
    let avatarsRef = await db.collection("avatars").where("playerID", "==", playerId).get()
    let calendarEventsRef = await db.collection("calendarEvents").where("playerID", "==", playerId).get()
    let scoresRef = await db.collection("scores").where("playerID", "==", playerId).get()
    let notificationsRef = await db.collection("notifications").where("playerID", "==", playerId).get()
    let classroomsRef = await db.collection("classrooms").where("students", "array-contains", playerId).get()


    homeworkRef.empty ? "" : homeworkRef.docs.forEach(async t => await t.ref.delete())
    avatarsRef.empty ? "" : avatarsRef.docs.forEach(async t => await t.ref.delete())
    calendarEventsRef.empty ? "" : calendarEventsRef.docs.forEach(async t => await t.ref.delete())
    scoresRef.empty ? "" : scoresRef.docs.forEach(async t => await t.ref.delete())
    notificationsRef.empty ? "" : notificationsRef.docs.forEach(async t => await t.ref.delete())

    if (!classroomsRef.empty) {
        let classrooms = classroomsRef.docs.map(t => t.data())

        for (let _class of classrooms) {

            _class.students.splice(_class.students.findIndex((t: any) => t === playerId), 1)

            await db.collection("classrooms").doc(_class.id).update(_class)
        }

    }

    await db.collection("players").doc(playerId).update({
        displayName: Common.deletedPlayer,
        metadata: {
            author: playerId,
            isDeleted: true,
            updated: fs.Timestamp.now()
        }
    })


  return  webGLSend(req, res, true)



})

export const WGGetTimestamp = fn.https.onRequest((req , res ) => {



    const timestamp = fs.Timestamp.now()

    webGLSend(req, res , timestamp)


})


export const WGDeleteDocument = fn.https.onRequest((req, res) => {

    const data = JSON.parse((req.body.data as string))


    let collection : FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> | FirebaseFirestore.Query<FirebaseFirestore.DocumentData>
    = db.collection(data.collectionName)

    if (data.id) {
    
        (collection as FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> ).doc(data.id).delete().then(_res => {

            webGLSend(req ,res, null)

        })
    } else if (Array.isArray(data.queryFilter)) {
    
        for (let index = 0; index < data.queryFilter.length; index++) {
            const element = data.queryFilter[index];

          collection =  collection.where(element.fieldName, element.operator, element.fieldValue)

        }

        collection.get().then(_res => {
                
                let _data = _res.docs.map(t => t.data())
    
                _data.forEach(async t => {
    
                    await db.collection(data.collectionName).doc(t.id).delete()
    
                })
    
                webGLSend(req,res, null)
    
            })
    } 



})



function webGLSend(req: functions.https.Request, res: functions.Response<any>, data: any) {

    _cors(req ,res  , () => {

        res.status(200).append("Access-Control-Allow-Origin", "*").append('Access-Control-Allow-Headers', '*').send(data)

    })



}