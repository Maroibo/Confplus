import { NextResponse } from "next/server";
import * as repo from "../../repository.js";
export async function GET(request, { params }) {
  try {
    let { id } = params;
    const response = await repo.readUser(id);
    if (response.done) {
      return NextResponse.json(response.user);
    } else {
      return NextResponse.json({
        error: "user not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
