import type { CourseId } from '../courseConfig';

export const LEGACY_MATCH3_STATE_DOC = 'state';

export function courseCloudStateDocId(courseId: CourseId): string {
  return `state--${courseId}`;
}
