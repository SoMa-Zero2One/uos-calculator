import React, { useState } from "react";

import { convertToeicToIbt, convertIeltsToIbt } from "./utils/conversion";

type UserInput = {
  id: number;
  gpa: string;
  ibt: string;
  itp: string;
  ielts: string;
};

type CalculationResult = {
  id: number;
  gpa: number;
  ibt: number;
  itp: number | null;
  ielts: number | null;
  bonus: number;
  finalScore: number;
};

const App: React.FC = () => {
  const [users, setUsers] = useState<UserInput[]>([
    { id: Date.now(), gpa: "", ibt: "", itp: "", ielts: "" },
  ]);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const addUser = () => {
    setUsers([
      ...users,
      { id: Date.now(), gpa: "", ibt: "", itp: "", ielts: "" },
    ]);
  };

  const handleChange = (
    id: number,
    field: keyof Omit<UserInput, "id">,
    value: string
  ) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  const calculateFinalScore = (gpa: number, ibt: number): number => {
    // UOS 교환학생 점수 계산 공식
    // 학점 4.0, IBT 90 -> 86.512점으로 계산
    const gpaScore = (gpa / 4.0) * 40; // 학점 만점 40점
    const ibtScore = (ibt / 120) * 45; // IBT 만점 45점
    const documentScore = 1.512; // 서류점수 (예시)

    return gpaScore + ibtScore + documentScore;
  };

  const handleCalculate = () => {
    const calculationResults = users.map((u) => {
      const gpaNum = parseFloat(u.gpa) || 0;
      let ibtNum = parseFloat(u.ibt) || 0;
      const itpNum = u.itp ? parseFloat(u.itp) : null;
      const ieltsNum = u.ielts ? parseFloat(u.ielts) : null;

      // IBT 점수가 없으면 다른 점수로 변환
      if (!ibtNum && u.itp) {
        ibtNum = convertToeicToIbt(parseFloat(u.itp));
      }
      if (!ibtNum && u.ielts) {
        ibtNum = convertIeltsToIbt(parseFloat(u.ielts));
      }

      const bonus = 0; // 가산점 로직 추가 가능
      const finalScore = calculateFinalScore(gpaNum, ibtNum);

      return {
        id: u.id,
        gpa: gpaNum,
        ibt: ibtNum,
        itp: itpNum,
        ielts: ieltsNum,
        bonus,
        finalScore,
      };
    });

    setResults(calculationResults);
    setShowResults(true);
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setResults([]);
  };

  if (showResults) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">계산 결과</h1>
        <div className="border-b-4 border-black w-32 mx-auto mb-8"></div>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black">
            <thead>
              <tr className="bg-black text-white">
                <th className="border border-black px-4 py-3">사용자</th>
                <th className="border border-black px-4 py-3">학점</th>
                <th className="border border-black px-4 py-3">IBT</th>
                <th className="border border-black px-4 py-3">ITP</th>
                <th className="border border-black px-4 py-3">IELTS</th>
                <th className="border border-black px-4 py-3">가산점</th>
                <th className="border border-black px-4 py-3">최종 점수</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.id} className="bg-white">
                  <td className="border border-black px-4 py-3 text-center">
                    사용자 {index + 1}
                  </td>
                  <td className="border border-black px-4 py-3 text-center">
                    {result.gpa.toFixed(1)}
                  </td>
                  <td className="border border-black px-4 py-3 text-center">
                    {result.ibt > 0 ? result.ibt.toFixed(1) : "N/A"}
                  </td>
                  <td className="border border-black px-4 py-3 text-center">
                    {result.itp ? result.itp.toString() : "N/A"}
                  </td>
                  <td className="border border-black px-4 py-3 text-center">
                    {result.ielts ? result.ielts.toString() : "N/A"}
                  </td>
                  <td className="border border-black px-4 py-3 text-center">
                    {result.bonus}
                  </td>
                  <td className="border border-black px-4 py-3 text-center">
                    {result.finalScore.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleRecalculate}
            className="bg-black text-white px-8 py-3 rounded-lg"
          >
            다시 계산하기
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-700">
          <p className="font-semibold mb-4">안내 사항:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              1학년 기기 바탕을 누르면 게산된 값을 그대로 유지할 수 있습니다.
            </li>
            <li>
              위 게산은 공식적인 총액의 원습니다. 본교의 정식 절차의 무관하며,
              경희대 학생의 실습용으로 만든 출력이지않습니다. 신을 방법을 이한
              찬짬하여 <strong>단순 참고 목적</strong>으로 만들었습니다.
            </li>
            <li>
              위 게산에서 <strong>서류점수</strong>는 <strong>10점 만점</strong>
              으로 게산합니다.
            </li>
            <li>
              위 게산의 점수 확산은 본교의 '평수 확산표'를 토대로 게산합니다.
            </li>
            <li>교환학생 최소 요구 점수 미측정 시 점수는 산출되지 않습니다.</li>
            <li>
              <strong>가산점 항목:</strong>
            </li>
            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
              <li>봉사활동 100시간 이상인 경우 +1</li>
              <li>
                Global Collaborative Summer Program(GC) 수강자 과목당 +1점 (최대
                +2점)
              </li>
              <li>Global Ambassador 활동 수료자 +1점 (최대 +1점)</li>
            </ul>
            <li>
              등점시 발생 시 1) 학점, 2) 공인어학성적, 3) 서류점수 순으로
              우선순위가 결정됩니다.
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        UOS 교환학생 점수 계산기
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((u, idx) => (
          <div
            key={u.id}
            className="border-2 border-black rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">사용자 {idx + 1}</h2>

            <input
              type="number"
              step="0.01"
              placeholder="학점 (ex: 4.0)"
              value={u.gpa}
              onChange={(e) => handleChange(u.id, "gpa", e.target.value)}
              className="w-full mb-3 border border-gray-400 rounded px-3 py-2"
            />
            <input
              type="number"
              step="1"
              placeholder="IBT 점수 (선택)"
              value={u.ibt}
              onChange={(e) => handleChange(u.id, "ibt", e.target.value)}
              className="w-full mb-3 border border-gray-400 rounded px-3 py-2"
            />
            <input
              type="number"
              step="1"
              placeholder="ITP 점수 (선택)"
              value={u.itp}
              onChange={(e) => handleChange(u.id, "itp", e.target.value)}
              className="w-full mb-3 border border-gray-400 rounded px-3 py-2"
            />
            <input
              type="number"
              step="0.1"
              placeholder="IELTS 점수 (선택)"
              value={u.ielts}
              onChange={(e) => handleChange(u.id, "ielts", e.target.value)}
              className="w-full mb-3 border border-gray-400 rounded px-3 py-2"
            />
          </div>
        ))}

        {/* 사용자 추가 카드 */}
        <div
          onClick={addUser}
          className="border-2 border-dashed border-black rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100"
        >
          <span className="text-5xl font-bold">+</span>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleCalculate}
          className="bg-black text-white px-8 py-3 rounded-lg"
        >
          계산하기
        </button>
      </div>
    </div>
  );
};

export default App;
