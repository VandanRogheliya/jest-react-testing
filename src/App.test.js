import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

// Dummy data
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

// Dummy data
const MOCK_TASK = {
	id: 3,
	text: 'Visit dentist',
	day: 'Feb 9th at 1:30pm',
	reminder: true,
}

// Mocking APIs
beforeEach(() => {
	jest.spyOn(global, 'fetch').mockImplementation((url, init) => {
		// GET all tasks
		if (url === 'http://localhost:5000/tasks' && !init)
			return Promise.resolve({
				json: () => Promise.resolve(MOCK_TASKS),
			})

		// POST a new task
		if (url === 'http://localhost:5000/tasks' && init.method === 'POST')
			return Promise.resolve({ json: () => Promise.resolve(MOCK_TASK) })

		// DELETE a task
		if (init.method === 'DELETE')
			return Promise.resolve({
				status: 200,
			})
	})
})

test('task list renders', async () => {
	// Render DOM
	await act(async () => {
		render(<App />)
	})

	// Assertions
	expect(screen.getByTestId('header')).toBeInTheDocument()
	expect(screen.getByTestId('header-button')).toBeInTheDocument()
	expect(screen.getByText('Appointment')).toBeInTheDocument()
})

test('task creation', async () => {
	// Render DOM
	await act(async () => {
		render(<App />)
	})

	// Mock button click to open the form
	fireEvent.click(screen.getByTestId('header-button'))

	// Reference all the input fields
	const textInput = screen.getByTestId('task-text-input')
	const dateTimeInput = screen.getByTestId('task-day-time-input')
	const reminderInput = screen.getByTestId('task-reminder-input')

	// Reference the submit button
	const submitButton = screen.getByTestId('add-task-submit-button')

	// Mock filling the form
	fireEvent.change(textInput, { target: { value: MOCK_TASK.text } })
	fireEvent.change(dateTimeInput, { target: { value: MOCK_TASK.day } })
	if (MOCK_TASK.reminder) fireEvent.click(reminderInput)

	// Mock submit button click
	fireEvent.click(submitButton)

	// Wait for the API call to complete
	await waitFor(() => screen.getByText(MOCK_TASK.text))

	// Assertions
	expect(screen.getByText(MOCK_TASK.text)).toBeInTheDocument()
	expect(screen.getByText(MOCK_TASK.day)).toBeInTheDocument()
})

test('delete a task', async () => {
	// Render DOM
	await act(async () => {
		render(<App />)
	})

	// Reference task to be deleted
	const taskCard = screen.getAllByTestId('task-card')[0]

	// Assert the task is present in the DOM
	expect(taskCard).toBeInTheDocument()

	// Reference delete button
	const deleteBtn = screen.getAllByTestId('delete-button')[0]

	// Mock delete button click
	fireEvent.click(deleteBtn)

	// Wait for API call to complete
	await waitFor(() => screen.getByText(MOCK_TASKS[0].text))

	// Reference task again
	const deletedTaskText = screen.queryByText(MOCK_TASKS[0].text)

	// Assertion
	expect(deletedTaskText).toBeNull()
})
