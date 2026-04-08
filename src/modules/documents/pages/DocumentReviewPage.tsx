import { useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SectionNav } from '../../../components/ModulePage/SectionNav';
import { DOCUMENT_SECTIONS } from '../config';
import type { DocumentSectionKey } from '../config';
import type { DocumentComment, DocumentRecord, LinkedEntity } from '../types';
import { documentsService } from '../services';
import { DocumentViewer } from '../components/DocumentViewer';
import { ExtractedFieldsSection } from '../components/sections/ExtractedFieldsSection';
import { LinkedEntitiesSection } from '../components/sections/LinkedEntitiesSection';
import { TriggeredRulesSection } from '../components/sections/TriggeredRulesSection';
import { CommentsSection } from '../components/sections/CommentsSection';
import styles from '../DocumentsModule.module.css';

export type FieldAction =
  | { type: 'CONFIRM_FIELD'; fieldId: string }
  | { type: 'OVERRIDE_FIELD'; fieldId: string; value: string; explanation: string }
  | { type: 'ADD_COMMENT'; comment: Omit<DocumentComment, 'id'> }
  | { type: 'LINK_ENTITY'; entity: LinkedEntity };

function documentReducer(state: DocumentRecord, action: FieldAction): DocumentRecord {
  switch (action.type) {
    case 'CONFIRM_FIELD':
      return {
        ...state,
        extractedFields: state.extractedFields.map((f) =>
          f.id === action.fieldId
            ? { ...f, status: 'confirmed' as const, confirmedValue: f.extractedValue }
            : f
        ),
      };
    case 'OVERRIDE_FIELD':
      return {
        ...state,
        extractedFields: state.extractedFields.map((f) =>
          f.id === action.fieldId
            ? { ...f, status: 'overridden' as const, confirmedValue: action.value, overrideExplanation: action.explanation }
            : f
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [...state.comments, { ...action.comment, id: `comment-${Date.now()}` }],
      };
    case 'LINK_ENTITY':
      return {
        ...state,
        linkedEntities: [...state.linkedEntities, action.entity],
      };
  }
}

function renderSection(
  section: DocumentSectionKey,
  doc: DocumentRecord,
  dispatch: React.Dispatch<FieldAction>,
) {
  switch (section) {
    case 'fields':
      return <ExtractedFieldsSection fields={doc.extractedFields} dispatch={dispatch} />;
    case 'entities':
      return <LinkedEntitiesSection linkedEntities={doc.linkedEntities} dispatch={dispatch} />;
    case 'rules':
      return <TriggeredRulesSection rules={doc.triggeredRules} />;
    case 'comments':
      return <CommentsSection comments={doc.comments} dispatch={dispatch} />;
  }
}

export function DocumentReviewPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<DocumentSectionKey>('fields');

  const initialDocument = documentId ? documentsService.getDocumentById(documentId) : undefined;
  const [doc, dispatch] = useReducer(
    documentReducer,
    initialDocument ?? ({ extractedFields: [], linkedEntities: [], triggeredRules: [], comments: [] } as unknown as DocumentRecord),
  );

  if (!initialDocument || !doc) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Document not found.</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.reviewHeader}>
        <button className={styles.backButton} onClick={() => navigate('/documents')} type="button">
          Back to documents
        </button>
        <div className={styles.reviewHeaderInfo}>
          <h1 className={styles.reviewTitle}>{doc.title}</h1>
          <span className={styles.recordStatus}>{doc.status}</span>
          <div className={styles.reviewPills}>
            <span className={styles.pill}>{doc.category}</span>
            <span className={styles.pill}>{doc.documentType}</span>
            <span className={styles.pill}>{doc.entityName}</span>
            <span className={styles.pill}>TY {doc.taxYear}</span>
          </div>
        </div>
      </div>

      <div className={styles.reviewSplitPane}>
        <div className={styles.viewerPane}>
          <DocumentViewer document={doc} />
        </div>

        <div className={styles.reviewPane}>
          <SectionNav
            sections={DOCUMENT_SECTIONS}
            activeSection={activeSection}
            onSelect={(key) => setActiveSection(key as DocumentSectionKey)}
            accentColor="#4338ca"
          />
          {renderSection(activeSection, doc, dispatch)}
        </div>
      </div>
    </div>
  );
}
