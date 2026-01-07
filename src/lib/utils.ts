import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type {Marker} from "@/types.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseReaperMarkers(reaperProjectFileText: string) {
  const markerRegex = /^\s*MARKER\s+(\d+)\s+([0-9.]+)\s+(?:"([^"]*)"|'([^']*)'|(\S+))/gm;
  const markers: Marker[] = [];

  let match;
  while ((match = markerRegex.exec(reaperProjectFileText)) !== null) {
    const [, id, time, doubleQuoted, singleQuoted, unquoted] = match;
    markers.push({
      id: id as unknown as number,
      time: time as unknown as number,
      name: doubleQuoted ?? singleQuoted ?? unquoted
    });
  }
  return markers.sort((a, b) => a.time - b.time);
}

export function getTimeCodeFromSeconds(time: number, fps: number = 30) {
  const hours = Math.floor(time / 3600).toString().padStart(2, "0");
  const minutes = Math.floor(time % 3600 / 60).toString().padStart(2, "0");
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  const frames = Math.floor(time % 1 * fps).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}:${frames}`;
}

export function exportEosCsvFile(content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reacue_eos-data_${Date.now().toFixed()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}