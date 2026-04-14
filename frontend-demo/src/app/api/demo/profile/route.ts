import { NextResponse } from "next/server";
import { demoUser } from "@/lib/mock-data";
import { DEMO_TOKEN } from "@/lib/constants";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  await new Promise((resolve) => setTimeout(resolve, 500));

  if (authHeader !== `Bearer ${DEMO_TOKEN}`) {
    return NextResponse.json(
      { message: "Нет доступа. Сначала войди в демо-систему." },
      { status: 401 }
    );
  }

  return NextResponse.json(demoUser);
}
