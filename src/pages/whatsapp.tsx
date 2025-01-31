import { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { QRCodeSVG } from 'qrcode.react';

const WhatsAppPage = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const { data: sessionData, refetch: refetchSession } =
    trpc.whatsapp.getSession.useQuery();
  const { mutate: generateQrCode } = trpc.whatsapp.generateQrCode.useMutation({
    onSuccess: (data) => {
      setQrCode(data.qrCode);
    },
  });

  const { mutate: authenticate } = trpc.whatsapp.authenticate.useMutation({
    onSuccess: (data) => {
      setAuthenticated(true);
      setUserData(data.userData);
    },
  });

  useEffect(() => {
    if (sessionData) {
      setAuthenticated(true);
      setUserData(sessionData.userData);
    } else {
      generateQrCode();
    }
  }, [sessionData, generateQrCode]);

  return (
    <div>
      <h1>WhatsApp Authentication</h1>
      {authenticated ? (
        <div>
          <h2>Authenticated User Data</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      ) : (
        <div>
          <h2>Scan the QR Code</h2>
          {qrCode && <QRCodeSVG value={qrCode} />}
        </div>
      )}
    </div>
  );
};

export default WhatsAppPage;
