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

export type CommitResponse = {
	commit: {
		message: string
		sha: string
		author: { name: string }
	}
}
