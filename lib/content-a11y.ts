/** ATAG 2.0 Part B — shared types for content verification scripts. */

export type ContentIssue = {
  file: string;
  line?: number;
  rule: string;
  message: string;
  repair: string;
};
