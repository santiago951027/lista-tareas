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

  if (taskName === "") {
    mostrarModal("❌ Por favor escribe una tarea.");
    return;
  }

  const nuevaTarea = new Task(taskName);
  tareas.push(nuevaTarea);
  guardarTareasEnLocalStorage(tareas);
  mostrarTareas();
  input.value = "";
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
