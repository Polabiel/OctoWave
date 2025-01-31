import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '../prisma';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Contact,
} from 'baileys';
import { Boom } from '@hapi/boom';

const whatsappRouter = router({
  generateQrCode: publicProcedure.mutation(async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    let sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    });

    return new Promise<{ qrCode: string }>((resolve) => {
      sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;
          if (shouldReconnect) {
            sock = makeWASocket({
              auth: state,
              printQRInTerminal: true,
            });
          }
        } else if (connection === 'open') {
          console.log('opened connection');
        }
        if (qr) {
          resolve({ qrCode: qr });
        }
      });

      sock.ev.on('creds.update', saveCreds);
    });
  }),

  authenticate: publicProcedure.mutation(async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    let sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    });

    return new Promise<{ userData: Contact }>((resolve) => {
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;
          if (shouldReconnect) {
            sock = makeWASocket({
              auth: state,
              printQRInTerminal: true,
            });
          }
        } else if (connection === 'open') {
          console.log('opened connection');
        }
      });

      sock.ev.on('creds.update', saveCreds);

      sock.ev.on('connection.update', async (update) => {
        const { connection } = update;
        if (connection === 'open') {
          const userData = sock.user;
          if (!userData) throw new Error('User data not available');
          await prisma.whatsAppSession.create({
            data: {
              userId: userData.id,
              sessionData: JSON.stringify(state),
            },
          });
          resolve({ userData });
        }
      });
    });
  }),

  getSession: publicProcedure.query(async () => {
    const session = await prisma.whatsAppSession.findFirst();
    if (session) {
      return { userData: JSON.parse(session.sessionData) };
    }
    return null;
  }),
});

export { whatsappRouter };
