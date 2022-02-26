export type DetectInfo = DetectPage[]
export type DetectPage = {
    page: number,
    number_match: DetectBox[],
    keyword_match: DetectBox[]
};

export type DetectBox = {
    text: string,
    type: string, 
    x1: number,
    x2: number, 
    y1: number, 
    y2: number
}
