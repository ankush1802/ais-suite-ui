export interface Examination {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    questions? : Question[]
}
export interface Question{
    index : number;
    question : string;
    options: string[];
}
