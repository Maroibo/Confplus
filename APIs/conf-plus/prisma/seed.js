import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const conferencesPath = path.join(process.cwd(), "data/confereces.json");
const papersPath = path.join(process.cwd(), "data/papers.json");
const reviewsPath = path.join(process.cwd(), "data/reviews.json");
const usersPath = path.join(process.cwd(), "data/users.json");
const locationsPath = path.join(process.cwd(), "data/locations.json");
const institutionsPath = path.join(process.cwd(), "data/institutions.json");
const datesPath = path.join(process.cwd(), "data/conference-dates.json");
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  try {
    let conferences = await fs.promises.readFile(conferencesPath);
    conferences = JSON.parse(conferences);
    let papers = await fs.promises.readFile(papersPath);
    papers = JSON.parse(papers);
    let reviews = await fs.promises.readFile(reviewsPath);
    reviews = JSON.parse(reviews);
    let users = await fs.promises.readFile(usersPath);
    users = JSON.parse(users);
    let locations = await fs.promises.readFile(locationsPath);
    locations = JSON.parse(locations);
    let institutions = await fs.promises.readFile(institutionsPath);
    institutions = JSON.parse(institutions);
    let dates = await fs.promises.readFile(datesPath);
    dates = JSON.parse(dates);

    // Delete all data from the database
    try {
      // Do not change the order of the following statements
      await prisma.review.deleteMany({});
      await prisma.reviewer.deleteMany({});
      await prisma.Author_Paper.deleteMany({});
      await prisma.paper.deleteMany({});
      await prisma.session.deleteMany({});
      await prisma.conference.deleteMany({});
      await prisma.author.deleteMany({});
      await prisma.organizer.deleteMany({});
      await prisma.user.deleteMany({});
      await prisma.location.deleteMany({});
      await prisma.institution.deleteMany({});
      await prisma.date.deleteMany({});

    } catch (error) {
      console.log(error);
    }

    // createMany is not supported for SQLite. Use create instead
    for (const date of dates) await prisma.date.create({
        data: {
            day: date.day
        }
    });

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
        const {institution_id} = (await prisma.institution.findFirst({select: {institution_id:true}}));

        if (user.role === "author")
            await prisma.author.upsert({
                where: { user_id: newUser.user_id },
                update: {},
                create: {
                    "user_id": newUser.user_id,
                    "institution_id": institution_id,
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
    for (const conference of conferences) {
        const newConf = await prisma.conference.create({
            data: {
                img: conference.img,
                title: conference.title,
                start_date: conference.start_date,
                end_date: conference.end_date,
            }
        });

        for (const session of conference.sessions)
            await prisma.session.create({
                data: {
                    "conference_id": newConf.conference_id,
                    "day": session.day,
                    "from_time": session.fromTime,
                    "to_time": session.toTime,
                    "location_city": session.location,
                }
            });
    }

    // //Papers
    let {user_id: authorId} = await prisma.author.findFirst({select: {user_id: true}});
    let {user_id: lastAuthorId} = await prisma.author.findFirst({select: {user_id: true}, orderBy: {user_id: "desc"}});
    for (const paper of papers) {
        const newPaper = await prisma.paper.create({
            data: {
                "title": paper.title,
                "abstract": paper.abstract,
                "document": paper.document,
            }
        })

        // Author_Paper
        for (const author of paper.authors) {

            await prisma.Author_Paper.create({
                data: {
                    "author_id": authorId,
                    "paper_id": newPaper.paper_id,
                    "main_author": author.main ? true : false
                }
            })
            if (authorId >= lastAuthorId){
              authorId = (await prisma.author.findFirst({select: {user_id: true}})).user_id;
            } else
                authorId = authorId + 1;
        }
    }

    // Reviews
    await prisma.paper.findMany({
        select: {
            paper_id: true,
        }
    }).then(async (papers) => {
        for (const paper of papers) {
            let value1, value2;
            let {user_id:reviewerId} = await prisma.reviewer.findFirst({select: {user_id: true}});
            let {user_id:lastReviewerId} = await prisma.reviewer.findFirst({select: {user_id: true}, orderBy: {user_id: "desc"}});
            do {
                value1 = random(reviewerId, lastReviewerId);
                value2 = random(reviewerId, lastReviewerId);
            } while (value1 === value2);

            await prisma.review.create({
                data: {
                    "paper_id": paper.paper_id,
                    "reviewer_id": value1,
                    "overall": 0,
                    "contribution": 0,
                    "strength": "",
                    "weakness": "",
                    "accepted": "pending",
                    "done": "pending"
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
                    "accepted": "pending",
                    "done": "pending"
                }
            })
        }
    })
    await prisma.session.create({
        data: {
            "conference_id": 1,
            "day": "2023-05-06T00:00:00.000Z",
            "from_time": "16:19",
            "to_time": "18:22",
            "location_city": "London",
        }
    })
    await prisma.review.update({
        where: {
            review_id: 1
        },
        data: {
            "overall": 2,
            "contribution": 2,
            "strength": "Good",
            "weakness": "Bad",
            "accepted": "yes",
            "done": "done"
        }
    })
    await prisma.review.update({
        where: {
            review_id: 2
        },
        data: {
            "overall": 2,
            "contribution": 2,
            "strength": "Good",
            "weakness": "Bad",
            "accepted": "yes",
            "done": "done"
        }
    })
    await prisma.review.update({
        where: {
            review_id: 3
        },
        data: {
            "overall": 2,
            "contribution": 2,
            "strength": "Good",
            "weakness": "Bad",
            "accepted": "yes",
            "done": "done"
        }
    })
    await prisma.review.update({
        where: {
            review_id: 4
        },
        data: {
            "overall": 2,
            "contribution": 2,
            "strength": "Good",
            "weakness": "Bad",
            "accepted": "yes",
            "done": "done"
        }
    })
    await prisma.review.update({
        where: {
            review_id: 5
        },
        data: {
            "overall": 2,
            "contribution": 2,
            "strength": "Good",
            "weakness": "Bad",
            "accepted": "yes",
            "done": "done"
        }
    })
    await prisma.review.update({
        where: {
            review_id: 6
        },
        data: {
            "overall": 2,
            "contribution": 2,
            "strength": "Good",
            "weakness": "Bad",
            "accepted": "yes",
            "done": "done"
        }
    })
    await prisma.review.update({
        where: {
            review_id: 7
        },
        data: {
            "overall": 2,
            "contribution": 2,
            "strength": "Good",
            "weakness": "Bad",
            "accepted": "yes",
            "done": "done"
        }
    })
    await prisma.review.update({
        where: {
            review_id: 8
        },
        data: {
            "overall": 2,
            "contribution": 2,
            "strength": "Good",
            "weakness": "Bad",
            "accepted": "yes",
            "done": "done"
        }
    })
    await prisma.presentation.create({
        data: {
            "paper_id": 1,
            "session_id": 1,
        }
    })
    await prisma.presentation.create({
        data: {
            "paper_id": 2,
            "session_id": 1,
        }
    })
    await prisma.presentation.create({
        data: {
            "paper_id": 3,
            "session_id": 2,
        }
    })
    await prisma.presentation.create({
        data: {
            "paper_id": 4,
            "session_id": 2,
        }
    })
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
