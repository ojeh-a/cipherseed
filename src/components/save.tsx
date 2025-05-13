"use client";
import Link from "next/link";
import React from "react";

const Save = () => {
  return (
    <div className="justify-center items-center text-center">
      <Link href="./savePage" className="bg-red-300">
        <button>Encrypt seed phrase</button>
      </Link>
    </div>
  );
};

export default Save;
