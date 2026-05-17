import Spinner from "../../components/ui/Spinner";
import ModalShell from "../../components/ui/ModalShell";

export default function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmTone = "danger",
  onConfirm,
  onClose,
  isProcessing = false,
}) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={isProcessing ? () => {} : onClose}
      title={title}
      description={description}
      widthClassName="max-w-lg"
      footer={(
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="ds-btn border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`ds-btn text-white ${
              confirmTone === "danger"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-primary hover:bg-[#0d2345]"
            }`}
          >
            {isProcessing ? (
              <>
                <Spinner size="sm" label="" className="gap-2 text-white" />
                <span>Processing...</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      )}
    >
      <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-slate-50 px-4 py-4 text-sm text-slate-600">
        {description}
      </div>
    </ModalShell>
  );
}
