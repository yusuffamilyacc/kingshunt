"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";

interface Player {
  no: number;
  name: string;
  fideId: string;
  fed: string;
  elo: number;
  ukd: number;
  club: string;
  detailUrl: string;
}

interface Match {
  round: number;
  opponent: string;
  opponentUKD: number;
  result: number; // 1 = kazanç, 0.5 = beraberlik, 0 = kayıp
  newUKD: number;
  color: "white" | "black";
}

// UKD hesaplama fonksiyonu (ELO benzeri sistem)
function calculateUKD(
  currentUKD: number,
  opponentUKD: number,
  result: number, // 1 = kazanç, 0.5 = beraberlik, 0 = kayıp
  kFactor: number = 32
): number {
  // Beklenen skor hesaplama
  const expectedScore = 1 / (1 + Math.pow(10, (opponentUKD - currentUKD) / 400));
  
  // Yeni UKD hesaplama
  const newUKD = currentUKD + kFactor * (result - expectedScore);
  
  return Math.round(newUKD);
}

export default function UKDHesaplamaPage() {
  const [tournamentUrl, setTournamentUrl] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerMatches, setPlayerMatches] = useState<Match[]>([]);
  const [finalUKD, setFinalUKD] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  // Manuel hesaplama için state'ler
  const [currentUKD, setCurrentUKD] = useState<string>("");
  const [opponentUKD, setOpponentUKD] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [newUKD, setNewUKD] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{
    opponentUKD: number;
    result: number;
    newUKD: number;
  }>>([]);
  const [activeTab, setActiveTab] = useState<"manual" | "tournament">("manual");

  // Turnuva verilerini çek
  const fetchTournamentData = async () => {
    if (!tournamentUrl) {
      setError("Lütfen turnuva URL'i girin");
      return;
    }

    setLoading(true);
    setError("");
    setPlayers([]);
    setSelectedPlayer(null);
    setPlayerMatches([]);
    setFinalUKD(null);

    try {
      const response = await fetch(`/api/chess-results?url=${encodeURIComponent(tournamentUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Turnuva verileri alınamadı");
        return;
      }

      setPlayers(data.players || []);
      if (data.players && data.players.length === 0) {
        setError("Turnuva verileri bulunamadı. URL'i kontrol edin.");
      }
    } catch (err) {
      setError("Veri çekilirken bir hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Oyuncu seçildiğinde maçlarını hesapla
  const calculatePlayerUKD = async (player: Player) => {
    setSelectedPlayer(player);
    setPlayerMatches([]);
    setFinalUKD(null);
    setLoading(true);
    setError("");

    if (!player.detailUrl) {
      setError("Sporcu detay linki bulunamadı");
      setLoading(false);
      return;
    }

    try {
      // Sporcu detay sayfasından maç sonuçlarını çek
      const response = await fetch(
        `/api/chess-results/player?url=${encodeURIComponent(player.detailUrl)}&name=${encodeURIComponent(player.name)}`
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Maç sonuçları alınamadı");
        setLoading(false);
        return;
      }

      const data = await response.json();
      const rawMatches = data.matches || [];

      if (rawMatches.length === 0) {
        setError("Bu sporcu için maç sonucu bulunamadı");
        setLoading(false);
        return;
      }

      // UKD hesaplaması yap
      const matches: Match[] = [];
      let currentUKD = player.ukd || 1500; // Başlangıç UKD'si

      // Maçları sıraya göre sırala
      const sortedMatches = rawMatches.sort((a: any, b: any) => a.round - b.round);

      for (const rawMatch of sortedMatches) {
        const opponentUKD = rawMatch.opponentUKD || 1500;
        const result = rawMatch.result; // 1, 0.5, veya 0
        const newUKD = calculateUKD(currentUKD, opponentUKD, result);

        matches.push({
          round: rawMatch.round,
          opponent: rawMatch.opponent,
          opponentUKD,
          result,
          newUKD,
          color: rawMatch.color || "white",
        });

        currentUKD = newUKD;
      }

      setPlayerMatches(matches);
      setFinalUKD(currentUKD);
    } catch (err) {
      console.error("Error calculating player UKD:", err);
      setError("Maç sonuçları hesaplanırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Manuel hesaplama
  const handleCalculate = () => {
    if (!currentUKD || !opponentUKD || result === null) {
      return;
    }

    const current = parseFloat(currentUKD);
    const opponent = parseFloat(opponentUKD);

    if (isNaN(current) || isNaN(opponent)) {
      return;
    }

    const calculated = calculateUKD(current, opponent, result);
    setNewUKD(calculated);
    
    setHistory(prev => [{
      opponentUKD: opponent,
      result,
      newUKD: calculated
    }, ...prev].slice(0, 10));
  };

  const handleReset = () => {
    setCurrentUKD("");
    setOpponentUKD("");
    setResult(null);
    setNewUKD(null);
  };

  const handleAddToHistory = () => {
    if (newUKD !== null) {
      setCurrentUKD(newUKD.toString());
      setOpponentUKD("");
      setResult(null);
      setNewUKD(null);
    }
  };

  const getResultLabel = (res: number) => {
    if (res === 1) return "Kazandı";
    if (res === 0.5) return "Berabere";
    return "Kaybetti";
  };

  const getResultColor = (res: number) => {
    if (res === 1) return "text-green-600";
    if (res === 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="text-[#0b0b0b]">
      <section className="relative overflow-hidden border-b border-[#0b0b0b]/5 bg-gradient-to-b from-white via-[#f4ecde] to-[#f7f4ec]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(201,162,77,0.12),transparent_32%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <SectionHeading
            align="center"
            eyebrow="UKD Hesaplama"
            title="Ulusal Kuvvet Derecesi Hesaplayıcı"
            subtitle="Chess-results.com'dan turnuva verilerini çekerek veya manuel olarak UKD hesaplayın."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-4 border-b border-[#0b0b0b]/10">
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "manual"
                ? "border-b-2 border-gold-500 text-gold-700"
                : "text-[#4a4a4a] hover:text-[#0b0b0b]"
            }`}
          >
            Manuel Hesaplama
          </button>
          <button
            onClick={() => setActiveTab("tournament")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "tournament"
                ? "border-b-2 border-gold-500 text-gold-700"
                : "text-[#4a4a4a] hover:text-[#0b0b0b]"
            }`}
          >
            Turnuva Hesaplama
          </button>
        </div>

        {activeTab === "manual" ? (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Manuel Hesaplama Formu */}
            <div className="rounded-3xl border border-[#0b0b0b]/6 bg-white p-6 md:p-8 shadow-xl shadow-black/10">
              <h3 className="text-xl font-semibold text-[#0b0b0b] mb-6">
                UKD Hesaplama
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0b0b0b]/80 mb-2">
                    Mevcut UKD'niz
                  </label>
                  <input
                    type="number"
                    value={currentUKD}
                    onChange={(e) => setCurrentUKD(e.target.value)}
                    placeholder="Örn: 1500"
                    className="w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] placeholder:text-[#4a4a4a]/60 focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0b0b0b]/80 mb-2">
                    Rakip UKD'si
                  </label>
                  <input
                    type="number"
                    value={opponentUKD}
                    onChange={(e) => setOpponentUKD(e.target.value)}
                    placeholder="Örn: 1600"
                    className="w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] placeholder:text-[#4a4a4a]/60 focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0b0b0b]/80 mb-2">
                    Sonuç
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setResult(1)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                        result === 1
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-[#0b0b0b]/10 bg-[#f7f4ec] text-[#0b0b0b] hover:border-green-400"
                      }`}
                    >
                      Kazandınız
                    </button>
                    <button
                      onClick={() => setResult(0.5)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                        result === 0.5
                          ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                          : "border-[#0b0b0b]/10 bg-[#f7f4ec] text-[#0b0b0b] hover:border-yellow-400"
                      }`}
                    >
                      Berabere
                    </button>
                    <button
                      onClick={() => setResult(0)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                        result === 0
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-[#0b0b0b]/10 bg-[#f7f4ec] text-[#0b0b0b] hover:border-red-400"
                      }`}
                    >
                      Kaybettiniz
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCalculate}
                    disabled={!currentUKD || !opponentUKD || result === null}
                    className="flex-1 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-gold-500/30 transition hover:-translate-y-0.5 hover:shadow-gold-400/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    Hesapla
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-full border border-[#0b0b0b]/10 bg-white px-5 py-3 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#f7f4ec]"
                  >
                    Temizle
                  </button>
                </div>
              </div>

              {/* Sonuç */}
              {newUKD !== null && (
                <div className="mt-6 rounded-2xl border border-gold-400/50 bg-gold-500/15 p-6">
                  <p className="text-sm font-medium text-gold-700 mb-2">
                    Yeni UKD'niz
                  </p>
                  <p className="text-3xl font-bold text-gold-800">
                    {newUKD}
                  </p>
                  {currentUKD && (
                    <p className="mt-2 text-sm text-gold-600">
                      {newUKD > parseFloat(currentUKD) ? (
                        <span className="text-green-600">
                          ↑ +{newUKD - parseFloat(currentUKD)} puan
                        </span>
                      ) : newUKD < parseFloat(currentUKD) ? (
                        <span className="text-red-600">
                          ↓ {newUKD - parseFloat(currentUKD)} puan
                        </span>
                      ) : (
                        <span>Değişmedi</span>
                      )}
                    </p>
                  )}
                  <button
                    onClick={handleAddToHistory}
                    className="mt-4 w-full rounded-full border border-gold-400/50 bg-white px-4 py-2 text-sm font-semibold text-gold-800 transition hover:bg-gold-50"
                  >
                    Yeni UKD'yi Kullan
                  </button>
                </div>
              )}
            </div>

            {/* Bilgi ve Geçmiş */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#0b0b0b]/6 bg-white p-6 shadow-lg shadow-black/5">
                <h4 className="text-base font-semibold text-[#0b0b0b] mb-3">
                  UKD Nedir?
                </h4>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">
                  UKD (Ulusal Kuvvet Derecesi), Türkiye Satranç Federasyonu tarafından 
                  kullanılan bir rating sistemidir. ELO sistemine benzer şekilde çalışır 
                  ve oyuncuların gücünü sayısal olarak ifade eder.
                </p>
                <div className="mt-4 space-y-2 text-xs text-[#4a4a4a]">
                  <p><span className="font-semibold text-[#0b0b0b]">• K-Faktörü:</span> 32 (standart)</p>
                  <p><span className="font-semibold text-[#0b0b0b]">• Beklenen Skor:</span> Rakip UKD'sine göre hesaplanır</p>
                  <p><span className="font-semibold text-[#0b0b0b]">• Yeni UKD:</span> Mevcut UKD + K × (Sonuç - Beklenen Skor)</p>
                </div>
              </div>

              {history.length > 0 && (
                <div className="rounded-2xl border border-[#0b0b0b]/6 bg-white p-6 shadow-lg shadow-black/5">
                  <h4 className="text-base font-semibold text-[#0b0b0b] mb-4">
                    Son Hesaplamalar
                  </h4>
                  <div className="space-y-2">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl border border-[#0b0b0b]/5 bg-[#f7f4ec] px-4 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold ${getResultColor(item.result)}`}>
                            {getResultLabel(item.result)}
                          </span>
                          <span className="text-xs text-[#4a4a4a]">
                            vs {item.opponentUKD}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gold-700">
                          {item.newUKD}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Turnuva URL Girişi */}
            <div className="rounded-3xl border border-[#0b0b0b]/6 bg-white p-6 md:p-8 shadow-xl shadow-black/10">
              <h3 className="text-xl font-semibold text-[#0b0b0b] mb-4">
                Turnuva Verilerini Çek
              </h3>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={tournamentUrl}
                  onChange={(e) => setTournamentUrl(e.target.value)}
                  placeholder="https://s2.chess-results.com/tnr1323346.aspx?lan=8&art=0&SNode=S0"
                  className="flex-1 rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] placeholder:text-[#4a4a4a]/60 focus:border-gold-400 focus:outline-none"
                />
                <button
                  onClick={fetchTournamentData}
                  disabled={loading || !tournamentUrl}
                  className="rounded-full bg-gradient-to-r from-gold-400 to-amber-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-gold-500/30 transition hover:-translate-y-0.5 hover:shadow-gold-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Yükleniyor..." : "Çek"}
                </button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Sporcu Listesi */}
            {players.length > 0 && (
              <div className="rounded-3xl border border-[#0b0b0b]/6 bg-white p-6 md:p-8 shadow-xl shadow-black/10">
                <h3 className="text-xl font-semibold text-[#0b0b0b] mb-4">
                  Sporcular ({players.length})
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {players.map((player) => (
                      <button
                        key={player.no}
                        onClick={() => calculatePlayerUKD(player)}
                        disabled={loading || !player.detailUrl}
                        className={`w-full rounded-xl border-2 px-4 py-3 text-left transition ${
                          selectedPlayer?.no === player.no
                            ? "border-gold-500 bg-gold-50"
                            : "border-[#0b0b0b]/10 bg-[#f7f4ec] hover:border-gold-400"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#0b0b0b]">
                              {player.no}. {player.name}
                            </p>
                            <p className="text-xs text-[#4a4a4a]">
                              UKD: {player.ukd || "Yok"} | ELO: {player.elo || "Yok"}
                              {player.detailUrl ? "" : " (Detay yok)"}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Seçilen Oyuncunun Maçları ve UKD Hesaplaması */}
            {selectedPlayer && (
              <div className="rounded-3xl border border-[#0b0b0b]/6 bg-white p-6 md:p-8 shadow-xl shadow-black/10">
                <h3 className="text-xl font-semibold text-[#0b0b0b] mb-4">
                  {selectedPlayer.name} - Maç Sonuçları
                </h3>
                
                {loading && (
                  <div className="text-center py-8">
                    <p className="text-[#4a4a4a]">Maç sonuçları yükleniyor...</p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 rounded-xl border border-red-400/50 bg-red-500/15 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {!loading && !error && playerMatches.length > 0 && (
                  <>
                    <div className="mb-4 rounded-xl border border-gold-400/50 bg-gold-500/15 p-4">
                      <p className="text-sm font-medium text-gold-700 mb-1">
                        Başlangıç UKD: {selectedPlayer.ukd || 1500}
                      </p>
                      <p className="text-2xl font-bold text-gold-800">
                        Final UKD: {finalUKD}
                      </p>
                      <p className="mt-2 text-sm text-gold-600">
                        {finalUKD && selectedPlayer.ukd && (
                          finalUKD > selectedPlayer.ukd ? (
                            <span className="text-green-600">
                              ↑ +{finalUKD - selectedPlayer.ukd} puan
                            </span>
                          ) : (
                            <span className="text-red-600">
                              ↓ {finalUKD - selectedPlayer.ukd} puan
                            </span>
                          )
                        )}
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="space-y-2">
                        {playerMatches.map((match, index) => (
                          <div
                            key={index}
                            className="rounded-xl border border-[#0b0b0b]/5 bg-[#f7f4ec] px-4 py-3"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-[#0b0b0b]">
                                  Tur {match.round}: vs {match.opponent}
                                </p>
                                <p className="text-xs text-[#4a4a4a]">
                                  Rakip UKD: {match.opponentUKD} | Renk: {match.color === "white" ? "Beyaz" : "Siyah"}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className={`text-sm font-semibold ${getResultColor(match.result)}`}>
                                  {getResultLabel(match.result)}
                                </span>
                                <p className="text-xs text-[#4a4a4a]">
                                  UKD: {match.newUKD}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!loading && !error && playerMatches.length === 0 && selectedPlayer && (
                  <div className="text-center py-8">
                    <p className="text-[#4a4a4a]">Henüz maç sonucu yok</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
