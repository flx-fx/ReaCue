import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export const FRAME_RATE = 30;

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getSecondsFromTimecode = (tc: string) => tc.split(":").map((x, i) => parseInt(x) * [3600, 60, 1, 1 / FRAME_RATE][i]).reduce((a, b) => a + b);
export const getTimecodeFromSeconds = (s: number) => [s / 3600, s % 3600 / 60, s % 60, s % 1 * FRAME_RATE].map((x) => Math.floor(x).toString().padStart(2, "0")).join(":");

export const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}