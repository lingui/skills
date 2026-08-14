import { Trans, useLingui } from "@lingui/react/macro";
import { products } from "./data/products";
import { notify } from "./lib/notify";

export default function App() {
  const { t } = useLingui();

  return (
    <main>
      <h1>
        <Trans>Storefront</Trans>
      </h1>
      <input placeholder={t`Search products…`} aria-label={t`Search products`} />
      <ul>
        {products.map((p) => (
          <li key={p.sku} className="product-row" data-testid="product-item">
            <img src={p.image} alt={p.name} />
            <h2>{p.name}</h2>
            {p.badge && <span className="product-badge">{p.badge}</span>}
            <p>{p.tagline}</p>
            <p>{p.description}</p>
            <button onClick={() => notify("added")}>
              <Trans>Add to cart</Trans>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
