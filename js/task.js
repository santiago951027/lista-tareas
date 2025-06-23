let idContador = 1;

export class Task {
  constructor(name) {
    this.id = idContador++;
    this.name = name;
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
