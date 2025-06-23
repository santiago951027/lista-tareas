import { Task, actualizarContadorID } from './task.js';

export function guardarTareasEnLocalStorage(tareas) {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

export function cargarTareasDesdeLocalStorage(tareas) {
  const tareasGuardadas = localStorage.getItem("tareas");
  if (tareasGuardadas) {
    const tareasParseadas = JSON.parse(tareasGuardadas);
    tareasParseadas.forEach((t) => {
      const tarea = new Task(t.name);
      tarea.id = t.id;
      tarea.completed = t.completed;
      tareas.push(tarea);
    });

    if (tareas.length > 0) {
      const nuevoId = Math.max(...tareas.map((t) => t.id)) + 1;
      actualizarContadorID(nuevoId);
    }
  }
}
