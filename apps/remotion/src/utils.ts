import { Scene } from "./schemas";

export const calculateSceneDuration = (scene: Scene): number => {
  const charCount = scene.script.length;
  // 1文字あたり3フレーム(0.2秒)を基準とし、1.3倍速なので時間を短縮する (15fps換算)
  // 3 / 1.3 = 2.30... -> 約2.3フレーム
  const baseDuration = (charCount * 3) / 1.3;
  const withPadding = baseDuration + 15; // 末尾に15フレーム(1秒)の余白
  return Math.max(45, Math.ceil(withPadding)); // 最低45フレーム(3秒)保証、整数に切り上げ
};
