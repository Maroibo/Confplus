import exp from "constants";
import fs from "fs";
import { nanoid } from "nanoid";
// C create R read U update D delete
const PAPER_PATH = "data/papers.json";
const REVIEW_PATH = "data/reviews.json";
const CONFERENCE_PATH = "data/confereces.json";
const USER_PATH = "data/users.json";
const INSTITUTION_PATH = "data/institutions.json";
export async function createPaper(paper) {
  const createdId = nanoid();
  if (validatePaper(paper)) {
    const addedPaper = { ...paper, id: createdId };
    let papers = await fs.promises.readFile(PAPER_PATH, "utf8");
    papers = JSON.parse(papers);
    papers.push(addedPaper);
    await fs.promises.writeFile(PAPER_PATH, JSON.stringify(papers));
    return {
      done: true,
      paper: addedPaper,
    };
  } else {
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
  let papers = await fs.promises.readFile(PAPER_PATH, "utf8");
  papers = JSON.parse(papers);
  let paper = papers.find((paper) => paper.id === id);
  if (paper) {
    return {
      done: true,
      paper: paper,
    };
  }
  return {
    done: false,
    paper: null,
  };
}
export async function updatePaper(id, paper) {
  let papers = await fs.promises.readFile(PAPER_PATH, "utf8");
  papers = JSON.parse(papers);
  const index = papers.findIndex((paper) => paper.id === id);
  if (index < 0) {
    return {
      done: false,
      paper: null,
    };
  }
  paper.id = id;
  papers[index] = paper;
  await fs.promises.writeFile(PAPER_PATH, JSON.stringify(papers));
  return {
    done: true,
    paper: paper,
  };
}
export async function deletePaper(id) {
  let papers = await fs.promises.readFile(PAPER_PATH, "utf8");
  papers = JSON.parse(papers);
  const index = papers.findIndex((paper) => paper.id === id);
  if (index < 0) {
    return {
      done: false,
      paper: null,
    };
  }
  const deletedPaper = papers[index];
  papers.splice(index, 1);
  await fs.promises.writeFile(PAPER_PATH, JSON.stringify(papers));
  return {
    done: true,
    paper: deletedPaper,
  };
}
export async function createReview(review) {
  if (validateReview(review)) {
    let reviews = await fs.promises.readFile(REVIEW_PATH, "utf8");
    reviews = JSON.parse(reviews);
    reviews.push(review);
    await fs.promises.writeFile(REVIEW_PATH, JSON.stringify(reviews));
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
export async function readReview(id, idType) {
  if (idType === "paper") {
    let reviews = await fs.promises.readFile(REVIEW_PATH, "utf8");
    reviews = JSON.parse(reviews);
    let review = reviews.find((review) => review.paper === id);
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
  } else if (idType === "reviewer") {
    let reviews = await fs.promises.readFile(REVIEW_PATH, "utf8");
    reviews = JSON.parse(reviews);
    let parsedId = parseInt(id);
    let review = reviews.filter(
      (review) => review.reviewers.indexOf(parsedId) >= 0
    );
    if (review.length !== 0) {
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
  } else {
    return {
      done: false,
      review: null,
    };
  }
}
export async function readAllPapers() {
  let papers = await fs.promises.readFile(PAPER_PATH, "utf8");
  papers = JSON.parse(papers);
  return {
    done: true,
    papers: papers,
  };
}
export async function readAllReviews() {
  let reviews = await fs.promises.readFile(REVIEW_PATH, "utf8");
  reviews = JSON.parse(reviews);
  return {
    done: true,
    reviews: reviews,
  };
}
export async function readAllConferences() {
  let conferences = await fs.promises.readFile(CONFERENCE_PATH, "utf8");
  conferences = JSON.parse(conferences);
  return {
    done: true,
    conferences: conferences,
  };
}
export async function readAllInstitutions() {
  let institutions = await fs.promises.readFile(INSTITUTION_PATH, "utf8");
  institutions = JSON.parse(institutions);
  return {
    done: true,
    institutions: institutions,
  };
}
export async function updateReview(id, review) {
  let reviews = await fs.promises.readFile(REVIEW_PATH, "utf8");
  reviews = JSON.parse(reviews);
  const index = reviews.findIndex((review) => review.paper === id);
  reviews[index] = review;
  await fs.promises.writeFile(REVIEW_PATH, JSON.stringify(reviews));
  if (index >= 0) {
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
}
export async function deleteReview(id) {
  let reviews = await fs.promises.readFile(REVIEW_PATH, "utf8");
  reviews = JSON.parse(reviews);
  const index = reviews.findIndex((review) => review.paper === id);
  console.log(reviews);
  if (index >= 0) {
    const review = reviews[index];
    reviews.splice(index, 1);
    await fs.promises.writeFile(REVIEW_PATH, JSON.stringify(reviews));
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
}
export async function createConference(conference) {
  const createdId = nanoid();
  const addedConference = { ...conference, id: createdId };
  let conferences = await fs.promises.readFile(CONFERENCE_PATH, "utf8");
  conferences = JSON.parse(conferences);
  conferences.push(addedConference);
  await fs.promises.writeFile(CONFERENCE_PATH, JSON.stringify(conferences));
  return {
    done: true,
    conference: createdId,
  };
}
export async function readConference(id) {
  let conferences = await fs.promises.readFile(CONFERENCE_PATH, "utf8");
  conferences = JSON.parse(conferences);
  let conference = conferences.find((conference) => conference.id === id);
  if (conference) {
    return {
      done: true,
      conference: conference,
    };
  } else {
    return {
      done: false,
      conference: null,
    };
  }
}
export async function updateConference(id, conference) {
  let conferences = await fs.promises.readFile(CONFERENCE_PATH, "utf8");
  conferences = JSON.parse(conferences);
  const index = conferences.findIndex((conference) => conference.id === id);
  conferences[index] = conference;
  await fs.promises.writeFile(CONFERENCE_PATH, JSON.stringify(conferences));
  if (id) {
    return {
      done: true,
      conference: conference,
    };
  } else {
    return {
      done: false,
      conference: null,
    };
  }
}
export async function readAllUsers() {
  let users = await fs.promises.readFile(USER_PATH, "utf8");
  users = JSON.parse(users);
  return {
    done: true,
    users: users,
  };
}
export async function readUser(id) {
  let users = await fs.promises.readFile(USER_PATH, "utf8");
  users = JSON.parse(users);
  let user = users.find((user) => `${user.id}` === id);
  if (user) {
    return {
      done: true,
      user: user,
    };
  } else {
    return {
      done: false,
      user: null,
    };
  }
}
export async function readOrganizers() {
  let users = await fs.promises.readFile(USER_PATH, "utf8");
  users = JSON.parse(users);
  let organizers = users.filter((user) => user.role === "organizer");
  return {
    done: true,
    users: organizers,
  };
}
export async function readReviewers() {
  let users = await fs.promises.readFile(USER_PATH, "utf8");
  users = JSON.parse(users);
  let reviewers = users.filter((user) => user.role === "reviewer");
  return {
    done: true,
    users: reviewers,
  };
}
export async function readAuthors() {
  let users = await fs.promises.readFile(USER_PATH, "utf8");
  users = JSON.parse(users);
  let authors = users.filter((user) => user.role === "author");
  return {
    done: true,
    users: authors,
  };
}
