import { Trans, useLingui } from "@lingui/react/macro";

export function App() {
  const { t } = useLingui();

  return (
    <main>
      <h1>
        <Trans>Welcome to the store</Trans>
      </h1>
      <input type="search" placeholder={t`Search products`} />
      <p>
        <Trans>All prices include tax.</Trans>
      </p>
    </main>
  );
}
