import { SearchService } from "./search.service";
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: string, categoryId?: string, page?: number, hitsPerPage?: number): Promise<any>;
    searchCategories(query: string, parentId?: string, page?: number, hitsPerPage?: number): Promise<any>;
    reindexAll(): Promise<{
        message: string;
    }>;
}
