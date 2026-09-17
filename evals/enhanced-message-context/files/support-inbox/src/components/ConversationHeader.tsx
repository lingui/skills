import { Trans, useLingui } from "@lingui/react/macro";

export function ConversationHeader({
  subject,
  isResolved,
  onAssign,
  onSnooze,
  onClose,
}: {
  subject: string;
  isResolved: boolean;
  onAssign: () => void;
  onSnooze: () => void;
  onClose: () => void;
}) {
  const { t } = useLingui();

  // lingui-set comment="Action buttons in the header of a conversation"
  const actions = [
    { key: "assign", label: t`Assign`, onClick: onAssign },
    { key: "snooze", label: t`Snooze`, onClick: onSnooze },
    { key: "close", label: t`Close`, onClick: onClose },
  ];

  return (
    <header className="conversation-header">
      <h2>{subject}</h2>

      <p className="status">{isResolved ? <Trans>Resolved</Trans> : <Trans>Open</Trans>}</p>

      <nav>
        {actions.map((a) => (
          <button key={a.key} onClick={a.onClick}>
            {a.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
