import React from 'react';
import Link from 'next/link';

import SettingsButton from './settingsButton';
import PageReloadButton from "@/components/pageReload";
import NavDocumentation from "@/components/navDocumentation";
import InfoStatus from "./infoStatus";

export function Navbar() {
    return (
        <div className="pb-20">
            <div className="w-full bg-textColor fixed top-0 z-50">
                <nav className="flex items-center justify-between p-6">
                    <div>
                        <Link href={"/"}>
                            <img src='/logo.svg' className='logo' style={{height: "40px", width: "40px"}}></img>
                        </Link>
                    </div>
                    <div className="flex-1 text-center">
                        <span className="font-semibold text-xl tracking-tight text-white">Smart-Home System</span>
                    </div>
                    <NavDocumentation/>
                    <PageReloadButton/>
                    <InfoStatus/>
                    <SettingsButton/>
                </nav>
            </div>
        </div>
    );
}

export function Footer() {
    return (
        <footer className={"bg-textColor shadow max-w-screen bottom-0 w-full"}>
            <div className={"w-full mx-auto max-w-screen-xl p-4 flex items-center justify-between"}>
                <span className={"text-sm text-gray-500 dark:text-gray-400"}>
                    © 2024
                    <Link href={"/"}>
                        <span className={"hover:underline ml-1"}>Nerd Teens</span>
                    </Link>
                    . All Rights Reserved.
                </span>
            </div>
        </footer>

    );
}
