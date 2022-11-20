import React, { useEffect, useRef } from "react";
import { format, getYear, parseISO } from "date-fns";
import { id, ja } from "date-fns/locale";
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
import { useState } from "react";
import { nanoid } from "nanoid";
import { calendarOutline } from "ionicons/icons";
setupIonicReact();

function App() {
  const [todos, setTodos] = useState([]);
  // JSON.parse(localStorage.getItem("todos") || "null")
  useEffect(() => {
    if (localStorage.getItem("todos") !== null) {
      setTodos(JSON.parse(localStorage.getItem("todos")));
    }
  }, []);

  // 追加したところ
  // 入力ホーム
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");

  //編集用
  const [editedInput, setEditedInput] = useState("");
  // 文字列の受け取り
  const handleChangeInput = (event) => {
    const value = event.target.value;
    if (value === null || value === undefined) {
      return;
    }
    setInput(value.toString());
  };
  // function getItem(key: string) {
  //   const value = localStorage.getItem(key);
  //   if (value !== null) {
  //     return value;
  //   }
  //   return "";
  // }

  // function removeItem(key: string) {
  //   localStorage.removeItem(key);
  // }

  // function setItem(key: string, value: any) {
  //   localStorage.setItem(key, value);
  // }
  // 編集

  // const handleEdit = (id, content) => {
  //   const newState = todos.map((todo) => {
  //     if (todo.id !== id) return todo;
  //     return { ...todo, content: content };
  //   });

  //   setTodos(newState);
  // };

  // 送信
  const handleSubmit = (event) => {
    event.preventDefault();
    const newTodo = {
      id: nanoid(),
      content: input,
      boolean: true,
      isDone: false,
      todoDate: date,
    };

    setTodos((prevState) => [...prevState, newTodo]);
    setInput("");
    const oldData = JSON.parse(localStorage.getItem("todos"));
    oldData.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(oldData));
  };
  // 消去
  // const handleDelete = (id: string, todo) => {
  //   const newState = todos.filter((todo) => todo.id !== id);
  //   setTodos(newState);
  //   localStorage.setItem("todos", JSON.stringify(newState));
  // };
  // const handleAllDelete = () => {
  //   setTodos([]);
  // };

  const modal = useRef("null");

  function dismiss() {
    modal.current?.dismiss();
  }
  // 検索
  const [filter, setFilter] = useState("all");
  const filteredTodo = todos.filter((todo) => {
    switch (filter) {
      case "all":
        return todo;
      case "checked":
        return todo.isDone;
      case "unchecked":
        return !todo.isDone;
      default:
        return todo;
    }
  });
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
              {/* <IonLabel color="light">
                <div className="dateDisplay">いつまでに</div>
              </IonLabel> */}
              <div>
                <IonSelect
                  interface="popover"
                  defaultValue="all"
                  placeholder="すべてのタスク"
                  onIonChange={(e) => {
                    setFilter(e.target.value);
                    console.log(e.target.value);
                  }}
                >
                  <IonSelectOption value="all">すべてのタスク</IonSelectOption>
                  <IonSelectOption value="unchecked">
                    現在のタスク
                  </IonSelectOption>
                  <IonSelectOption value="checked">
                    完了したタスク
                  </IonSelectOption>
                </IonSelect>
              </div>
              {/* <div>
                <IonButton className="allDelete" size="default">
                  並び替え
                </IonButton>
              </div> */}
            </IonListHeader>
            {/* {todos.map((todo) => { */}
            {filteredTodo.map((todo, index) => {
              return (
                <IonItem key={todo.id} className="border">
                  <IonCheckbox
                    checked={todo.isDone}
                    onIonChange={(e) => {
                      const newValue = e.detail.checked;

                      if (newValue === null || newValue === undefined) {
                        return;
                      }

                      // let strageItem = JSON.parse(
                      //   localStorage.getItem("todos")
                      // );
                      // console.log(index);
                      // localStorage.setItem("todos", JSON.stringify(strageItem));

                      setTodos((prevTodos) => {
                        const newTodos = prevTodos.map((prevTodo) => {
                          if (todo.id === prevTodo.id) {
                            return {
                              ...prevTodo,
                              isDone: newValue,
                            };
                          }
                          // console.log(prevTodo);
                          return prevTodo;
                        });
                        localStorage.setItem("todos", JSON.stringify(newTodos));
                        return newTodos;
                      });
                    }}
                  />
                  <IonInput
                    className="text"
                    type="text"
                    disabled={todo.isDone}
                    value={todo.content}
                    onIonChange={(e) => {
                      e.preventDefault();
                      const newContent = e.detail.value;
                      if (newContent === null || newContent === undefined) {
                        return;
                      }
                      setTodos((prevTodos) => {
                        const newTodos = prevTodos.map((prevTodo) => {
                          if (todo.id === prevTodo.id) {
                            // edit
                            return {
                              ...prevTodo,
                              content: newContent,
                            };
                          }
                          return prevTodo;
                        });
                        localStorage.setItem("todos", JSON.stringify(newTodos));
                        return newTodos;
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
                      const newState = todos.filter(
                        (todos) => todos.id !== todo.id
                      );
                      setTodos(newState);
                      localStorage.setItem("todos", JSON.stringify(newState));
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
