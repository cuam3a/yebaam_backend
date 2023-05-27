export interface PointsByPostInterface {
    postId: string,
    userId?: string,
    marksId?: string,
    isEnabled?: boolean,
    model?: string
    entityId?: string
    dataToPoints: {
        likePoints: ItemValue,
        commentPoints: ItemValue,
        sharePoints: ItemValue,
    }
}

export interface ItemValue {
    value: Number,
    totalPoints: Number,
    avaliablePoints: Number
}