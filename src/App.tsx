import React, { useRef } from "react";
import { format, getYear, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
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
  IonDatetime,
  IonButtons,
  IonModal,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import "./style.css";
import { IonInputCustomEvent, InputChangeEventDetail } from "@ionic/core";
import { useState } from "react";
import { nanoid } from "nanoid";
import { calendarOutline } from "ionicons/icons";
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
      todoDate: "2022/10/10(月) ",
    },
    {
      id: "2",
      content: "二つ目の内容",
      boolean: true,
      isDone: true,
      todoDate: "2022/10/13(木)",
    },
  ]);
  // 入力ホーム
  const [input, setInput] = useState<string>("");
  const [date, setDate] = useState<string>("");

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
      todoDate: date,
    };

    setTodos((prevState) => [...prevState, newTodo]);
    setInput("");
  };

  // 消去
  const handleDelete = (id: string) => {
    const newState = todos.filter((todo) => todo.id !== id);
    setTodos(newState);
  };
  // const handleAllDelete = () => {
  //   setTodos([]);
  // };
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }
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
              <IonButtons slot="end" className="calendar" id="open-modal">
                <IonButton id="open-modal" slot="end" className="calendar">
                  <IonIcon
                    className="calendar"
                    icon={calendarOutline}
                  ></IonIcon>
                </IonButton>
              </IonButtons>
              <IonModal id="calendar" ref={modal} trigger="open-modal">
                <IonDatetime
                  // presentation="date"
                  showDefaultButtons={true}
                  onIonChange={(e) => {
                    const newValue = e.detail.value;
                    if (newValue === null || newValue === undefined) {
                      return;
                    }
                    if (typeof newValue === "string") {
                      console.log(
                        format(parseISO(newValue), "yyyy/M/d(E) HH:mm", {
                          locale: ja,
                        })
                      );
                      setDate(
                        format(parseISO(newValue), "yyyy/M/d(E)", {
                          locale: ja,
                        })
                      );
                    }
                  }}
                ></IonDatetime>
              </IonModal>
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
            <IonListHeader color="medium">
              <IonLabel>TODO一覧</IonLabel>
              <IonLabel color="light">
                <div className="dateDisplay">いつまでに</div>
              </IonLabel>
              <div>
                <IonSelect interface="popover" placeholder="並び替え">
                  <IonSelectOption value="up">昇順</IonSelectOption>
                  <IonSelectOption value="down">降順</IonSelectOption>
                </IonSelect>
              </div>
              {/* <div>
                <IonButton className="allDelete" size="default">
                  並び替え
                </IonButton>
              </div> */}
            </IonListHeader>
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
                    disabled={todo.isDone}
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
                      // textDecoration: todo.isDone ? "line-through  " : "",
                      color: todo.isDone ? "gray" : "",
                    }}
                  />
                  <IonLabel color="medium">
                    <div className="date">{todo.todoDate.toLocaleString()}</div>
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
