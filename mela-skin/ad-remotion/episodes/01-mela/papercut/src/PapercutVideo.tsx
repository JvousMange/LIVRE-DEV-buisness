// MELA SKIN : 43 plans animés (couches de papier), transitions du kit, sous-titres en étiquettes déchirées, voix.
import React from 'react';
import type {Caption} from '@remotion/captions';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {CutSeries, type CutSpec} from './lib/paper/transitions';
import {GrainOverlay, PaperDefs} from './lib/paper/kit';
import {WordTagCaptions} from './lib/paper/overlays';
import {PLAN} from './scene';
import {SCENES} from './film/scenes';
import captionsJson from '../public/vo/captions.json';
import EP from '../episode.json';

const captions = captionsJson as Caption[];
const CUTS = ((EP as {cuts?: Record<string, CutSpec>}).cuts ?? {});
// La musique baisse sous la voix (0,5 pendant les mots) et remonte dans les silences.
const SPEECH = captions.map((c) => [c.startMs, c.endMs]);
const musicVolume = (f: number) => {
  const ms = (f / 30) * 1000;
  const gap = Math.min(...SPEECH.map(([a, b]) => (ms < a ? a - ms : ms > b ? ms - b : 0)));
  return 0.3 * (0.5 + 0.5 * Math.min(1, Math.max(0, (gap - 150) / 400)));
};
const fromOf = (id: string) => PLAN.scenes.find((s) => s.id === id)!;

export const PapercutVideo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#1a1a1a'}}>
    <PaperDefs />
    <CutSeries scenes={SCENES.map(({id, component}) => ({id, component, durationInFrames: fromOf(id).durationInFrames}))} cuts={CUTS} />
    <WordTagCaptions captions={captions} bandY={() => 0.71} />
    <GrainOverlay />
    <Audio src={staticFile('vo/voiceover.wav')} />
    <Audio src={staticFile('audio/music.wav')} volume={(f) => musicVolume(f)} />
    <Audio src={staticFile('audio/fx.wav')} volume={0.55} />
  </AbsoluteFill>
);
