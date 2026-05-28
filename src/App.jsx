import React from "react";

export default function App() {
  const [contacts, setContacts] = React.useState([]);
  const [rawInput, setRawInput] = React.useState("");
  const [downloadUrl, setDownloadUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("iphone_contacts.vcf");

  const parseContacts = () => {
    const lines = rawInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const parsed = lines.map((line, index) => {
      const parts = line.split(",");

      if (parts.length >= 2) {
        return {
          name: parts[0].trim(),
          phone: parts[1].trim(),
        };
      }

      return {
        name: `Contact ${String(index + 1).padStart(3, "0")}`,
        phone: line.trim(),
      };
    });

    setContacts(parsed);
    generateVCF(parsed);
  };

  const generateVCF = (data) => {
    let vcfContent = "";

    data.forEach((contact) => {
      vcfContent += `BEGIN:VCARD\n`;
      vcfContent += `VERSION:3.0\n`;
      vcfContent += `FN:${contact.name}\n`;
      vcfContent += `TEL;TYPE=CELL:${contact.phone}\n`;
      vcfContent += `END:VCARD\n`;
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
          <h1 className="text-4xl font-bold mb-3">
            iPhone Contact Sync Web App
          </h1>

          <p className="text-gray-600 mb-8">
            Paste phone numbers or upload CSV/TXT to generate iPhone-ready VCF contacts.
          </p>

          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder={`0909123456\n0911222333\n\nOR\n\nNguyen Van A,0909123456`}
            className="w-full h-72 border rounded-2xl p-4 font-mono text-sm mb-4"
          />

          <div className="flex gap-4 mb-6">
            <button
              onClick={parseContacts}
              className="bg-black text-white rounded-2xl px-6 py-3"
            >
              Generate Contacts
            </button>

            <button
              onClick={downloadVCF}
              disabled={!downloadUrl}
              className="border rounded-2xl px-6 py-3"
            >
              Download VCF
            </button>
          </div>

          <div className="border rounded-2xl overflow-hidden">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="flex justify-between p-4 border-b"
              >
                <span>{contact.name}</span>
                <span>{contact.phone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
