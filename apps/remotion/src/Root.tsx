import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainVideo } from "./MainVideo";
import { VideoDataSchema } from "./schemas";
import { calculateSceneDuration } from "./utils";
import "./style.css";
import data from "../public/data2.json";

// バリデーション
const videoData = VideoDataSchema.parse(data);

export const RemotionRoot: React.FC = () => {
  const fps = 15;

  const durationInFrames = videoData.scenes.reduce((acc, scene) => {
    return acc + calculateSceneDuration(scene);
  }, 0);

  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: videoData.scenes,
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
