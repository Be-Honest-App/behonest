// app/page.tsx (updated for country filter in query)
import { Hero } from "./components/Hero";
import { Feed } from "./components/Post/Feed";
import SubFeed from "./components/Post/SubFeed";
import { RightCol } from "./components/RightCol";
import LeftCol from "./components/LeftCol";
import { MobileLeftColToggle } from "./components/MobileLeftColToggle";
import dbConnect from "@/lib/mongodb";
import Post from "../models/Post";
import { Types } from "mongoose";
import type { FilterQuery } from 'mongoose';

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

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  await dbConnect();

  let initialPosts: PostProps[] = [];
  let initialBusinessNames: string[] = [];

  try {
    // Build dynamic query based on params
    const where: FilterQuery<typeof Post> = {};
    const industry = params.industry as string | undefined;
    const country = params.country as string | undefined;  // Changed from search

    if (industry) {
      where.businessName = { $regex: industry, $options: 'i' };
    }
    if (country) {
      where.country = country;  // Exact match on country code
    }

    const rawPosts = (await Post.find(where)
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
        (p) =>
          p.businessName &&
          p.businessName.trim().toLowerCase() !== "general"
      )
      .map((p) => p.businessName as string);

    initialBusinessNames = [...new Set(businessNames)].slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  const uniqueTags = [...new Set(initialPosts.map((post) => post.tag))].slice(0, 4);

  return (
    <>
      <Hero />

      {/* Main layout using flex */}
      <main className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] mt-10 gap-6 overflow-hidden">

        {/* 🟧 Left Column (visible on lg+, fixed/sticky) */}
        <aside className="hidden lg:flex lg:w-1/4 sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto -px-10">
          <LeftCol />
        </aside>

        {/* 🟩 Feed (full-width on mobile, scrollable) */}
        <section className="flex-1 flex flex-col overflow-y-auto">
          <div className="pb-0 md:pb-10">
            <SubFeed />
          </div>
          <div className="overflow-y-auto flex-1 h-[calc(100vh-4rem)] px-2 md:px-0">
            <Feed initialPosts={initialPosts} />
          </div>
        </section>

        {/* 🟦 Right Column (hidden on mobile, shown on lg+, fixed/sticky) */}
        <aside className="hidden lg:flex lg:w-1/4 sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto">
          <RightCol
            initialTags={
              initialBusinessNames.length > 0
                ? initialBusinessNames
                : uniqueTags
            }
          />
        </aside>

        {/* Mobile Toggle: Floating + button */}
        <MobileLeftColToggle />
      </main>
    </>
  );
}