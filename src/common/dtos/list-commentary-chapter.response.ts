import { AdjacentBibleChapters } from '../adjacent-bible-chapters.fn';
import { CommentaryChapterResponse } from './commentary-chapter.response';

export type ListCommentaryChapterResponse = AdjacentBibleChapters & {
  values: Omit<CommentaryChapterResponse, keyof AdjacentBibleChapters>[];
};
