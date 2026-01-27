import type {Marker, Tempo, TimecodeSource} from "@/types";

export function generateEosImport(projectFiles: File[], eventList: number, timecodeSource: TimecodeSource, timecodeOffset: string, createCueLinks: boolean, cueList: number, smartCueNumbers: boolean, firstCue: number, firstEvent: number) {
    return async () => {
        if (!projectFiles.length) return;
        try {
            const fileText = await projectFiles[0].text();
            const markers = parseReaperMarkers(fileText);
            const tempo = parseReaperTempo(fileText);

            const lines: string[] = [];
            lines.push("START_SHOWCONTROL");
            lines.push("TARGET_TYPE,TARGET_TYPE_AS_TEXT,TARGET_LIST_NUMBER,TARGET_ID,PART_NUMBER,LABEL,TIME_ADDRESS,DATE,TRIGGER,ACTION");
            lines.push(`28,Event,${eventList},0,${timecodeSource === "midi" ? 1 : 2},,,,Source 1 External,${timecodeSource.toUpperCase()}`);
            lines.push(...markers.map((marker, index) => {
                const label = marker.name.replaceAll("\"", "");
                const timecode = timecodeSum(getTimeCodeFromSeconds(marker.time), timecodeOffset);
                const beats = Math.round(marker.time * tempo.bpm / 60 * 1000) / 1000;
                const measure = Math.floor((beats / tempo.m1) + 1);
                const beat = Math.round((beats % tempo.m1 + 1) * 100);
                const cue = createCueLinks ? `Cue  ${cueList} / ${smartCueNumbers ? `${measure}.${beat} ` : (firstCue) + index}` : "";

                return `28,Event,${eventList},${index + firstEvent},${timecodeSource === "midi" ? 1 : 2},"${label}",${timecode},,,${cue}`
            }))
            lines.push("END_SHOWCONTROL");

            exportEosCsvFile(lines.join("\n"), projectFiles[0].name.replace(".rpp", ""))
        } catch (err) {
            console.error("Failed to read file:", err);
        }
    };
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

export function parseReaperTempo(reaperProjectFileText: string): Tempo {
  const tempoRegex = /^\s*TEMPO\s(?<bpm>\d+)\s(?<m1>\d+)\s(?<m2>\d+)\s(?<bmpBasis>[0-5])/gm
  return (tempoRegex.exec(reaperProjectFileText)?.groups ?? {}) as unknown as Tempo
}

export function getTimeCodeFromSeconds(time: number, fps: number = 30) {
  const hours = Math.floor(time / 3600).toString().padStart(2, "0");
  const minutes = Math.floor(time % 3600 / 60).toString().padStart(2, "0");
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  const frames = Math.floor(time % 1 * fps).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}:${frames}`;
}

export function exportEosCsvFile(content: string, projectName: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ReaCue_ShowData_${projectName}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const timecodeSum = (...timecodes: string[]) => timecodes.map(tc => tc.split(":").map(Number)).reduce((a, b) => a.map((x, i) => x + b[i]), [0, 0, 0, 0]).map(x => x.toString().padStart(2, "0")).join(":");
