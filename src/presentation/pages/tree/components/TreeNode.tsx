import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Pencil } from 'lucide-react';

const GENERATION_COLORS: Record<number, { bg: string; ring: string; badge: string; text: string }> = {
    0: { bg: 'from-amber-400 to-orange-500', ring: 'ring-amber-300', badge: 'bg-amber-100 text-amber-700', text: 'amber' },
    1: { bg: 'from-sky-400 to-indigo-500', ring: 'ring-sky-300', badge: 'bg-sky-100 text-sky-700', text: 'sky' },
    2: { bg: 'from-emerald-400 to-teal-500', ring: 'ring-emerald-300', badge: 'bg-emerald-100 text-emerald-700', text: 'emerald' },
    3: { bg: 'from-violet-400 to-purple-500', ring: 'ring-violet-300', badge: 'bg-violet-100 text-violet-700', text: 'violet' },
    4: { bg: 'from-rose-400 to-pink-500', ring: 'ring-rose-300', badge: 'bg-rose-100 text-rose-700', text: 'rose' },
};

export const FamilyNode = memo(({ data }: any) => {
    const isDeceased = data.status === 'Deceased';
    const currentYear = new Date().getFullYear();
    const birthYear = data.birth_date ? new Date(data.birth_date).getFullYear() : null;
    const age = (birthYear && birthYear > 0 && birthYear < currentYear)
        ? currentYear - birthYear
        : null;

    const gen = data.generation ?? 0;
    const genOffset = data.generation_display_offset ?? 1;
    const displayGen = gen + genOffset;
    const colors = GENERATION_COLORS[gen % Object.keys(GENERATION_COLORS).length] ?? GENERATION_COLORS[0];

    // Initials from full name
    const initials = (data.full_name ?? '?')
        .split(' ')
        .filter(Boolean)
        .slice(-2)
        .map((w: string) => w[0].toUpperCase())
        .join('');

    return (
        <div className="relative w-[190px] h-[130px]">
            {/* Handles - Outside the clipped area to stay visible */}
            {data.hasParent && (
                <Handle type="target" position={Position.Top} id="lineage-in"
                    style={{ background: '#a5b4fc', width: 10, height: 10, border: '1px solid #e0e7ff', top: -5, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
            )}
            {data.hasChildren && (
                <Handle type="source" position={Position.Bottom} id="lineage-out"
                    style={{ background: '#a5b4fc', width: 10, height: 10, border: '1px solid #e0e7ff', bottom: -5, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
            )}
            {data.hasPartner && (
                <Handle type="source" position={Position.Right} id="partner-out"
                    style={{ background: '#fda4af', width: 8, height: 8, border: '1px solid #ffe4e6', right: -4, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
            )}
            {data.isPartner && (
                <Handle type="target" position={Position.Left} id="partner-in"
                    style={{ background: '#fda4af', width: 8, height: 8, border: '1px solid #ffe4e6', left: -4, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} />
            )}

            {/* Main Card - Clipped for perfect corners */}
            <div className={`
                w-full h-full bg-white rounded-md shadow-sm hover:shadow-lg transition-all duration-200
                flex flex-col overflow-hidden relative
                ${isDeceased ? 'opacity-90' : ''}
            `}>
                <div className="p-3 flex-1 flex flex-col min-h-0">
                    {/* Floating Edit Button */}
                    {data.onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                data.onEdit(data.profile);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-md bg-gray-50/80 text-gray-400 hover:bg-slate-100 hover:text-indigo-600 transition-all z-30 border border-transparent hover:border-indigo-100 shadow-sm backdrop-blur-sm nodrag nopan pointer-events-auto cursor-pointer"
                            title="Chỉnh sửa thông tin"
                        >
                            <Pencil size={10} strokeWidth={3} />
                        </button>
                    )}

                    {/* Header: Avatar + Gen badge */}
                    <div className="flex items-center gap-2.5 mb-2 pr-4">
                        {/* Avatar */}
                        <div className={`
                            w-10 h-10 rounded-full shrink-0 flex items-center justify-center overflow-hidden
                            bg-linear-to-br ${colors.bg} ring-1 ${colors.ring}
                            shadow-md
                        `}>
                            {data.image_url ? (
                                <img src={data.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-black text-xs">{initials}</span>
                            )}
                        </div>

                        {/* Name + Meta */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-0.5">
                                {/* Gender icon */}
                                <span className="text-[10px] shrink-0">
                                    {data.gender === 'Male' ? '♂' : data.gender === 'Female' ? '♀' : '○'}
                                </span>
                                {data.isPartner && (
                                    <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-1 rounded uppercase tracking-tighter shrink-0">
                                        Phối ngẫu
                                    </span>
                                )}
                                {isDeceased && (
                                    <span className="text-[9px] font-semibold text-gray-400 italic shrink-0">Mất</span>
                                )}
                            </div>
                            <div className="text-[11px] font-black text-gray-900 leading-tight line-clamp-2" title={data.full_name}>
                                {data.full_name}
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Generation Badge */}
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${colors.badge}`}>
                            Đời {displayGen}
                        </span>

                        {/* Age */}
                        {age !== null && (
                            <span className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                {isDeceased ? '✤' : '●'} {age}t
                            </span>
                        )}

                        {/* Death Anniversary */}
                        {isDeceased && data.death_anniversary && (
                            <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full truncate max-w-full block">
                                Giỗ: {data.death_anniversary}
                            </span>
                        )}
                    </div>
                </div>

                {/* Status Bar at Bottom - No separate rounding needed as it's clipped */}
                <div className={`h-1.5 shrink-0 ${isDeceased ? 'bg-gray-300' : `bg-linear-to-r ${colors.bg}`}`} />
            </div>
        </div>
    );
});
