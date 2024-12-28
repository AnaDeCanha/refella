"use client";
import React from "react";

const MessageCard: React.FC = () => {
  return (
    <div className="bg-lightLila rounded-2xl w-full max-w-[996px] mx-auto p-8 md:p-8 mt-32">
      <h1 className="font-title text-titleMobile md:text-title text-dark py-6 md:p-8">
        Hi! I&apos;m <strong>Refella</strong>—your AI-powered reflection
        companion.
      </h1>
      <p className="font-body text-body text-dark px-8">
        I know how hard it can be to capture your progress and share your work
        in a meaningful way. That&apos;s why I&apos;m here! I&apos;ll guide you
        through quick, thoughtful conversations to help you reflect, learn, and
        craft impactful posts that highlight your growth and expertise.
      </p>
    </div>
  );
};

export default MessageCard;
