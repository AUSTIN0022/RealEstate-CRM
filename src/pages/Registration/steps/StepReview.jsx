import { Eye } from "lucide-react"

export default function StepReview({ basicInfo, wings, banks, amenities, documents, disbursements, onPreviewDoc }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Review & Submit</h2>

      {/* Basic Info */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-lg">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
          <div><p className="text-gray-600">Project Name</p><p className="font-medium text-gray-900">{basicInfo.projectName}</p></div>
          <div><p className="text-gray-600">Maharera Number</p><p className="font-medium text-gray-900">{basicInfo.mahareraNo}</p></div>
          <div><p className="text-gray-600">Start Date</p><p className="font-medium text-gray-900">{basicInfo.startDate}</p></div>
          <div><p className="text-gray-600">Completion Date</p><p className="font-medium text-gray-900">{basicInfo.completionDate}</p></div>
          <div><p className="text-gray-600">Status</p><p className="font-medium text-gray-900">{basicInfo.status}</p></div>
          <div><p className="text-gray-600">Address</p><p className="font-medium text-gray-900">{basicInfo.address || "-"}</p></div>
        </div>
      </div>

      {/* Wings */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-lg">Wings & Floors ({wings.length})</h3>
        {wings.length > 0 ? (
          <div className="space-y-4">
            {wings.map((wing, wIdx) => (
              <div key={wIdx} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between">
                    <h4 className="font-semibold text-gray-800">{wing.wingName}</h4>
                    <span className="text-sm text-gray-600">{wing.noOfFloors} Floors, {wing.noOfProperties} Units</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm text-left">
                        <thead className="bg-white text-gray-500 border-b">
                            <tr><th className="px-3 py-2">Floor</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Property</th><th className="px-3 py-2">Area</th><th className="px-3 py-2">Qty</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {wing.floors.map((f, fIdx) => (
                                <tr key={fIdx}>
                                    <td className="px-3 py-2 font-medium">{f.floorName}</td>
                                    <td className="px-3 py-2">{f.propertyType}</td>
                                    <td className="px-3 py-2">{f.property}</td>
                                    <td className="px-3 py-2">{f.area}</td>
                                    <td className="px-3 py-2">{f.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-600">No wings added</p>}
      </div>

      {/* Banks */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-lg">Bank Information ({banks.length})</h3>
        {banks.length > 0 ? (
          <div className="space-y-2">
            {banks.map((bank) => (
              <div key={bank.bankDetailId} className="bg-gray-50 p-3 rounded text-sm">
                <p className="font-medium text-gray-900">{bank.bankName} - {bank.branchName}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 mt-1 text-xs">
                  <p>Contact: {bank.contactPerson}</p><p>Phone: {bank.contactNumber}</p><p>IFSC: {bank.ifsc || "-"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-600">No banks added</p>}
      </div>

      {/* Amenities & Docs */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-lg">Amenities & Documents</h3>
        <div className="mb-2">{amenities.length > 0 ? amenities.map(a => <span key={a} className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-sm mr-2">{a}</span>) : <span className="text-gray-600">No amenities</span>}</div>
        <div className="space-y-2">
            {documents.map((doc) => (
                <div key={doc.documentId} className="flex items-start justify-between bg-gray-50 p-3 rounded text-sm">
                    <div className="flex-1"><p className="font-medium text-gray-900">{doc.title}</p><p className="text-gray-600 text-xs mt-1">{doc.type} - {doc.file.name}</p></div>
                    <button onClick={() => onPreviewDoc(doc.file)} className="text-indigo-600 hover:text-indigo-700 p-1 ml-2"><Eye size={18} /></button>
                </div>
            ))}
        </div>
      </div>

      {/* Disbursements */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-lg">Disbursements</h3>
        {disbursements.length > 0 ? (
          <>
            <div className="space-y-2">
              {disbursements.map((d) => (
                <div key={d.disbursementId} className="flex justify-between items-center bg-gray-50 p-3 rounded text-sm">
                  <div><p className="font-medium text-gray-900">{d.title}</p><p className="text-gray-600 text-xs">{d.description || "-"}</p></div>
                  <p className="font-semibold text-indigo-600">{d.percentage}%</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded"><p className="font-semibold text-green-900">Total: {disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0)}%</p></div>
          </>
        ) : <p className="text-gray-600">No disbursements added</p>}
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm md:text-base text-green-900 font-medium">All information is ready to be submitted</p>
      </div>
    </div>
  )
}