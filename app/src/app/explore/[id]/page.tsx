"use client";

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

const ProfilePage = ({ params }) => {
  const { id } = params;

  console.log("Fetched ID:", id); // Debugging log

  const tokenData = [
    {
      id: "1",
      title: "notamuffin",
      token: "notamuffin",
      insuredAmount: "0",
      riskFactor: "1.00",
      image: "/poop.jpg",
      twitter: "https://twitter.com/notamuffin",
      telegram: "https://t.me/notamuffin",
      website: "https://notamuffin.xyz",
      deployOn: "Ethereum",
    },
    {
      id: "2",
      title: "justababy",
      token: "justababy",
      insuredAmount: "0",
      riskFactor: "1.00",
      image: "/baby.jpg",
      twitter: "https://twitter.com/justababy",
      telegram: "https://t.me/justababy",
      website: "https://justababy.xyz",
      deployOn: "Binance",
    },
    {
      id: "3",
      title: "frog",
      token: "frog",
      insuredAmount: "0",
      riskFactor: "1.00",
      image: "/frog.jpg",
      twitter: "https://twitter.com/frog",
      telegram: "https://t.me/frog",
      website: "https://frog.xyz",
      deployOn: "Polygon",
    },
    {
      id: "4",
      title: "meounch",
      token: "meounch",
      insuredAmount: "132",
      riskFactor: "0.29",
      image: "/cat.jpg",
      twitter: "https://twitter.com/meounch",
      telegram: "https://t.me/meounch",
      website: "https://meounch.xyz",
      deployOn: "Scroll",
    },
    {
      id: "5",
      title: "creep",
      token: "creep",
      insuredAmount: "500",
      riskFactor: "0.50",
      image: "/creeper.jpg",
      twitter: "https://twitter.com/creep",
      telegram: "https://t.me/creep",
      website: "https://creep.xyz",
      deployOn: "Avalanche",
    },
    {
      id: "6",
      title: "babyshark",
      token: "babyshark",
      insuredAmount: "0",
      riskFactor: "1.00",
      image: "/shark.jpeg",
      twitter: "https://twitter.com/babyshark",
      telegram: "https://t.me/babyshark",
      website: "https://babyshark.xyz",
      deployOn: "Arbitrum",
    },
    {
      id: "7",
      title: "ye",
      token: "ye",
      insuredAmount: "0",
      riskFactor: "1.00",
      image: "/ye.jpg",
      twitter: "https://twitter.com/ye",
      telegram: "https://t.me/ye",
      website: "https://ye.xyz",
      deployOn: "Optimism",
    },
  ];

  const [token, setToken] = useState(null);
  const [comments, setComments] = useState([]);

  const getCommentsForToken = (token) => {
    const commentsData = {
      "1": [
        {
          id: 1,
          username: "Baker",
          avatar: token.image,
          text: "This token is not a muffin, but it’s fresh!",
        },
        {
          id: 2,
          username: "Foodie",
          avatar: token.image,
          text: "Not sure what it is, but it’s definitely not a muffin!",
        },
      ],
      "2": [
        {
          id: 1,
          username: "Parent",
          avatar: token.image,
          text: "Just a baby but packs a punch!",
        },
        {
          id: 2,
          username: "Nanny",
          avatar: token.image,
          text: "Taking baby steps to the moon!",
        },
        {
          id: 3,
          username: "Toddler",
          avatar: token.image,
          text: "Crawling its way up the charts!",
        },
      ],
      "3": [
        {
          id: 1,
          username: "Frogger",
          avatar: token.image,
          text: "Ribbit! This frog is leaping high!",
        },
        {
          id: 2,
          username: "Hopper",
          avatar: token.image,
          text: "Jumping into profits like a frog!",
        },
      ],
      "4": [
        {
          id: 1,
          username: "Anon",
          avatar: token.image,
          text: "Meounch me up, Scotty! To the moon we go",
        },
        {
          id: 2,
          username: "Anon",
          avatar: token.image,
          text: "Not kitten around with this one",
        },
        {
          id: 3,
          username: "Anon",
          avatar: token.image,
          text: "This coin’s got me snacking at 2am",
        },
      ],
      "5": [
        {
          id: 1,
          username: "Gamer",
          avatar: token.image,
          text: "This token is creeping up on us!",
        },
        {
          id: 2,
          username: "Miner",
          avatar: token.image,
          text: "Creeping its way to the top!",
        },
      ],
      "6": [
        {
          id: 1,
          username: "Diver",
          avatar: token.image,
          text: "Babyshark doo doo doo, this token is making waves!",
        },
        {
          id: 2,
          username: "Swimmer",
          avatar: token.image,
          text: "Swimming through the crypto ocean!",
        },
      ],
      "7": [
        {
          id: 1,
          username: "Fan",
          avatar: token.image,
          text: "Ye token is just amazing!",
        },
        {
          id: 2,
          username: "Supporter",
          avatar: token.image,
          text: "This is the token we’ve been waiting for!",
        },
      ],
    };

    return commentsData[token.id] || [];
  };

  useEffect(() => {
    if (id) {
      const selectedToken = tokenData.find((token) => token.id === id);
      console.log("Selected Token:", selectedToken); // Debugging log
      setToken(selectedToken);

      if (selectedToken) {
        const tokenComments = getCommentsForToken(selectedToken);
        setComments(tokenComments);
        console.log("Fetched Comments:", tokenComments); // Debugging log
      }
    }
  }, [id]);

  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <img
          src={token.image}
          alt="Profile"
          className="mb-4 h-32 w-32 rounded-lg object-cover"
        />
        <h2 className="text-xl font-bold">{token.name}</h2>
        <div className="flex">
          <h2 className="m-4 text-xl font-bold">
            Insured amount: {token.insuredAmount}
          </h2>
          <h2 className="m-4 text-xl font-bold">
            Risk factor: {token.riskFactor}
          </h2>
        </div>
        <h1 className="mb-4 text-4xl font-bold">${token.token}</h1>
        <div className="mb-4 flex space-x-4">
          <a href={token.twitter} target="_blank" rel="noopener noreferrer">
            <TwitterIcon className="h-6 w-6" />
          </a>
          <a href={token.telegram} target="_blank" rel="noopener noreferrer">
            <TelegramIcon className="h-6 w-6" />
          </a>
          <a href={token.website} target="_blank" rel="noopener noreferrer">
            <WebsiteIcon className="h-6 w-6" />
          </a>
        </div>
        <div className="mb-8 flex space-x-4">
          <Button
            variant="outlined"
            className="flex items-center space-x-2 rounded-full bg-slate-100"
          >
            <CopyIcon className="h-4 w-4" />
            <a href="https://base-sepolia.blockscout.com/address/0x74c4aEDEdE3E3bB201478Ad760F45aD2eA9Cca2E">
              Copy contract
            </a>
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
          {comments.length === 0 ? (
            <div className="rounded-lg border p-4 text-center">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
// src/app/explore/page.tsx
