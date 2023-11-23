import { Types } from "mongoose"

export type Populated<M, K extends keyof M> = Omit<M, K> & {
    [P in K]: Exclude<M[P], Types.ObjectId | Types.ObjectId[]>
}