"use client";
import Game from "@/components/game/index";
import Navbar from "@/components/game/Navbar";

const Page = () => {
  return (
    <>
      <Navbar userName="Player1" playersOnline={5} />
      <Game />
    </>
  );
};

export default Page;
