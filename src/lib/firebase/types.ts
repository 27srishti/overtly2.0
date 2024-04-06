export interface client {
    id?: any;
    name: string;
    industry: string;
    // domain: string;
    demographics: string;
    createdAt: number;
}

export interface project {
    id?: any;
    name: string;
    currentStep: number;
    description: string;
    createdAt: number;
}