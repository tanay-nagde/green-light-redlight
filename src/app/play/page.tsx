"use client";
import GameArea from "@/components/game/GameArea";
import GameOverModal from "@/components/game/Gameover";
import { useDebounce } from "@/components/game/hooks/useDebounce";

import Navbar from "@/components/game/Navbar";
import { GameStateenum } from "@/utils/types/game";

import { useState } from "react";

const Page = () => {

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [state, setState] = useState<GameStateenum>(GameStateenum.PLAYING);



  console.log( "Score:", score, "Time:", time, "State:", state);
  return (
    <>
      <Navbar userName="Player1" playersOnline={1} playersEliminated={0} />
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
