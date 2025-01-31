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

  trpc.whatsapp.authenticate.useMutation({
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#25D366] p-6">
          <h1 className="text-2xl font-bold text-white text-center">
            WhatsApp Authentication
          </h1>
        </div>

        <div className="p-6">
          {authenticated ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Authenticated User Data
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
                <pre className="text-sm text-gray-600">
                  {JSON.stringify(userData, null, 2)}
                </pre>
              </div>
              <button
                onClick={() => refetchSession()}
                className="w-full bg-[#25D366] text-white py-2 px-4 rounded-md hover:bg-[#128C7E] transition-colors duration-200"
              >
                Refresh Session
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              {qrCode ? (
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <QRCodeSVG value={qrCode} size={256} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25D366]"></div>
                </div>
              )}
              <p className="text-gray-600 text-center">
                Scan the QR Code with WhatsApp to authenticate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPage;
