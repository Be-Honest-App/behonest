"use server";

import { Hero } from "./components/Hero";
import { LeftCol } from "./components/LeftCol";
import { Feed } from "./components/Feed";
import { RightCol } from "./components/RightCol";
import dbConnect from "@/lib/mongodb";
import Post from "../models/Post";
import { Types } from "mongoose";
import { SWRProvider } from "./providers/SWRProvider";

export interface PostProps {
  _id: string;
  tag: string;
  businessName?: string | null;
  time: string;
  title: string;
  content: string;
  likes: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
}

interface RawPost {
  _id: Types.ObjectId;
  tag: string;
  businessName?: string | null;
  time: string;
  title: string;
  content: string;
  likes: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export default async function Home() {
  await dbConnect();

  let initialPosts: PostProps[] = [];
  let initialBusinessNames: string[] = [];

  try {
    const rawPosts = (await Post.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()) as unknown as RawPost[];

    const processedPosts: PostProps[] = rawPosts.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    initialPosts = processedPosts;

    const businessNames = processedPosts
      .filter(
        (p) => p.businessName && p.businessName.trim().toLowerCase() !== "general"
      )
      .map((p) => p.businessName as string);

    initialBusinessNames = [...new Set(businessNames)].slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  const uniqueTags = [...new Set(initialPosts.map((post) => post.tag))].slice(
    0,
    4
  );

  return (
    <SWRProvider>
      <Hero />
      <LeftCol />
      <div>
        <Feed initialPosts={initialPosts} />
      </div>
      <RightCol
        initialTags={
          initialBusinessNames.length > 0 ? initialBusinessNames : uniqueTags
        }
      />
    </SWRProvider>
  );
}
