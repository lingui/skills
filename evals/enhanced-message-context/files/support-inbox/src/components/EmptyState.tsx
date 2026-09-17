import { Trans, useLingui } from "@lingui/react/macro";

export function EmptyState({ onCompose }: { onCompose: () => void }) {
  const { t } = useLingui();

  return (
    <div className="empty-state">
      <img src="/illustrations/empty-inbox.svg" alt={t`Empty inbox`} />

      <p>
        <Trans>You're all caught up. New conversations will show up here as customers write in.</Trans>
      </p>

      <button className="primary" onClick={onCompose} aria-label={t`New`}>
        +
      </button>
    </div>
  );
}
