export type Marker = {
    id: number;
    time: number;
    name: string;
}

export type Tempo = {
    bpm: number;
    m1: number;
    m2: number;
    bpmBasis: 0|1|2|3|4|5
}

export type TimecodeSource = "midi" | "smpte"