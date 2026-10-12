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
import { ElevenReaderTutorial } from './scenes/er/Main';
import { ER_TOTAL } from './scenes/er/timeline';
import { ElevenReaderReview } from './scenes/er2/Main';
import { ER2_TOTAL } from './scenes/er2/timeline';
import { ERCover } from './scenes/er2/Cover';
import { LibriVoxReview } from './scenes/lv/Main';
import { LV_TOTAL } from './scenes/lv/timeline';
import { LVCover } from './scenes/lv/Cover';
import { Cover } from './scenes/elt2/Cover';
import { CoverProposal } from './scenes/elt2/CoverProposal';

export const Root: React.FC = () => (
  <>
    <Composition id="LVReview" component={LibriVoxReview} durationInFrames={LV_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="LVCover" component={LVCover} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="LVCover1080" component={LVCover} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="LVCoverOG" component={LVCover} durationInFrames={1} fps={FPS} width={1200} height={630} />
    <Composition id="ERReview" component={ElevenReaderReview} durationInFrames={ER2_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="ERCover" component={ERCover} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="ERCover1080" component={ERCover} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="ERCoverOG" component={ERCover} durationInFrames={1} fps={FPS} width={1200} height={630} />
    <Composition id="ERTutorial" component={ElevenReaderTutorial} durationInFrames={ER_TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="ELTShort2" component={ELTShort2} durationInFrames={Math.round(SHORT2_DUR * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="ELTReview2" component={ELTReview2} durationInFrames={TOTAL2} fps={FPS} width={W} height={H} />
    <Composition id="ELTReview" component={ELTReview} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="ELTShort" component={ELTShort} durationInFrames={Math.round(SHORT_DUR * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="ELTThumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="ELTCover" component={Cover} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="ELTCover1080" component={Cover} durationInFrames={1} fps={FPS} width={1920} height={1080} />
    <Composition id="ELTCoverOG" component={Cover} durationInFrames={1} fps={FPS} width={1200} height={630} />
    <Composition id="ELTCoverPropA" component={CoverProposal} defaultProps={{ variant: 'a' as const }} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="ELTCoverPropB" component={CoverProposal} defaultProps={{ variant: 'b' as const }} durationInFrames={1} fps={FPS} width={1280} height={720} />
    <Composition id="Lab" component={Lab} durationInFrames={FPS * 18} fps={FPS} width={W} height={H} />
  </>
);
