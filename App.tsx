import React, { useState } from 'react'
import { Text, StyleSheet, TextInput, Button, View, SafeAreaView, FlatList } from 'react-native'

const repoNamePattern = /^[^/]+\/[^/]+$/

type Commit = {
	message: string
	sha: string
	authorName: string
	date: Date
}

type RepoData = {
	id: number
	commits?: Commit[]
}

export default function App() {
	const [repo, setRepo] = useState('')
	const [isRepoNameValid, setIsRepoNameValid] = useState(true)
	const [repoData, setRepoData] = useState<RepoData | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const handleRepoChange = (text: string) => {
		setRepo(text)
		setIsRepoNameValid(repoNamePattern.test(text))

		if (errorMessage) {
			setErrorMessage('')
		}
	}

	const handleSearchRepo = async () => {
		if (isRepoNameValid) {
			setIsLoading(true)

			const response = await fetch(`https://api.github.com/repos/${repo}`).then(response => {
				if (response.status === 200) {
					return response.json()
				}
			})

			if (response) {
				setRepoData({ id: response.id })

				const commitsResponse = await fetch(`https://api.github.com/repos/${repo}/commits`).then(response => {
					if (response.status === 200) {
						return response.json()
					}
				})

				if (commitsResponse) {
					setRepoData(prevRepoData => ({
						...prevRepoData,
						commits: commitsResponse
							.map((commit: any) => ({
								message: commit.commit.message,
								sha: commit.sha,
								authorName: commit.commit.author.name,
							}))
							.sort((a: Commit, b: Commit) => new Date(b.date).getTime() - new Date(a.date).getTime()),
					}))
				} else {
					setErrorMessage('Commits not found')
				}
			} else {
				setErrorMessage('Repository not found')
			}

			setIsLoading(false)
		} else {
			setErrorMessage(`Invalid repository name: ${repo}`)
		}
	}

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
										<View style={styles.commitItem}>
											<Text>{item.message}</Text>
											<Text>{item.sha}</Text>
											<Text>{item.authorName}</Text>
										</View>
									)}
									contentContainerStyle={{ flexGrow: 1 }}
								/>
							</View>
						) : null}
					</View>
				) : null}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screenWrapper: {
		flex: 1,
	},
	container: {
		flex: 1,
		padding: 16,
		alignItems: 'center',
	},
	title: {
		fontSize: 28,
		marginBottom: 8,
	},
	inputLabel: {
		textAlign: 'left',
		width: '100%',
		marginBottom: 8,
	},
	input: {
		width: '100%',
		height: 40,
		borderColor: 'gray',
		borderWidth: 2,
		paddingHorizontal: 8,
		marginBottom: 16,
	},
	errorMessage: {
		color: 'red',
		marginTop: 8,
	},
	repoDataContainer: {
		flex: 1,
	},
	commitItem: {
		height: 80,
		padding: 10,
		borderBottomWidth: 2,
		borderBottomColor: '#ccc',
		// @todo: temporary fix bottom edge
		marginBottom: 12,
	},
})
