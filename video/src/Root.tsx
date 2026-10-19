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
import { PhoneTest } from './scenes/nxr/PhoneTest';
import { NextoryReview } from './scenes/nxr/Main';
import { NXR_TOTAL } from './scenes/nxr/timeline';
import { NXRThumb } from './scenes/nxr/Thumb';
import { NextoryReviewShort, NXR_SHORT_TOTAL } from './scenes/nxr/Short';
import { PodimoReview } from './scenes/pdr/Main';
import { PDR_TOTAL } from './scenes/pdr/timeline';
import { PDRThumb } from './scenes/pdr/Thumb';
import { PodimoReviewShort, PDR_SHORT_TOTAL } from './scenes/pdr/Short';
import { StorytelReview } from './scenes/str/Main';
import { STR_TOTAL } from './scenes/str/timeline';
import { STRThumb } from './scenes/str/Thumb';
import { StorytelReviewShort, STR_SHORT_TOTAL } from './scenes/str/Short';

import { StephenKingGuide } from './scenes/skg/Main';
import { SKG_TOTAL } from './scenes/skg/timeline';
import { SKThumbA, SKThumbB } from './scenes/skg/Thumb';
import { Top10Terror } from './scenes/t10/Main';
import { T10_TOTAL } from './scenes/t10/timeline';
import { T10Short, T10_SHORT_TOTAL } from './scenes/t10/Short';
import { T10ThumbA, T10ThumbB, T10ThumbC } from './scenes/t10/Thumb';

export const Root: React.FC = () => (
  <>
    {/* SonorBooks Polska · «10 historii grozy, które naprawdę przerażają» (rama pl-top10-horror; el español está en top10-terror) */}
    <Composition id="PL-top10-horror" component={Top10Terror} durationInFrames={T10_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="PL-top10-horror-short" component={T10Short} durationInFrames={T10_SHORT_TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="PL-top10-horror-thumbA" component={T10ThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="PL-top10-horror-thumbB" component={T10ThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="PL-top10-horror-thumbC" component={T10ThumbC} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="SKGuide" component={StephenKingGuide} durationInFrames={SKG_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="SKThumbA" component={SKThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="SKThumbB" component={SKThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="STReview" component={StorytelReview} durationInFrames={STR_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="STRThumb" component={STRThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="STRShort" component={StorytelReviewShort} durationInFrames={STR_SHORT_TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="PDReview" component={PodimoReview} durationInFrames={PDR_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="PDRThumb" component={PDRThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="PDRShort" component={PodimoReviewShort} durationInFrames={PDR_SHORT_TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="NXReview" component={NextoryReview} durationInFrames={NXR_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="NXRThumb" component={NXRThumb} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="NXRShort" component={NextoryReviewShort} durationInFrames={NXR_SHORT_TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="NXRPhoneTest" component={PhoneTest} durationInFrames={60} fps={FPS} width={W} height={H} />
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
