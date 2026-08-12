import { Trans } from "@lingui/react/macro";

export function Editor({
  onAlign,
  onSave,
}: {
  onAlign: (dir: "left" | "center" | "right") => void;
  onSave: () => void;
}) {
  return (
    <div className="editor">
      <div className="align-controls" role="group">
        <button onClick={() => onAlign("left")}>
          <Trans>left</Trans>
        </button>
        <button onClick={() => onAlign("center")}>
          <Trans>center</Trans>
        </button>
        <button onClick={() => onAlign("right")}>
          <Trans>right</Trans>
        </button>
      </div>
      <button className="primary" onClick={onSave}>
        <Trans>Save</Trans>
      </button>
    </div>
  );
}
