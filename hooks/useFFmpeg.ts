"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useRef, useState } from "react";

export function useFFmpeg() {
  const ffmpegRef = useRef(new FFmpeg());
  const isLoadedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const load = async () => {
    if (isLoadedRef.current) {
      return;
    }

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("progress", ({ progress: currentProgress }) => {
      setProgress(Math.round(currentProgress * 100));
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });

    isLoadedRef.current = true;
  };

  const convertToMp3 = async (videoUrl: string, filename?: string): Promise<void> => {
    setLoading(true);
    setProgress(0);

    try {
      const ffmpeg = ffmpegRef.current;

      await load();
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoUrl));
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-q:a",
        "0",
        "-map",
        "a",
        "output.mp3",
      ]);

      const data = await ffmpeg.readFile("output.mp3");
      const audioData =
        data instanceof Uint8Array
          ? Uint8Array.from(data)
          : new TextEncoder().encode(String(data));
      const blob = new Blob([audioData], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = filename ? `${filename}.mp3` : "sedotvidio-audio.mp3";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return { convertToMp3, loading, progress };
}
