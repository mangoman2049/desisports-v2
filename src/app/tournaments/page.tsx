import tournamentData from "../../../prisma/tournament_1_data.json";
import TournamentView from "./TournamentView";

export const metadata = {
  title: "Tournaments — Desi Boys Tournament May 2026 | DesiSports V2",
  description: "Official Spawtz 16-Over Indoor Cricket standings, squads, statistics, and scorecards.",
};

export default function TournamentsPage() {
  return (
    <div className="py-2">
      <TournamentView data={tournamentData as any} />
    </div>
  );
}
