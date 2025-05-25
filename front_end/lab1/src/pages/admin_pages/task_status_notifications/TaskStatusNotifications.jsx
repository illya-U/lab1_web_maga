import { useEffect, useState } from "react";
import { getAuthData } from "../../../common/AuthService.jsx";
import "./styles/TaskStatusNotifcations.css";

export default function TaskStatusNotifications() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthData();

    if (!token) {
      setError("Користувач не авторизований");
      return;
    }

    const ws_socket = import.meta.env.VITE_DJANGO_WS_HOST

    const wsUrl = `${ws_socket}task_status/?token=${token.replace("Token ", "")}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("✅ Підключено до WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "initial_statuses") {
          setTasks(data.tasks);
        } else if (data.task_id) {
          setTasks((prev) => {
            const existingIndex = prev.findIndex((t) => t.task_id === data.task_id);
            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = { ...updated[existingIndex], ...data };
              return updated;
            } else {
              return [data, ...prev];
            }
          });
        }
      } catch (e) {
        console.error("❌ Помилка обробки повідомлення:", e);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket помилка з'єднання:", err);
      setError("У вас немає прав доступу або помилка з'єднання");
    };

    socket.onclose = () => {
      console.warn("🔌 WebSocket з'єднання закрите");
    };

    return () => {
        if (import.meta.env.DEV) return
        socket.close();
    };
  }, []);

  if (error) return <div className="task-error">{error}</div>;

  return (
    <div className="task-table-container">
      <h2>Статуси задач</h2>
      <table className="task-table">
        <thead>
          <tr>
            <th>Назва операції</th>
            <th>Час виконання (сек)</th>
            <th>Статус</th>
            <th>Завершено</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.task_id}>
              <td>{task.name}</td>
              <td>{task.execution_time}</td>
              <td>
                <span className={`status ${task.status}`}>
                  {task.status}
                </span>
              </td>
              <td>{task.end_time ? new Date(task.end_time).toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
