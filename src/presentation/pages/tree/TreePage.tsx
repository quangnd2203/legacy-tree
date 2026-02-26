import { useEffect, useState, useRef } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    BackgroundVariant,
    MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { getProfiles } from '@application/profile-use-cases/ProfileUseCases';
import { Profile } from '@domain/profiles/Profile';
import { FamilyNode } from './components/TreeNode';
import { OrthogonalEdge } from './components/OrthogonalEdge';
import { sortProfilesByTraditionalSeniority } from '@application/genealogy-use-cases/ProcessAncestryBook';
import { useClanSettingsContext } from '../../context/ClanSettingsContext';

const nodeTypes = { familyNode: FamilyNode };
const edgeTypes = { orthogonal: OrthogonalEdge };

const NODE_WIDTH = 190;
const SPOUSE_GAP = 50;
const SIBLING_GAP = 120;
const GEN_GAP = 160;

export function TreePage({
    onEditProfile,
    refreshTrigger = 0
}: {
    onEditProfile?: (profile: Profile) => void;
    refreshTrigger?: number;
}) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);
    const { settings: clanSettings } = useClanSettingsContext();
    const genDisplayOffset = clanSettings?.generation_display_offset ?? 1;

    const editRef = useRef(onEditProfile);
    useEffect(() => { editRef.current = onEditProfile; }, [onEditProfile]);

    const buildTree = (profiles: Profile[]) => {
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        const processed = new Set<string>();

        // Calculate generation for each profile (root = 0)
        const genMap: Record<string, number> = {};
        const calcGen = (id: string): number => {
            if (genMap[id] !== undefined) return genMap[id];
            const p = profiles.find(x => x.id === id);
            if (!p || !p.father_id) { genMap[id] = 0; return 0; }
            genMap[id] = calcGen(p.father_id) + 1;
            return genMap[id];
        };
        profiles.forEach(p => calcGen(p.id));

        // Bi-directional generation propagation for spouses
        let changed = true;
        while (changed) {
            changed = false;
            profiles.forEach(p => {
                if (p.partner_id || profiles.some(x => x.partner_id === p.id)) {
                    const partners = profiles.filter(x => x.partner_id === p.id || p.partner_id === x.id);
                    partners.forEach(partner => {
                        if (genMap[p.id] !== genMap[partner.id]) {
                            const maxGen = Math.max(genMap[p.id], genMap[partner.id]);
                            if (genMap[p.id] !== maxGen) { genMap[p.id] = maxGen; changed = true; }
                            if (genMap[partner.id] !== maxGen) { genMap[partner.id] = maxGen; changed = true; }
                        }
                    });
                }
            });
            // Limit iterations to prevent infinite loops in bad data
            if (changed) { /* max 5 iterations or similar could be added but data is mostly trees */ }
            break; // For now one pass is better than zero, but let's do it properly
        }

        // Re-run propagation correctly
        for (let i = 0; i < 3; i++) { // 3 passes usually enough for any spouse chain
            profiles.forEach(p => {
                const partners = profiles.filter(x => x.partner_id === p.id || p.partner_id === x.id);
                partners.forEach(partner => {
                    const pg = genMap[p.id] || 0;
                    const parg = genMap[partner.id] || 0;
                    if (pg !== parg) {
                        const target = Math.max(pg, parg);
                        genMap[p.id] = target;
                        genMap[partner.id] = target;
                    }
                });
            });
        }

        const getPartners = (id: string) =>
            profiles.filter(p => p.partner_id === id || profiles.find(x => x.id === id)?.partner_id === p.id);
        const getChildren = (id: string) => {
            const children = profiles.filter(p => p.father_id === id);
            return sortProfilesByTraditionalSeniority(children);
        };

        const layoutNode = (id: string, x: number, y: number): number => {
            if (processed.has(id)) return 0;
            processed.add(id);

            const profile = profiles.find(p => p.id === id)!;
            const partners = getPartners(id);
            const children = getChildren(id);
            const gen = genMap[id] ?? 0;

            const coupleWidth = NODE_WIDTH + partners.length * (NODE_WIDTH + SPOUSE_GAP);

            let childrenTotalWidth = 0;
            if (children.length > 0) {
                let cx = 0;
                children.forEach(child => {
                    const w = layoutNode(child.id, x + cx, y + GEN_GAP);
                    cx += w + SIBLING_GAP;
                });
                childrenTotalWidth = cx - SIBLING_GAP;
            }

            const subtreeWidth = Math.max(coupleWidth, childrenTotalWidth);
            const pX = x + (subtreeWidth - coupleWidth) / 2;

            // Main person node
            newNodes.push({
                id: profile.id,
                type: 'familyNode',
                data: {
                    profile: profile,
                    full_name: profile.full_name,
                    birth_date: profile.birth_date,
                    birth_date_lunar: profile.birth_date_lunar,
                    status: profile.status,
                    death_anniversary: profile.death_anniversary,
                    image_url: profile.image_url,
                    gender: profile.gender,
                    generation: gen,
                    generation_display_offset: genDisplayOffset,
                    hasParent: !!profile.father_id,
                    hasPartner: partners.length > 0,
                    isPartner: false,
                    hasChildren: children.length > 0,
                    onEdit: (p: Profile) => editRef.current?.(p),
                },
                position: { x: pX, y: gen * GEN_GAP },
            } as Node);

            // Partner nodes
            partners.forEach((partner, idx) => {
                processed.add(partner.id);
                newNodes.push({
                    id: partner.id,
                    type: 'familyNode',
                    data: {
                        profile: partner,
                        full_name: partner.full_name,
                        birth_date: partner.birth_date,
                        birth_date_lunar: partner.birth_date_lunar,
                        status: partner.status,
                        death_anniversary: partner.death_anniversary,
                        image_url: partner.image_url,
                        gender: partner.gender,
                        generation: gen,
                        generation_display_offset: genDisplayOffset,
                        hasParent: false,
                        hasPartner: true,
                        isPartner: true,
                        hasChildren: false,
                        onEdit: (p: Profile) => editRef.current?.(p),
                    },
                    position: { x: pX + (NODE_WIDTH + SPOUSE_GAP) * (idx + 1), y: gen * GEN_GAP },
                } as Node);

                newEdges.push({
                    id: `p-${profile.id}-${partner.id}`,
                    source: profile.id,
                    target: partner.id,
                    sourceHandle: 'partner-out',
                    targetHandle: 'partner-in',
                    style: { stroke: '#fda4af', strokeDasharray: '4 3', strokeWidth: 2 },
                    type: 'straight',
                });
            });

            // Child edges
            children.forEach(child => {
                newEdges.push({
                    id: `e-${profile.id}-${child.id}`,
                    source: profile.id,
                    target: child.id,
                    type: 'orthogonal',
                    style: { stroke: '#818cf8', strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8', width: 14, height: 14 },
                });
            });

            return subtreeWidth;
        };

        const roots = sortProfilesByTraditionalSeniority(
            profiles.filter(p =>
                !p.father_id &&
                !profiles.some(x => (x.partner_id === p.id || p.partner_id === x.id) && x.father_id)
            )
        );

        let currentX = 0;
        roots.forEach(root => {
            if (!processed.has(root.id)) {
                const w = layoutNode(root.id, currentX, 0);
                currentX += w + SIBLING_GAP * 2;
            }
        });

        setNodes(newNodes);
        setEdges(newEdges);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getProfiles();
            buildTree(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [refreshTrigger]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-50">
                <div className="text-center animate-pulse">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🌳</span>
                    </div>
                    <p className="text-indigo-600 font-semibold text-sm">Đang tải phả đồ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodesDraggable={false}
                nodesConnectable={false}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                maxZoom={2}
                className="bg-linear-to-br from-slate-50 to-indigo-50/30"
            >
                <Background gap={30} color="#e0e7ff" variant={BackgroundVariant.Dots} />
                <Controls
                    className="bg-white! border-gray-200! shadow-lg! rounded-xl! overflow-hidden"
                    showInteractive={false}
                />
                <MiniMap
                    nodeColor={(node: Node) => {
                        const gen = (node.data as Record<string, unknown>)?.generation ?? 0;
                        const colors = ['#fb923c', '#60a5fa', '#34d399', '#a78bfa', '#fb7185'];
                        return colors[(gen as number) % colors.length];
                    }}
                    className="bg-white! border-gray-200! shadow-lg! rounded-xl! overflow-hidden hidden sm:block"
                    maskColor="rgba(240, 244, 250, 0.4)"
                />
            </ReactFlow>

            <button
                onClick={fetchData}
                className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white border border-gray-200 shadow-lg hover:shadow-xl text-gray-700 text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
            >
                🔄 Làm mới phả đồ
            </button>
        </div>
    );
}
