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
} from "@ionic/react";
import { IonInputCustomEvent, InputChangeEventDetail } from "@ionic/core";
import { useState } from "react";
import { nanoid } from "nanoid";
import zh from "@mobiscroll/react/dist/src/i18n/zh";

setupIonicReact();
interface Todo {
  id: string;
  content: string;
  boolean: boolean;
}
interface editTodo {
  content: string;
  id: string;
}

// interface TodoLostItemProps {
//   todo: Todo;
// }

// const TodoList = ({ todo }: TodoLostItemProps) => {
//   <IonItemSliding key={todo.id}>
//     <IonItem>
//       <IonLabel>{todo.content}</IonLabel>
//     </IonItem>
//     <IonItemOptions side="end">
//       <IonItemOption color="medium">編集</IonItemOption>
//       <IonItemOption
//         color="danger"
//         onClick={(event) => {
//           setTodos((prevTodos) =>
//             prevTodos.filter(
//               (prevTodo) => prevTodo.id !== todo.id
//               //prevTodoとtodoの何が違うのか。
//             )
//           );
//         }}
//       >
//         削除
//       </IonItemOption>
//     </IonItemOptions>
//   </IonItemSliding>;
// };

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      content: "todoの内容",
      id: "1",
      boolean: true,
    },
    {
      id: "2",
      content: "二つ目の内容",
      boolean: true,
    },
  ]);
  const [input, setInput] = useState<string>("");

  //入力ホーム
  const [editedInput, setEditedInput] = useState<string>("");
  const handleChangeInput = (
    event: IonInputCustomEvent<InputChangeEventDetail>
  ): void => {
    const value = event.target.value;
    if (value === null || value === undefined) {
      return;
    }
    setInput(value.toString());
  };

  const handleEditInput = (
    event: IonInputCustomEvent<InputChangeEventDetail>
  ): void => {
    const value = event.target.value;
    if (value === null || value === undefined) {
      return;
    }
    setEditedInput(value.toString());
  };
  // 送信
  const handleSubmitForm: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const newTodo: Todo = {
      id: nanoid(),
      content: input,
      boolean: true,
    };

    setTodos((prevState) => [...prevState, newTodo]);
    setInput("");
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
          <form onSubmit={handleSubmitForm}>
            <IonItem>
              <IonLabel position="floating">TODOの内容を入力</IonLabel>
              <IonInput
                placeholder="腕足せを二十回する"
                onIonChange={handleChangeInput}
                value={input}
              />

              <IonButton
                item-right
                slot="end"
                disabled={input === ""}
                type="submit"
              >
                追加
              </IonButton>
            </IonItem>
          </form>
          <IonList className="ion-padding-vertical">
            <IonListHeader>TODO一覧</IonListHeader>
            {todos.map((todo) => {
              return (
                <form
                  key={todo.id}
                  onSubmit={(event) => {
                    event.preventDefault();
                    setTodos((prevTodo) =>
                      prevTodo.map((prev) => {
                        if (prev.id === todo.id) {
                          return {
                            id: todo.id,
                            content: editedInput,
                            boolean: true,
                          };
                        } else {
                          return prev;
                        }
                      })
                    );
                    setEditedInput("");
                  }}
                >
                  <IonItemSliding>
                    <IonItem>
                      <IonLabel>{todo.content}</IonLabel>
                      <IonItem>
                        <IonInput
                          disabled={todo.boolean}
                          placeholder="編集用"
                          onIonChange={handleEditInput}
                          // value={todos.map((prev) => {
                          //   if (prev.id === todo.id) {
                          //     return editedInput;
                          //   } else {
                          //     return todo;
                          //   }
                          // })}
                          value={editedInput}
                        />
                      </IonItem>
                    </IonItem>
                    <IonItemOptions side="end">
                      <IonItemOption
                        type="submit"
                        onClick={(event) => {
                          setTodos((prevTodo) =>
                            prevTodo.map((prev) => {
                              if (prev.id === todo.id) {
                                return {
                                  id: todo.id,
                                  content: todo.content,
                                  boolean: false,
                                };
                              } else {
                                return prev;
                              }
                            })
                          );
                        }}
                      >
                        編集
                      </IonItemOption>
                      <IonItemOption
                        color="danger"
                        onClick={(event) => {
                          setTodos((prevTodos) =>
                            prevTodos.filter(
                              (prevTodo) => prevTodo.id !== todo.id
                              //prevTodoとtodoの何が違うのか。
                            )
                          );
                        }}
                      >
                        削除
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                </form>
              );
            })}
          </IonList>
        </IonContent>
      </IonPage>
    </IonApp>
  );
}

export default App;
