import React, { useState } from 'react'
import { Text, StyleSheet, TextInput, View, SafeAreaView } from 'react-native'
import { Button } from './components/Button'
import { RepositoryWrapper } from './components/RepositoryWrapper'

import { BASE_URL, repoNamePattern } from './constants'
import { Commit, CommitResponse, RepoData } from './types'
import { getRepoData, storeRepoData } from './utils/storage'

export default function RootApp() {
	const [repo, setRepo] = useState<string>('')
	const [isRepoNameValid, setIsRepoNameValid] = useState<boolean>(true)
	const [repoData, setRepoData] = useState<RepoData | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string>('')

	const handleRepoChange = (text: string) => {
		setRepo(text)
		setIsRepoNameValid(repoNamePattern.test(text))

		if (errorMessage) {
			setErrorMessage('')
		}
	}

	const handleSearchRepo = async () => {
		if (!isRepoNameValid) {
			setRepoData(null)
			setErrorMessage(`Invalid repository name: ${repo}`)

			return
		}

		setIsLoading(true)

		// check if repository data is cached in AsyncStorage
		const cachedData = await getRepoData(repo)

		// if repository data is cached, set repoData to cached data
		if (cachedData) {
			setRepoData({ ...cachedData })
			setIsLoading(false)

			return
		}

		const response = await fetch(`${BASE_URL}${repo}`).then(response => {
			if (response.status === 200) {
				return response.json()
			}
		})

		if (!response) {
			setRepoData(null)
			setErrorMessage('Repository not found')
			setIsLoading(false)

			return
		}

		const commitsResponse = await fetch(`${BASE_URL}${repo}/commits`).then(response => {
			if (response.status === 200) {
				return response.json()
			}
		})

		if (!commitsResponse) {
			setRepoData(null)
			setErrorMessage('Commits not found')
			setIsLoading(false)

			return
		}

		const formattedCommits = commitsResponse
			.map(({ commit }: CommitResponse) => ({
				message: commit.message,
				sha: commit.sha,
				authorName: commit.author.name,
			}))
			.sort((a: Commit, b: Commit) => new Date(b.date).getTime() - new Date(a.date).getTime())

		setRepoData({
			id: response.id,
			commits: formattedCommits,
		})

		storeRepoData(repo, {
			id: response.id,
			commits: formattedCommits,
		})

		setIsLoading(false)
	}

	return (
		<SafeAreaView style={styles.rootContainer}>
			<View style={styles.container}>
				<Text style={styles.title}>Github Finder</Text>
				<Text style={styles.inputLabel}>GitHub repository name</Text>
				<Text style={styles.inputLabel}>Correct format: &quot;&lt;owner&gt;/&lt;repository&gt;&quot;</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter the repository owner and name"
					value={repo}
					onChangeText={handleRepoChange}
				/>
				{errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
				<Button title={isLoading ? 'Loading...' : 'Search'} disabled={!repo} onPress={handleSearchRepo} />
				<RepositoryWrapper repositoryData={repoData} />
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flex: 1,
		padding: 16,
	},
	errorMessage: {
		color: '#bd2c00',
	},
	input: {
		borderColor: '#333',
		borderWidth: 2,
		height: 40,
		marginBottom: 16,
		paddingHorizontal: 8,
		width: '100%',
	},
	inputLabel: {
		color: '#333',
		marginBottom: 8,
		textAlign: 'left',
		width: '100%',
	},
	rootContainer: {
		flex: 1,
	},
	title: {
		color: '#333',
		fontSize: 28,
		marginBottom: 8,
	},
})
