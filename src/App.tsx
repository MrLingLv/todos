import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import { selector, useRecoilValue } from "recoil";
import { Todo } from "./API";
import "./App.css";
import { textChange } from "./atom";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { Content } from "./Content";

const client = generateClient();

const contentState = selector({
  key: "contentState",
  get: (({get})=>{
    const content = get(textChange)
    return content.toUpperCase()
  })
})

async function addTodo(content: string = "default content") {
  const todo = {
    name: content,
    description: `Realtime and Offline (${new Date().toLocaleString()})`,
  };

  return await client.graphql({
    query: createTodo,
    variables: {
      input: todo,
    },
  });
}

async function fetchTodos() {
  try {
    const res = await client.graphql({
      query: listTodos,
    });
    return res.data.listTodos.items;
  } catch (error) {
    console.error("error :>> ", error);
  }
}

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const content = useRecoilValue(contentState)

  useEffect(() => {
    getTodos();
  }, []);

  const handleAddTodo = () => {
    addTodo(content).then(() => getTodos());
  };

  const getTodos = () => {
    fetchTodos().then((data) => {
      if (data) setTodoList(data);
    });
  };

  return (
    <>
      <h1>DEMO TODO LIST</h1>
      <div className="card">
        <Content/>
        <button onClick={handleAddTodo}>ADD TODO</button>
      </div>
      <h3 style={{ textAlign: "center" }}>TODO list</h3>
      <ul>
        {todoList &&
          todoList.map((i, idx) => {
            return (
              <>
                <li>
                  <div className="flex justify-start">
                    <div className="w-10">{++idx}</div>
                    <div>{`${i.name}, ${i.description}`}</div>
                  </div>
                </li>
              </>
            );
          })}
      </ul>
    </>
  );
}

export default App;
