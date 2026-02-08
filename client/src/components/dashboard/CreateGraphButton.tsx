import { useState } from "react";
import CreateGraphModal from "./CreateGraphModal";

const CreateGraphButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-md bg-primary text-foreground"
      >
        + New Graph
      </button>

      {open && <CreateGraphModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default CreateGraphButton;
