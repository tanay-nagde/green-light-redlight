"use client";
import Game from "@/components/game/index";
import Navbar from "@/components/game/Navbar";
import { useParams } from "next/navigation";

const Page = () => {
  const { slug } = useParams();
  console.log("Game slug:", slug);
  return (
    <>
      <Navbar userName="Player1" playersOnline={5} />
      <Game />
    </>
  );
};

export default Page;
