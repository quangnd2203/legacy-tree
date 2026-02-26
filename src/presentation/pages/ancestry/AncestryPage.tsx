import { useEffect } from 'react';
import { BookOpen, User, Users, AlertTriangle, RefreshCw, Printer } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useAncestryBook } from './hooks/useAncestryBook';
import { useClanSettingsContext } from '../../context/ClanSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { getRankLabel, getChildRankLabel, getParentNames, type FamilyUnit } from '@application/genealogy-use-cases/ProcessAncestryBook';
import { Profile } from '@domain/profiles/Profile';
import {
    BOOK_FOOTER,
    NO_DESCENDANTS_TEXT,
    TITLE_LABELS,
    getDisplayBirthDate,
} from '@shared/genealogy/GenealogyConfig';

export function AncestryPage({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
    const { profiles, familyUnits, loading, error, refetch } = useAncestryBook(refreshTrigger);
    const { settings: clanSettings } = useClanSettingsContext();
    const { user } = useAuth();

    // LT-502: Print handler — opens a clean window with only ancestry content
    // This bypasses the sidebar/flexbox layout constraints entirely
    const handlePrint = () => {
        const contentEl = document.querySelector('.print-ancestry-content');
        if (!contentEl) return;

        // Count units for page numbering
        const units = contentEl.querySelectorAll('.ancestry-unit');
        units.forEach((el, i) => {
            el.setAttribute('data-page', `${i + 2} / ${units.length + 1}`);
        });

        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) {
            alert('Vui lòng cho phép popup để in phả ký.');
            return;
        }

        // Copy all stylesheets from parent so Tailwind classes render correctly
        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map(el => el.outerHTML)
            .join('');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <title>Phả Ký Gia Phả</title>
                ${styles}
                <style>
                    /* ── Page setup ─────────────────────────────────── */
                    @page { size: A4 portrait; margin: 1.8cm 2cm; }
                    body { background: white !important; font-family: Georgia, "Times New Roman", serif; font-size: 10pt; }

                    /* ── Colors ──────────────────────────────────────── */
                    * { color: black !important; background: transparent !important;
                        box-shadow: none !important; text-shadow: none !important; }

                    /* ── COMPACT: Override Tailwind large spacing ─────── */
                    /* py-12 → 3rem top/bottom viên container chính */
                    .px-6.py-12 { padding-top: 0.5cm !important; padding-bottom: 0.5cm !important;
                                  padding-left: 0 !important; padding-right: 0 !important; }
                    /* mb-20: bìa sách → section */
                    .mb-20 { margin-bottom: 0.5cm !important; }
                    /* mb-8: section header margin */
                    .mb-8 { margin-bottom: 0.3cm !important; }
                    /* mb-6 */
                    .mb-6 { margin-bottom: 0.2cm !important; }
                    /* mb-4 */
                    .mb-4 { margin-bottom: 0.15cm !important; }
                    /* space-y-24: khoảng giữa các family unit (vô nghĩa vì có page-break) */
                    .space-y-24 > * + * { margin-top: 0 !important; }
                    /* pb-32: padding cuối container */
                    .pb-32 { padding-bottom: 0.3cm !important; }
                    /* pt-20: footer book */
                    .pt-20 { padding-top: 0.3cm !important; }
                    /* gap-8 trong children grid */
                    .gap-8 { gap: 0.4cm !important; }
                    /* py-4, py-6 trong partner/children sections */
                    .py-4 { padding-top: 0.2cm !important; padding-bottom: 0.2cm !important; }
                    .py-6 { padding-top: 0.25cm !important; padding-bottom: 0.25cm !important; }
                    /* p-4, p-6 trong card sections */
                    .p-4 { padding: 0.2cm !important; }
                    .p-6 { padding: 0.25cm !important; }
                    /* Khoảng cách trong children list */
                    .space-y-4 > * + * { margin-top: 0.15cm !important; }
                    .space-y-3 > * + * { margin-top: 0.1cm !important; }

                    /* ── COMPACT: Typography scale for A4 ────────────── */
                    /* Tên chủ hộ lớn: text-4xl → ~20pt */
                    .text-4xl { font-size: 20pt !important; line-height: 1.25 !important; }
                    /* Tên phối ngẫu in nghiêng: text-2xl → ~14pt */
                    .text-2xl { font-size: 14pt !important; }
                    .text-xl  { font-size: 12pt !important; }
                    .text-lg  { font-size: 11pt !important; }
                    .text-base { font-size: 10pt !important; }
                    .text-sm  { font-size: 9pt !important; }
                    /* Label badge nhỏ */
                    .text-xs, [class*="text-xs"] { font-size: 8pt !important; }
                    .text-\[10px\] { font-size: 7.5pt !important; }

                    /* ── Section header (THÔNG TIN CÁ NHÂN, ...) ─────── */
                    .flex.items-center.gap-2.mb-4,
                    .flex.items-center.gap-2.mb-6 { margin-bottom: 0.2cm !important; }

                    /* ── Ancestry unit: 1 trang/hộ ───────────────────── */
                    .ancestry-cover {
                        page-break-after: always; break-after: page;
                        min-height: 85vh;
                        display: flex; flex-direction: column;
                        justify-content: center; align-items: center; text-align: center;
                    }
                    .ancestry-preface { page-break-after: always; break-after: page; }
                    .ancestry-unit {
                        page-break-after: always !important; break-after: page !important;
                        min-height: 24cm !important; /* Chiều cao tối thiểu 1 trang giấy */
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    .ancestry-unit:last-child { page-break-after: auto !important; break-after: auto !important; }

                    /* ── Footer số trang: Đẩy xuống đáy trang ─────────── */
                    .ancestry-unit[data-page]::after {
                        content: "Trang " attr(data-page);
                        display: block; text-align: center;
                        font-size: 8pt; font-style: italic;
                        margin-top: auto !important; /* Đẩy xuống đáy */
                        padding-top: 0.3cm;
                        padding-bottom: 0.5cm;
                        border-top: 0.5pt solid #aaa;
                    }

                    /* ── Ẩn UI elements ──────────────────────────────── */
                    button, .no-print, nav, aside { display: none !important; }

                    /* ── Relative positioning reset (các absolute labels) */
                    .relative { position: relative !important; }
                    /* Ẩn line decorator P.1, P.2 bên trái */
                    .absolute.-left-12, .absolute.-left-16 { display: none !important; }
                </style>
            </head>
            <body>
                <div class="max-w-3xl mx-auto px-6 py-12">
                    ${contentEl.innerHTML}
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() { window.print(); window.close(); }, 800);
                    };
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    // ─── Loading State ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center animate-pulse">
                    <BookOpen size={48} className="text-indigo-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium lowercase tracking-widest text-xs">Đang phổ phả ký...</p>
                </div>
            </div>
        );
    }

    // ─── Error State (LT-308) ────────────────────────────────────────────────
    if (error) {
        return (
            <div className="h-full flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center max-w-sm">
                    <AlertTriangle size={48} className="text-rose-300 mx-auto mb-4" />
                    <h2 className="text-lg font-black text-gray-800 mb-2">Không thể tải Gia Phả</h2>
                    <p className="text-sm text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={refetch}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-widest hover:bg-gray-700 transition-colors active:scale-95"
                    >
                        <RefreshCw size={14} />
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // ─── Main Render ─────────────────────────────────────────────────────────
    return (
        <div className="h-full overflow-y-auto bg-[#FDFDFD] px-4 sm:px-6 py-8 sm:py-12 selection:bg-indigo-100 selection:text-indigo-900 print-scroll-container">
            <div className="max-w-3xl mx-auto">

                {/* ── Print Button (LT-502) — only for logged-in users, hidden in print ── */}
                {user && (
                    <div className="flex justify-end mb-6 no-print">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-gray-700 transition-colors active:scale-95 rounded-xl shadow-sm"
                        >
                            <Printer size={14} /> In Phả Ký
                        </button>
                    </div>
                )}

                {/* LT-503: ancestry-content wraps ONLY the printable genealogy content */}
                <div className="print-ancestry-content">

                    {/* ── Book Cover Header — LT-503: class ancestry-cover ── */}
                    <div className="text-center mb-12 sm:mb-20 ancestry-cover">
                        <div className="inline-block p-3 border-b-2 border-double border-gray-200 mb-6">
                            <BookOpen size={32} className="text-gray-300" />
                        </div>

                        {/* Clan identity */}
                        <h1 className="text-2xl sm:text-4xl font-serif font-black text-gray-900 mb-2 tracking-tight">
                            {clanSettings?.book_title || clanSettings?.clan_name || 'Gia Phả Dòng Họ'}
                        </h1>

                        {/* Branch / Chi line */}
                        {(clanSettings?.branch_name || clanSettings?.sub_branch_name) && (
                            <p className="text-base font-serif italic text-gray-600 mb-1">
                                {[clanSettings?.branch_name, clanSettings?.sub_branch_name].filter(Boolean).join(' — ')}
                            </p>
                        )}

                        {/* Hometown */}
                        {(clanSettings?.hometown_village || clanSettings?.hometown_commune || clanSettings?.hometown_district || clanSettings?.hometown_province) && (
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                                📍 {[
                                    clanSettings?.hometown_village,
                                    clanSettings?.hometown_commune,
                                    clanSettings?.hometown_district,
                                    clanSettings?.hometown_province,
                                ].filter(Boolean).join(', ')}
                            </p>
                        )}

                        {/* Compiler info */}
                        {clanSettings?.book_compiled_year && (
                            <p className="text-[10px] text-gray-300 italic mt-2">
                                Lập phả năm {clanSettings.book_compiled_year}
                                {clanSettings.book_compiler_name ? ` • ${clanSettings.book_compiler_name}` : ''}
                            </p>
                        )}
                    </div>

                    {/* ── Preface Poem (HTML from TipTap, sanitized) ── */}
                    {clanSettings?.preface_poem && (
                        <div className="mb-20 border-t border-b border-gray-100 py-12">
                            <div
                                className="font-serif text-gray-700 text-base leading-loose prose prose-sm max-w-none text-center"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(clanSettings.preface_poem) }}
                            />
                        </div>
                    )}

                    <div className="space-y-16 sm:space-y-24 pb-20 sm:pb-32">
                        {familyUnits.map((unit: FamilyUnit, idx: number) => {
                            const genOffset = (clanSettings?.generation_display_offset ?? 1) - 1;
                            const displayGeneration = unit.generation + genOffset;
                            const rankLabel = getRankLabel(unit.head, profiles, unit.generation);
                            const parentNames = unit.generation > 1 ? getParentNames(unit.head, profiles) : null;

                            return (
                                // LT-501: ancestry-unit class → page-break-after:always in @media print
                                <section key={unit.head.id} className="relative group ancestry-unit">
                                    {/* Page Index Label — hidden in print via no-print */}
                                    <div className="absolute -left-12 top-0 h-full w-px bg-gray-100 group-hover:bg-indigo-200 transition-colors no-print" />
                                    <div className="absolute -left-16 top-0 text-[10px] font-black text-gray-300 group-hover:text-indigo-400 tracking-tighter transition-colors no-print">
                                        P.{idx + 1}
                                    </div>

                                    {/* Generation Header */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="bg-gray-900 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest">
                                            Đời Thứ {displayGeneration}
                                        </span>
                                        <div className="h-px flex-1 bg-gray-100" />
                                    </div>

                                    {/* Main Entry Heading */}
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 leading-tight flex items-baseline flex-wrap gap-x-3">
                                            <span className="text-sm font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                                                {rankLabel}
                                            </span>
                                            <span>{unit.head.full_name}</span>
                                            {unit.partners.length > 0 && (
                                                <span className="text-gray-400 font-light italic">
                                                    & {unit.partners.map((p: Profile) => p.full_name).join(', ')}
                                                </span>
                                            )}
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-gray-700">
                                            {/* Personal Info */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    <User size={12} /> Thông tin cá nhân
                                                </div>

                                                {/* Lineage Reference (LT-304) */}
                                                {parentNames && (
                                                    <div className="mb-4 p-2 bg-indigo-50/50 rounded border border-indigo-100/50 text-xs text-gray-600">
                                                        <span className="text-indigo-400 font-black uppercase tracking-tighter mr-2">Trực hệ:</span>
                                                        <span className="text-gray-900 font-bold">{rankLabel}</span>
                                                        <span className="ml-1 text-gray-500">của </span>
                                                        <span className="text-gray-900 font-bold">{parentNames}</span>
                                                    </div>
                                                )}

                                                <p className="mb-2"><strong className="text-gray-900 font-bold">Họ và tên:</strong> {unit.head.full_name}</p>
                                                {(() => {
                                                    const display = getDisplayBirthDate(unit.head);
                                                    return display && (
                                                        <p className="mb-2">
                                                            <strong className="text-gray-900 font-bold">Ngày sinh:</strong> {display.value}
                                                            {display.type === 'lunar' && <span className="ml-1.5 text-[10px] bg-indigo-50 text-indigo-500 px-1 py-0.5 rounded font-black uppercase tracking-tighter">Âm</span>}
                                                        </p>
                                                    );
                                                })()}
                                                <p className="mb-2">
                                                    <strong className="text-gray-900 font-bold">Trạng thái:</strong>{' '}
                                                    {unit.head.status === 'Alive' ? TITLE_LABELS.ALIVE : TITLE_LABELS.DECEASED}
                                                </p>
                                                {unit.head.status === 'Deceased' && unit.head.death_anniversary && (
                                                    <p className="text-rose-600 font-bold italic">
                                                        Ngày kỵ nhật (Giỗ): {unit.head.death_anniversary}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Partners */}
                                            {unit.partners.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        <Users size={12} /> Phối ngẫu (Vợ/Chồng)
                                                    </div>
                                                    {unit.partners.map((partner: Profile) => (
                                                        <div key={partner.id} className="mb-4 last:mb-0 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <p className="font-bold text-gray-900 underline underline-offset-4 decoration-gray-200">{partner.full_name}</p>
                                                            {(() => {
                                                                const display = getDisplayBirthDate(partner);
                                                                return display && (
                                                                    <p className="text-gray-500 text-xs mt-1">
                                                                        Ngày sinh: {display.value}
                                                                        {display.type === 'lunar' && <span className="ml-1 text-[9px] text-indigo-400 font-bold italic">(Âm)</span>}
                                                                    </p>
                                                                );
                                                            })()}
                                                            {partner.status === 'Deceased' && partner.death_anniversary && (
                                                                <p className="text-rose-500 text-[10px] font-semibold mt-1 italic">
                                                                    Kỵ nhật: {partner.death_anniversary}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Children / Offspring Section */}
                                    {unit.children.length > 0 ? (
                                        <div className="pl-6 border-l-2 border-indigo-50 bg-indigo-50/20 py-6 pr-6 rounded-r-2xl">
                                            <h4 className="flex items-center gap-2 text-xs font-black text-indigo-500 uppercase tracking-widest mb-4">
                                                Hậu duệ trực hệ ({unit.children.length} người con)
                                            </h4>
                                            <div className="columns-1 sm:columns-2 gap-8 space-y-4">
                                                {unit.children.map((child: Profile, cIdx: number) => {
                                                    const childLabel = getChildRankLabel(child, unit.children);
                                                    return (
                                                        <div key={child.id} className="flex items-start gap-3 group/child break-inside-avoid mb-4">
                                                            <span className="text-[10px] font-black text-indigo-200 mt-0.5">{cIdx + 1}.</span>
                                                            <div>
                                                                <div className="text-sm font-bold text-gray-900 group-hover/child:text-indigo-600 transition-colors flex items-center gap-1">
                                                                    <span>{child.full_name}</span>
                                                                    <span className="text-[10px] text-indigo-400/60 font-medium bg-indigo-50/50 px-1 rounded ml-1">
                                                                        {childLabel}
                                                                    </span>
                                                                </div>
                                                                {(() => {
                                                                    const display = getDisplayBirthDate(child);
                                                                    return display && (
                                                                        <p className="text-[10px] text-gray-400">
                                                                            Ngày sinh: {display.value}
                                                                            {display.type === 'lunar' && <span className="ml-1 text-[8px] text-indigo-300 font-bold italic">(Âm)</span>}
                                                                        </p>
                                                                    );
                                                                })()}
                                                                {child.status === 'Deceased' && child.death_anniversary && (
                                                                    <p className="text-[10px] text-rose-400 italic font-medium">Kỵ nhật: {child.death_anniversary}</p>
                                                                )}
                                                                {(() => {
                                                                    const childPartners = profiles.filter((p: Profile) => p.partner_id === child.id || (child.partner_id === p.id && p.id !== child.id));
                                                                    if (childPartners.length === 0) return null;

                                                                    return (
                                                                        <div className="mt-1 space-y-0.5 border-t border-indigo-100/30 pt-1">
                                                                            <div className="text-gray-500 font-medium italic text-[11px] flex items-center gap-1">
                                                                                <span className="text-[9px] uppercase tracking-tighter opacity-70 bg-gray-100 px-1 rounded">Phối ngẫu:</span>
                                                                                <span>{childPartners.map((p: Profile) => p.full_name).join(', ')}</span>
                                                                            </div>
                                                                            {childPartners.map((partner: Profile) => (
                                                                                partner.status === 'Deceased' && partner.death_anniversary && (
                                                                                    <p key={partner.id} className="text-[10px] text-rose-400 italic">
                                                                                        Kỵ nhật ({partner.full_name}): {partner.death_anniversary}
                                                                                    </p>
                                                                                )
                                                                            ))}
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pl-6 border-l-2 border-gray-50 py-4 italic text-gray-400 text-xs">
                                            {NO_DESCENDANTS_TEXT}
                                        </div>
                                    )}

                                    {/* Separator Diamond */}
                                    <div className="flex justify-center mt-20 opacity-20">
                                        <div className="w-1.5 h-1.5 bg-gray-900 rotate-45" />
                                    </div>
                                </section>
                            );
                        })}
                    </div>

                    {/* Closing Footer */}
                    <div className="text-center pt-20 border-t border-gray-100">
                        <p className="font-serif italic text-gray-300 text-sm">{BOOK_FOOTER}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
