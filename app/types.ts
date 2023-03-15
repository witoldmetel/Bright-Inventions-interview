export type Commit = {
	message: string
	sha: string
	authorName: string
	date: Date
	isChecked?: boolean
}

export type RepoData = {
	id: number
	commits?: Commit[]
}
