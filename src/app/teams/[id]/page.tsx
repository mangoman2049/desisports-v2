import { redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function TeamsAliasPage({ params }: Props) {
  redirect(`/tournaments/1/teams/${params.id}`);
}
