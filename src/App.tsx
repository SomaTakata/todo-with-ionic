/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import {
  setupIonicReact,
  IonApp,
  IonPage,
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonList,
  IonInput,
  IonIcon,
  IonListHeader,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItemGroup,
  IonCheckbox,
  IonReorder,
  IonReorderGroup,
  IonVirtualScroll,
  IonCard,
} from "@ionic/react";
import "./style.css";
import { IonInputCustomEvent, InputChangeEventDetail } from "@ionic/core";
import { useState } from "react";
import { nanoid } from "nanoid";

setupIonicReact();
interface Todo {
  id: string;
  content: string;
  boolean: boolean;
  isDone: boolean;
  todoDate: string;
}
interface editTodo {
  content: string;
  id: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      content: "todoの内容",
      id: "1",
      boolean: false,
      isDone: false,
      todoDate: "2022/09/22 11:43:54",
    },
    {
      id: "2",
      content: "二つ目の内容",
      boolean: true,
      isDone: true,
      todoDate: "2022/10/03 11:43:53",
    },
  ]);
  // 入力ホーム
  const [input, setInput] = useState<string>("");

  //編集用
  const [editedInput, setEditedInput] = useState<string>("");
  // 文字列の受け取り
  const handleChangeInput = (
    event: IonInputCustomEvent<InputChangeEventDetail>
  ): void => {
    const value = event.target.value;
    if (value === null || value === undefined) {
      return;
    }
    setInput(value.toString());
  };

  // 編集
  const handleEdit = (id: string, content: string) => {
    const newState = todos.map((todo) => {
      if (todo.id !== id) return todo;
      return { ...todo, content: content };
    });

    setTodos(newState);
  };

  // 送信
  const handleSubmit: React.MouseEventHandler<HTMLIonButtonElement> = (
    event
  ) => {
    event.preventDefault();
    const newTodo: Todo = {
      id: nanoid(),
      content: input,
      boolean: true,
      isDone: false,
      todoDate: new Date().toLocaleString(),
    };

    setTodos((prevState) => [...prevState, newTodo]);
    setInput("");
  };

  // 消去
  const handleDelete = (id: string) => {
    const newState = todos.filter((todo) => todo.id !== id);
    setTodos(newState);
  };
  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>TODO</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ">
          <IonCard>
            <IonItem>
              <IonLabel position="floating">TODOの内容を入力</IonLabel>
              <IonInput
                placeholder="腕足せを二十回する"
                onIonChange={handleChangeInput}
                value={input}
              />

              <IonButton
                item-right
                size="default"
                slot="end"
                className="add"
                disabled={input === ""}
                type="submit"
                onClick={handleSubmit}
              >
                追加
              </IonButton>
            </IonItem>
          </IonCard>
          <IonList className="ion-padding-vertical">
            <IonListHeader color="medium">TODO一覧</IonListHeader>
            {todos.map((todo) => {
              return (
                <IonItem key={todo.id} className="border">
                  <IonCheckbox
                    checked={todo.isDone}
                    onIonChange={(e) => {
                      const newValue = e.detail.checked;

                      if (newValue === null || newValue === undefined) {
                        return;
                      }

                      setTodos((prevTodos) => {
                        return prevTodos.map((prevTodo) => {
                          if (todo.id === prevTodo.id) {
                            return {
                              ...prevTodo,
                              isDone: newValue,
                            };
                          }
                          return prevTodo;
                        });
                      });
                    }}
                  />

                  <IonInput
                    className="text"
                    type="text"
                    value={todo.content}
                    onIonChange={(e) => {
                      const newContent = e.detail.value;

                      if (newContent === null || newContent === undefined) {
                        return;
                      }

                      setTodos((prevTodos) => {
                        return prevTodos.map((prevTodo) => {
                          if (todo.id === prevTodo.id) {
                            // edit
                            return {
                              ...prevTodo,
                              content: newContent,
                            };
                          }

                          return prevTodo;
                        });
                      });
                    }}
                    style={{
                      textDecoration: todo.isDone ? "line-through " : "",
                    }}
                  />
                  <IonLabel class="date" color="medium">
                    {todo.todoDate.toLocaleString()}
                  </IonLabel>

                  <IonButton
                    slot="end"
                    size="default"
                    color="danger"
                    onClick={() => {
                      handleDelete(todo.id);
                    }}
                  >
                    削除
                  </IonButton>
                </IonItem>
              );
            })}
          </IonList>
        </IonContent>
      </IonPage>
    </IonApp>
  );
}

export default App;
