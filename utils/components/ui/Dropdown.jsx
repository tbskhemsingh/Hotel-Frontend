'use client';

import Link from 'next/link';

export default function Dropdown({ id, title, items = [], parentId }) {
    const headingId = `heading-${id}`;
    const collapseId = `collapse-${id}`;

    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={headingId}>
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded="false"
                    aria-controls={collapseId}
                >
                    {title}
                </button>
            </h2>

            <div id={collapseId} className="accordion-collapse collapse" aria-labelledby={headingId} data-bs-parent={`#${parentId}`}>
                <div className="accordion-body">
                    <div className="row">
                        {items.map((item, index) => (
                            <div key={index} className="col-6 col-md-3 mb-2 fw-semibold">
                                {item.href ? (
                                    <Link href={item.href} className="text-decoration-none text-dark">
                                        • {item.label}
                                    </Link>
                                ) : (
                                    <>• {item.label}</>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
