import { useLingui, Trans } from "@lingui/react/macro";

export function PostsTable({
  rows,
  selectedCount,
}: {
  rows: Array<{ id: string; name: string; status: string; created: string }>;
  selectedCount: number;
}) {
  const { t } = useLingui();

  const columns = [
    { key: "name", label: t`Name` },
    { key: "status", label: t`Status` },
    { key: "created", label: t`Created` },
  ];

  return (
    <section>
      <p>
        <Trans>{selectedCount} selected</Trans>
      </p>
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.status}</td>
              <td>{r.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
