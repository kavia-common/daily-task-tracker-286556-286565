import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const TASKS_STORAGE_KEY = 'todo_tasks_v1';
const THEME_STORAGE_KEY = 'todo_theme_v1';

/**
 * Safely read a value from localStorage.
 * Falls back to undefined if storage is unavailable or parsing fails.
 */
function safeReadFromStorage(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return undefined;
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to read from localStorage', err);
    return undefined;
  }
}

/**
 * Safely write a value to localStorage.
 */
function safeWriteToStorage(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to write to localStorage', err);
  }
}

/**
 * Infer the initial theme from storage or prefers-color-scheme.
 */
function getInitialTheme() {
  const stored = safeReadFromStorage(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * Get initial tasks array from storage.
 */
function getInitialTasks() {
  const stored = safeReadFromStorage(TASKS_STORAGE_KEY);
  if (Array.isArray(stored)) {
    return stored;
  }
  return [];
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [tasks, setTasks] = useState(getInitialTasks);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const titleInputRef = useRef(null);
  const editTitleInputRef = useRef(null);

  // Apply theme to <html data-theme="">
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    safeWriteToStorage(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Persist tasks whenever they change
  useEffect(() => {
    safeWriteToStorage(TASKS_STORAGE_KEY, tasks);
  }, [tasks]);

  // Focus title input on mount
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // Focus edit title input when entering edit mode
  useEffect(() => {
    if (editingId && editTitleInputRef.current) {
      editTitleInputRef.current.focus();
    }
  }, [editingId]);

  // PUBLIC_INTERFACE
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // PUBLIC_INTERFACE
  const handleAddTask = useCallback(
    event => {
      event.preventDefault();
      const trimmedTitle = newTitle.trim();
      const trimmedDescription = newDescription.trim();

      if (!trimmedTitle) {
        return;
      }

      const now = new Date().toISOString();
      const newTask = {
        id: Date.now(),
        title: trimmedTitle,
        description: trimmedDescription || '',
        isCompleted: false,
        createdAt: now,
      };

      setTasks(prev => [newTask, ...prev]);
      setNewTitle('');
      setNewDescription('');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    },
    [newTitle, newDescription]
  );

  // PUBLIC_INTERFACE
  const handleToggleTaskCompletion = useCallback(id => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  }, []);

  // PUBLIC_INTERFACE
  const handleDeleteTask = useCallback(id => {
    setTasks(prev => prev.filter(task => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingTitle('');
      setEditingDescription('');
    }
  }, [editingId]);

  // PUBLIC_INTERFACE
  const startEditingTask = useCallback(task => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description || '');
  }, []);

  // PUBLIC_INTERFACE
  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditingTitle('');
    setEditingDescription('');
  }, []);

  // PUBLIC_INTERFACE
  const submitEdit = useCallback(
    event => {
      event.preventDefault();
      if (editingId == null) return;

      const trimmedTitle = editingTitle.trim();
      const trimmedDescription = editingDescription.trim();

      if (!trimmedTitle) {
        return;
      }

      setTasks(prev =>
        prev.map(task =>
          task.id === editingId
            ? {
                ...task,
                title: trimmedTitle,
                description: trimmedDescription,
              }
            : task
        )
      );
      setEditingId(null);
      setEditingTitle('');
      setEditingDescription('');
    },
    [editingDescription, editingId, editingTitle]
  );

  // PUBLIC_INTERFACE
  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.isCompleted));
  }, []);

  // Derive visible tasks based on filter + search
  const visibleTasks = tasks.filter(task => {
    if (filter === 'active' && task.isCompleted) return false;
    if (filter === 'completed' && !task.isCompleted) return false;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const haystack = `${task.title} ${task.description || ''}`.toLowerCase();
    return haystack.includes(query);
  });

  const hasCompletedTasks = tasks.some(task => task.isCompleted);

  const handleFilterChange = nextFilter => {
    setFilter(nextFilter);
  };

  const themeLabel =
    theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-content" aria-label="Daily task tracker header">
          <div className="app-header-text">
            <h1 className="app-title">Daily Task Tracker</h1>
            <p className="app-subtitle">
              Capture, organize, and complete your tasks with focus.
            </p>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={themeLabel}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <main className="app-main" aria-label="Task management">
        <section
          className="card card-input"
          aria-labelledby="new-task-heading"
        >
          <h2 id="new-task-heading" className="section-title">
            Add a task
          </h2>
          <form className="task-form" onSubmit={handleAddTask}>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label" htmlFor="task-title">
                  Task name
                </label>
                <input
                  id="task-title"
                  ref={titleInputRef}
                  type="text"
                  className="text-input"
                  placeholder="e.g. Review pull requests"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  aria-required="true"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label" htmlFor="task-description">
                  Notes <span className="field-optional">(optional)</span>
                </label>
                <textarea
                  id="task-description"
                  className="text-area"
                  placeholder="Short context helps you start quickly."
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!newTitle.trim()}
              >
                Add task
              </button>
            </div>
          </form>
        </section>

        <section
          className="card card-controls"
          aria-label="Task filters and search"
        >
          <div className="filters">
            <div className="filter-buttons" role="tablist" aria-label="Filter tasks">
              <button
                type="button"
                className={`btn btn-filter ${
                  filter === 'all' ? 'btn-filter-active' : ''
                }`}
                onClick={() => handleFilterChange('all')}
                role="tab"
                aria-selected={filter === 'all'}
              >
                All
              </button>
              <button
                type="button"
                className={`btn btn-filter ${
                  filter === 'active' ? 'btn-filter-active' : ''
                }`}
                onClick={() => handleFilterChange('active')}
                role="tab"
                aria-selected={filter === 'active'}
              >
                Active
              </button>
              <button
                type="button"
                className={`btn btn-filter ${
                  filter === 'completed' ? 'btn-filter-active' : ''
                }`}
                onClick={() => handleFilterChange('completed')}
                role="tab"
                aria-selected={filter === 'completed'}
              >
                Completed
              </button>
            </div>
            <div className="search-container">
              <label className="visually-hidden" htmlFor="task-search">
                Search tasks
              </label>
              <input
                id="task-search"
                type="search"
                className="text-input search-input"
                placeholder="Search by name or notes"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="controls-footer">
            <p className="task-count" aria-live="polite">
              {tasks.length === 0
                ? 'No tasks yet'
                : `${tasks.filter(t => !t.isCompleted).length} active · ${
                    tasks.filter(t => t.isCompleted).length
                  } completed`}
            </p>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={clearCompleted}
              disabled={!hasCompletedTasks}
            >
              Clear completed
            </button>
          </div>
        </section>

        <section
          className="card card-list"
          aria-labelledby="task-list-heading"
        >
          <h2 id="task-list-heading" className="section-title">
            Tasks
          </h2>
          {visibleTasks.length === 0 ? (
            <div className="empty-state" role="status" aria-live="polite">
              <p className="empty-title">
                {tasks.length === 0
                  ? 'You have no tasks yet.'
                  : 'No tasks match your current filters.'}
              </p>
              <p className="empty-body">
                {tasks.length === 0
                  ? 'Create your first task above to get started.'
                  : 'Try changing the filter or clearing the search.'}
              </p>
            </div>
          ) : (
            <ul className="task-list" aria-label="Tasks">
              {visibleTasks.map(task => {
                const isEditing = editingId === task.id;
                return (
                  <li
                    key={task.id}
                    className={`task-item ${
                      task.isCompleted ? 'task-completed' : ''
                    }`}
                  >
                    <div className="task-main">
                      <div className="task-checkbox">
                        <input
                          id={`task-checkbox-${task.id}`}
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() =>
                            handleToggleTaskCompletion(task.id)
                          }
                          aria-checked={task.isCompleted}
                        />
                      </div>
                      <div className="task-content">
                        {isEditing ? (
                          <form
                            className="task-edit-form"
                            onSubmit={submitEdit}
                          >
                            <label
                              className="visually-hidden"
                              htmlFor={`edit-title-${task.id}`}
                            >
                              Edit task title
                            </label>
                            <input
                              id={`edit-title-${task.id}`}
                              ref={editTitleInputRef}
                              type="text"
                              className="text-input text-input-inline"
                              value={editingTitle}
                              onChange={e =>
                                setEditingTitle(e.target.value)
                              }
                              aria-required="true"
                            />
                            <label
                              className="visually-hidden"
                              htmlFor={`edit-description-${task.id}`}
                            >
                              Edit task notes
                            </label>
                            <textarea
                              id={`edit-description-${task.id}`}
                              className="text-area text-area-inline"
                              rows={2}
                              value={editingDescription}
                              onChange={e =>
                                setEditingDescription(e.target.value)
                              }
                            />
                            <div className="task-edit-actions">
                              <button
                                type="submit"
                                className="btn btn-primary btn-xs"
                                disabled={!editingTitle.trim()}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost btn-xs"
                                onClick={cancelEditing}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <label
                              className="task-title"
                              htmlFor={`task-checkbox-${task.id}`}
                            >
                              {task.title}
                            </label>
                            {task.description ? (
                              <p className="task-description">
                                {task.description}
                              </p>
                            ) : null}
                            <p className="task-meta">
                              Added{' '}
                              {new Date(task.createdAt).toLocaleString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {!isEditing && (
                      <div className="task-actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() => startEditingTask(task)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-xs"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
