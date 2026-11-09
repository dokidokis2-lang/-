import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowRight,
  Footprints,
  HeartPulse,
  X,
  ShieldCheck,
  CalendarCheck2,
  Camera,
  Scale,
  ClipboardPlus,
  User,
  Target,
  Sparkles
} from 'lucide-react';
import { UserProfile, AttendanceDay, MedicalGoal, Hospital, MedicalCheckupRecord } from '../types';

interface HomeViewProps {
  user: UserProfile;
  attendanceDays: AttendanceDay[];
  points: number;
  dailyEarnedPoints: number;
  dailyMaxLimit: number;
  medicalGoals: MedicalGoal[];
  nearbyEmergencyHospital: Hospital;
  onNavigate: (tab: 'home' | 'mission' | 'shop' | 'community' | 'hospital' | 'mypage', subTab?: string) => void;
  onCheckAttendance: () => void;
  onStartWalk: () => void;
  onSelectPrimaryGoal?: (goalId: string) => void;
  isLoggedIn?: boolean;
  onRequireAuth?: (targetName?: string, initialMode?: 'login' | 'signup') => void;
  onUpdateUserProfile?: (updated: Partial<UserProfile>) => void;
  medicalRecords?: MedicalCheckupRecord[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  attendanceDays,
  points,
  dailyEarnedPoints,
  dailyMaxLimit,
  medicalGoals,
  nearbyEmergencyHospital,
  onNavigate,
  onCheckAttendance,
  onStartWalk,
  onSelectPrimaryGoal,
  isLoggedIn = false,
  onRequireAuth,
  onUpdateUserProfile,
  medicalRecords = [],
}) => {
  // Guide Modal State for "모으개가 처음이신가요?"
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateUserProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateUserProfile({ profileImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Active primary medical goal
  const activeGoal = medicalGoals.find((g) => g.isPrimary) || medicalGoals[0];
  const goalPercent = activeGoal
    ? Math.min(100, Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100))
    : 42;

  const todayAttendance = attendanceDays.find((d) => d.isToday);

  return (
    <div className="space-y-6 animate-fadeIn pb-10 max-w-5xl mx-auto">
      {/* ========================================================
          1. HERO SECTION (최상단 메인 섹션)
          Two-column grid: Left illustration & Right title + features + CTAs
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-100 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: Walking Illustration with Centered Puppy Hero */}
          <div className="md:col-span-5 flex justify-center md:justify-start">
            <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-3xl overflow-hidden border border-amber-100/80 shadow-xs bg-amber-50/20 p-1 flex items-center justify-center">
              <img
                src="/assets/brand/hero_walk_park.png"
                alt="반려견 주인공 강아지와 함께 걷는 산책"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>

          {/* Right: Headlines, 3 Mini-Highlights, 2 CTA Buttons */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-stone-900 tracking-tight leading-tight">
                함께 걷는 오늘,<br />
                <span className="text-amber-500 inline-flex items-center gap-1.5">
                  모이는 내일
                  <span className="text-xl sm:text-2xl inline-block -rotate-6">✨</span>
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 sm:mt-3 leading-relaxed">
                매일의 산책과 작은 돌봄이<br />
                우리 아이의 건강한 미래를 위한 포인트가 됩니다.
              </p>
            </div>

            {/* 3 Mini Feature Highlights with vertical dividers & enlarged centered icons */}
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-6 py-2.5 border-y border-stone-100/80">
              {/* Feature 1: 산책 리워드 */}
              <div className="flex-1 sm:flex-initial sm:w-28 flex flex-col items-center text-center">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF3E6] border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-2xs mb-2 transition-transform duration-200 hover:scale-105">
                  <Footprints className="w-6 h-6 text-amber-500" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-stone-800 whitespace-nowrap">산책 리워드</span>
              </div>

              <div className="w-px h-10 bg-stone-200/80" />

              {/* Feature 2: 건강 관리 */}
              <div className="flex-1 sm:flex-initial sm:w-28 flex flex-col items-center text-center">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FFEAE6] border border-rose-200/60 flex items-center justify-center text-rose-500 shadow-2xs mb-2 transition-transform duration-200 hover:scale-105">
                  <HeartPulse className="w-6 h-6 text-rose-500" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-stone-800 whitespace-nowrap">건강 관리</span>
              </div>

              <div className="w-px h-10 bg-stone-200/80" />

              {/* Feature 3: 의료비 준비 (포인트 아이콘 적용) */}
              <div className="flex-1 sm:flex-initial sm:w-28 flex flex-col items-center text-center">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF6DB] border border-amber-200/60 flex items-center justify-center shadow-2xs mb-2 p-2.5 transition-transform duration-200 hover:scale-105">
                  <img
                    src="/assets/brand/point_coin.png"
                    alt="의료비 준비 포인트"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-stone-800 whitespace-nowrap">의료비 준비</span>
              </div>
            </div>

            {/* 2 Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <button
                onClick={onStartWalk}
                className="flex-1 py-3 px-5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>지금 시작하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsGuideModalOpen(true)}
                className="flex-1 py-3 px-5 bg-white hover:bg-stone-50 active:scale-[0.99] border border-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>모으개가 처음이신가요?</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          NEW SECTION: 반려견 프로필 & 출석체크 (회원 / 비회원 분기)
          첨부된 디자인(image_92a6ea27.png) 완벽 반영
          ======================================================== */}
      <div className="space-y-3.5">
        {/* 상단 출석체크 가로형 배너 */}
        <div
          onClick={() => {
            if (!isLoggedIn) {
              onRequireAuth?.('출석체크', 'login');
            } else {
              if (todayAttendance?.isChecked) {
                onNavigate('mission', 'attendance');
              } else {
                onCheckAttendance();
              }
            }
          }}
          className="w-full bg-[#FFF5E9] hover:bg-[#FFEEDC] border border-[#FFE0C2] rounded-3xl py-3.5 px-5 sm:px-6 flex items-center justify-between text-stone-900 transition-all cursor-pointer shadow-2xs group"
          title={isLoggedIn ? '오늘 출석체크 하러가기' : '로그인하고 오늘의 포인트 받기'}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0">
              <CalendarCheck2 className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-stone-900">
              <span>출석체크</span>
              <span className="text-amber-500 font-bold">&gt;</span>
              <span className="text-amber-950 font-black">
                {isLoggedIn ? '오늘 출석체크 하러가기' : '로그인하고 오늘의 포인트 받기'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>

        {/* 메인 프로필 영역 (회원: 반려견 프로필 카드 / 비회원: 서비스 소개 및 가입/로그인) */}
        {isLoggedIn ? (
          /* ========================================================
             로그인 회원 화면: 첨부 반려견 프로필 카드 디자인
             ======================================================== */
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#FFEAD5] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* 왼쪽 영역: 반려견 프로필 사진, 카메라 변경 버튼, 이름·나이·견종 알약 바 */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
                <div className="relative mb-3">
                  {/* 3개의 오렌지 장식 스파크 (첨부 디자인 일치) */}
                  <div className="absolute -top-3 -left-2 flex gap-1 pointer-events-none select-none">
                    <span className="w-1.5 h-3.5 bg-amber-400 rounded-full transform -rotate-45" />
                    <span className="w-1.5 h-4.5 bg-amber-400 rounded-full transform -rotate-12 -mt-1" />
                    <span className="w-1.5 h-3.5 bg-amber-400 rounded-full transform rotate-20" />
                  </div>

                  {/* 원형 프로필 사진 프레임 */}
                  <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full border-4 border-[#FFECCC] bg-[#FFF8F0] shadow-sm overflow-hidden flex items-center justify-center relative">
                    {user.profileImage && user.profileImage.startsWith('data:image') ? (
                      <img
                        src={user.profileImage}
                        alt={user.petName}
                        className="w-full h-full object-cover"
                      />
                    ) : user.profileImage && (user.profileImage.startsWith('/assets') || user.profileImage.startsWith('http')) ? (
                      <img
                        src={user.profileImage}
                        alt={user.petName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/assets/brand/default_pet_profile.png"
                        alt={user.petName || '반려견'}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* 카메라 사진 변경 아이콘 버튼 */}
                    <label
                      className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95 border-2 border-white"
                      title="반려견 사진 변경하기"
                    >
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* 하단 반려견 정보 알약 바 (이름 | 나이 | 견종) */}
                <div className="bg-[#FFF9F3] border border-[#FFE8D0] rounded-2xl py-2 px-5 flex items-center justify-center gap-3 shadow-2xs">
                  <span className="font-black text-stone-900 text-base sm:text-lg">
                    {user.petName || '정보를 등록해주세요'}
                  </span>
                  <span className="text-stone-300 select-none">|</span>
                  <span className="font-bold text-stone-700 text-sm sm:text-base">
                    {user.petAge ? `${user.petAge}살` : '나이 미등록'}
                  </span>
                  <span className="text-stone-300 select-none">|</span>
                  <span className="font-bold text-stone-700 text-sm sm:text-base">
                    {user.petBreed || '견종 미등록'}
                  </span>
                </div>
              </div>

              {/* 오른쪽 영역: 몸무게, 특이사항, 지병, 동물병원 기록 */}
              <div className="md:col-span-7 bg-[#FFF9F3] rounded-3xl p-5 sm:p-6 border border-[#FFEAD5] flex flex-col justify-between space-y-3.5">
                {/* 1. 몸무게 */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FFEAD5]/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <Scale className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-black text-stone-900 text-sm sm:text-base">몸무게</span>
                  </div>
                  <div className="font-black text-stone-900 text-base sm:text-lg tabular-nums">
                    {user.petWeight && user.petWeight > 0 ? (
                      `${user.petWeight} kg`
                    ) : (
                      <span className="text-xs text-stone-400 font-medium">정보를 등록해주세요</span>
                    )}
                  </div>
                </div>

                {/* 2. 특이사항 */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FFEAD5]/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <Footprints className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-black text-stone-900 text-sm sm:text-base">특이사항</span>
                  </div>
                  <div className="font-bold text-stone-800 text-sm sm:text-base text-right max-w-[240px] truncate">
                    {user.healthNotes || '없음'}
                  </div>
                </div>

                {/* 3. 지병 */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FFEAD5]/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <HeartPulse className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-black text-stone-900 text-sm sm:text-base">지병</span>
                  </div>
                  <div className="font-bold text-stone-800 text-sm sm:text-base text-right max-w-[240px] truncate">
                    {user.hasCondition === '있음'
                      ? (user.petCondition || user.conditionDetail || (user.conditionCategories && user.conditionCategories.length > 0 ? user.conditionCategories.join(', ') : '있음'))
                      : (user.hasCondition === '모름' ? '모름' : '없음')}
                  </div>
                </div>

                {/* 4. 동물병원 기록 */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <ClipboardPlus className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-black text-stone-900 text-sm sm:text-base">병원기록</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('mypage', 'records')}
                    className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-800 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer group/btn"
                  >
                    <span>기록 보기</span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover/btn:translate-x-0.5 group-hover/btn:text-amber-600 transition-all" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             비회원 화면: 모으개 서비스 소개 영역
             ======================================================== */
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#FFEAD5] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* 왼쪽 영역: 귀여운 반려견 일러스트 + 문구 */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 border-[#FFECCC] bg-[#FFF8F0] shadow-sm overflow-hidden flex items-center justify-center p-2">
                  <img
                    src="/assets/brand/default_pet_profile.png"
                    alt="모으개 반려견 케어"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                    우리 아이와 함께 시작해볼까요?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
                    회원가입하고 반려견 맞춤 케어 서비스를 이용해보세요.
                  </p>
                </div>
              </div>

              {/* 오른쪽 영역: 4가지 서비스 소개 정보 + 회원가입/로그인 버튼 */}
              <div className="md:col-span-7 bg-[#FFF9F3] rounded-3xl p-5 sm:p-6 border border-[#FFEAD5] flex flex-col justify-between space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Feature 1: 반려견 프로필 관리 */}
                  <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-100 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-stone-900 text-xs sm:text-sm block truncate">
                        반려견 프로필 관리
                      </span>
                      <span className="text-[11px] text-stone-500 block truncate">
                        품종·나이 맞춤 건강 정보
                      </span>
                    </div>
                  </div>

                  {/* Feature 2: GPS 산책 리워드 */}
                  <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-100 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center shrink-0">
                      <Footprints className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-stone-900 text-xs sm:text-sm block truncate">
                        GPS 산책 리워드
                      </span>
                      <span className="text-[11px] text-stone-500 block truncate">
                        걸을 때마다 쌓이는 포인트
                      </span>
                    </div>
                  </div>

                  {/* Feature 3: 건강 및 병원 기록 관리 */}
                  <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-100 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0">
                      <HeartPulse className="w-5 h-5 text-rose-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-stone-900 text-xs sm:text-sm block truncate">
                        건강 및 병원 기록 관리
                      </span>
                      <span className="text-[11px] text-stone-500 block truncate">
                        검진·접종 내역 스마트 기록
                      </span>
                    </div>
                  </div>

                  {/* Feature 4: 우리 아이 의료비 목표 설정 */}
                  <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-stone-100 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-stone-900 text-xs sm:text-sm block truncate">
                        우리 아이 의료비 목표 설정
                      </span>
                      <span className="text-[11px] text-stone-500 block truncate">
                        병원비 바우처 사전 준비
                      </span>
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 (회원가입하고 시작하기 & 로그인하기) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onRequireAuth?.('회원가입', 'signup')}
                    className="flex-1 py-3 px-5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>회원가입하고 시작하기</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequireAuth?.('로그인', 'login')}
                    className="flex-1 py-3 px-5 bg-white hover:bg-stone-50 active:scale-[0.99] border border-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>로그인하기</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          3. WELCOME POINT BANNER (환영 포인트 띠 배너)
          ======================================================== */}
      <div
        onClick={() => onNavigate('mypage', 'benefits')}
        className="w-full bg-[#FFF9F3] hover:bg-[#FFF4E8] border border-amber-200/80 rounded-2xl py-3 px-4 sm:px-6 flex items-center justify-between text-xs sm:text-sm font-bold text-stone-800 transition-all cursor-pointer shadow-2xs group"
        title="포인트 내역 확인하기"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg shrink-0">📢</span>
          <span className="truncate">
            지금 회원가입하고 <strong className="text-amber-600 font-black">2,000P 환영 포인트</strong>를 받아보세요!
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
      </div>

      {/* ========================================================
          3. 2-COLUMN HIGHLIGHTS GRID (주요 핵심 카드 2분할)
          Left: 모으개 GPS 산책 목걸이 / Right: 우리 아이 의료비 목표
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: 모으개 GPS 산책 목걸이 (실제 사진 적용) */}
        <div className="bg-[#FFF8F2] border border-orange-100/90 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all min-h-[180px]">
          <div className="relative z-10 max-w-[210px] sm:max-w-[230px]">
            <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-snug">
              모으개<br />GPS 산책 목걸이
            </h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              산책 기록부터 위치 확인까지!<br />
              더 안전하고 특별한 산책을 시작하세요.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 w-fit cursor-pointer"
            >
              <span>모으개 SHOP 바로가기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual GPS Collar Photo (전달받은 공식 사진 적용) */}
          <div className="absolute right-2 bottom-1 w-36 h-28 sm:w-40 sm:h-32 pointer-events-none flex items-center justify-center p-1">
            <img
              src="/assets/brand/gps_collar_photo.png"
              alt="모으개 스마트 GPS 산책 목걸이"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* Right Card: 우리 아이 의료비 목표 (건강관리 체크리스트 아이콘 적용) */}
        <div
          onClick={() => onNavigate('mypage', 'points')}
          className="bg-[#F4FAF5] border border-emerald-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all min-h-[180px]"
          title="목표 관리 페이지로 이동"
        >
          <div className="relative z-10">
            <div className="max-w-[210px] sm:max-w-[230px]">
              <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-snug">
                우리 아이<br />의료비 목표
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                예상치 못한 병원비도<br />
                미리, 차근차근 준비해요.
              </p>
            </div>

            {/* Health Checklist Icon (전달받은 아이콘 적용) */}
            <div className="absolute right-4 top-4 w-18 h-18 pointer-events-none">
              <img
                src="/assets/brand/icon_health_checklist.png"
                alt="건강관리 체크리스트"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
          </div>

          {/* Inner Goal Progress Bar Card */}
          <div className="relative z-10 bg-white rounded-2xl p-3.5 shadow-2xs border border-stone-100 mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <span className="text-sm">🐾</span>
                <span>의료비 목표 ({activeGoal?.title || '정기 건강검진'})</span>
              </div>
              <div className="font-black text-stone-900 tabular-nums">
                <span>{activeGoal?.targetAmount.toLocaleString()}P</span>
                <span className="text-amber-600 ml-1.5 font-bold">{goalPercent}%</span>
              </div>
            </div>
            {/* Progress Bar Track */}
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. 3-COLUMN SERVICE SHORTCUTS GRID (3열 주요 서비스)
          산책 미션 / 동물병원 / 커뮤니티 (중앙 정렬 및 확대된 전용 아이콘 적용)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: 산책 미션 */}
        <div
          onClick={() => onNavigate('mission')}
          className="bg-[#FFFBF5] hover:bg-[#FFF6EA] border border-orange-100/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center justify-between text-center"
        >
          <div className="w-full flex flex-col items-center">
            {/* Enlarged & Centered Icon */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 mx-auto mb-3.5 flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/assets/brand/icon_walk_mission_map.png"
                alt="산책 미션"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Title */}
            <h4 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-amber-600 transition-colors">
              산책 미션
            </h4>
            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
              함께 걸을수록<br />차곡차곡 쌓이는 포인트
            </p>
          </div>
          {/* Bottom Status */}
          <div className="w-full pt-3 mt-4 flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold border-t border-orange-100/60">
            <span>오늘 적립 {dailyEarnedPoints}/{dailyMaxLimit}P</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: 동물병원 */}
        <div
          onClick={() => onNavigate('hospital')}
          className="bg-[#FFFBF5] hover:bg-[#FFF6EA] border border-orange-100/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center justify-between text-center"
        >
          <div className="w-full flex flex-col items-center">
            {/* Enlarged & Centered Icon */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 mx-auto mb-3.5 flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/assets/brand/icon_hospital_building.png"
                alt="동물병원"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Title */}
            <h4 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-amber-600 transition-colors">
              동물병원
            </h4>
            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
              우리 아이에게 가까운<br />동물병원을 찾아보세요
            </p>
          </div>
          {/* Bottom Status */}
          <div className="w-full pt-3 mt-4 flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold border-t border-orange-100/60">
            <span className="truncate max-w-[200px]">24시: {nearbyEmergencyHospital.name.slice(0, 10)}...</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
        </div>

        {/* Card 3: 커뮤니티 */}
        <div
          onClick={() => onNavigate('community')}
          className="bg-[#FFFBF5] hover:bg-[#FFF6EA] border border-orange-100/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center justify-between text-center"
        >
          <div className="w-full flex flex-col items-center">
            {/* Enlarged & Centered Icon */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 mx-auto mb-3.5 flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/assets/brand/icon_community_speech.png"
                alt="커뮤니티"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Title */}
            <h4 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-amber-600 transition-colors">
              커뮤니티
            </h4>
            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
              반려인들과 정보도 나누고<br />일상도 함께해요
            </p>
          </div>
          {/* Bottom Status */}
          <div className="w-full pt-3 mt-4 flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold border-t border-orange-100/60">
            <span>응급 대처 가이드 & 일상 공유</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* ========================================================
          5. "이런 서비스도 있어요!" 4-COLUMN FEATURE GRID (4열 주요 서비스)
          SHOP / 산책 경로 / 건강 기록 / 레벨·배지 (전달받은 전용 아이콘 적용)
          ======================================================== */}
      <div className="space-y-4 pt-3">
        <div className="text-center">
          <span className="px-3.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200/60 inline-block mb-1.5">
            모으개 주요 서비스
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center justify-center gap-1.5">
            <span className="text-amber-500">✨</span> 이런 서비스도 있어요!
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Service 1: 모으개 SHOP */}
          <div
            onClick={() => onNavigate('shop')}
            className="bg-[#FFFBF5] hover:bg-[#FFF6EA] border border-orange-100/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-22 sm:h-22 mx-auto mb-3.5 flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/assets/brand/icon_shop_bag.png"
                  alt="모으개 SHOP"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-sm sm:text-base font-black text-stone-900 group-hover:text-amber-600 transition-colors">
                모으개 SHOP
              </h4>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                산책부터 일상까지<br />필요한 반려동물 용품
              </p>
            </div>
            <div className="pt-4 flex justify-center text-stone-400 group-hover:text-amber-600 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Service 2: 산책 경로 기록 */}
          <div
            onClick={() => onNavigate('mypage', 'walks')}
            className="bg-[#FFFBF5] hover:bg-[#FFF6EA] border border-orange-100/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-22 sm:h-22 mx-auto mb-3.5 flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/assets/brand/icon_route_tablet.png"
                  alt="산책 경로 기록"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-sm sm:text-base font-black text-stone-900 group-hover:text-amber-600 transition-colors">
                산책 경로 기록
              </h4>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                GPS로 우리 아이의<br />산책 경로를 한눈에!
              </p>
            </div>
            <div className="pt-4 flex justify-center text-stone-400 group-hover:text-amber-600 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Service 3: 건강 기록 관리 */}
          <div
            onClick={() => onNavigate('mypage', 'records')}
            className="bg-[#FFFBF5] hover:bg-[#FFF6EA] border border-orange-100/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-22 sm:h-22 mx-auto mb-3.5 flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/assets/brand/icon_health_checklist.png"
                  alt="건강 기록 관리"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-sm sm:text-base font-black text-stone-900 group-hover:text-amber-600 transition-colors">
                건강 기록 관리
              </h4>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                예방접종, 정기검진 등<br />건강 정보를 간편하게
              </p>
            </div>
            <div className="pt-4 flex justify-center text-stone-400 group-hover:text-amber-600 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Service 4: 레벨 · 배지 */}
          <div
            onClick={() => onNavigate('mypage', 'profile')}
            className="bg-[#FFFBF5] hover:bg-[#FFF6EA] border border-orange-100/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-22 sm:h-22 mx-auto mb-3.5 flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/assets/brand/icon_badge_medal.png"
                  alt="레벨 · 배지"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-sm sm:text-base font-black text-stone-900 group-hover:text-amber-600 transition-colors">
                레벨 · 배지
              </h4>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                참여할수록 올라가는<br />레벨과 특별한 배지
              </p>
            </div>
            <div className="pt-4 flex justify-center text-stone-400 group-hover:text-amber-600 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          6. BOTTOM SECTION: HEADER & PURE PANORAMIC ILLUSTRATION
          Requirement 4: 전달한 사람과 강아지가 함께 산책하는 일러스트를 홈페이지 하단에 적용.
          일러스트 위에 불필요한 문구나 버튼을 추가하지 마세요.
          투명 배경을 유지하고 흰색 배경과 자연스럽게 어우러지도록 해주세요.
          ======================================================== */}
      <div className="space-y-4 pt-4">
        {/* Banner Texts and Action Placed Cleanly Above Illustration */}
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
            작은 실천이 모여 <span className="text-amber-500">큰 사랑</span>이 됩니다.
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            오늘도 우리 아이와 함께 걷고, 건강한 내일을 모아 보세요.
          </p>
          <div className="pt-1">
            <button
              onClick={onStartWalk}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>지금, 모으개와 시작하기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean, Untouched, High-Res Panoramic Illustration (No overlay text/buttons, pristine transparent aesthetic) */}
        <div className="w-full max-w-4xl mx-auto flex justify-center px-2">
          <img
            src="/assets/brand/bottom_sunset_panoramic.png"
            alt="모으개 반려견과 산책하는 일러스트"
            className="w-full h-auto max-h-[320px] object-contain select-none pointer-events-none"
          />
        </div>
      </div>

      {/* ========================================================
          7. "모으개가 처음이신가요?" SERVICE INTRODUCTION MODAL
          ======================================================== */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl space-y-5 border border-stone-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-2xs overflow-hidden">
                  <img src="/assets/aistudio/mogege_brand_logo.png" alt="모으개 로고" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base font-bold text-stone-900">모으개(MOGEGAE) 서비스 소개</h3>
              </div>
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-stone-700">
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/50 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-amber-600" />
                  1. 걸음마다 쌓이는 산책 리워드
                </div>
                <p className="text-stone-600 leading-relaxed">
                  반려견과 매일 산책하며 미션을 달성하면 하루 최대 500P가 적립됩니다. 스마트 GPS 목걸이 연동 시 안전 위치 확인과 보너스 인증을 받을 수 있습니다.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/50 space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <img src="/assets/brand/point_coin.png" alt="포인트" className="w-4 h-4 object-contain" />
                  2. 우리 아이 평생 의료비 목표 저축
                </div>
                <p className="text-stone-600 leading-relaxed">
                  적립한 포인트를 정기 건강검진, 예방접종, 응급 수술비 등 원하는 목적별 목표에 차곡차곡 모아 안전하게 대비하세요.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/50 space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  3. 제휴 동물병원 EMR 전산 즉시 할인
                </div>
                <p className="text-stone-600 leading-relaxed">
                  전국 모으개 제휴 동물병원 및 브랜드 매장에서 바우처 코드를 제시하면 진료비와 용품을 현장에서 바로 할인받을 수 있습니다.
                </p>
              </div>

              <div className="p-3.5 bg-orange-50/70 rounded-2xl border border-orange-200/50 space-y-1">
                <div className="font-bold text-orange-900 flex items-center gap-1.5">
                  <CalendarCheck2 className="w-4 h-4 text-orange-600" />
                  4. 매일 출석체크 150P & 신규 회원 2,000P
                </div>
                <p className="text-stone-600 leading-relaxed">
                  매일 접속 시 독립적인 150P 출석체크 보너스가 지급되며, 신규 가입 시 2,000P 축하금이 즉시 지급됩니다.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-2xl cursor-pointer"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setIsGuideModalOpen(false);
                  onStartWalk();
                }}
                className="flex-2 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>지금 산책 시작하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
