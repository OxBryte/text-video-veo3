import { fal } from "@fal-ai/client";
import React, { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(8);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [audio, setAudio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inpogress, setInProgress] = useState(false);
  const [result, setResult] = useState(null);
  const [requestId, setRequestId] = useState(null);

  fal.config({
    credentials: import.meta.env.VITE_FAL_API_KEY || "",
  });

  async function handlePrompt() {
    const result = await fal.subscribe("fal-ai/veo3", {
      input: {
        prompt: prompt || " ",
        aspect_ratio: aspectRatio || "16:9",
        duration: duration + "s" || "1s",
        enhance_prompt: true,
        generate_audio: audio || true,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_QUEUE") {
          console.log("In queue:", update);
          setLoading(true);
          update.logs.map((log) => log.message).forEach(console.log);
        }
        if (update.status === "IN_PROGRESS") {
          console.log("In progress:", update);
          setInProgress(true);
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    setRequestId(result?.requestId);
    setResult(result?.data?.video?.url);
    console.log("Result:", result);
    console.log(result.data);
    console.log(result.requestId);
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col gap-6 items-center w-lg w-fit">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        {/* <div className="w-lg border border-white/10 rounded-lg h-[260px] flex items-center justify-center flex-col gap-3">
          Upload your Image here
        </div> */}
        <div className="w-full">
          <textarea
            type="text"
            rows={6}
            placeholder="Enter your prompt here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-2.5 border border-white/10 rounded-lg"
          />
        </div>
        <div className="flex gap-3 items-center justify-between w-full">
          <input
            type="number"
            placeholder="Duration (e.g. 8)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2.5 border border-white/10 rounded-lg"
          />
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full px-4 py-2.5 border border-white/10 rounded-lg"
          >
            <option value="16:9">16:9</option>
            <option value="1:1">1:1</option>
            <option value="9:16">9:16</option>
          </select>
          <select
            value={audio ? "true" : "false"}
            onChange={(e) => setAudio(e.target.value === "true")}
            className="w-full px-4 py-2.5 border border-white/10 rounded-lg"
          >
            <option value="false">No Audio</option>
            <option value="true">With Audio</option>
          </select>
        </div>
        {requestId && <p>{requestId}</p>}
        {result && <video src={result}></video>}
        <button
          className="w-full bg-[#0c2c47] text-white px-10 py-3 rounded-lg"
          onClick={() => handlePrompt()}
        >
          {loading ? "In queue..." : inpogress ? "In progress" : "Send Prompt"}
        </button>
      </div>
    </div>
  );
}
