// TOEIC, IELTS, TOEFL 점수 변환 테이블 (UOS 교환학생 기준)
// 참고: 공식 변환표를 기반으로 구현

interface ScoreRange {
  min: number;
  max: number;
  toefl: number;
}

interface IeltsToToeflMap {
  ielts: number;
  toefl: number;
}

// TOEIC -> TOEFL 변환 테이블
const TOEIC_TO_TOEFL: ScoreRange[] = [
  { min: 981, max: 990, toefl: 118 }, // 117-120 범위의 중간값
  { min: 966, max: 980, toefl: 115 }, // 114-116 범위의 중간값
  { min: 951, max: 965, toefl: 112 }, // 112-113 범위의 중간값
  { min: 936, max: 950, toefl: 110 }, // 110-111 범위의 중간값
  { min: 921, max: 935, toefl: 108 }, // 107-109 범위의 중간값
  { min: 906, max: 920, toefl: 105 }, // 105-106 범위의 중간값
  { min: 891, max: 905, toefl: 103 }, // 103-104 범위의 중간값
  { min: 876, max: 890, toefl: 101 }, // 101-102 범위의 중간값
  { min: 861, max: 875, toefl: 99 }, // 99-100 범위의 중간값
  { min: 846, max: 860, toefl: 97 }, // 97-98 범위의 중간값
  { min: 831, max: 845, toefl: 95 }, // 95-96 범위의 중간값
  { min: 816, max: 830, toefl: 93 }, // 93-94 범위의 중간값
  { min: 801, max: 815, toefl: 91 }, // 91-92 범위의 중간값
  { min: 786, max: 800, toefl: 89 }, // 89-90 범위의 중간값
  { min: 771, max: 785, toefl: 87 }, // 87-88 범위의 중간값
  { min: 756, max: 770, toefl: 85 }, // 85-86 범위의 중간값
  { min: 741, max: 755, toefl: 83 }, // 83-84 범위의 중간값
  { min: 726, max: 740, toefl: 81 }, // 81-82 범위의 중간값
  { min: 711, max: 725, toefl: 80 }, // 80
  { min: 696, max: 710, toefl: 79 }, // 79
  { min: 681, max: 695, toefl: 78 }, // 78
  { min: 666, max: 680, toefl: 76 }, // 76-77 범위의 중간값
  { min: 651, max: 665, toefl: 74 }, // 74-75 범위의 중간값
  { min: 636, max: 650, toefl: 73 }, // 73
  { min: 621, max: 635, toefl: 71 }, // 71-72 범위의 중간값
  { min: 606, max: 620, toefl: 69 }, // 69-70 범위의 중간값
  { min: 591, max: 605, toefl: 67 }, // 67-68 범위의 중간값
  { min: 576, max: 590, toefl: 66 }, // 66
  { min: 561, max: 575, toefl: 64 }, // 64-65 범위의 중간값
  { min: 546, max: 560, toefl: 63 }, // 63
  { min: 531, max: 545, toefl: 61 }, // 61-62 범위의 중간값
  { min: 516, max: 530, toefl: 59 }, // 59-60 범위의 중간값
  { min: 501, max: 515, toefl: 57 }, // 57-58 범위의 중간값
  { min: 486, max: 500, toefl: 55 }, // 54-56 범위의 중간값
  { min: 471, max: 485, toefl: 52 }, // 51-53 범위의 중간값
  { min: 456, max: 470, toefl: 49 }, // 49-50 범위의 중간값
  { min: 441, max: 455, toefl: 47 }, // 46-48 범위의 중간값
  { min: 426, max: 440, toefl: 44 }, // 44-45 범위의 중간값
  { min: 411, max: 425, toefl: 42 }, // 42-43 범위의 중간값
  { min: 0, max: 410, toefl: 40 }, // 41이하
];

// IELTS -> TOEFL 변환 테이블
const IELTS_TO_TOEFL: IeltsToToeflMap[] = [
  { ielts: 9.0, toefl: 118 }, // 117-120 범위의 중간값
  { ielts: 8.5, toefl: 112 }, // 112-113 범위의 중간값
  { ielts: 8.0, toefl: 101 }, // 101-102 범위의 중간값
  { ielts: 7.5, toefl: 101 }, // 101-102 범위의 중간값
  { ielts: 7.0, toefl: 85 }, // 85-86 범위의 중간값
  { ielts: 6.5, toefl: 85 }, // 85-86 범위의 중간값
  { ielts: 6.0, toefl: 71 }, // 71-72 범위의 중간값
  { ielts: 5.5, toefl: 71 }, // 71-72 범위의 중간값
  { ielts: 5.0, toefl: 57 }, // 57-58 범위의 중간값
  { ielts: 4.5, toefl: 57 }, // 57-58 범위의 중간값
  { ielts: 4.0, toefl: 44 }, // 44-45 범위의 중간값
];

/**
 * ITP 점수를 TOEFL IBT 점수로 변환
 * @param itpScore ITP 점수 (0-677, TOEIC 점수 체계와 동일)
 * @returns TOEFL IBT 점수 (0-120)
 */
export function convertItpToIbt(itpScore: number): number {
  if (itpScore < 0 || itpScore > 677) {
    throw new Error("ITP 점수는 0-677 범위여야 합니다.");
  }

  // ITP 점수를 TOEIC 점수 체계로 변환 (비례 환산)
  const toeicEquivalent = (itpScore / 677) * 990;

  // 점수 범위에 맞는 TOEFL 점수 찾기
  for (const range of TOEIC_TO_TOEFL) {
    if (toeicEquivalent >= range.min && toeicEquivalent <= range.max) {
      return range.toefl;
    }
  }

  // 매칭되는 범위가 없으면 최소값 반환
  return 40;
}

/**
 * TOEIC 점수를 TOEFL IBT 점수로 변환
 * @param toeicScore TOEIC 점수 (0-990)
 * @returns TOEFL IBT 점수 (0-120)
 */
export function convertToeicToIbt(toeicScore: number): number {
  if (toeicScore < 0 || toeicScore > 990) {
    throw new Error("TOEIC 점수는 0-990 범위여야 합니다.");
  }

  // 점수 범위에 맞는 TOEFL 점수 찾기
  for (const range of TOEIC_TO_TOEFL) {
    if (toeicScore >= range.min && toeicScore <= range.max) {
      return range.toefl;
    }
  }

  // 매칭되는 범위가 없으면 최소값 반환
  return 40;
}

/**
 * IELTS 점수를 TOEFL IBT 점수로 변환
 * @param ieltsScore IELTS 점수 (0-9.0)
 * @returns TOEFL IBT 점수 (0-120)
 */
export function convertIeltsToIbt(ieltsScore: number): number {
  if (ieltsScore < 0 || ieltsScore > 9.0) {
    throw new Error("IELTS 점수는 0-9.0 범위여야 합니다.");
  }

  // 정확한 점수 매칭 찾기
  for (const mapping of IELTS_TO_TOEFL) {
    if (Math.abs(ieltsScore - mapping.ielts) < 0.1) {
      return mapping.toefl;
    }
  }

  // 범위 내 점수 보간법 적용
  for (let i = 0; i < IELTS_TO_TOEFL.length - 1; i++) {
    const current = IELTS_TO_TOEFL[i];
    const next = IELTS_TO_TOEFL[i + 1];

    if (ieltsScore <= current.ielts && ieltsScore >= next.ielts) {
      // 선형 보간법 적용
      const ratio = (current.ielts - ieltsScore) / (current.ielts - next.ielts);
      return Math.round(current.toefl + ratio * (next.toefl - current.toefl));
    }
  }

  // 매칭되는 범위가 없으면 최소값 반환
  return 40;
}

/**
 * TOEFL IBT 점수를 TOEIC 점수로 변환 (역변환)
 * @param toeflScore TOEFL IBT 점수 (0-120)
 * @returns TOEIC 점수 (0-990)
 */
export function convertIbtToToeic(toeflScore: number): number {
  if (toeflScore < 0 || toeflScore > 120) {
    throw new Error("TOEFL IBT 점수는 0-120 범위여야 합니다.");
  }

  // TOEFL 점수에 맞는 TOEIC 범위 찾기
  for (const range of TOEIC_TO_TOEFL) {
    if (toeflScore >= range.toefl - 1 && toeflScore <= range.toefl + 1) {
      // 범위의 중간값 반환
      return Math.round((range.min + range.max) / 2);
    }
  }

  // 매칭되는 범위가 없으면 최소값 반환
  return 410;
}

/**
 * TOEFL IBT 점수를 IELTS 점수로 변환 (역변환)
 * @param toeflScore TOEFL IBT 점수 (0-120)
 * @returns IELTS 점수 (0-9.0)
 */
export function convertIbtToIelts(toeflScore: number): number {
  if (toeflScore < 0 || toeflScore > 120) {
    throw new Error("TOEFL IBT 점수는 0-120 범위여야 합니다.");
  }

  // TOEFL 점수에 맞는 IELTS 점수 찾기
  for (const mapping of IELTS_TO_TOEFL) {
    if (toeflScore >= mapping.toefl - 2 && toeflScore <= mapping.toefl + 2) {
      return mapping.ielts;
    }
  }

  // 매칭되는 범위가 없으면 최소값 반환
  return 4.0;
}

/**
 * 점수 유효성 검사
 * @param score 점수
 * @param type 점수 타입 ('toeic' | 'ielts' | 'toefl')
 * @returns 유효한 점수인지 여부
 */
export function isValidScore(
  score: number,
  type: "toeic" | "ielts" | "toefl"
): boolean {
  switch (type) {
    case "toeic":
      return score >= 0 && score <= 990;
    case "ielts":
      return score >= 0 && score <= 9.0;
    case "toefl":
      return score >= 0 && score <= 120;
    default:
      return false;
  }
}

/**
 * 점수 범위 정보 반환
 * @param type 점수 타입
 * @returns 점수 범위 정보
 */
export function getScoreRange(type: "toeic" | "ielts" | "toefl"): {
  min: number;
  max: number;
  name: string;
} {
  switch (type) {
    case "toeic":
      return { min: 0, max: 990, name: "TOEIC" };
    case "ielts":
      return { min: 0, max: 9.0, name: "IELTS" };
    case "toefl":
      return { min: 0, max: 120, name: "TOEFL IBT" };
    default:
      throw new Error("지원하지 않는 점수 타입입니다.");
  }
}
