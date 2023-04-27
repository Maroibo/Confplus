import { NextResponse } from "next/server";
import * as repo from "../repository.js";
export async function GET(request) {
  try {
    const response = await repo.readAllDates();
    if (response.dates.length > 0) {
      return NextResponse.json(response.dates);
    } else {
      return NextResponse.json({
        error: "There are no dates",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
