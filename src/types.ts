export type Marker = {
    id: number; time: number; name: string;
}

export type Tempo = {
    bpm: number; m1: number; m2: number; bpmBasis: 0 | 1 | 2 | 3 | 4 | 5
}

export type ShowDataEntry = {
    id: number, label: string, timecode: string, cue: string
}

export type ShowDataOptions = {
    timecodeSource: TimecodeSource,
    timecodeOffset: string,
    eventList: number,
    firstEvent: number,
    cueList: number,
    firstCue: number,
    createCues?: boolean,
    createCueLinks?: boolean,
    smartCueNumbers?: boolean
    projectName?: string,
}

export type TimecodeSource = "midi" | "smpte"