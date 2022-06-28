import { API_HOST } from '../../config';

export interface CategoryInfo {
    id: number,
    name: string,
    keywords: {
        [keyword: string]: string[]
    }
}

export interface MetricInfo {
    id: number,
    name: string,
    category: number,
    category_name: string,
    synonyms: string[][]
}

export interface HierarchyInfo {
    metric_info: {
        [metric: string]: string[], 
    },
    category_info: {
        [category: string]: string[]
    }
}

export async function getCategoryHierarchy() {
    const cat_req = await fetch(API_HOST + '/extract/categories');
    const cat_res: CategoryInfo[] = await cat_req.json();
    const met_req = await fetch(API_HOST + '/extract/metrics');
    const met_res: MetricInfo[] = await met_req.json();
    
    const cat_hierarchy: {[category: string]: string[]} = {};
    for (const cat of cat_res) {
        cat_hierarchy[cat.name] = Object.keys(cat.keywords)
    }

    const met_hierarchy: {[metric: string]: string[]} = {};
    for (const metric of met_res) {
        if (metric.category_name in met_hierarchy) {
            met_hierarchy[metric.category_name].push(metric.name)
        } else {
            met_hierarchy[metric.category_name] = [metric.name]
        }
    }

    return {
        metric_info: met_hierarchy, category_info: cat_hierarchy
    };
}
