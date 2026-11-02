"use client";

import { useState, type ReactNode } from "react";
import UiDialog from "./UiDialog";

export default function ContentNotice({
  children,
  className = "nbc-btn",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && (
        <UiDialog
          title="Nội dung chưa được bổ sung"
          onClose={() => setOpen(false)}
        >
          <p>Bạn có thể tiếp tục khám phá các mục khác.</p>
          <button className="nbc-btn is-ink" onClick={() => setOpen(false)}>
            Đã hiểu
          </button>
        </UiDialog>
      )}
    </>
  );
}
