"use client";

import { useState } from "react";
import { getDemoUser, setDemoUser } from "@/lib/store/auth";
import UiDialog from "./UiDialog";
import TargetGoalDialog from "./TargetGoalDialog";

export default function GoalDialog(props: {kind: "minutes" | "goal"; onClose: () => void}) {
  return props.kind === "goal" ? <TargetGoalDialog onClose={props.onClose}/> : <LegacyMinutesDialog {...props}/>;
}
function LegacyMinutesDialog({
  kind,
  onClose,
}: {
  kind: "minutes" | "goal";
  onClose: () => void;
}) {
  const user = getDemoUser();
  const [value, setValue] = useState(
    String(
      kind === "minutes"
        ? (user?.minutesPerDay ?? 45)
        : (user?.goal ?? "Hoàn thành B1"),
    ),
  );
  return (
    <UiDialog
      title={kind === "minutes" ? "Mục tiêu mỗi ngày" : "Mục tiêu học tập"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (user)
            setDemoUser({
              ...user,
              ...(kind === "minutes"
                ? { minutesPerDay: Number(value) }
                : { goal: value }),
            });
          onClose();
        }}
      >
        <fieldset className="ui-options">
          <legend>
            {kind === "minutes"
              ? "Bạn muốn học bao nhiêu phút mỗi ngày?"
              : "Bạn muốn đạt đến cấp nào?"}
          </legend>
          {(kind === "minutes"
            ? ["30", "45", "60", "180"]
            : [
                "Hoàn thành A1",
                "Hoàn thành A2",
                "Hoàn thành B1",
                "Hoàn thành B2",
                "Hoàn thành C1",
              ]
          ).map((option) => (
            <label
              key={option}
              className={value === option ? "is-selected" : ""}
            >
              <input
                type="radio"
                name="goal"
                value={option}
                checked={value === option}
                onChange={() => setValue(option)}
              />
              {option}
              {kind === "minutes" ? " phút" : ""}
            </label>
          ))}
        </fieldset>
        <button className="nbc-btn is-ink" type="submit">
          Lưu mục tiêu
        </button>
      </form>
    </UiDialog>
  );
}
