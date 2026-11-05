import { requireData, unwrap } from "./supabase.helpers";

const PAGE_SIZE = 500;

type PageFetcher<Row> = (
  from: number,
  to: number
) => PromiseLike<{ data: Row[] | null; error: { message: string } | null }>;

export async function readAllRows<Row>(fetchPage: PageFetcher<Row>): Promise<Row[]> {
  const rows: Row[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const page = requireData(unwrap(await fetchPage(from, from + PAGE_SIZE - 1)));

    rows.push(...page);

    if (page.length < PAGE_SIZE) {
      return rows;
    }
  }
}
