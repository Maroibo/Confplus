import { NextResponse } from "next/server";
import * as repo from "../repository.js";
export async function GET(request) {
  try {
    const type = new URL(request.url).searchParams.get("type")?.toLowerCase();
    const name = new URL(request.url).searchParams.get("name");

    if (name) {
      const response = await repo.readUserByName(name);
      if (response.done) {
        return NextResponse.json(response.user);
      } else {
        return NextResponse.json({
          error: "user not found",
        });
      }
    } else if (!type || type === "") {
      const response = await repo.readAllUsers();
      return NextResponse.json(response.users);
    } else {
      if (type !== "reviewer" && type !== "author" && type !== "organizer") {
        return NextResponse.json({
          error: "invalid type",
        });
      } else if (type === "reviewer") {
        const response = await repo.readReviewers();
        return NextResponse.json(response.users);
      } else if (type === "author") {
        const response = await repo.readAuthors();
        return NextResponse.json(response.users);
      } else if (type === "organizer") {
        const response = await repo.readOrganizers();
        return NextResponse.json(response.users);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
