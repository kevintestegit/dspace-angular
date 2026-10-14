/**
 * Normalises what the user typed in the search box before it is sent to the REST API, which hands the query
 * straight to Solr's Lucene parser.
 *
 * Two corrections, both based on measurements against this repository's own index:
 *
 * - Repeated wildcards (`**`, `***`) mean exactly the same as a single `*`, so they are collapsed.
 * - An unmatched double quote makes Solr reject the whole query with HTTP 422, and the search page ends up showing
 *   an error instead of results. Closing the quote keeps the phrase search the user was typing.
 *
 * Deliberately NOT rewritten: `%`. It is not a wildcard in Solr (it is silently dropped, so `operacao%` behaves
 * exactly like `operacao`), but in this repository a percent sign is far more likely to be literal text — "100%",
 * "50%" — than a SQL-style wildcard. Rewriting it to `*` would turn "100%" into the prefix search "100*" and
 * silently widen the results.
 *
 * @param query the raw value typed by the user
 * @returns the query to send, unchanged when there is nothing to normalise
 */
export function normalizeSearchQuery(query: string): string {
  if (query === null || query === undefined || query.trim() === '') {
    return query;
  }

  let normalized = query.replace(/\*{2,}/g, '*');

  const quotes = (normalized.match(/"/g) || []).length;
  if (quotes % 2 !== 0) {
    normalized += '"';
  }

  return normalized;
}
