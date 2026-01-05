import React from "react";
import {
  AbsoluteFill,
  Series,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  interpolate,
} from "remotion";
import { Scene } from "./schemas";
import { calculateSceneDuration } from "./utils";

const Background = () => (
  <AbsoluteFill className="bg-slate-50 -z-10">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-purple-50/80" />
    {/* Decorative particles */}
    <div className="absolute top-10 left-10 w-32 h-32 border-t-4 border-l-4 border-blue-200/50 rounded-tl-3xl" />
    <div className="absolute bottom-10 right-10 w-32 h-32 border-b-4 border-r-4 border-purple-200/50 rounded-br-3xl" />
  </AbsoluteFill>
);

const SceneCard: React.FC<{
  scene: Scene;
  index: number;
  duration: number;
}> = ({ scene, index, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const translateY = spring({
    frame,
    fps,
    from: 50,
    to: 0,
    config: { damping: 200 },
  });

  // Audio fade in/out logic
  const audioVolume = (f: number) => {
    const fadeIn = interpolate(f, [0, 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(f, [duration - 15, duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return fadeIn * fadeOut;
  };

  return (
    <AbsoluteFill className="flex items-center justify-center p-10">
      <div
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-16 w-full max-w-7xl flex flex-col gap-10 border border-white/50"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset",
        }}
      >
        <div className="border-b border-gray-200 pb-8 flex justify-between items-end">
          <div>
            <h2 className="text-7xl font-bold text-gray-800 font-sans leading-tight tracking-tight">
              {scene.title}
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-1 w-12 bg-blue-500 rounded-full"></span>
              <div className="text-3xl text-gray-500 font-mono uppercase tracking-wider">
                {scene.type}
              </div>
            </div>
          </div>
          <div className="text-9xl font-bold text-gray-100 font-mono select-none">
            {(index + 1).toString().padStart(2, "0")}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-10">
          <p className="text-5xl text-gray-700 leading-snug font-sans whitespace-pre-wrap">
            {scene.content}
          </p>

          {scene.type === "CODE" && scene.code && (
            <div className="bg-gray-900 rounded-xl p-8 overflow-hidden font-mono text-3xl text-gray-100 relative shadow-inner ring-1 ring-gray-800">
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <pre className="whitespace-pre-wrap pt-4">
                {scene.code.split("\n").map((line, i) => {
                  const isHighlighted = scene.highlightLines?.includes(i + 1);
                  return (
                    <div
                      key={i}
                      className={`transition-all duration-500 flex items-center ${
                        isHighlighted
                          ? "bg-blue-500/10 -mx-8 px-8 border-l-4 border-blue-500 scale-[1.02] origin-left z-10 py-1"
                          : "opacity-60 blur-[0.5px] scale-100"
                      }`}
                    >
                      <span
                        className={`select-none mr-6 w-12 inline-block text-right text-2xl ${isHighlighted ? "text-blue-400 font-bold" : "text-gray-600"}`}
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1">{line}</span>
                      {isHighlighted && (
                        <span className="ml-4 text-blue-500 animate-pulse">
                          ←
                        </span>
                      )}
                    </div>
                  );
                })}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-auto pt-8 border-t border-gray-100 flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-gray-400 text-2xl font-sans truncate flex-1">
            Script: {scene.script}
          </p>
        </div>
        <Audio
          src={staticFile(`audio/scene_${index}.mp3`)}
          playbackRate={1.3}
          volume={audioVolume}
        />
      </div>
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC<{ scenes: Scene[] }> = ({ scenes }) => {
  return (
    <AbsoluteFill className="bg-white">
      <Background />
      <Audio
        src={staticFile("bgm.mp3")}
        loop
        volume={0.05} // Low volume background music
      />
      <Series>
        {scenes.map((scene, index) => {
          const duration = calculateSceneDuration(scene);
          return (
            <Series.Sequence key={index} durationInFrames={duration}>
              <SceneCard scene={scene} index={index} duration={duration} />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
