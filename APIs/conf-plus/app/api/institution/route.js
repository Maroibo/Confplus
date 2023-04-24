import { NextResponse } from "next/server";
import * as repo from "../repository.js";
export async function GET(request) {
  try {
    const response = await repo.readAllInstitutions();
    if (response.institutions.length > 0) {
      return NextResponse.json(response.institutions);
    } else {
      return NextResponse.json({
        error: "There are no institutions",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
