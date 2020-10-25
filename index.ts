/**
 * See https://en.wikipedia.org/wiki/Interval_(music)#Main_intervals
 */
export enum Interval {
  P1 = 0,
  d2 = 0,
  m2 = 1,
  A1 = 1,
  M2 = 2,
  d3 = 2,
  m3 = 3,
  A2 = 3,
  M3 = 4,
  d4 = 4,
  P4 = 5,
  A3 = 5,
  d5 = 6,
  TT = 6,
  A4 = 6,
  P5 = 7,
  d6 = 7,
  m6 = 8,
  A5 = 8,
  M6 = 9,
  d7 = 9,
  m7 = 10,
  A6 = 10,
  M7 = 11,
  d8 = 11,
  P8 = 12,
  A7 = 12,
}

export enum Note {
  Ab = 0,
  A = 1,
  As = 2,

  Bb = 2,
  B = 3,
  Bs = 4,

  Cb = 3,
  C = 4,
  Cs = 5,

  Db = 5,
  D = 6,
  Ds = 7,

  Eb = 7,
  E = 8,
  Es = 9,

  Fb = 8,
  F = 9,
  Fs = 10,

  Gb = 10,
  G = 11,
  Gs = 0,
}

export const TuningPresets = {
  StandardGuitar: {
    strings: new Map([
      [1, Note.E],
      [2, Note.B],
      [3, Note.G],
      [4, Note.D],
      [5, Note.A],
      [6, Note.E],
    ]),
    frets: 15,
  },
};

/**
 * String position should be starting at 1 for highest pitch (thinnest) string
 */
export type StringPosition = number;
export type Fret = number;

/**
 * This doesn't really support weird tuning like a 5 string banjo
 *
 * @todo: support different length strings
 */
export interface Tuning {
  strings: Map<StringPosition, Note>;
  frets: number; // how many frets there are
}

export type FretboardPosition = [StringPosition, Fret]; // just a fancy x, y coord

export interface FretboardInterval {
  position: FretboardPosition;
  interval: Interval;
}

export type Fretboard = Array<FretboardPosition>;

/**
 * @todo: allow startNote to just be FretboardPosition, and assume interval of P1
 */
export const getIntervalPositions = (
  tuning: Tuning,
  startNote: FretboardInterval,
  interval: Interval
): Array<FretboardPosition> =>
  getAllIntervals(tuning, startNote)
    .filter((fretInterval) => fretInterval.interval === interval)
    .map((fretInterval) => fretInterval.position);

export const getAllIntervals = (
  tuning: Tuning,
  startNote: FretboardInterval
): Array<FretboardInterval> =>
  getFretboard(tuning).map(
    (position: FretboardPosition): FretboardInterval => ({
      position,
      interval: getInterval(tuning, startNote, position),
    })
  );

export const getFretboard = (tuning: Tuning): Fretboard => {
  const fretboard: Fretboard = [];
  for (
    let stringPosition: StringPosition = 1;
    stringPosition <= tuning.strings.size;
    stringPosition++
  ) {
    for (let fret: Fret = 0; fret <= tuning.frets; fret++) {
      fretboard.push([stringPosition, fret]);
    }
  }
  return fretboard;
};

export const getInterval = (
  tuning: Tuning,
  from: FretboardInterval,
  to: FretboardPosition
): Interval => {
  const rootNote = subtractInterval(
    fretboardNote(tuning, from.position),
    from.interval
  );
  const toNote = fretboardNote(tuning, to);
  return noteInterval(rootNote, toNote);
};

export const noteInterval = (fromNote: Note, toNote: Note): Interval =>
  (toNote + 12 - fromNote) % 12;

export const fretboardNote = (tuning: Tuning, fret: FretboardPosition): Note =>
  addInterval(stringNote(tuning.strings, fret[0]), fret[1]);

export const stringNote = (
  strings: Map<StringPosition, Note>,
  stringN: number
): Note => {
  const note = strings.get(stringN);
  if (note === undefined) {
    throw new Error(`No string ${stringN}`);
  }
  return note;
};

export const addInterval = (stringNote: Note, interval: Interval): Note =>
  Note[Note[(stringNote + interval) % 12] as keyof typeof Note];

export const subtractInterval = (
  stringNote: Note,
  interval: Interval
): Note => {
  const n = (stringNote + 12 - (interval % 12)) % 12;
  return Note[Note[n] as keyof typeof Note];
};

export const isReachable = (
  tuning: Tuning,
  fromPosition: FretboardPosition,
  toPosition: FretboardPosition
): boolean => true;
