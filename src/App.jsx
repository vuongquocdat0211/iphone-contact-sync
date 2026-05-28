export default function ContactVCFGenerator() {
  const [contacts, setContacts] = React.useState([]);
  const [rawInput, setRawInput] = React.useState("");
  const [downloadUrl, setDownloadUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("iphone_contacts.vcf");

  const parseContacts = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    const lines = rawInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const parsed = lines.map((line, index) => {
      const parts = line.split(",");

      if (parts.length >= 2) {
        return {
          name: parts[0].trim(),
          phone: parts[1].trim().replace(/\s+/g, ""),
        };
      }

      return {
        name: `Liên hệ ${String(index + 1).padStart(3, "0")}`,
        phone: line.trim().replace(/\s+/g, ""),
      };
    });

    setContacts(parsed);
    generateVCF(parsed);
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      setRawInput(text);
    };

    reader.readAsText(file);
  };

  const generateVCF = (data) => {
    let vcfContent = "";

    data.forEach((contact) => {
      const safeName = contact.name
        .replace(/,/g, "")
        .replace(/;/g, "")
        .trim();

      const safePhone = contact.phone.trim();

      vcfContent += "BEGIN:VCARD\n";
      vcfContent += "VERSION:3.0\n";
      vcfContent += `N:${safeName};;;;\n`;
      vcfContent += `FN:${safeName}\n`;
      vcfContent += `TEL;TYPE=CELL:${safePhone}\n`;
      vcfContent += "END:VCARD\n";
    });

    const blob = new Blob([vcfContent], {
      type: "text/vcard;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
  };

  const downloadVCF = () => {
    if (!downloadUrl) return;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900">
              iPhone Contact Sync Web App
            </h1>
            <p className="text-gray-600 text-lg">
              Paste phone numbers or upload CSV/TXT to generate iPhone-ready VCF contacts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Upload CSV / TXT
                </label>

                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCSVUpload}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Paste Contacts
                </label>

                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder={`Supported formats:\n\n0909123456\n0911222333\n\nOR\n\nNguyen Van A,0909123456\nTran Van B,0911222333`}
                  className="w-full h-96 border rounded-2xl p-4 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-2xl p-6 h-full border">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                  Generate VCF
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Output File Name
                    </label>

                    <input
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full border rounded-xl p-3"
                    />
                  </div>

                  <button
                    onClick={parseContacts}
                    className="w-full bg-black text-white rounded-2xl p-4 text-lg font-semibold hover:opacity-90 transition"
                  >
                    Generate Contacts
                  </button>

                  <button
                    onClick={downloadVCF}
                    disabled={!downloadUrl}
                    className="w-full bg-white border border-black rounded-2xl p-4 text-lg font-semibold disabled:opacity-40"
                  >
                    Download VCF
                  </button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Contacts Preview
                  </h3>

                  <div className="max-h-80 overflow-auto rounded-xl border bg-white">
                    {contacts.length === 0 ? (
                      <div className="p-6 text-gray-500 text-center">
                        No contacts generated yet.
                      </div>
                    ) : (
                      contacts.map((contact, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border-b last:border-b-0"
                        >
                          <div>
                            <div className="font-semibold text-gray-900">
                              {contact.name}
                            </div>
                            <div className="text-gray-600 text-sm">
                              {contact.phone}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-blue-900">
              How to Import to iPhone
            </h2>

            <ol className="list-decimal list-inside space-y-2 text-blue-900">
              <li>Generate and download the VCF file.</li>
              <li>Send the file to your iPhone using AirDrop, Zalo, Email, or iCloud Drive.</li>
              <li>Open the VCF file on iPhone.</li>
              <li>Tap “Add All Contacts”.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
Update App.jsx
