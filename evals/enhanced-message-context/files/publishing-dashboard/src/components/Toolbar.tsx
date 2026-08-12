import { Trans, useLingui } from "@lingui/react/macro";

export function Toolbar({
  onBack,
  onPublish,
  onArchive,
}: {
  onBack: () => void;
  onPublish: () => void;
  onArchive: () => void;
}) {
  const { t } = useLingui();

  return (
    <header className="toolbar">
      <button onClick={onBack}>
        <Trans>Back</Trans>
      </button>
      <button onClick={onPublish} className="primary">
        <Trans>Post</Trans>
      </button>
      <button onClick={onArchive} title={t`Archive`} aria-label={t`Archive`}>
        🗄
      </button>
    </header>
  );
}
