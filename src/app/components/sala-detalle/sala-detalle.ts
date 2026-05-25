import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MensajeService } from '../../services/mensaje.service';
import { GaleriaService } from '../../services/galeria.service';
import { Votacion } from '../votacion/votacion';
import { HeaderComponent } from '../header/header';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-sala-detalle',
  templateUrl: './sala-detalle.html',
  styleUrl: './sala-detalle.css',
  imports: [CommonModule, FormsModule, RouterModule, Votacion]
})
export class SalaDetalleComponent implements OnInit {

  salaId!: number;
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  vistaActual: string = 'muro';
  miUsuarioId: number | null = null;
  // --- Mensajes de estado ---
  mensajeError: string = '';
  mensajeExito: string = '';
@ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  // --- Variables para la Pizarra Nativa ---
  @ViewChild('canvasPizarra') canvasRef!: ElementRef<HTMLCanvasElement>;
  private cx!: CanvasRenderingContext2D;
  colorPizarra: string = '#000000';
  grosorPincel: number = 5;
  dibujando: boolean = false;

  // --- Galería ---
  imagenesGaleria: any[] = [];
  imagenPrevia: string | null = null;
  subiendo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private mensajeService: MensajeService,
    private galeriaService: GaleriaService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.salaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarHistorial();
    this.cargarGaleria();
    this.miUsuarioId = this.authService.obtenerIdUsuarioLogueado();
  }

  // --- Lógica del Muro ---
  cargarHistorial() {
    this.mensajeService.obtenerHistorial(this.salaId).subscribe({
      next: (historial) => {
        this.mensajes = historial;
        this.hacerScrollHaciaAbajo();
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

  hacerScrollHaciaAbajo() {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
    }, 50); // 50 milisegundos dan tiempo a Angular a pintar el HTML
  }

  // --- Lógica de la Pizarra (Nativa) ---
  inicializarPizarra() {
    if (!this.canvasRef) return;
    const canvasEl = this.canvasRef.nativeElement;
    const contenedor = canvasEl.parentElement;

    if (contenedor) {
      canvasEl.width = contenedor.clientWidth;
      canvasEl.height = contenedor.clientHeight || 400;
    }

    this.cx = canvasEl.getContext('2d')!;
    this.cx.lineCap = 'round';
    this.cx.lineJoin = 'round';

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

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

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

  // --- Lógica de Galería (Fotos y Dibujos) ---
  cargarGaleria() {
    this.galeriaService.obtenerImagenes(this.salaId).subscribe({
      next: (imgs) => {
        this.imagenesGaleria = imgs;
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.mensajeError = 'La imagen es demasiado grande. Máximo 5MB.';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrevia = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  cancelarSubida(): void {
    this.imagenPrevia = null;
    this.mensajeError = '';
  }

  subirFoto(): void {
    if (!this.imagenPrevia) return;
    
    this.subiendo = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const nuevaImagen = {
      imagenBase64: this.imagenPrevia,
      sala: { id: this.salaId }
    };

    this.galeriaService.subirImagen(nuevaImagen).subscribe({
      next: () => {
        this.mensajeExito = '¡Foto publicada!';
        this.imagenPrevia = null; 
        this.subiendo = false;
        this.cargarGaleria(); 
      },
      error: (err) => {
        this.mensajeError = 'Error al subir la imagen.';
        this.subiendo = false;
        console.error('Error al subir foto', err);
        this.cdr.detectChanges();
      }
    });
  }

  // --- Lógica de Pantalla Completa ---
  imagenSeleccionada: string | null = null;

  abrirImagen(base64: string): void {
    this.imagenSeleccionada = base64;
  }

  cerrarImagen(): void {
    this.imagenSeleccionada = null;
  }
}