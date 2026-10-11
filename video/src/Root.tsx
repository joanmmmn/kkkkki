import React from 'react';
import { Composition } from 'remotion';
import { FPS, H, W } from './brand/tokens';
import { Lab } from './scenes/Lab';
import { ELTReview } from './scenes/elt/Main';
import { TOTAL } from './scenes/elt/timeline';
import { Thumbnail } from './scenes/elt/Thumbnail';
import { ELTShort, SHORT_DUR } from './scenes/elt/Short';
import { ELTReview2 } from './scenes/elt2/Main';
import { TOTAL2 } from './scenes/elt2/timeline';
import { ELTShort2, SHORT_DUR as SHORT2_DUR } from './scenes/elt2/Short2';
import { NextoryTutorial } from './scenes/nx/Main';
import { NX_TOTAL } from './scenes/nx/timeline';
import { NextoryShort, SHORT_TOTAL as NX_SHORT_TOTAL } from './scenes/nx/Short';
import { NXThumb } from './scenes/nx/Thumb';

export const Root: React.FC = () => (
  <>
    <Composition id="NXTutorial" component={NextoryTutorial} durationInFrames={NX_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="NXShort" component={NextoryShort} durationInFrames={NX_SHORT_TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="NXThumb" component={NXThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="ELTShort2" component={ELTShort2} durationInFrames={Math.round(SHORT2_DUR * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="ELTReview2" component={ELTReview2} durationInFrames={TOTAL2} fps={FPS} width={W} height={H} />
    <Composition id="ELTReview" component={ELTReview} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="ELTShort" component={ELTShort} durationInFrames={Math.round(SHORT_DUR * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="ELTThumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Lab" component={Lab} durationInFrames={FPS * 18} fps={FPS} width={W} height={H} />
  </>
);
