/**
 * Barrel cho dữ liệu demo — extracted từ API thật của aioenglish.com
 * (xem docs/research/aioenglish/DATA-SOURCES.md và các header trong từng module).
 */
export { goCauCourse } from "./goCauCourse";
export type {
  GoCauCourse,
  GoCauCourseMeta,
  GoCauLearningUnit,
  GoCauStatement,
  GoCauTier,
} from "./goCauCourse";

export { tuVungOxford3000 } from "./tuVungCourse";
export type {
  TuVungCourse,
  TuVungCourseMeta,
  TuVungGroup,
  TuVungSet,
} from "./tuVungCourse";

export { nguPhapCatalog } from "./nguPhapCatalog";
export type {
  NguPhapCatalog,
  NguPhapCurriculumLevel,
  NguPhapCurriculumModule,
  NguPhapCurriculumStage,
  NguPhapGroup,
  NguPhapNode,
  NguPhapNodeCounts,
  NguPhapTopic,
  NguPhapTypingRef,
} from "./nguPhapCatalog";

export { learningPath } from "./learningPath";
export type {
  LearningPath,
  PathChapter,
  PathEta,
  PathGoal,
  PathLevel,
  PathLevelTest,
  PathProgress,
  PathProgressDone,
  PathRow,
  PathTarget,
} from "./learningPath";
