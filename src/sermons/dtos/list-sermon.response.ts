import { SermonInfoResponse } from './sermon-info.response';

export class ListSermonResponse {
  values: SermonInfoResponse[];
  total: number;
  limit: number;
  offset: number;
  nextPage: number | null;
}
