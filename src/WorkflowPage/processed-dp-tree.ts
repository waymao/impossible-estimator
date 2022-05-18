import { ProcessedDataPoint } from "./datapoints";


export type ProcessedDPTreeNode = {
    children: Map<string, ProcessedDPTreeNode>
    dps: ProcessedDataPoint[]
}

function newNode(): ProcessedDPTreeNode  {
    return {
        children: new Map(),
        dps: []
    };
}


export function sortProceessedDP(dp_list: ProcessedDataPoint[]): ProcessedDPTreeNode {
    const root = newNode()
    for (const dp of dp_list) {
        const category = dp.category || "Unspecified";
        if (!root.children.has(category)) {
            root.children.set(category, newNode());
        }
        const category_node = root.children.get(category)!;

        const metric = dp.metric || "Unspecified";
        if (!category_node.children.has(metric)) {
            category_node.children.set(metric, newNode());
        }
        const metric_node = category_node.children.get(metric)!;

        const sub_metric = dp.sub_metric || "Unspecified";
        if (!metric_node.children.has(sub_metric)) {
            metric_node.children.set(sub_metric, newNode());
        }
        const sub_metric_node = metric_node.children.get(sub_metric)!;
        sub_metric_node.dps.push(dp);
    }
    return root
}
