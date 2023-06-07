import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request) {
  try {
    // return the paper states
    const response = await repo.noOfConferenceSessions();
    if (response.done) {
      return NextResponse.json({
        noOfConferenceSessions: response.sessions,
      });
    } else {
      return NextResponse.json({
        error: "internal server error",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
