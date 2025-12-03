import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

function addTask(name) {
  const input = screen.getByLabelText(/task name/i);
  const button = screen.getByRole('button', { name: /add task/i });
  fireEvent.change(input, { target: { value: name } });
  fireEvent.click(button);
}

test('renders app title and task input', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /daily task tracker/i })
  ).toBeInTheDocument();

  expect(screen.getByLabelText(/task name/i)).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /add task/i })
  ).toBeInTheDocument();
});

test('can add a task and it appears in the list', () => {
  render(<App />);

  addTask('Write tests');

  // Task title label should appear
  expect(screen.getByText(/write tests/i)).toBeInTheDocument();
});

test('can toggle completion and UI reflects it via checkbox', () => {
  render(<App />);

  addTask('Toggle me');

  const checkbox = screen.getByRole('checkbox', {
    name: /toggle me/i,
  });

  expect(checkbox).not.toBeChecked();

  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();

  fireEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});

test('filter Active hides completed tasks', () => {
  render(<App />);

  addTask('Task A');
  addTask('Task B');

  const taskACheckbox = screen.getByRole('checkbox', { name: /task a/i });
  fireEvent.click(taskACheckbox); // complete Task A

  // Switch to Active filter
  const activeFilterButton = screen.getByRole('tab', { name: /active/i });
  fireEvent.click(activeFilterButton);

  // Completed task A should be hidden, while B remains
  expect(screen.queryByText(/task a/i)).not.toBeInTheDocument();
  expect(screen.getByText(/task b/i)).toBeInTheDocument();
});
