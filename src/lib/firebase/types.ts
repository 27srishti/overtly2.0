export interface client {
    id?: any;
    name: string;
    industry: string;
    domain: string;
    demographics: string;
    createdAt: number;
}

export interface project {
    id?: string;
    name: string;
    company: string;
    service: string;
    createdAt: number;
}