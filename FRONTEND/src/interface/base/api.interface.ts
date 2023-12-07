export interface MongoQueryResponseModel<T> {
    docs: Array<T>,
    totalDocs: number,
    offset: number,
    limit: number,
    totalPages: number,
    page: number,
    pagingCounter: number,
    hasPrevPage: boolean,
    hasNextPage: boolean,
    prevPage?: number | null,
    nextPage?: number | null
}

export interface QueryModel {
    page: number | 0,
    size: number | 5
}
export interface MinvoiceResponseModel<T> {
    code: number,
    message: string | null,
    data: T
}