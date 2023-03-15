import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { Text, StyleSheet, TextInput, View, SafeAreaView } from 'react-native'
import { Button } from './components/Button'
import { RepositoryWrapper } from './components/RepositoryWrapper'

import { BASE_URL, repoNamePattern } from './constants'
import { Commit, RepoData } from './types'

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

	const storeRepoData = async (id: string, value) => {
		try {
			const jsonValue = JSON.stringify(value)

			await AsyncStorage.setItem(id, jsonValue)
		} catch (e) {
			console.error(e)
		}
	}

	const getRepoData = async (id: string) => {
		try {
			const jsonValue = await AsyncStorage.getItem(id)

			return jsonValue !== null ? JSON.parse(jsonValue) : null
		} catch (e) {
			console.error(e)
		}
	}

	const handleSearchRepo = async () => {
		if (isRepoNameValid) {
			setIsLoading(true)

			const cachedData = await getRepoData(repo)

			if (cachedData) {
				setRepoData({ ...cachedData })
			} else {
				const response = await fetch(`${BASE_URL}${repo}`).then(response => {
					if (response.status === 200) {
						return response.json()
					}
				})

				if (response) {
					setRepoData({ id: response.id })

					const commitsResponse = await fetch(`${BASE_URL}${repo}/commits`).then(response => {
						if (response.status === 200) {
							return response.json()
						}
					})

					if (commitsResponse) {
						setRepoData(prevRepoData => ({
							...prevRepoData,
							commits: commitsResponse
								// @todo: update type
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								.map((commit: any) => ({
									message: commit.commit.message,
									sha: commit.sha,
									authorName: commit.commit.author.name,
								}))
								.sort((a: Commit, b: Commit) => new Date(b.date).getTime() - new Date(a.date).getTime()),
						}))

						storeRepoData(repo, {
							id: response.id,
							commits: commitsResponse
								// @todo: update type
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								.map((commit: any) => ({
									message: commit.commit.message,
									sha: commit.sha,
									authorName: commit.commit.author.name,
								}))
								.sort((a: Commit, b: Commit) => new Date(b.date).getTime() - new Date(a.date).getTime()),
						})
					} else {
						setErrorMessage('Commits not found')
					}
				} else {
					setRepoData(null)
					setErrorMessage('Repository not found')
				}
			}

			setIsLoading(false)
		} else {
			setRepoData(null)
			setErrorMessage(`Invalid repository name: ${repo}`)
		}
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
