import { Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { Order } from '../entities/order.entity';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger('TicketsService');

  async generateTicket(order: Order): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      // Usamos el constructor de PDFDocument de forma segura para TS
      const PDFDoc = PDFDocument as any;
      const doc = new PDFDoc({
        size: [226, 600],
        margins: { top: 20, bottom: 20, left: 10, right: 10 },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(err));

      // --- Encabezado ---
      doc
        .fontSize(12)
        .text(order.tenant?.businessName?.toUpperCase() || 'BBBUSINESS', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(8)
        .text(`FECHA: ${new Date(order.createdAt).toLocaleString()}`, { align: 'left' })
        .text(`ORDEN: #${order.id.toString().padStart(5, '0')}`, { align: 'left' })
        .text(`CLIENTE: ${order.customer?.username || 'GUESTRO'}`, { align: 'left' })
        .moveDown();

      if (order.orderReference) {
        doc.text(`REF: ${order.orderReference}`, { align: 'left' }).moveDown();
      }

      doc.text('-------------------------------------------', { align: 'center' }).moveDown(0.5);

      // --- Detalles de Productos ---
      doc.fontSize(8);
      order.orderItems?.forEach((item) => {
        const productName = item.product?.name || 'Producto';
        const line = `${item.quantity} x ${productName}`;
        const price = `$${parseFloat(item.subtotal.toString()).toFixed(2)}`;
        
        const currentY = doc.y;
        doc.text(line, { width: 150 });
        doc.text(price, 10, currentY, { align: 'right', width: 206 });
        doc.moveDown(0.5);
      });

      doc.moveDown(0.5);
      doc.text('-------------------------------------------', { align: 'center' }).moveDown(0.5);

      // --- Totales ---
      doc.fontSize(10);
      const totalY = doc.y;
      doc.text('TOTAL:', { bold: true });
      doc.text(`$${parseFloat(order.totalAmount.toString()).toFixed(2)}`, 10, totalY, {
        align: 'right',
        width: 206,
      });

      if (order.amountReceived) {
        doc.moveDown(0.5);
        doc.fontSize(8);
        const receivedY = doc.y;
        doc.text('RECIBIDO:');
        doc.text(`$${parseFloat(order.amountReceived.toString()).toFixed(2)}`, 10, receivedY, {
          align: 'right',
          width: 206,
        });

        doc.moveDown(0.2);
        const changeY = doc.y;
        doc.text('CAMBIO:');
        doc.text(`$${parseFloat(order.changeGiven.toString()).toFixed(2)}`, 10, changeY, {
          align: 'right',
          width: 206,
        });
      }

      doc.moveDown(1.5);

      // --- Código QR ---
      try {
        const qrData = `ORDEN:${order.qrToken}`;
        const qrImage = await QRCode.toDataURL(qrData);
        doc.image(qrImage, (226 - 80) / 2, doc.y, { width: 80 });
        doc.moveDown(0.5);
      } catch (err) {
        this.logger.error('Error generando QR para ticket', err);
      }

      doc
        .fontSize(7)
        .text('¡Gracias por su visita!', { align: 'center' })
        .moveDown(0.5)
        .text('Scanea el QR para ver tu pedido online', { align: 'center' });

      doc.end();
    });
  }
}
