import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import "./AnimatedList.css";

type AnimatedItemProps = { children: ReactNode; delay?: number; index: number; selected: boolean; onMouseEnter: () => void; onClick: () => void };

function AnimatedItem({ children, delay = 0.05, index, selected, onMouseEnter, onClick }: AnimatedItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: false });
  return <motion.div ref={ref} data-index={index} onMouseEnter={onMouseEnter} onClick={onClick} initial={{ opacity: 0, y: 12, scale: 0.985 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.985 }} transition={{ duration: 0.32, delay, ease: [0.22, 1, 0.36, 1] }} className={selected ? "animated-list-item-wrap is-selected" : "animated-list-item-wrap"}>{children}</motion.div>;
}

export type AnimatedListProps = { items: ReactNode[]; onItemSelect?: (item: ReactNode, index: number) => void; showGradients?: boolean; enableArrowNavigation?: boolean; className?: string; itemClassName?: string; displayScrollbar?: boolean; initialSelectedIndex?: number; initialDelay?: number };

export default function AnimatedList({ items, onItemSelect, showGradients = true, enableArrowNavigation = true, className = "", itemClassName = "", displayScrollbar = true, initialSelectedIndex = -1, initialDelay = 0.05 }: AnimatedListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => { const { scrollTop, scrollHeight, clientHeight } = e.currentTarget; setTopGradientOpacity(Math.min(scrollTop / 50, 1)); const distance = scrollHeight - (scrollTop + clientHeight); setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(distance / 50, 1)); }, []);
  const handleItemClick = useCallback((item: ReactNode, index: number) => { setSelectedIndex(index); onItemSelect?.(item, index); }, [onItemSelect]);

  useEffect(() => { if (!enableArrowNavigation) return; const onKeyDown = (e: KeyboardEvent) => { if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) { e.preventDefault(); setKeyboardNav(true); setSelectedIndex(prev => Math.min(prev + 1, items.length - 1)); } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) { e.preventDefault(); setKeyboardNav(true); setSelectedIndex(prev => Math.max(prev - 1, 0)); } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < items.length) { e.preventDefault(); onItemSelect?.(items[selectedIndex], selectedIndex); } }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [enableArrowNavigation, items, onItemSelect, selectedIndex]);

  useEffect(() => { if (!keyboardNav || selectedIndex < 0 || !listRef.current) return; const selected = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`); selected?.scrollIntoView({ behavior: "smooth", block: "nearest" }); setKeyboardNav(false); }, [keyboardNav, selectedIndex]);

  return <div className={`scroll-list-container ${className}`}><div ref={listRef} className={`scroll-list ${!displayScrollbar ? "no-scrollbar" : ""}`} onScroll={handleScroll}>{items.map((item, index) => <AnimatedItem key={index} index={index} delay={initialDelay + index * 0.045} selected={selectedIndex === index} onMouseEnter={() => setSelectedIndex(index)} onClick={() => handleItemClick(item, index)}>{<div className={itemClassName}>{item}</div>}</AnimatedItem>)}</div>{showGradients && <><div className="top-gradient" style={{ opacity: topGradientOpacity }} /><div className="bottom-gradient" style={{ opacity: bottomGradientOpacity }} /></>}</div>;
}
