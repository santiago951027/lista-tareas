let idContador = 1;

export class Task {
  constructor(name, category = "sin-categoria") {
    this.id = idContador++;
    this.name = name;
    this.category = category;
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }
}

export function actualizarContadorID(nuevoValor) {
  idContador = nuevoValor;
}

export function obtenerContadorID() {
  return idContador;
}
