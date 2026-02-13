'use client';

import { useState } from 'react';
import styles from './CommentModal.module.scss';
import { Comment } from '@/types/board';

interface CommentModalProps {
    cardTitle: string;
    comments: Comment[];
    onClose: () => void;
    onAddComment: (text: string) => void;
}

export default function CommentModal({
                                         cardTitle,
                                         comments,
                                         onClose,
                                         onAddComment
                                     }: CommentModalProps) {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = () => {
        if (!newComment.trim()) return;

        onAddComment(newComment.trim());
        setNewComment('');
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Comments for "{cardTitle}"</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.content}>
                    {comments.length === 0 ? (
                        <p className={styles.noComments}>
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        <ul className={styles.commentList}>
                            {comments.map(comment => (
                                <li key={comment.id}>
                                    <div className={styles.commentMeta}>
                                        You · {comment.timestamp}
                                    </div>
                                    <p>{comment.text}</p>
                                </li>
                            ))}
                        </ul>
                    )}

                    <form className={styles.form} onSubmit={e => e.preventDefault()}>
                        <textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            className={styles.textarea}
                        />
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={styles.submitButton}
                        >
                            Add Comment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
