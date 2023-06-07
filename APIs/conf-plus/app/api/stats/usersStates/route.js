import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request) {
  try {
    // return the paper states
    const response = await repo.noOfUsers();
    if (response.done) {
      return NextResponse.json(response);
    } else {
      return NextResponse.json({
        error: "internal server error",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
