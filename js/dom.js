import { guardarTareasEnLocalStorage } from './storage.js';

let tareas = [];

export function setTareas(nuevaLista) {
  tareas = nuevaLista;
}

export function mostrarTareas(tareasAMostrar = tareas) {
  const lista = document.getElementById("taskList");
  lista.innerHTML = "";

  tareasAMostrar.forEach((tarea) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarea.completed;
    checkbox.addEventListener("change", () => {
      tarea.toggleCompleted();
      guardarTareasEnLocalStorage(tareas);
      mostrarTareas();
    });

    const texto = document.createElement("span");
    texto.textContent = tarea.name;
    if (tarea.completed) {
      texto.style.textDecoration = "line-through";
    }

    const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";

    botonEditar.addEventListener("click", () => {
      const inputEditar = document.createElement("input");
      inputEditar.type = "text";
      inputEditar.value = tarea.name;

      const botonGuardar = document.createElement("button");
      botonGuardar.textContent = "Guardar";

      botonGuardar.addEventListener("click", () => {
        const nuevoNombre = inputEditar.value.trim();
        if (nuevoNombre === "") {
          mostrarModal("❌ El nombre no puede estar vacío.");
          return;
        }

        tarea.name = nuevoNombre;
        guardarTareasEnLocalStorage(tareas);
        mostrarTareas();
      });

      li.innerHTML = "";
      li.appendChild(inputEditar);
      li.appendChild(botonGuardar);
    });

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => {
      eliminarTarea(tarea.id);
    });

    li.appendChild(checkbox);
    li.appendChild(texto);
    li.appendChild(botonEditar);
    li.appendChild(botonEliminar);

    lista.appendChild(li);
  });

  actualizarContadorPendientes();
}

export function eliminarTarea(taskId) {
  const index = tareas.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    tareas.splice(index, 1);
    guardarTareasEnLocalStorage(tareas);
    mostrarTareas();
  }
}

export function filtrarTareas(completadas) {
  return tareas.filter((tarea) => tarea.completed === completadas);
}

export function actualizarContadorPendientes() {
  const contador = document.getElementById("contadorPendientes");
  const pendientes = tareas.filter((t) => !t.completed).length;

  if (pendientes === 0) {
    contador.textContent = "🎉 ¡No tienes tareas pendientes!";
  } else if (pendientes === 1) {
    contador.textContent = "Tienes 1 tarea pendiente";
  } else {
    contador.textContent = `Tienes ${pendientes} tareas pendientes`;
  }
}

export function mostrarModal(mensaje) {
  document.getElementById("modalMensaje").textContent = mensaje;
  document.getElementById("modalError").classList.remove("hidden");
}

export function cerrarModal() {
  document.getElementById("modalError").classList.add("hidden");
}
