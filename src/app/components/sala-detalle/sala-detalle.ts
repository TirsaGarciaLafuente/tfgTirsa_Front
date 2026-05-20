import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MensajeService } from '../../services/mensaje.service';
import { GaleriaService } from '../../services/galeria.service';

@Component({
  standalone: true,
  selector: 'app-sala-detalle',
  templateUrl: './sala-detalle.html',
  styleUrl: './sala-detalle.css',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class SalaDetalleComponent implements OnInit {

  salaId!: number;
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  vistaActual: string = 'muro';

  // --- Variables para la Pizarra Nativa ---
  @ViewChild('canvasPizarra') canvasRef!: ElementRef<HTMLCanvasElement>;
  private cx!: CanvasRenderingContext2D;
  colorPizarra: string = '#d4845a';
  grosorPincel: number = 5;
  dibujando: boolean = false;

  // --- Galería ---
  imagenesGaleria: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private mensajeService: MensajeService,
    private galeriaService: GaleriaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.salaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarHistorial();
    this.cargarGaleria();
  }

  // --- Lógica del Muro ---
  cargarHistorial() {
    this.mensajeService.obtenerHistorial(this.salaId).subscribe({
      next: (historial) => {
        this.mensajes = historial;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar mensajes', err)
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    this.mensajeService.enviarMensaje(this.salaId, this.nuevoMensaje).subscribe({
      next: (mensajeGuardado) => {
        this.mensajes.push(mensajeGuardado);
        this.nuevoMensaje = '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al enviar mensaje', err)
    });
  }

  // --- Lógica de Vistas ---
  cambiarVista(nuevaVista: string) {
    this.vistaActual = nuevaVista;
    if (nuevaVista === 'pizarra') {
      setTimeout(() => this.inicializarPizarra(), 50);
    }
  }

  // --- Lógica de la Pizarra (Nativa) ---
  inicializarPizarra() {
    if (!this.canvasRef) return;
    const canvasEl = this.canvasRef.nativeElement;
    const contenedor = canvasEl.parentElement; // Capturamos el <div> que lo envuelve

    // 1. Ajustamos la resolución interna para que coincida con el móvil/PC
    if (contenedor) {
      canvasEl.width = contenedor.clientWidth;
      // Puedes fijar la altura o usar la del contenedor. 400px es buena medida.
      canvasEl.height = contenedor.clientHeight || 400;
    }

    this.cx = canvasEl.getContext('2d')!;
    this.cx.lineCap = 'round';
    this.cx.lineJoin = 'round';

    // Fondo blanco
    this.cx.fillStyle = '#ffffff';
    this.cx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    this.actualizarPincel();
  }

  actualizarPincel() {
    if (this.cx) {
      this.cx.lineWidth = Number(this.grosorPincel);
      this.cx.strokeStyle = this.colorPizarra;
    }
  }

  empezarDibujo(e: MouseEvent | TouchEvent) {
    this.dibujando = true;
    this.cx.beginPath();
    const coords = this.obtenerCoordenadas(e);
    this.cx.moveTo(coords.x, coords.y);
  }

  dibujar(e: MouseEvent | TouchEvent) {
    if (!this.dibujando) return;
    const coords = this.obtenerCoordenadas(e);
    this.cx.lineTo(coords.x, coords.y);
    this.cx.stroke();
  }

  terminarDibujo() {
    this.dibujando = false;
  }

  private obtenerCoordenadas(e: MouseEvent | TouchEvent) {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();

    // Distinguir entre táctil y ratón
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Calcular la relación matemática entre el CSS y los píxeles reales
    const scaleX = canvasEl.width / rect.width;
    const scaleY = canvasEl.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  limpiarPizarra() {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx.fillStyle = '#ffffff';
    this.cx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  }

  // --- Lógica de Galería ---
  cargarGaleria() {
    this.galeriaService.obtenerImagenes(this.salaId).subscribe({
      next: (imgs) => {
        this.imagenesGaleria = imgs;
        this.cdr.detectChanges();
      }
    });
  }
  guardarDibujo() {
    if (!this.canvasRef) return;
    const imagenBase64 = this.canvasRef.nativeElement.toDataURL('image/png');

    const nuevaImagen = {
      imagenBase64: imagenBase64,
      sala: { id: this.salaId },
    };

    this.galeriaService.subirImagen(nuevaImagen).subscribe({
      next: () => {
        this.cargarGaleria();
        this.limpiarPizarra();
      },
      error: (err) => console.error('Error al guardar dibujo', err)
    });
  }
}