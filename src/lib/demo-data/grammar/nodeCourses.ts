/**
 * nodeCourses — map node ngữ pháp (nguPhapCatalog) → các khóa gõ câu liên quan.
 *
 * Nguồn khóa: src/lib/demo-data/go-cau (3 khóa tay-picked + 37 khóa bulk,
 * đều load được qua getCourseAsync). Map được lập bằng cách đọc title + mẫu
 * câu của từng khóa và đối chiếu chủ điểm node:
 *   - crs_b60adbaa933635b8d0 "Đã làm việc bao lâu rồi"  → HTHT khẳng định + for
 *   - crs_d5d9f4cb9dcf760b9e "Chưa gọi từ hôm đó"        → HTHT phủ định
 *   - crs_0008c8bbf528537cfd "Đã đi hay đang ở đó"       → have been to
 *   - crs_4fb3d0ed5685677471 "Ôn tập hiện tại hoàn thành" → for/since ôn tập
 *   - crs_6af8d95af4cf480c2c "Vẫn đang chờ từ sáng"      → HTHT tiếp diễn + since
 *   - crs_ae1ed2cfc00e37d174 "Bao lâu rồi và chưa xong"  → How long + HTHT TD
 *   - crs_2d19a63f05e546bf60 "Việc đã xong trước đó"     → QKHT khẳng định
 *   - crs_2f0f90e0bd1c47ea38 "Trước và sau trong quá khứ" → QKHT phủ định
 *   - crs_7110d98abf46c7e602 "Tương lai đang diễn ra"    → tương lai tiếp diễn
 *   - crs_30ce0ee017780f165d "Bão lũ và việc đã xong"    → TLTD phủ định
 *   - crs_70fe166265e51810d3 "Có thể làm được gì"        → can khả năng
 *   - crs_991247355be6da5a8a "Vừa có thể vừa phải làm"   → be able to
 *   - crs_694680703b6c19a0b7 "Ôn tập chương khuyết thiếu" → ôn khuyết thiếu
 *   - crs_d934f4746f93b75967 "Bắt buộc và không cần"     → must / have to / needn't
 *   - crs_7105a1fa420a801faa "Lời khuyên nên làm"        → should
 *   - crs_e43c881a99a80d0f53 "Khả năng bổn phận lời khuyên" → ought to / ôn
 *   - crs_15ff9cccf2ba2c12d5 "Điều kiện loại 2 khẳng định"
 *   - crs_7a3e078875f533bb4c "Điều kiện loại 2 phủ định"
 *   - crs_176e9c3c026bc673ef "Đáng lẽ đã và chắc hẳn đã" → should/must have V3
 *   - crs_c49c32b0946187993e "Không thể nào đã quên"     → shouldn't have V3
 *   - crs_d88d5ac22b47dda563 "Kể lại lời đã nói"         → said (that)…
 *   - crs_ef0391fd1c5a2d3272 "Kể lại câu hỏi và lời nhờ" → asked if / told to
 *   - crs_2e824de174c05b98bc "Ôn tập chương kể lại lời"  → ôn tường thuật
 *   - crs_90e6a6edfea17e40e8 "Thuật lại lời yêu cầu"     → told sb to V
 *   - crs_7bbc17b9f3b578cde8 "Thuật lại câu hỏi gián tiếp" → asked if…
 *   - crs_21c27bdc3d01c9b33c "Tự hỏi liệu có đúng không" → wonder whether
 *   - crs_31f958bf1136c6e787 "Việc được làm hằng ngày"   → bị động hiện tại
 *   - crs_a9c8c9e57e644c6e71 "Việc đã được làm trong quá khứ" → bị động QK
 *   - crs_317da2688bb7d65293 "Bị động phủ định và câu hỏi"
 *   - crs_0e965a922bf27f30c2 "Đã được sửa chưa"          → has been + V3
 *   - crs_b1bf2f59e1bb6183af "Bị phạt và được thăng chức" → get + V3
 *   - crs_423d2f32ea56a0d048 "Thật khó để làm gì"        → It is + adj + to V
 *   - crs_1a6ae82dc465174a0f "Biết phải làm gì"          → wh- + to V
 *   - crs_8a0db1efac587c7e25 "Khuyên và rủ ai làm gì"    → told sb to V
 *   - crs_d8d56f70abe8355b63 "Sẽ có lễ hội lớn"          → there will be
 *
 * Khóa đọc bằng getCourseAsync (async); link vào bài học:
 * `/go-cau/lo-trinh-b1/{courseId}`.
 */
export const NODE_COURSE_IDS: Record<string, string[]> = {
  "b1-present-perfect": [
    "crs_b60adbaa933635b8d0",
    "crs_d5d9f4cb9dcf760b9e",
    "crs_0008c8bbf528537cfd",
    "crs_4fb3d0ed5685677471",
  ],
  "b1-present-perfect-continuous": [
    "crs_6af8d95af4cf480c2c",
    "crs_ae1ed2cfc00e37d174",
  ],
  "b1-past-perfect": [
    "crs_2d19a63f05e546bf60",
    "crs_2f0f90e0bd1c47ea38",
  ],
  "b1-future-continuous": [
    "crs_7110d98abf46c7e602",
    "crs_30ce0ee017780f165d",
  ],
  "b1-modal-ability-permission": [
    "crs_70fe166265e51810d3",
    "crs_991247355be6da5a8a",
    "crs_694680703b6c19a0b7",
  ],
  "b1-modal-obligation": [
    "crs_d934f4746f93b75967",
    "crs_694680703b6c19a0b7",
  ],
  "b1-modal-ought-should": [
    "crs_7105a1fa420a801faa",
    "crs_e43c881a99a80d0f53",
  ],
  "b1-conditionals-1-2": [
    "crs_15ff9cccf2ba2c12d5",
    "crs_7a3e078875f533bb4c",
  ],
  "b1-modal-perfect": [
    "crs_176e9c3c026bc673ef",
    "crs_c49c32b0946187993e",
  ],
  "a2-reported-speech-intro": [
    "crs_d88d5ac22b47dda563",
    "crs_ef0391fd1c5a2d3272",
    "crs_2e824de174c05b98bc",
  ],
  "b1-to-infinitive-advanced": [
    "crs_1a6ae82dc465174a0f",
    "crs_8a0db1efac587c7e25",
  ],
  "b1-reported-speech": [
    "crs_90e6a6edfea17e40e8",
    "crs_7bbc17b9f3b578cde8",
    "crs_21c27bdc3d01c9b33c",
  ],
  "a2-passive-basic": [
    "crs_31f958bf1136c6e787",
    "crs_a9c8c9e57e644c6e71",
    "crs_317da2688bb7d65293",
  ],
  "b1-passive-voice": [
    "crs_0e965a922bf27f30c2",
    "crs_b1bf2f59e1bb6183af",
  ],
  "b1-it-clauses": [
    "crs_423d2f32ea56a0d048",
    "crs_1a6ae82dc465174a0f",
  ],
  "b1-there-here": [
    "crs_d8d56f70abe8355b63",
  ],
};

/** Số khóa gõ câu map được cho node (đếm nhanh cho UI). */
export function nodeCourseCount(nodeId: string): number {
  return NODE_COURSE_IDS[nodeId]?.length ?? 0;
}
