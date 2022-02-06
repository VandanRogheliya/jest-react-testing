import React from 'react'
import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

const MOCK_TASKS = [
	{
		id: 1,
		text: 'Appointment',
		day: 'Feb 5th at 2:30pm',
		reminder: true,
	},
	{
		id: 2,
		text: 'Meeting at School',
		day: 'Feb 6th at 1:30pm',
		reminder: false,
	},
]

test('task list renders', async () => {
	jest.spyOn(global, 'fetch').mockImplementation(() => {
		return Promise.resolve({
			json: () => Promise.resolve(MOCK_TASKS),
		})
	})
	await act(async () => {
		render(<App />)
	})
	expect(screen.getByTestId('header')).toBeInTheDocument()
	expect(screen.getByTestId('header-button')).toBeInTheDocument()

	expect(screen.getByText('Appointment')).toBeInTheDocument()

	global.fetch.mockRestore()
})

test('about link click', () => {
	render(<App />)
	act(() => screen.getByTestId('about-link').click())
	expect(screen.getByTestId('version')).toBeInTheDocument()
})
