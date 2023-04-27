import { NextResponse } from "next/server";
import * as repo from "../repository.js";
export async function GET(request) {
  try {
    const response = await repo.readAllLocations();
    if (response.locations.length > 0) {
      return NextResponse.json(response.locations);
    } else {
      return NextResponse.json({
        error: "There are no locations",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
