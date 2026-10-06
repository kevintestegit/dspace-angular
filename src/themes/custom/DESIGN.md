# PCIRN Angular theme direction

## Identity

Institutional repository for the Polícia Científica do Rio Grande do Norte. Page content should feel like part of the same public service as the existing home, search, administration, and item views.

## Visual contract

- Use the existing PCIRN palette: navy `#07345f`, gold `#d79b00`, ink `#24364b`, muted text `#667587`, line `#dfe6ec`, and white surfaces. Administration may use its existing deep blue `#0b3154` and teal `#0e5a73` tokens.
- Reuse the type scale and font stack in `styles/_pcirn-typography.scss`; headings are compact, left-aligned, and clearly separated from content.
- Keep forms, tables, search results, and status content dense enough for repository work. Use borders and spacing to group real content; reserve shadows for raised panels and avoid decorative card grids.
- Match the existing restrained corner radii and visible keyboard focus treatment. Keep native DSpace controls, labels, translations, loading, empty, and error states intact.
- At narrow widths, let toolbars and forms wrap and let wide tables scroll within their own containers.

## Shared shell boundary

Page-level styles may affect only the route content. Preserve the existing header, footer, hero, and breadcrumb presentation. Do not style across route content into those shared shell regions.
