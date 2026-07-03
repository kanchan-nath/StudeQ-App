import React from "react";
import Link from "next/link";
import styles from "./Breadcrumb.module.css";

/**
 * items: Array<{ label: string, to?: string }>
 * Last item = no link (current page)
 */

const Breadcrumb = ({ items = [] }) => {
    if (!items.length) return null;

    return (
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <ol className={styles.list} role="list">
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={i} className={styles.item}>
                            {!isLast && item.to ? (
                                <>
                                    <Link href={item.to} className={styles.link}>
                                        {item.label}
                                    </Link>
                                    <span className={styles.sep} aria-hidden="true">/</span>
                                </>
                            ) : (
                                <span className={styles.current} aria-current="page">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;