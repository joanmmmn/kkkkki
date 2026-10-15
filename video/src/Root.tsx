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
import { Lab3D, LAB_FRAMES } from './scenes/skg/three/Lab';
import { CienAnosHistoria } from './scenes/hdl/Main';
import { HDL_TOTAL } from './scenes/hdl/timeline';
import { HDLThumbA, HDLThumbB } from './scenes/hdl/Thumb';
import { HDLThumbA2, HDLThumbB2 } from './scenes/hdl/v2Thumb';
import { HDLLab } from './scenes/hdl/Lab';

export const Root: React.FC = () => (
  <>
    <Composition id="HDLCien" component={CienAnosHistoria} durationInFrames={HDL_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="HDLLab" component={HDLLab} durationInFrames={200} fps={FPS} width={W} height={H} />
    <Composition id="HDLThumbA" component={HDLThumbA} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="HDLThumbB" component={HDLThumbB} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="HDLThumbA2" component={HDLThumbA2} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="HDLThumbB2" component={HDLThumbB2} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="SKGuide" component={StephenKingGuide} durationInFrames={SKG_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="SKLab3D" component={Lab3D} durationInFrames={Math.max(5000, LAB_FRAMES.length)} fps={FPS} width={W} height={H} />
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
