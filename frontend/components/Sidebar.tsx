
"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/types/types";

interface SidebarProps {
    navItems: NavItem[];
}

type Box = { top: number; height: number };

export const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
    const pathname = usePathname();

    const navRef = useRef<HTMLElement | null>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const [activeBox, setActiveBox] = useState<Box | null>(null);
    const [hoverBox, setHoverBox] = useState<Box | null>(null);
    const [ready, setReady] = useState(false); 

    const activeIndex = navItems?.findIndex((i) => i.route === pathname) ?? -1;

    const measure = (index: number): Box | null => {
        const el = itemRefs.current[index];
        if (!el) return null;
        return { top: el.offsetTop, height: el.offsetHeight };
    };

    useEffect(() => {
        const update = () => setActiveBox(activeIndex >= 0 ? measure(activeIndex) : null);
        update();
        const raf = requestAnimationFrame(() => setReady(true));
        window.addEventListener("resize", update);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", update);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, navItems]);

    if (!navItems || navItems.length === 0) return null;

    return (
        <aside className="w-full md:w-64 shrink-0 bg-nav-bg border-r border-nav-border hidden md:flex flex-col min-h-[calc(100vh-68px)] transition-colors duration-300">
            <div className="flex flex-col flex-1 py-8 px-4 sticky top-17">
                <div className="flex items-center gap-2.5 px-4 pb-5 mb-3 border-b border-nav-border/60">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-60 animate-ping motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_8px_var(--color-brand-500)]" />
                    </span>
                    <span className="text-xs font-extrabold tracking-[0.2em] text-brand-text">
                        Kontrol paneli
                    </span>
                </div>

                <nav
                    ref={navRef}
                    className="relative flex flex-col gap-1.5 mt-2"
                    onMouseLeave={() => setHoverBox(null)}
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 rounded-xl bg-brand-50/70 transition-[transform,height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                        style={{
                            height: hoverBox?.height ?? 0,
                            transform: `translateY(${hoverBox?.top ?? 0}px)`,
                            opacity: hoverBox ? 1 : 0,
                        }}
                    />

                    {activeBox && (
                        <div
                            aria-hidden
                            className={`pointer-events-none absolute inset-x-0 rounded-xl bg-brand-50 border border-brand-400/30 shadow-[0_4px_18px_-6px_var(--color-brand-500)] motion-reduce:transition-none ${
                                ready
                                    ? "transition-[transform,height] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                                    : ""
                            }`}
                            style={{
                                height: activeBox.height,
                                transform: `translateY(${activeBox.top}px)`,
                            }}
                        >
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3/5 w-1.5 rounded-r-full bg-brand-500 shadow-[0_0_10px_var(--color-brand-500)]" />
                            <span className="absolute inset-0 rounded-xl bg-linear-to-r from-brand-500/10 via-transparent to-transparent" />
                        </div>
                    )}

                    {navItems.map((item, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <Link
                                key={item.route}
                                href={item.route}
                                ref={(el) => {
                                    itemRefs.current[index] = el;
                                }}
                                aria-current={isActive ? "page" : undefined}
                                onMouseEnter={() => setHoverBox(measure(index))}
                                onFocus={() => setHoverBox(measure(index))}
                                className={`group relative z-10 flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-500/60 ${
                                    isActive
                                        ? "text-brand-600"
                                        : "text-brand-text/75 hover:text-brand-600"
                                }`}
                            >
                                <span
                                    className={`truncate transition-transform duration-300 ease-out motion-reduce:transition-none ${
                                        isActive ? "translate-x-1" : "group-hover:translate-x-1.5"
                                    }`}
                                >
                                    {item.name}
                                </span>

                                {isActive ? (
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_var(--color-brand-500)]" />
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4 text-brand-400 opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 motion-reduce:transition-none"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};