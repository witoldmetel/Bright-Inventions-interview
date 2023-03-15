// @todo: Remove this
/* eslint-disable react-native/no-inline-styles */
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { Text, StyleSheet, TextInput, Button, View, SafeAreaView, FlatList, Pressable } from 'react-native'
import { CommitsSheet } from './components/CommitsSheet'

import { BASE_URL, repoNamePattern } from './constants'
import { Commit, RepoData } from './types'

const Item = ({ item, selectedCommits, handleChange }) => {
	const isItemChecked = selectedCommits.find(selectedCommit => selectedCommit.sha === item.sha)

	return (
		<Pressable onPress={() => handleChange(item.sha)}>
			<View style={styles.commitItem}>
				<MaterialCommunityIcons
					name={isItemChecked ? 'checkbox-marked' : 'checkbox-blank-outline'}
					size={24}
					color="#000"
				/>
				<Text style={{ color: 'green' }}>{item.authorName}</Text>
				<Text style={{ color: 'blue' }}>{item.sha}</Text>
				<Text numberOfLines={2} style={{ color: 'red' }}>
					{item.message}
				</Text>
			</View>
		</Pressable>
	)
}

export default function RootApp() {
	const [repo, setRepo] = useState<string>('')
	const [isRepoNameValid, setIsRepoNameValid] = useState<boolean>(true)
	const [repoData, setRepoData] = useState<RepoData | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [selectedCommits, setSelectedCommits] = React.useState<Commit[]>([])
	const [isVisible, setIsVisible] = useState<boolean>(false)

	const handleRepoChange = (text: string) => {
		setRepo(text)
		setIsRepoNameValid(repoNamePattern.test(text))

		if (errorMessage) {
			setErrorMessage('')
		}
	}

	const storeRepoData = async (id, value) => {
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
					setErrorMessage('Repository not found')
				}
			}

			setIsLoading(false)
		} else {
			setErrorMessage(`Invalid repository name: ${repo}`)
		}
	}

	const selectCommit = (sha: string) => {
		const isCommitSelected = selectedCommits.find(selectedCommit => selectedCommit.sha === sha)

		if (isCommitSelected) {
			const filteredArray = selectedCommits.filter(item => item.sha !== sha)

			setSelectedCommits(filteredArray)
		} else {
			const commitToSend = repoData.commits.find(commit => sha === commit.sha)

			setSelectedCommits(prev => [...prev, commitToSend])
		}
	}

	const toggleCommitsSheet = () => setIsVisible(!isVisible)

	return (
		<SafeAreaView style={styles.screenWrapper}>
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
				{isLoading ? <Text>Loading...</Text> : <Button title="Search" disabled={!repo} onPress={handleSearchRepo} />}
				{repoData ? (
					<View style={styles.repoDataContainer}>
						<Text>Repository ID: {repoData.id}</Text>
						{repoData.commits ? (
							<View>
								<Text>Latest commits:</Text>
								<FlatList
									data={repoData.commits}
									keyExtractor={item => item.sha}
									renderItem={({ item }) => (
										<Item item={item} selectedCommits={selectedCommits} handleChange={selectCommit} />
									)}
									contentContainerStyle={{ flexGrow: 1 }}
								/>
								<Button title="Send" disabled={selectedCommits.length === 0} onPress={toggleCommitsSheet} />
							</View>
						) : null}
					</View>
				) : null}
				<CommitsSheet isVisible={isVisible} toggleCommitsSheet={toggleCommitsSheet} commitsToSend={selectedCommits} />
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	commitItem: {
		borderBottomColor: '#ccc',
		borderBottomWidth: 2,
		height: 80,
		// @todo: temporary fix bottom edge
		marginBottom: 12,
		padding: 3,
	},
	container: {
		alignItems: 'center',
		flex: 1,
		padding: 16,
	},
	errorMessage: {
		color: 'red',
		marginTop: 8,
	},
	input: {
		borderColor: 'gray',
		borderWidth: 2,
		height: 40,
		marginBottom: 16,
		paddingHorizontal: 8,
		width: '100%',
	},
	inputLabel: {
		marginBottom: 8,
		textAlign: 'left',
		width: '100%',
	},
	repoDataContainer: {
		flex: 1,
	},
	screenWrapper: {
		flex: 1,
	},
	title: {
		fontSize: 28,
		marginBottom: 8,
	},
})
