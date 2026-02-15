import styles from './SkeletonCard.module.scss';

export default function SkeletonCard() {
    return (
        <div className={styles.skeletonCard}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonFooter}></div>
        </div>
    );
}
