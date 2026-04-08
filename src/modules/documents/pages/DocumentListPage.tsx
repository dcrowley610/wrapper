import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformContext } from '../../../platform/context';
import { DocumentCard } from '../components/DocumentCard';
import { DOCUMENT_FILTERS } from '../config';
import { documentsService } from '../services';
import styles from '../DocumentsModule.module.css';

export function DocumentListPage() {
  const { scopeSelection } = usePlatformContext();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    status: DOCUMENT_FILTERS[0].options[0],
    category: DOCUMENT_FILTERS[1].options[0],
    documentType: DOCUMENT_FILTERS[2].options[0],
  });

  const visibleDocuments = useMemo(() => {
    const scopeDocuments = documentsService.getScopedDocuments(scopeSelection);
    return scopeDocuments.filter((doc) => {
      const matchesSearch =
        searchValue.trim().length === 0 ||
        `${doc.title} ${doc.fileName} ${doc.entityName} ${doc.category}`
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      const matchesStatus = filters.status === 'All statuses' || doc.status === filters.status;
      const matchesCategory = filters.category === 'All categories' || doc.category === filters.category;
      const matchesType = filters.documentType === 'All types' || doc.documentType === filters.documentType;

      return matchesSearch && matchesStatus && matchesCategory && matchesType;
    });
  }, [scopeSelection, searchValue, filters]);

  const handleOpenDocument = useCallback((id: string) => navigate(`/documents/${id}`), [navigate]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.eyebrow}>Document Workspace</div>
          <h1 className={styles.title}>Review, verify, and connect your documents.</h1>
        </div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <label className={styles.fieldLabel} htmlFor="doc-search">
              Search documents
            </label>
            <input
              id="doc-search"
              className={styles.input}
              placeholder="Search by title, file name, entity, or category"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>

          <div className={styles.filterRow}>
            {DOCUMENT_FILTERS.map((filter) => (
              <label key={filter.key} className={styles.filterField}>
                <span className={styles.fieldLabel}>{filter.label}</span>
                <select
                  className={styles.select}
                  value={filters[filter.key]}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, [filter.key]: event.target.value }))
                  }
                >
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.listHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Document library</h2>
            <p className={styles.sectionCopy}>
              Click a document to open the review workspace with extracted fields,
              linked entities, triggered rules, and comments.
            </p>
          </div>
          <span className={styles.countPill}>{visibleDocuments.length} visible</span>
        </div>

        <div className={styles.recordGrid}>
          {visibleDocuments.length > 0 ? (
            visibleDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onOpen={handleOpenDocument}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              No documents match this scope and filter combination yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
