import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function App() {
  const [todo, setTodo] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    GetTodos();
    console.log(todo);
  }, []);

  const GetTodos = () => {
    axios(API_BASE + '/todo')
      .then((res) => {
        setTodo(res.data);
      })
      .catch(() => {
        console.error();
      });
  };

  const completeTodo = async (id) => {
    const data = await axios(API_BASE + '/todo/complete/' + id).then(
      (res) => res.data
    );
    setTodo((todo) =>
      todo.map((todos) => {
        if (todos._id === data._id) {
          todos.complete = data.complete;
        }

        return todos;
      })
    );
  };

  const deleteTodo = async (id) => {
    const data = await axios(API_BASE + '/todo/delete/' + id, {
      method: 'DELETE',
    })
      .then((res) => res.data)
      .catch(() => console.error());
    setTodo((todo) => todo.filter((todos) => todos._id !== data._id));
  };

  const addTodo = async (id) => {
    const data = await fetch(API_BASE + '/todo/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());

    setTodo([...todo, data]);
    setPopupActive(false);
    setNewTodo('');
  };

  return (
    <div className="App">
      <h1>Welcome,Ananth</h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todo.map((todos) => (
          <div
            className={'todo' + (todos.complete ? ' is-complete' : '')}
            onClick={() => {
              completeTodo(todos._id);
            }}
            key={todos.id}
          >
            <div className="checkbox"></div>
            <div className="text">{todos.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todos._id)}>
              X
            </div>
          </div>
        ))}
      </div>
      <div
        className="addPopup"
        onClick={() => {
          setPopupActive(true);
        }}
      >
        +
      </div>
      {popupActive ? (
        <div className="popup">
          <div
            className="closepopup"
            onClick={() => {
              setPopupActive(false);
            }}
          >
            X
          </div>
          <div className="content">
            <h3> Add Task</h3>
            <input
              type="text"
              className="addTodoInput"
              onChange={(e) => {
                setNewTodo(e.target.value);
              }}
              value={newTodo}
            />
            <button className="button" onClick={addTodo}>
              Create Task
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
