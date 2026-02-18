import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const jobs = await prisma.jobListing.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const job = await prisma.jobListing.create({
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        department: data.department,
        location: data.location || "Workshop",
        jobType: data.jobType || "FULL_TIME",
        salaryRange: data.salaryRange,
        status: data.active ? "PUBLISHED" : "DRAFT",
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    console.error("Job POST error:", error);
    return NextResponse.json({ error: "Failed to create job listing" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.jobListing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job listing" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, active, ...rest } = data;
    
    const updateData: any = { ...rest };
    if (active !== undefined) {
      updateData.status = active ? "PUBLISHED" : "ARCHIVED";
    }

    const job = await prisma.jobListing.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update job listing" }, { status: 500 });
  }
}
