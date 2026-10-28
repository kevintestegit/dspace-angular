export interface RepositoryDocument {
  /** Suffix of the translation keys under info.documentos. */
  id: string;
  /** Angular route to the document. */
  path: string;
}

/** Public list of the PCIRN regulatory documents. */
export const REPOSITORY_DOCUMENTS: RepositoryDocument[] = [
  { id: 'portaria', path: '/handle/123456789/29' },
  { id: 'manual', path: '/handle/123456789/24' },
  { id: 'acesso', path: '/info/politica-acesso' },
  { id: 'privacidade', path: '/info/privacy' },
  { id: 'termo', path: '/info/end-user-agreement' },
];
