/**
 * icons.tsx — bộ icon SVG stroke (đường lucide như markup nguồn, stroke=currentColor).
 * Dùng chung cho AppShell (sidebar) + dashboard /tong-quan.
 * Các path keyboard/layers/book-open/languages/play/book/map lấy nguyên từ
 * src/components/sites/aioenglish/gate/FeatureGate.tsx (đã đối chiếu markup gốc).
 */
import type { ReactElement, SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Ico({ size = 18, children, ...rest }: IconProps & { children: ReactElement | ReactElement[] }): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconHome(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </Ico>
  );
}

export function IconKeyboard(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M10 8h.01" />
      <path d="M12 12h.01" />
      <path d="M14 8h.01" />
      <path d="M16 12h.01" />
      <path d="M18 10h.01" />
      <path d="M18 14h.01" />
      <path d="M6 8h.01" />
      <path d="M6 12h.01" />
      <path d="M7 16h10" />
      <path d="M8 14h.01" />
      <rect width="20" height="16" x="2" y="4" rx="2" />
    </Ico>
  );
}

export function IconLayers(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </Ico>
  );
}

export function IconBookOpen(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Ico>
  );
}

export function IconLanguages(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </Ico>
  );
}

export function IconPlay(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </Ico>
  );
}

export function IconBook(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </Ico>
  );
}

export function IconMap(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </Ico>
  );
}

export function IconGraduationCap(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </Ico>
  );
}

export function IconUsers(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Ico>
  );
}

export function IconMessagePlus(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M12 8v6" />
      <path d="M9 11h6" />
    </Ico>
  );
}

export function IconSliders(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <line x1="21" x2="14" y1="4" y2="4" />
      <line x1="10" x2="3" y1="4" y2="4" />
      <line x1="21" x2="12" y1="12" y2="12" />
      <line x1="8" x2="3" y1="12" y2="12" />
      <line x1="21" x2="16" y1="20" y2="20" />
      <line x1="12" x2="3" y1="20" y2="20" />
      <line x1="14" x2="14" y1="2" y2="6" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="16" x2="16" y1="18" y2="22" />
    </Ico>
  );
}

/** Ngọn lửa 2 lớp cho widget điểm danh (fill, không stroke). */
export function FlameFill(props: IconProps): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 19}
      height={props.size ? props.size * 1.26 : 24}
      viewBox="0 0 19 24"
      aria-hidden="true"
      focusable="false"
      className={`hck-fl${props.className ? ` ${props.className}` : ""}`}
    >
      <path
        className="hck-fo"
        d="M9.5 0.6 C 10.2 5.2 13.2 7.4 15.4 10.4 C 17.6 13.4 18.6 16.2 17.6 19.2 C 16.4 22.6 13.2 24 9.5 24 C 5.8 24 2.6 22.6 1.4 19.2 C 0.4 16.2 1.4 13.4 3.6 10.4 C 4.6 9 5.6 7.6 6.2 5.8 C 7.4 6.8 8.2 8 8.6 9.4 C 9.6 6.6 9.8 3.6 9.5 0.6 Z"
      />
      <path
        className="hck-fi"
        d="M9.5 11 C 10.3 13.6 12.4 14.8 13.2 16.8 C 14 18.8 13.4 20.6 12 21.8 C 10.8 22.8 8.2 22.8 7 21.8 C 5.6 20.6 5 18.8 5.8 16.8 C 6.6 14.8 8.7 13.6 9.5 11 Z"
      />
    </svg>
  );
}

export function IconFlame(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Ico>
  );
}

export function IconClock(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Ico>
  );
}

export function IconCheck(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Ico>
  );
}

export function IconPencil(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </Ico>
  );
}

export function IconArrowRight(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Ico>
  );
}

export function IconPlayCircle(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </Ico>
  );
}

export function IconSparkle(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </Ico>
  );
}

export function IconHeart(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </Ico>
  );
}

export function IconUserPlus(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M2 21a8 8 0 0 1 13.292-6" />
      <circle cx="10" cy="8" r="5" />
      <path d="M19 16v6" />
      <path d="M22 19h-6" />
    </Ico>
  );
}

export function IconMore(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </Ico>
  );
}

export function IconFlag(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </Ico>
  );
}

export function IconClipboardList(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </Ico>
  );
}

export function IconNotebook(props: IconProps): ReactElement {
  return (
    <Ico {...props}>
      <path d="M2 6h4v12H2z" />
      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6z" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
    </Ico>
  );
}
