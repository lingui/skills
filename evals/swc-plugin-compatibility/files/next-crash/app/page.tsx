import { Trans } from "@lingui/react/macro";

export default function Home() {
  return (
    <main>
      <h1>
        <Trans>Order tracking</Trans>
      </h1>
      <p>
        <Trans>Enter your order number to see its status.</Trans>
      </p>
    </main>
  );
}
