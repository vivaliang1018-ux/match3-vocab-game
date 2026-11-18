// Audit-only entry. Not imported by the product or included in its build.
// Renders production components with deterministic props; no purchases, login,
// microphone authorization or notification requests are made by the harness.
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LocaleProvider, useI18n } from '../../src/i18n';
import { CourseProvider } from '../../src/course';
import { AuthProvider } from '../../src/auth/AuthProvider';
import { MembershipProvider } from '../../src/membership/MembershipProvider';
import { EMOJI_NOUN_CATEGORIES } from '../../src/data/emojiNouns';
import { memoryKeyForWord } from '../../src/lib/ebbinghausMemory';
import { AWARD_TRACKS } from '../../src/lib/playerSummary';
import { REWARDED_AD_COPY } from '../../src/i18n/rewardedAdCopy';
import { learningWordForCourse, sourceWordForCourse } from '../../src/lib/courseWord';
import '../../src/index.css';
const modules = import.meta.glob('../../src/components/mobile/*.tsx', { eager: true }) as Record<string, any>;
const component = (name: string) => Object.values(modules).find(m => m[name])?.[name];
const allItems = EMOJI_NOUN_CATEGORIES.flatMap(c => c.items);
const items = allItems.slice(0, 6);
const noop = () => {};
const params = new URLSearchParams(location.search);
const scenario = params.get('case') || 'dead';
const locale = params.get('locale') || 'en';
const now = Date.now();
const memory = new Map(allItems.slice(0, 24).map((item, i) => {
 const key = memoryKeyForWord(item.word);
 return [key, {key,word:item.word,cn:item.cn,stage: i % 3 + 1,lastReviewAt:now-86400000,nextReviewAt: i%2 ? now+43200000 : now-1000,exposures:5}];
}));
function Fixture() {
 const { setLocale } = useI18n();
 const [closed, setClosed] = useState(false);
 useEffect(() => { const t=setTimeout(()=>setLocale(locale as any),200);return()=>clearTimeout(t); }, []);
 useEffect(() => { document.body.dataset.auditCase = scenario; }, []);
 const close = () => setClosed(true);
 let name = '', props: any = {open:true,onClose:close};
 switch(scenario) {
 case 'translation-word':case 'translation-learned': {
 const course = (params.get('course') || 'zh-CN-ja') as Parameters<typeof learningWordForCourse>[1];
 const original = allItems.find(i=>i.id==='factory-worker')!;
 const item = {...original,word:learningWordForCourse(original,course),sourceWord:sourceWordForCourse(original,course)};
 if(scenario==='translation-word'){name='LearnedWordModal';props={open:true,item,onClose:close};}
 else {name='LearnedPanel';props={roundLearnedIds:[item.id],itemById:new Map([[item.id,item]]),allPool:[item],wordMemory:new Map(),canGoReview:false,onGoReview:noop};}
 break;
 }
 case 'consent':name='LegalConsentModal';props.onAccept=close;break;
 case 'course':name='CoursePickerSheet';props={initialSourceLanguage:'en',initialCourseId:'en-es',required:true,onClose:close,onConfirmed:close};break;
 case 'course-change':name='CoursePickerSheet';props={initialSourceLanguage:'en',initialCourseId:'en-es',onClose:close,onConfirmed:close};break;
 case 'quiz-pick':case 'quiz-connect':name='RoundQuizSheet';props={open:true,items,distractorPool:allItems,quizKind:scenario==='quiz-pick'?'pick':'connect',checkpoint:null,onComplete:close};break;
 case 'result':case 'review-result':case 'mood-result':
 name='RoundResultSheet';props={result:{kind:scenario==='review-result'?'review':'learned',items,learnedTotal:24,adventureClears:4,dayStreak:3,collectionAdded:6,streakIncreased:true,unlocks:['review','category'],awardIds:[],perfectQuiz:true,nextGoal:'Keep discovering new words',followUp:scenario==='review-result'?'review-choices':scenario==='mood-result'?'mood-limit':'advance'},onExitComplete:noop,onContinue:close,onReturnToCategory:close,onViewCollection:close,canContinueReview:true,canGoAdventure:false,hasPremiumAccess:false,lifetimeDisplayPrice:'¥1,500',onContinueReview:close,onGoAdventure:close,onUnlockPlus:close,onReturnHome:close,onRest:close,onClaimAward:noop,onEnableReminders:async()=>'unavailable'};break;
 case 'dead':case 'refilled':
 name='DeadMachineSheet';props={open:true,nextStaminaAt:now+20*3600000,hasStamina:scenario==='refilled',canGoSayBlast:true,canGoReview:true,canGoMood:true,rewardedAdsAvailable:true,adResetsRemaining:2,adBusy:false,adStatus:'No ad is available right now. Please try again shortly.',lifetimeDisplayPrice:'¥1,500',onWatchAd:noop,onUnlockPlus:noop,onGoSayBlast:close,onGoReview:close,onGoMood:close,onContinue:close,onGoHome:close,remindersEnabled:false,reminderBusy:false,onEnableReminders:noop};break;
 case 'fail':name='AdventureFailSheet';props={open:true,canRetry:true,unlimitedRetry:false,remainingWords:3,onRetry:close,onRecharge:close,onGoHome:close};break;
 case 'learned':case 'learned-empty':case 'learned-tour':
 name='LearnedPanel';props={roundLearnedIds:scenario==='learned-empty'?[]:allItems.slice(0,24).map(i=>i.id),itemById:new Map(allItems.map(i=>[i.id,i])),allPool:allItems,wordMemory:memory,canGoReview:true,onGoReview:noop,showFirstVisitGuide:scenario==='learned-tour',onFirstVisitGuideComplete:close};break;
 case 'word':name='LearnedWordModal';props={open:true,item:allItems.find(i=>i.word.length>35),onClose:close};break;
 case 'mode':name='ModePickerSheet';props={open:true,onClose:close,challengeMode:'random',onChallengeModeChange:close,onOpenCategoryHub:close,onShuffleWords:noop,onRestart:noop,canPlay:true,categoryUnlocked:true,moodUnlocked:true,moodCanStartNew:true,sayBlastReady:true,onOpenSayBlast:close};break;
 case 'category':name='CategoryHubSheet';props={open:true,onClose:close,onBackToModes:close,pools:EMOJI_NOUN_CATEGORIES.map((c,i)=>({id:c.id,label:c.subtitle,subtitle:c.subtitle,description:c.label,emoji:c.items[0].emoji,browseSectionId:'all',cycle:1,clearedInCycle:0,items:c.items})),sections:[{id:'all',label:'Explore categories'}],selectedCategoryId:EMOJI_NOUN_CATEGORIES[0].id,onSelectCategory:close};break;
 case 'signin':case 'signup':name='SignInSheet';props={open:true,onClose:close,initialMode:scenario==='signup'?'signUp':'signIn'};break;
 case 'account-prompt':name='AccountPromptSheet';props={open:true,kind:'soft',discoveredCount:24,onCreateAccount:close,onSignIn:close,onDismiss:close};break;
 case 'membership':case 'trial':
 name='MembershipSheet';props={open:true,mode:scenario==='trial'?'welcome':'paywall',signedIn:false,lifetimeDisplayPrice:'¥1,500',storeReady:true,storeBusy:false,storeError:null,onStartTrial:noop,onSelectPlan:async()=>'cancelled',onContinueFree:close,onRestore:async()=>false,onClose:close};break;
 case 'notifications':name='NotificationSettingsSheet';props={open:true,locale,hasPremiumAccess:false,playedToday:true,reminderGameState:{dueReviewCount:12,staminaValue:0,nextStaminaAt:now+72000000},onClose:close,onStatus:noop};break;
 case 'reminder':name='LearningReminderPromptSheet';props={open:true,kind:'learning',locale,busy:false,onEnable:noop,onLater:close};break;
 case 'achievement':name='AchievementDetailSheet';props={achievement:{id:'sets',value:24,label:'Sets cleared',iconSrc:'/branding/awards/set_hunter.webp'},onClose:close};break;
 case 'award':name='AwardClaimSheet';props={open:true,def:AWARD_TRACKS[0],progress:{id:'set_hunter',value:10,tier:1,achieved:10,current:0,next:20,maxed:false,unlocked:true,claimable:true,ratio:.5},claimedAt:null,claimable:true,onClose:close,onClaim:noop};break;
 case 'legal':name='LegalDocSheet';props={open:true,title:'Privacy Policy',src:'/privacy.html',onClose:close};break;
 case 'sayblast':name='SayBlastGame';props={learnedItems:items,speechLocale:'en-US',progressUserId:null,onExit:close,onRewardStamina:async()=>'daily-limit',onValidExperience:noop};break;
 default:throw new Error('Unknown audit case: '+scenario);
 }
 const C = component(name);
 if (scenario === 'dead' || scenario === 'refilled') props.adStatus = REWARDED_AD_COPY[locale as keyof typeof REWARDED_AD_COPY].unavailable;
 return <div style={{height:'100dvh',overflow:'auto',background:'#e8f8ff'}}>{closed?<div role="status">Audit callback reached</div>:C?<C {...props}/>:<pre>Missing component {name}</pre>}</div>;
}
createRoot(document.getElementById('root')!).render(<LocaleProvider><CourseProvider><AuthProvider><MembershipProvider><Fixture/></MembershipProvider></AuthProvider></CourseProvider></LocaleProvider>);
