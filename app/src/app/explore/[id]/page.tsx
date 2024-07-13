"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  CopyIcon,
  SwapIcon,
  TwitterIcon,
  TelegramIcon,
  WebsiteIcon,
} from "~/components/ui/icons";

const ProfilePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Example data for the profile. Replace this with actual data fetching logic.
  const tokenData = {
    ticker: "meounch",
    name: "Meounch",
    insuredAmount: "1000",
    riskFactor: "0.1",
    image: "/cat.jpg",
    twitter: "https://twitter.com/meounch",
    telegram: "https://t.me/meounch",
    website: "https://meounch.xyz",
    deployOn: "Scroll",
  };

  // Example comments data. Replace this with actual data fetching logic.
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch comments data from an API or use static data
    const fetchComments = async () => {
      const data = [
        {
          id: 1,
          username: "Anon",
          avatar: "/cat.jpg",
          text: "Meounch me up, Scotty! To the moon we go",
        },
        {
          id: 2,
          username: "Anon",
          avatar: "/cat.jpg",
          text: "Not kitten around with this one",
        },
        {
          id: 3,
          username: "Anon",
          avatar: "/cat.jpg",
          text: "This coin's got me snacking at 2am",
        },
        // Add more comments as needed
      ];
      setComments(data);
    };

    fetchComments();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <img
          src={tokenData.image}
          alt="Profile"
          className="mb-4 h-32 w-32 rounded-lg object-cover"
        />
        <h2 className="text-xl font-bold">{tokenData.name}</h2>
        <div className="flex">
          <h2 className="m-4 text-xl font-bold">
            Insured amount: {tokenData.insuredAmount}
          </h2>
          <h2 className="m-4 text-xl font-bold">
            Risk factor: {tokenData.riskFactor}
          </h2>
        </div>
        <h1 className="mb-4 text-4xl font-bold">{tokenData.ticker}</h1>
        <div className="mb-4 flex space-x-4">
          <a href={tokenData.twitter} target="_blank" rel="noopener noreferrer">
            <TwitterIcon className="h-6 w-6" />
          </a>
          <a
            href={tokenData.telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TelegramIcon className="h-6 w-6" />
          </a>
          <a href={tokenData.website} target="_blank" rel="noopener noreferrer">
            <WebsiteIcon className="h-6 w-6" />
          </a>
        </div>
        <div className="mb-8 flex space-x-4">
          <Button
            variant="outlined"
            className="flex items-center space-x-2 rounded-full bg-slate-100"
          >
            <CopyIcon className="h-4 w-4" />
            <span>Copy contract</span>
          </Button>
          <Button
            variant="solid"
            className="flex items-center space-x-2 rounded-full bg-slate-100"
          >
            <SwapIcon className="h-4 w-4" />
            <span>Swap on Uniswap</span>
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Join discussion"
          className="mb-4 w-full max-w-md rounded-3xl"
        />
        <div className="w-full max-w-md space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-center space-x-2">
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="font-bold">{comment.username}</span>
              </div>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
