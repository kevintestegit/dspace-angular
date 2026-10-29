export interface PcirnCollectionCategory {
  configuration: string;
  titleKey: string;
  icon: string;
}

export const PCIRN_COLLECTION_CATEGORIES: PcirnCollectionCategory[] = [
  { configuration: 'pcirnNormas', titleKey: 'pcirnNormas.search.results.head', icon: 'fa-file-signature' },
  { configuration: 'pcirnPops', titleKey: 'pcirnPops.search.results.head', icon: 'fa-clipboard-list' },
  { configuration: 'pcirnPap', titleKey: 'pcirnPap.search.results.head', icon: 'fa-folder-open' },
  { configuration: 'pcirnNotasTecnicas', titleKey: 'pcirnNotasTecnicas.search.results.head', icon: 'fa-note-sticky' },
  { configuration: 'pcirnRelatorios', titleKey: 'pcirnRelatorios.search.results.head', icon: 'fa-chart-column' },
  { configuration: 'pcirnMemoriaInstitucional', titleKey: 'pcirnMemoriaInstitucional.search.results.head', icon: 'fa-landmark' },
];
