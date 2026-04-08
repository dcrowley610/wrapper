import type { CSSProperties } from 'react';
import styles from './SectionNav.module.css';

export type SectionConfig = {
  key: string;
  label: string;
};

type SectionNavProps = {
  sections: SectionConfig[];
  activeSection: string;
  onSelect: (key: string) => void;
  accentColor?: string;
};

export function SectionNav({ sections, activeSection, onSelect, accentColor }: SectionNavProps) {
  const style = accentColor
    ? ({ '--section-nav-active-bg': accentColor } as CSSProperties)
    : undefined;

  return (
    <div className={styles.sectionNav} style={style}>
      {sections.map((section) => (
        <button
          key={section.key}
          className={`${styles.sectionTab} ${activeSection === section.key ? styles.sectionTabActive : ''}`}
          onClick={() => onSelect(section.key)}
          type="button"
        >
          {section.label}
        </button>
      ))}
    </div>
  );
}
