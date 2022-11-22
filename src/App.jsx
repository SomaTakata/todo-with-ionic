import React, { useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
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
  IonCheckbox,
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
  useEffect(() => {
    const todosCollectionRef = collection(db, "todos");
    const unsub = onSnapshot(todosCollectionRef, (querySnapshot) => {
      setTodos(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsub;
  }, []);

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

  // 　チェック
  const handleChecked = async (e, id) => {
    const newValue = e.detail.checked;
    if (newValue === null || newValue === undefined) {
      return;
    }
    setTodos((prevTodos) => {
      const newTodos = prevTodos.map((prevTodo) => {
        if (id === prevTodo.id) {
          return {
            ...prevTodo,
            isDone: newValue,
          };
        }
        return prevTodo;
      });
      return newTodos;
    });
    const userDocumentRef = doc(db, "todos", id);
    console.log(userDocumentRef);
    await updateDoc(userDocumentRef, {
      isDone: newValue,
    });
  };

  // 編集
  const handleEdit = async (e, id) => {
    const newValue = e.detail.value;
    if (newValue === null || newValue === undefined) {
      return;
    }
    setTodos((prevTodos) => {
      const newTodos = prevTodos.map((prevTodo) => {
        if (id === prevTodo.id) {
          return {
            ...prevTodo,
            content: newValue,
          };
        }
        return prevTodo;
      });
      return newTodos;
    });
    const userDocumentRef = doc(db, "todos", id);
    console.log(userDocumentRef);
    await updateDoc(userDocumentRef, {
      content: newValue,
    });
  };

  // 送信
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newTodo = {
      id: nanoid(),
      content: input,
      isDone: false,
      todoDate: date,
    };
    setTodos((prevState) => [...prevState, newTodo]);
    setInput("");
    const usersCollectionRef = collection(db, "todos");
    const documentRef = await addDoc(usersCollectionRef, newTodo);
    console.log(documentRef);
  };

  // モーダル
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

  // 消去
  const deleteTodo = async (id) => {
    const newState = todos.filter((todos) => todos.id !== id);
    setTodos(newState);
    console.log(id);
    const userDocumentRef = doc(db, "todos", id);
    console.log(userDocumentRef);
    await deleteDoc(userDocumentRef);
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
            </IonListHeader>
            {filteredTodo.map((todo, index) => {
              return (
                <IonItem key={todo.id} className="border">
                  <IonCheckbox
                    checked={todo.isDone}
                    onIonChange={(e) => {
                      handleChecked(e, todo.id);
                    }}
                  />
                  <IonInput
                    className="text"
                    type="text"
                    disabled={todo.isDone}
                    value={todo.content}
                    onIonChange={(e) => {
                      handleEdit(e, todo.id);
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
                      deleteTodo(todo.id);
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
