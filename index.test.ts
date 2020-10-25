import test from "tape";
import {
  Note,
  addInterval,
  TuningPresets,
  Tuning,
  fretboardNote,
  Interval,
  noteInterval,
  getIntervalPositions,
} from "./index";

test("frettedNote", (t) => {
  t.equal(addInterval(Note.E, 5), Note.A);
  t.equal(addInterval(Note.A, 3), Note.C);
  t.end();
});

test("fretboardNote", (t) => {
  const tuning: Tuning = TuningPresets.StandardGuitar;
  t.equal(fretboardNote(tuning, [1, 0]), Note.E);
  t.equal(fretboardNote(tuning, [1, 1]), Note.F);
  t.equal(fretboardNote(tuning, [3, 4]), Note.B);
  t.end();
});

test("noteInterval", (t) => {
  t.equal(noteInterval(Note.C, Note.G), Interval.P5);
  t.end();
});

test("getIntervalPositions :: from root to 5th", (t) => {
  const tuning: Tuning = {
    strings: TuningPresets.StandardGuitar.strings,
    frets: 5, // limit it to 5 frets for simplicity
  };

  // Get all perfect 5ths from G (on 6th string)
  const perfect5ths = getIntervalPositions(
    tuning,
    {
      position: [6, 3],
      interval: Interval.P1,
    },
    Interval.P5
  );

  // These are all the Ds
  const actual = [
    [4, 0],
    [2, 3],
    [5, 5],
  ];
  actual.forEach((actualPos) => {
    t.ok(
      perfect5ths.find(
        (pos) => pos[0] === actualPos[0] && pos[1] === actualPos[1]
      ),
      `Perfect 5th of G found at ${actualPos}`
    );
  });

  t.end();
});

test("getIntervalPositions :: from 3rd to minor 7th", (t) => {
  const tuning: Tuning = {
    strings: TuningPresets.StandardGuitar.strings,
    frets: 5, // limit it to 5 frets for simplicity
  };

  // Get all minor 7ths from G (on 6th string), using the G's minor 3rd as reference
  const minor3rds = getIntervalPositions(
    tuning,
    {
      position: [5, 1], // Bb
      interval: Interval.m3,
    },
    Interval.m7
  );

  // These are all the Fs (minor 3rds of G)
  const actual = [
    [1, 1],
    [4, 3],
    [6, 1],
  ];
  actual.forEach((actualPos) => {
    t.ok(
      minor3rds.find(
        (pos) => pos[0] === actualPos[0] && pos[1] === actualPos[1]
      ),
      `Minor 3rd of G found at ${actualPos}`
    );
  });

  t.end();
});
