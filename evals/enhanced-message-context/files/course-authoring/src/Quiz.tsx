import { Trans } from "@lingui/react/macro";

export function Quiz({
  isCorrect,
  onSave,
}: {
  isCorrect: boolean;
  onSave: () => void;
}) {
  return (
    <div className="quiz-result">
      <p className={isCorrect ? "correct" : "incorrect"}>
        {isCorrect ? <Trans>right</Trans> : <Trans>wrong</Trans>}
      </p>
      <button className="primary" onClick={onSave}>
        <Trans>Save</Trans>
      </button>
    </div>
  );
}
