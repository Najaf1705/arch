interface Props {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-background/60 backdrop-blur-sm
      "
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-80 rounded-lg
          bg-c1
          border border-border
          shadow-xl
          p-6
        "
      >
        <h2 className="text-sm font-semibold text-foreground mb-2">
          {title}
        </h2>

        <p className="text-sm text-foreground/75 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            autoFocus
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
