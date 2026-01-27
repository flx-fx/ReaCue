import type {Marker, ShowDataEntry, ShowDataOptions, Tempo} from "@/types.ts";
import {downloadTextFile, getSecondsFromTimecode, getTimecodeFromSeconds} from "@/lib/utils.ts";

const sanitizeLabel = (label: string) => label.replaceAll("\"", "");

const buildShowDataEntries = (markers: Marker[], tempo: Tempo, {
    timecodeOffset,
    firstEvent,
    firstCue,
    smartCueNumbers
}: ShowDataOptions) => markers.map((marker, index) => {
    const totalBeats = Math.round(marker.time * tempo.bpm / 60 * 1000) / 1000;
    const measure = Math.floor((totalBeats / tempo.m1) + 1);
    const beatTimes100 = Math.round((totalBeats % tempo.m1 + 1) * 100);
    const cue = `${smartCueNumbers ? `${measure}.${beatTimes100}` : (firstCue + index)}`;

    return {
        id: firstEvent + index,
        label: sanitizeLabel(marker.name),
        timecode: getTimecodeFromSeconds(marker.time + getSecondsFromTimecode(timecodeOffset)),
        cue
    }
})

const buildShowControlSection = (showDataEntries: ShowDataEntry[], {
    timecodeSource,
    eventList,
    cueList,
    createCueLinks
}: ShowDataOptions) => [
    "START_SHOWCONTROL",
    "TARGET_TYPE,TARGET_TYPE_AS_TEXT,TARGET_LIST_NUMBER,TARGET_ID,PART_NUMBER,LABEL,TIME_ADDRESS,DATE,TRIGGER,ACTION",
    `28,Event,${eventList},0,${timecodeSource === "midi" ? 1 : 2},,,,Source 1 External,${timecodeSource.toUpperCase()}`,
    ...showDataEntries.map(entry => `28,Event,${eventList},${entry.id},${timecodeSource === "midi" ? 1 : 2},"${entry.label}",${entry.timecode},,,${createCueLinks ? `Cue  ${cueList} / ${entry.cue}` : ""}`),
    "END_SHOWCONTROL"
].join("\n");

const buildTargetsSection = (showDataEntries: ShowDataEntry[], {cueList, projectName}: ShowDataOptions) => [
    "START_TARGETS",
    "TARGET_TYPE,TARGET_TYPE_AS_TEXT,TARGET_LIST_NUMBER,TARGET_ID,TARGET_DCID,PART_NUMBER,LABEL",
    `15,Cue_List,,${cueList},ReaCue-CueList-${cueList},,${projectName}`,
    ...showDataEntries.map(entry => `1,Cue,${cueList},${entry.cue},ReaCue-Cue-${cueList}-${entry.id},,${entry.label}`),
    "END_TARGETS"
].join("\n");

const readProjectFile = async (file: File): Promise<{ text: string; name: string; }> => ({
    text: await file.text(),
    name: file.name.replace(".rpp", "")
});

const parseMarkers = (input: string): Marker[] => {
    const markerRegex = /^\s*MARKER\s+(\d+)\s+([0-9.]+)\s+(?:"([^"]*)"|'([^']*)'|(\S+))/gm;
    const markers: Marker[] = [];

    let match;
    while ((match = markerRegex.exec(input)) !== null) {
        const [, id, time, doubleQuoted, singleQuoted, unquoted] = match;
        markers.push({
            id: parseInt(id), time: parseFloat(time), name: doubleQuoted ?? singleQuoted ?? unquoted
        });
    }
    return markers.sort((a, b) => a.time - b.time);
};

const parseTempo = (input: string): Tempo => (/^\s*TEMPO\s(?<bpm>\d+)\s(?<m1>\d+)\s(?<m2>\d+)\s(?<bpmBasis>[0-5])/gm.exec(input)?.groups ?? {}) as unknown as Tempo;

const getShowDataFileContent = (markers: Marker[], tempo: Tempo, options: ShowDataOptions) => {
    const showDataEntries = buildShowDataEntries(markers, tempo, options)
    return `${buildShowControlSection(showDataEntries, options)}\n${options.createCues ? buildTargetsSection(showDataEntries, options) : ''}`;
}

export const exportShowDataFile = async (inputFile: File, options: ShowDataOptions) => {
    const {text, name} = await readProjectFile(inputFile);

    if (!options.projectName) options.projectName = name;

    const markers = parseMarkers(text);
    const tempo = parseTempo(text);

    const fileContent = getShowDataFileContent(markers, tempo, options);

    downloadTextFile(fileContent, `ReaCue_ShowData_${options.projectName}.csv`);
}