export type MsgT = { ok: boolean; t: string } | null;
export default function Msg({ m }: { m: MsgT }) {
  if (!m) return null;
  return <p role="status" className={`mb-4 rounded-lg px-4 py-3 text-sm ${m.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{m.t}</p>;
}
