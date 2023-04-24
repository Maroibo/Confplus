import { NextResponse } from "next/server";
import * as repo from "../repository.js";
export async function GET(request) {
  try {
    const response = await repo.readAllConferences();
    if (response.conferences.length > 0) {
      return NextResponse.json(response.conferences);
    } else {
      return NextResponse.json({
        error: "There are no conferences",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
