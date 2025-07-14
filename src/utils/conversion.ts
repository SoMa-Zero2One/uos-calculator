/**
 * TOEIC 점수를 TOEFL IBT 점수로 변환 (비례 변환)
 * @param toeicScore TOEIC 점수 (0-990)
 * @returns TOEFL IBT 점수 (0-120)
 */
export function convertToeicToIbt(toeicScore: number): number {
  if (toeicScore < 0 || toeicScore > 990) {
    throw new Error("TOEIC 점수는 0-990 범위여야 합니다.");
  }

  // 비례 변환: TOEIC 990점 = TOEFL 120점
  return Math.round((toeicScore / 990) * 120);
}

/**
 * IELTS 점수를 TOEFL IBT 점수로 변환 (비례 변환)
 * @param ieltsScore IELTS 점수 (0-9.0)
 * @returns TOEFL IBT 점수 (0-120)
 */
export function convertIeltsToIbt(ieltsScore: number): number {
  if (ieltsScore < 0 || ieltsScore > 9.0) {
    throw new Error("IELTS 점수는 0-9.0 범위여야 합니다.");
  }

  // 비례 변환: IELTS 9.0점 = TOEFL 120점
  return Math.round((ieltsScore / 9.0) * 120);
}
