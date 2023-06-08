import fs from "fs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// C create R read U update D delete
const PAPER_PATH = "data/papers.json";
const REVIEW_PATH = "data/reviews.json";
const CONFERENCE_PATH = "data/confereces.json";
const USER_PATH = "data/users.json";
const INSTITUTION_PATH = "data/institutions.json";
const DATES_PATH = "data/conference-dates.json";
const LOCATIONS_PATH = "data/locations.json";

export async function readAllAcceptedPapers() {
  try {
    let papers = await prisma.review.findMany({
      where: {
        accepted: "yes",
      },
      select: {
        paper_id: true,
      },
    });
    papers = papers.map((paper) => paper.paper_id);
    // Remove duplicates
    papers = [...new Set(papers)];
    let newPapers = await prisma.paper.findMany({
      where: {
        paper_id: {
          in: papers,
        },
      }
    });
    let presenters = await prisma.author_Paper.findMany({
      where: {
        AND: [{
        paper_id: {
          in: papers
        }
        },
        {main_author: true}
      ]},
      select: {
        author: true,
      },
    });
    
    let papers_presenters = [];
    for (let i = 0; i < papers.length; i++) {
      const paper = newPapers[i];
      const presenter = presenters[i];
      papers_presenters.push({
        paper,
        ...presenter,
      });
    }
    

    await prisma.$disconnect();
    // handle error
    return {
      done: true,
      papers_presenters: papers_presenters,
    };
  } catch (error) {
    console.log(error);
    return {
      done: false,
      papers_presenters: null,
    };
  }
}

export async function createPaper(paper) {
  try {
    const createdPaper = await prisma.paper.create({
      data: paper,
    });
    await prisma.$disconnect();
    // handle error
    return {
      done: true,
      paper: createdPaper,
    };
  } catch (error) {
    return {
      done: false,
      paper: null,
    };
  }
}

export async function createAuthorPaper(authorPaper) {
  try {
    const createdAuthorPaper = await prisma.author_Paper.create({
      data: authorPaper,
    });
    await prisma.$disconnect();
    // handle error
    return {
      done: true,
      authorPaper: createdAuthorPaper,
    };
  } catch (error) {
    return {
      done: false,
      paper: null,
    };
  }
}

function validatePaper(paper) {
  const paperModel = ["title", "abstract", "document", "status", "authors"];
  const paperKeys = Object.keys(paper);
  const paperValues = Object.values(paper);
  if (paperKeys.length !== paperModel.length) {
    return false;
  }
  paperKeys.forEach((key) => {
    if (!paperModel.includes(key)) {
      return false;
    }
  });
  paperValues.forEach((value) => {
    if (value === "") {
      return false;
    }
  });
  return true;
}

export async function readPaper(id) {
  try {
    const paper = await prisma.paper.findUnique({
      where: {
        paper_id: parseInt(id),
      },
      include: {
        Author_Paper: true,
      },
    });
    await prisma.$disconnect();
    return {
      done: true,
      paper: paper,
    };
  } catch (error) {
    return {
      done: false,
      paper: null,
    };
  }
}

export async function readPaperByAuthor(authorId) {
  const papers = await prisma.paper.findMany({
    // include the accepted attribute from the review table
    where: {
      Author_Paper: {
        some: {
          author_id: parseInt(authorId),
        },
      },
    },
    include: {
      Author_Paper: true,
      reviews: {
        select: {
          accepted: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  return {
    done: true,
    papers: papers,
  };
}

export async function updateConference(id, conference) {
  try {
    const updatedConference = await prisma.conference.update({
      where: {
        conference_id: parseInt(id),
      },
      data: conference,
    });
    await prisma.$disconnect();
    return {
      done: true,
      conference: updatedConference,
    };
  } catch (error) {
    return {
      done: false,
      conference: null,
    };
  }
}

export async function updatePaper(id, paper) {
  try {
    const updatedPaper = await prisma.paper.update({
      where: {
        paper_id: parseInt(id),
      },
      data: paper,
    });
    await prisma.$disconnect();
    return {
      done: true,
      paper: updatedPaper,
    };
  } catch (error) {
    return {
      done: false,
      paper: null,
    };
  }
}

export async function deletePaper(id) {
  try {
    const deletedPaper = await prisma.paper.delete({
      where: {
        paper_id: parseInt(id),
      },
    });
    await prisma.$disconnect();
    return {
      done: true,
      paper: deletedPaper,
    };
  } catch (error) {
    return {
      done: false,
      paper: null,
    };
  }
}

export async function createReviews(paper_id) {
  try {
    const allReviewers = await prisma.reviewer.findMany();
    // select 2 distinct random reviewers
    const randomReviewers = [];
    while (randomReviewers.length < 2) {
      const randomReviewer =
        allReviewers[Math.floor(Math.random() * allReviewers.length)];
      if (!randomReviewers.includes(randomReviewer)) {
        randomReviewers.push(randomReviewer);
      }
    }

    const review1 = await prisma.review.create({
      data: {
        paper_id: paper_id,
        reviewer_id: randomReviewers[0].user_id,
        done: "pending",
        overall: 0,
        contribution: 0,
        strength: "",
        weakness: "",
        accepted: "pending",
      },
    });
    const review2 = await prisma.review.create({
      data: {
        paper_id: paper_id,
        reviewer_id: randomReviewers[1].user_id,
        done: "pending",
        overall: 0,
        contribution: 0,
        strength: "",
        weakness: "",
        accepted: "pending",
      },
    });
    await prisma.$disconnect();
    return {
      done: true,
      reviews: [review1, review2],
    };
  } catch (error) {
    return {
      done: false,
      review: null,
    };
  }
}

function validateReview(review) {
  const reviewModel = [
    "reviewer",
    "paper",
    "overall",
    "contribution",
    "strength",
    "weakness",
    "accepted",
    "done",
  ];
  const reviewKeys = Object.keys(review);
  const reviewValues = Object.values(review);
  if (reviewKeys.length !== reviewModel.length) {
    return false;
  }
  reviewKeys.forEach((key) => {
    if (!reviewModel.includes(key)) {
      return false;
    }
  });
  reviewValues.forEach((value) => {
    if (value === "") {
      return false;
    }
  });
  return true;
}

export async function readReview(paperId, idType) {
  try {
    let review;
    if (idType === "paper") {
      review = await prisma.review.findMany({
        where: {
          paper_id: parseInt(paperId),
          done: "done",
        },
      });
    } else if (idType === "reviewer") {
      review = await prisma.review.findMany({
        where: {
          reviewer_id: parseInt(paperId),
        },
      });
    }
    await prisma.$disconnect();
    if (review) {
      return {
        done: true,
        review: review,
      };
    } else {
      return {
        done: false,
        review: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      done: false,
      review: null,
    };
  }
}

export async function readAllPapers() {
  try {
    const papers = await prisma.paper.findMany();
    return {
      done: true,
      papers: papers,
    };
  } catch (error) {
    return {
      done: false,
      papers: null,
    };
  }
}

export async function readAllReviews() {
  try {
    const reviews = await prisma.review.findMany();
    await prisma.$disconnect();
    return {
      done: true,
      reviews: reviews,
    };
  } catch (error) {
    return {
      done: false,
      reviews: null,
    };
  }
}

export async function readAllConferences() {
  try {
    const conferences = await prisma.conference.findMany({
      include: {
        session: {
          include: {
            presentation: true,
          },
        },
      },
    });

    await prisma.$disconnect();
    return {
      done: true,
      conferences: conferences,
    };
  } catch (error) {
    return {
      done: false,
      conferences: null,
    };
  }
}

export async function readAllInstitutions() {
  try {
    const institutions = await prisma.institution.findMany();
    await prisma.$disconnect();
    return {
      done: true,
      institutions: institutions,
    };
  } catch (error) {
    return {
      done: false,
      institutions: null,
    };
  }
}

export async function readAllDates() {
  try {
    const dates = await prisma.date.findMany();
    await prisma.$disconnect();
    return {
      done: true,
      dates: dates,
    };
  } catch (error) {
    return {
      done: false,
      dates: null,
    };
  }
}

export async function deletePresentations(sessionId) {
  try {
    const deletedPresentations = await prisma.presentation.deleteMany({
      where: {
        session_id: sessionId,
      },
    });
    await prisma.$disconnect();
    return {
      done: true,
      presentations: deletedPresentations,
    };
  } catch (error) {
    return {
      done: false,
      presentations: null,
    };
  }
}

export async function createPresentations(presentationsState) {

  try {
    let newPresentations = [];
    presentationsState.forEach(async (p) => {
  
      const newPresentation = await prisma.presentation.create({
        data: {
          session_id: p.session_id,
          paper_id: p.paper_id,
        },
      });
      newPresentations.push(newPresentation);
    });
    await prisma.$disconnect();
    return {
      done: true,
      presentations: newPresentations,
    };
  } catch (error) {
    return {
      done: false,
      presentations: null,
    };
  }
}

export async function createSession(id, sessionState) {
  try {
    const newSession = await prisma.session.create({
      data: {
        day: sessionState.day,
        from_time: sessionState.from_time,
        to_time: sessionState.to_time,
        location_city: sessionState.location_city,
        conference_id: parseInt(id),
      }
    });
    await prisma.$disconnect();
    return {
      done: true,
      session: newSession,
    };
  } catch (error) {
    return {
      done: false,
      session: null,
    };
  }
}

export async function updateSession(sessionId, sessionState) {
  try {
    const updatedSession = await prisma.session.update({
      where: {
        session_id: parseInt(sessionId),
      },
      data: {
        day: sessionState.day,
        from_time: sessionState.from_time,
        to_time: sessionState.to_time,
        location_city: sessionState.location_city,
      }
    });
    await prisma.$disconnect();
    return {
      done: true,
      session: updatedSession,
    };
  } catch (error) {
    return {
      done: false,
      session: null,
    };
  }
}

export async function deleteSession(sessionId) {
  try {
    const deletedSession = await prisma.session.delete({
      where: { session_id: sessionId },
    });
    await prisma.$disconnect();
    // handle error
    return {
      done: true,
      session: deletedSession,
    };
  } catch (error) {
    console.log(error);
    return {
      done: false,
      session: null,
    };
  }
}

export async function readAllLocations() {
  try {
    const locations = await prisma.location.findMany();
    await prisma.$disconnect();
    return {
      done: true,
      locations: locations,
    };
  } catch (error) {
    return {
      done: false,
      locations: null,
    };
  }
}

export async function deleteReview(id) {
  try {
    const review = await prisma.review.delete({
      where: {
        paper: parseInt(id),
      },
    });
    await prisma.$disconnect();
    return {
      done: true,
      review: review,
    };
  } catch (error) {
    return {
      done: false,
      review: null,
    };
  }
}

export async function createConference(conference) {
  try {
    const createdConference = await prisma.conference.create({
      data: conference,
    });
    await prisma.$disconnect();
    return {
      done: true,
      conference: createdConference,
    };
  } catch (error) {
    return {
      done: false,
      conference: null,
    };
  }
}

export async function readConference(id) {
  try {
    const conference = await prisma.conference.findUnique({
      where: {
        conference_id: parseInt(id),
      },
      include: {
        session: {
          include: {
            presentation: true,
          },
        },
      },
    });
    await prisma.$disconnect();
    return {
      done: true,
      conference: conference,
    };
  } catch (error) {
    return {
      done: false,
      conference: null,
    };
  }
}

export async function updateReview(id, review) {
  try {
    const updatedReview = await prisma.review.update({
      where: {
        review_id: parseInt(id),
      },
      data: review,
    });
    await prisma.$disconnect();
    return {
      done: true,
      review: updatedReview,
    };
  } catch (error) {
    console.log(error);
    return {
      done: false,
      review: null,
    };
  }
}

export async function readAllUsers() {
  try {
    const users = await prisma.user.findMany();
    await prisma.$disconnect();
    return {
      done: true,
      users: users,
    };
  } catch (error) {
    return {
      done: false,
      users: null,
    };
  }
}

export async function readUserByName(name) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        first_name: name,
      },
      include: {
        author: true,
        reviewer: true,
        organizer: true,
      },
    });
    await prisma.$disconnect();
    return {
      done: true,
      user: user,
    };
  } catch (error) {
    return {
      done: false,
      user: null,
    };
  }
}

export async function readUser(id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: parseInt(id),
      },
      include: {
        author: true,
        reviewer: true,
        organizer: true,
      },
    });
    console.log(id);
    await prisma.$disconnect();
    return {
      done: true,
      user: user,
    };
  } catch (error) {
    return {
      done: false,
      user: null,
    };
  }
}

export async function readUserByEmailPassword(email, password) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
      // return the list of authors and reviewers and organizers
      include: {
        author: true,
        reviewer: true,
        organizer: true,
      },
    });
    await prisma.$disconnect();
    return {
      done: true,
      user: user,
    };
  } catch (error) {
    return {
      done: false,
      user: null,
    };
  }
}

export async function readOrganizers() {
  try {
    const organizers = await prisma.organizer.findMany();
    await prisma.$disconnect();
    return {
      done: true,
      users: organizers,
    };
  } catch (error) {
    return {
      done: false,
      users: null,
    };
  }
}

export async function readReviewers() {
  try {
    const reviewers = await prisma.reviewer.findMany();
    await prisma.$disconnect();
    return {
      done: true,
      users: reviewers,
    };
  } catch (error) {
    return {
      done: false,
      users: null,
    };
  }
}

export async function readAuthors() {
  try {
    const authors = await prisma.author.findMany();
    await prisma.$disconnect();
    return {
      done: true,
      users: authors,
    };
  } catch (error) {
    return {
      done: false,
      users: null,
    };
  }
}

export async function paperStats() {
  try {
    let accepted = await prisma.review.count({
      where: {
        accepted: "yes",
      },
    });
    accepted = accepted / 2;
    let rejected = await prisma.review.count({
      where: {
        accepted: "no",
      },
    });
    rejected = rejected / 2;
    let pending = await prisma.review.count({
      where: {
        accepted: "pending",
      },
    });
    pending = pending / 2;
    await prisma.$disconnect();
    return {
      done: true,
      accepted: accepted,
      rejected: rejected,
      pending: pending,
    };
  } catch (error) {
    console.log(error);
    return {
      done: false,
      accepted: null,
      rejected: null,
      pending: null,
    };
  }
}

export async function avgAuthorsPerPaper() {
  try {
    const authorsPerPaper = await prisma.author_Paper.groupBy({
      by: ["paper_id"],
      _count: {
        author_id: true,
      },
    });
    const papers = await prisma.paper.count();
    let sum = 0;
    authorsPerPaper.forEach((paper) => {
      sum += paper._count.author_id;
    });
    // round to 2 decimal places
    const avgerage = Math.round((sum / papers) * 100) / 100;
    await prisma.$disconnect();
    return {
      done: true,
      avg: `${avgerage}`,
    };
  } catch (error) {
    console.log(error);
    return {
      done: false,
      avg: null,
    };
  }
}

// get the number of conference sessions
export async function noOfConferenceSessions() {
  const sessions = await prisma.session.count();
  await prisma.$disconnect();
  return {
    done: true,
    sessions: sessions,
  };
}

// get the number of presentations per session
export async function avgPapersPerSession() {
  const presentationsPerSession = await prisma.presentation.groupBy({
    by: ["session_id"],
    _count: {
      presentation_id: true,
    },
  });
  // get the number of sessions
  const sessions = await prisma.session.count();
  let sum = 0;
  presentationsPerSession.forEach((session) => {
    sum += session._count.presentation_id;
  });
  // round to 2 decimal places
  const avgerage = Math.round((sum / sessions) * 100) / 100;
  await prisma.$disconnect();
  return {
    done: true,
    avg: `${avgerage}`,
  };
}

export async function noOfUsers() {
  const authors = await prisma.author.count();
  const reviewers = await prisma.reviewer.count();
  const organizers = await prisma.organizer.count();
  await prisma.$disconnect();
  return {
    done: true,
    authors: authors,
    reviewers: reviewers,
    organizers: organizers,
  };
}