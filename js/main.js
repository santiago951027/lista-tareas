import { Task } from './task.js';
import { guardarTareasEnLocalStorage, cargarTareasDesdeLocalStorage } from './storage.js';
import {
  mostrarTareas,
  eliminarTarea,
  filtrarTareas,
  actualizarContadorPendientes,
  mostrarModal,
  cerrarModal,
  setTareas
} from './dom.js';

const tareas = [];

setTareas(tareas);
cargarTareasDesdeLocalStorage(tareas);
mostrarTareas();

document.getElementById("addTaskBtn").addEventListener("click", () => {
  const input = document.getElementById("taskInput");
  const taskName = input.value.trim();
  const categoria = document.getElementById("taskCategory").value;
  const fecha = document.getElementById("taskDate").value;

  if (taskName === "") {
    mostrarModal("❌ Por favor escribe una tarea.");
    return;
  }

  if (categoria === "sin-categoria") {
    mostrarModal("❌ Debes seleccionar una categoría válida.");
    return;
  }

  const nuevaTarea = new Task(taskName, categoria, fecha);
  tareas.push(nuevaTarea);
  guardarTareasEnLocalStorage(tareas);
  mostrarTareas();

  // 🧹 Limpiar campos del formulario
  input.value = "";
  document.getElementById("taskDate").value = "";              // ✅ Limpia la fecha
  document.getElementById("taskCategory").value = "sin-categoria"; // Reinicia el select
});

document.getElementById("showAll").addEventListener("click", () => {
  mostrarTareas();
});

document.getElementById("showCompleted").addEventListener("click", () => {
  const completadas = filtrarTareas(true);
  mostrarTareas(completadas);
});

document.getElementById("showPending").addEventListener("click", () => {
  const pendientes = filtrarTareas(false);
  mostrarTareas(pendientes);
});

document.getElementById("cerrarModal").addEventListener("click", cerrarModal);
