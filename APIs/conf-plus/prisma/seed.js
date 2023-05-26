import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const conferencesPath = path.join(process.cwd(), 'data/confereces.json')
const papersPath = path.join(process.cwd(), 'data/papers.json')
const reviewsPath = path.join(process.cwd(), 'data/reviews.json')
const usersPath = path.join(process.cwd(), 'data/users.json')
const locationsPath = path.join(process.cwd(), 'data/locations.json')
const institutionsPath = path.join(process.cwd(), 'data/institutions.json')
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

async function main() {
    try {
        let conferences = await fs.promises.readFile(conferencesPath)
        conferences = JSON.parse(conferences)
        let papers = await fs.promises.readFile(papersPath)
        papers = JSON.parse(papers)
        let reviews = await fs.promises.readFile(reviewsPath)
        reviews = JSON.parse(reviews)
        let users = await fs.promises.readFile(usersPath)
        users = JSON.parse(users)
        let locations = await fs.promises.readFile(locationsPath)
        locations = JSON.parse(locations)
        let institutions = await fs.promises.readFile(institutionsPath)
        institutions = JSON.parse(institutions)

        // createMany is not supported for SQLite. Use create instead
        for (const institution of institutions) {

            await prisma.institution.upsert({
                where: { name : institution.name },
                update: {},
                create: {
                    "name": institution.name,
                }
            });
        }
            
        for (const location of locations) await prisma.location.upsert({
            where: { city: location.city },
            update: {},
            create: {
                "city": location.city,
            }
        })

        // create the user and the author, reviewer, or organizer
        for (const user of users) {
            const newUser = await prisma.user.upsert({
                where: { email: user.email },
                update: {},
                create: {
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "password": user.password
                    }
            });

            // There are three types of users: author, reviewer, and organizer
            // The user type is determined by the role field

            if (user.role === "author")
                await prisma.author.upsert({
                    where: { user_id: newUser.user_id },
                    update: {},
                    create: {
                        "user_id": newUser.user_id,
                        "institution_id": "cli4ugu7n0000una458kvawna"
                    }
                });
            
            if (user.role === "reviewer")
                await prisma.reviewer.upsert({
                    where: { user_id: newUser.user_id },
                    update: {},
                    create: {
                        "user_id": newUser.user_id,
                    }
                });
            
            if (user.role === "organizer")
                await prisma.organizer.upsert({
                    where: { user_id: newUser.user_id },
                    update: {},
                    create: {
                        "user_id": newUser.user_id
                    }
                });
        }

        // Conferences
        // for (const conference of conferences) {
        //     const newConf = await prisma.conference.create({
        //         data: {
        //             img: conference.img,
        //             title: conference.title,
        //             start_date: conference.start_date,
        //             end_date: conference.end_date,
        //         }
        //     });
            
        //     for (const session of conference.sessions) 
        //         await prisma.session.create({
        //             data: {
        //                 "conference_id": newConf.conference_id,
        //                 "day": session.day,
        //                 "from_time": session.fromTime,
        //                 "to_time": session.toTime,
        //             }
        //         });
        // } 

        // Papers
        // for (const paper of papers) {
        //     const newPaper = await prisma.paper.create({
        //         data: {
        //             "title": paper.title,
        //             "abstract": paper.abstract,
        //             "document": paper.document,
        //         }
        //     })

        //     // Author_Paper
        //     for (const author of paper.authors) {
        //         const authorId = random(14, 20);
        //         await prisma.Author_Paper.create({
        //             data: {
        //                 "author_id": authorId,
        //                 "paper_id": newPaper.paper_id,
        //                 "main_author": author.main ? true : false
        //             }
        //         })
        //     } 
        // }

        // Reviews
        await prisma.paper.findMany({
            select: {
                paper_id: true,
            }
        }).then(async (papers) => {
            for (const paper of papers) {
                let value1, value2;
                do {
                    value1 = random(3, 13);
                    value2 = random(3, 13);
                } while (value1 === value2);

                await prisma.review.create({
                    data: {
                        "paper_id": paper.paper_id,
                        "reviewer_id": value1,
                        "overall": 0,
                        "contribution": 0,
                        "strength": "",
                        "weakness": "",
                        "accepted": false,
                        "done": false
                    }
                })
                await prisma.review.create({
                    data: {
                        "paper_id": paper.paper_id,
                        "reviewer_id": value2,
                        "overall": 0,
                        "contribution": 0,
                        "strength": "",
                        "weakness": "",
                        "accepted": false,
                        "done": false
                    }
                })
            }
        })

        
    } catch (error) {
        console.log(error);
        return { error: error.message }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })