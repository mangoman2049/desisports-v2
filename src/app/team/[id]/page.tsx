import { redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function TeamAliasPage({ params }: Props) {
  redirect(`/tournaments/1/teams/${params.id}`);
}
