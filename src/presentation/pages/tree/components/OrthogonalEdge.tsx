import { EdgeProps, getStraightPath, useInternalNode } from '@xyflow/react';

/**
 * OrthogonalEdge: Always draws strict 90-degree elbow lines
 * Path: source-bottom → down half-gap → horizontal → up to target-top
 */
export function OrthogonalEdge({
    id, source, target, style, markerEnd,
}: EdgeProps) {
    const sourceNode = useInternalNode(source);
    const targetNode = useInternalNode(target);

    if (!sourceNode || !targetNode) return null;

    // Get absolute center-bottom of source and center-top of target
    const sx = sourceNode.internals.positionAbsolute.x + (sourceNode.measured?.width ?? 190) / 2;
    const sy = sourceNode.internals.positionAbsolute.y + (sourceNode.measured?.height ?? 100);
    const tx = targetNode.internals.positionAbsolute.x + (targetNode.measured?.width ?? 190) / 2;
    const ty = targetNode.internals.positionAbsolute.y;

    const midY = sy + (ty - sy) / 2;

    // Build orthogonal SVG path: down → horizontal → down
    const d = `M ${sx} ${sy} L ${sx} ${midY} L ${tx} ${midY} L ${tx} ${ty}`;

    return (
        <path
            id={id}
            d={d}
            fill="none"
            style={style}
            markerEnd={markerEnd as string}
            className="react-flow__edge-path"
        />
    );
}
