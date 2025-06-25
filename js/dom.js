import { guardarTareasEnLocalStorage } from './storage.js';

let tareas = [];

export function setTareas(nuevaLista) {
  tareas = nuevaLista;
}
export function mostrarTareas(tareasAMostrar = tareas) {
  const lista = document.getElementById("taskList");
  lista.innerHTML = "";
  
  // 🔃 Ordenar: pendientes primero, completadas después
  const tareasOrdenadas = [...tareasAMostrar].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });
  
  tareasOrdenadas.forEach((tarea) => {
    const li = document.createElement("li");
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarea.completed;
    
    if (tarea.completed) {
      checkbox.disabled = true; // 🔒 Desactiva si ya está completada
    } else {
      checkbox.addEventListener("change", () => {
        checkbox.checked = false; // visualmente lo deja sin marcar mientras se confirma
        
        mostrarConfirmacion("¿Quieres marcar esta tarea como completada?", () => {
          tarea.toggleCompleted();
          guardarTareasEnLocalStorage(tareas);
          mostrarTareas();
          
          // 🎉 Solo lanza confeti si se marcó como completada
          if (tarea.completed) {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        });
      });
    }
    
    const texto = document.createElement("span");
    texto.textContent = tarea.name;
    if (tarea.completed) {
      texto.style.textDecoration = "line-through";
    }
    const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";
    
    if (tarea.completed) {
      botonEditar.disabled = true;
      botonEditar.style.opacity = 0.5;
      botonEditar.style.cursor = "not-allowed";
      botonEditar.title = "No se puede editar una tarea completada";
    } else {
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
    }

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => {
      mostrarConfirmacion("¿Estás seguro de eliminar esta tarea?", () => {
        eliminarTarea(tarea.id);
      });
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

function mostrarConfirmacion(mensaje, callbackAceptar) {
  const modal = document.getElementById("modalConfirmacion");
  const texto = document.getElementById("mensajeConfirmacion");
  const btnSi = document.getElementById("confirmarEliminar");
  const btnNo = document.getElementById("cancelarEliminar");

  texto.textContent = mensaje;
  modal.classList.remove("hidden");
  document.body.classList.add("modal-activo"); // 🔐 bloquear todo

  // Limpiar eventos anteriores
  const nuevoBtnSi = btnSi.cloneNode(true);
  const nuevoBtnNo = btnNo.cloneNode(true);
  btnSi.parentNode.replaceChild(nuevoBtnSi, btnSi);
  btnNo.parentNode.replaceChild(nuevoBtnNo, btnNo);

  nuevoBtnSi.addEventListener("click", () => {
    modal.classList.add("hidden");
    document.body.classList.remove("modal-activo"); // 🔓 desbloquear
    callbackAceptar();
  });

  nuevoBtnNo.addEventListener("click", () => {
    modal.classList.add("hidden");
    document.body.classList.remove("modal-activo"); // 🔓 desbloquear
  });
}

