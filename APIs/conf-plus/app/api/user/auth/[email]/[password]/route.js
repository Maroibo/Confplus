import { NextResponse } from "next/server";
import * as repo from "../../../../repository.js";
export async function GET(request, { params }) {
  // takes the params which are email and password
  try {
    let { email, password } = params;
    const response = await repo.readUserByEmailPassword(email, password);
    if (response.done) {
      return NextResponse.json({
        user: response.user,
        status: 200,
      });
    } else {
      return NextResponse.json({
        error: "user not found",
        status: 404,
      });
    }
  } catch (err) {
    console.log(err);
  }
}
