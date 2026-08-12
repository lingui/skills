import { Trans, useLingui } from "@lingui/react/macro";

export function App() {
  const { t } = useLingui();

  return (
    <main>
      <h1>
        <Trans>Team dashboard</Trans>
      </h1>
      <input type="search" placeholder={t`Search projects`} />
      <p>
        <Trans>Everything is up to date.</Trans>
      </p>
    </main>
  );
}
