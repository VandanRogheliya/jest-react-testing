import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

const MOCK_TASK = {
	id: 3,
	text: 'Visit dentist',
	day: 'Feb 9th at 1:30pm',
	reminder: true,
}

beforeEach(() => {
	jest.spyOn(global, 'fetch').mockImplementation((url, init) => {
		if (url === 'http://localhost:5000/tasks' && !init)
			return Promise.resolve({
				json: () => Promise.resolve(MOCK_TASKS),
			})
		if (url === 'http://localhost:5000/tasks' && init.method === 'POST')
			return Promise.resolve({ json: () => Promise.resolve(MOCK_TASK) })
		if (init.method === 'DELETE')
			return Promise.resolve({
				status: 200,
			})
	})
})

test('task list renders', async () => {
	await act(async () => {
		render(<App />)
	})
	expect(screen.getByTestId('header')).toBeInTheDocument()
	expect(screen.getByTestId('header-button')).toBeInTheDocument()

	expect(screen.getByText('Appointment')).toBeInTheDocument()

	global.fetch.mockRestore()
})

test('task creation', async () => {
	await act(async () => {
		render(<App />)
	})
	act(() => {
		screen.getByTestId('header-button').click()
	})
	const textInput = screen.getByTestId('task-text-input')
	const dateTimeInput = screen.getByTestId('task-day-time-input')
	const reminderInput = screen.getByTestId('task-reminder-input')
	const submitButton = screen.getByTestId('add-task-submit-button')
	act(() => {
		fireEvent.change(textInput, { target: { value: MOCK_TASK.text } })
		fireEvent.change(dateTimeInput, { target: { value: MOCK_TASK.day } })
		if (MOCK_TASK.reminder) fireEvent.click(reminderInput)
	})

	fireEvent.click(submitButton)
	await waitFor(() => screen.getByText(MOCK_TASK.text))

	expect(screen.getByText(MOCK_TASK.text)).toBeInTheDocument()
	expect(screen.getByText(MOCK_TASK.day)).toBeInTheDocument()
})

test('delete a task', async () => {
	await act(async () => {
		render(<App />)
	})
	const taskCard = screen.getAllByTestId('task-card')[0]

	expect(taskCard).toBeInTheDocument()
	const deleteBtn = screen.getAllByTestId('delete-button')[0]
	fireEvent.click(deleteBtn)
	await waitFor(() => screen.getByText(MOCK_TASKS[0].text))
	const deletedTaskText = screen.queryByText(MOCK_TASKS[0].text)
	expect(deletedTaskText).toBeNull()
})

test('about link click', async () => {
	await act(async () => {
		render(<App />)
	})
	act(() => screen.getByTestId('about-link').click())
	expect(screen.getByTestId('version')).toBeInTheDocument()
})
