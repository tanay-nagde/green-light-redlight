"use client";
import GameArea from "@/components/game/GameArea";
import GameOverModal from "@/components/game/Gameover";

import Navbar from "@/components/game/Navbar";
import { GameStateenum } from "@/utils/types/game";
import { useParams } from "next/navigation";
import { use, useState } from "react";

const Page = () => {

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [state, setState] = useState<GameStateenum>(GameStateenum.PLAYING);



  console.log( "Score:", score, "Time:", time, "State:", state);
  return (
    <>
      <Navbar userName="Player1" playersOnline={1} />
      <GameArea
        setScore={setScore}
        setTime={setTime}
        setState={setState}
      />
      {
        state === GameStateenum.OVER && <GameOverModal />
      }
    </>
  );
};

export default Page;
