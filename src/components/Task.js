import { FaTimes } from 'react-icons/fa'

const Task = ({ task, onDelete, onToggle }) => {
	return (
		<div
			className={`task ${task.reminder ? 'reminder' : ''}`}
			onDoubleClick={() => onToggle(task.id)}
			data-testid='task-card'>
			<h3>
				{task.text}{' '}
				<button
					style={{ border: 'none' }}
					onClick={() => onDelete(task.id)}
					data-testid='delete-button'>
					<FaTimes style={{ color: 'red', cursor: 'pointer' }} />
				</button>
			</h3>
			<p>{task.day}</p>
		</div>
	)
}

export default Task
