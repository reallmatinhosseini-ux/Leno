import React from "react";

const S = ({ d, size = 20 }: { d: React.ReactNode; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
export const Search = () => <S d={<><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>} />;
export const Heart = () => <S d={<path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9z" />} />;
export const Bag = () => <S d={<><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8a3 3 0 0 1 6 0" /></>} />;
export const Arrow = ({ flip }: { flip?: boolean }) => <span style={flip ? { display: "inline-flex", transform: "scaleX(-1)" } : { display: "inline-flex" }}><S size={18} d={<path d="M5 12h14M13 6l6 6-6 6" />} /></span>;
export const Close = () => <S size={22} d={<path d="M6 6l12 12M18 6 6 18" />} />;
export const Grid = () => <S d={<><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></>} />;
export const Minus = () => <S size={14} d={<path d="M6 12h12" />} />;
export const Plus = () => <S size={14} d={<path d="M12 6v12M6 12h12" />} />;
const L = (d: React.ReactNode) => () => <S size={22} d={d} />;
export const Truck = L(<><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></>);
export const Return = L(<><path d="M9 7 5 11l4 4" /><path d="M5 11h9a5 5 0 0 1 0 10h-3" /></>);
export const Card = L(<><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h4" /></>);
export const Chat = L(<path d="M4 18l1.4-3.6A7.5 7.5 0 1 1 8 17.2z" />);
export const Lock = L(<><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>);
export const Ruler = () => <S size={16} d={<><path d="M3 15 15 3l6 6L9 21z" /><path d="M7 11l2 2M10 8l2 2M13 5l2 2" /></>} />;

export function Kiss({ className = "" }: { className?: string }) {
  return <span className={"kiss-m " + className} aria-hidden="true" />;
}
export function Logo() {
  return (<><Kiss /><span className="lw"><b>LENO WEAR</b><small>LEAVE YOUR MARK</small></span></>);
}
