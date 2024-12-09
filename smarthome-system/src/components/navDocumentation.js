"use client";

import React from 'react';
import Link from 'next/link';

const NavDocumentationButton = () => {
    return (
        <div className='flex justify-center'>
            <Link href="/documentation">
                <span>
                    <img className='svg mr-4' src='/file-earmark-break-fill.svg' alt='Documentation' style={{ filter: 'invert(1)' }} />
                </span>
            </Link>
        </div>
    );
};

export default NavDocumentationButton;
