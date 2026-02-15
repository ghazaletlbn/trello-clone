import styles from '../List/List.module.scss';
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";

interface ListSkeletonProps {
    title: string;
}

export default function ListSkeleton({title}: ListSkeletonProps) {
    return (
        <div className={styles.list}>
            <div className={styles.listHeader}>
                <h2>{title}</h2>
            </div>

            <div className={styles.listCards}>
                <SkeletonCard/>
                <SkeletonCard/>
            </div>

        </div>
    );
}
