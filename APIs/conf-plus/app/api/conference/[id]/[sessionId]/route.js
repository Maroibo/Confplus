import { NextResponse } from "next/server";
import * as repo from "../../../repository.js";

export async function DELETE(request, { params }) {
    try {
      let { id , sessionId } = params;
      const response = await repo.deleteSession(parseInt(sessionId));
      if (response.done) {
        return NextResponse.json(response.session);
      } else {
        return NextResponse.json({
          error: "session not deleted",
        });
      }
    } catch (err) {
      console.log(err);
    }
}