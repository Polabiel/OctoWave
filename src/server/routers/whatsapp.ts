import { router, publicProcedure } from '../trpc';
import { prisma } from '../prisma';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Contact,
} from 'baileys';
import { Boom } from '@hapi/boom';
import { z } from 'zod';

const whatsappRouter = router({
  generateQrCode: publicProcedure
    .output(z.object({ qrCode: z.string() }))
    .mutation(async () => {
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

        sock.ev.on('creds.update', async (creds) => {
          await saveCreds();
          const sessionData = JSON.stringify(creds, (key, value) => {
            if (typeof value === 'bigint') {
              return value.toString();
            }
            return value;
          });
          await prisma.whatsAppSession.create({
            data: {
              sessionData,
              user: {
                connect: {
                  id: '1', // Replace with actual user ID from your authentication context
                },
              },
            },
          });
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
