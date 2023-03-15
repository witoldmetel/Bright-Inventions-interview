export type Commit = {
	message: string
	sha: string
	authorName: string
	date: Date
}

export type RepoData = {
	id: number
	commits?: Commit[]
}
