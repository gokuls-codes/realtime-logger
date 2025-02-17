"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ScrollArea } from "./ui/scroll-area";

const LogDisplay = () => {
  const [connected, setConnected] = useState(false);
  const [logData, setLogData] = useState([]);

  const logEndRef = useRef(null);

  useEffect(() => {
    let socket = null;

    try {
      socket = io("ws://localhost:5000");

      socket.on("connect", () => {
        console.log("Connected to server");
        setConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
        setConnected(false);
      });

      socket.on("file-change", (data) => {
        const logLines = data
          ?.split("\n")
          .filter((logLine) => logLine.trim() !== "");
        if (logLines?.length > 0) setLogData((prev) => [...prev, ...logLines]);
      });
    } catch (err) {
      console.log(err);
      return;
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    logEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [logData]);

  return (
    <>
      <section className="border border-slate-400 rounded-md p-4 ">
        <ScrollArea className="h-80 overflow-scroll">
          {logData.map((logLine, index) => (
            <div
              className={cn(
                " h-8 text-white flex items-center px-2  ",
                index % 2 ? "bg-neutral-800" : ""
              )}
              key={"logLine" + index}
              ref={index === logData.length - 1 ? logEndRef : null}
            >
              <p className="line-clamp-1">{logLine}</p>
            </div>
          ))}
          {/* <div className="h-1" ref={logEndRef}></div> */}
        </ScrollArea>
      </section>

      {connected ? (
        <p className=" text-sm text-right text-green-600 ">
          Connected to the server
        </p>
      ) : (
        <p className=" text-sm text-right  text-red-600 ">
          Disconnected from the server
        </p>
      )}
    </>
  );
};

export default LogDisplay;
