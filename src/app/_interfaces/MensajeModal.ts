export interface MensajeModal {
    id: string;
    titulo: string;
    mensaje: string[]; // Cada posicion representa un parrafo en mensaje del modal.
    mostrarSpinner?: boolean;
    mostrarBotonCerrar?: boolean;
    mostrarAceptar?: boolean;
    mostrarCancelar?: boolean;
}
