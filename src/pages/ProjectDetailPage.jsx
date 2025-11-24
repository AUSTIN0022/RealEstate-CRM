import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { Card } from "../components/ui/Card"
import { Tabs } from "../components/ui/Tabs"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { Table } from "../components/ui/Table"
import { FormInput } from "../components/ui/FormInput"
import { ArrowLeft, Edit, Trash2, Plus, Save, X, Building2, CheckCircle2, Percent, Calendar } from "lucide-react"
import { formatDate } from "../utils/helpers"
import { projectService } from "../services/projectService"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enquiries, setEnquiries] = useState([])
  const [disbursements, setDisbursements] = useState([])

  // Modal/Form States
  const [isEditingBasic, setIsEditingBasic] = useState(false)
  const [basicForm, setBasicForm] = useState({})

  const [isAddingWing, setIsAddingWing] = useState(false)
  const [wingForm, setWingForm] = useState({ wingName: "", noOfFloors: 0, noOfProperties: 0, floors: [] })

  const [isAddingBank, setIsAddingBank] = useState(false)
  const [editingBankId, setEditingBankId] = useState(null)
  const [bankForm, setBankForm] = useState({ bankName: "", branchName: "", contactPerson: "", contactNumber: "" })

  const [isAddingAmenity, setIsAddingAmenity] = useState(false)
  const [editingAmenityId, setEditingAmenityId] = useState(null)
  const [amenityForm, setAmenityForm] = useState({ amenityName: "" })

  const [isEditingDisbursements, setIsEditingDisbursements] = useState(false)
  const [disbursementForm, setDisbursementForm] = useState([])

  // --- Data Fetching ---

  const fetchData = async () => {
    try {
      setLoading(true)
      const projectData = await projectService.getProjectById(projectId)
      setProject(projectData)
      setBasicForm({
        projectName: projectData.projectName,
        projectAddress: projectData.projectAddress,
        startDate: projectData.startDate?.split('T')[0],
        completionDate: projectData.completionDate?.split('T')[0],
        mahareraNo: projectData.mahareraNo,
        progress: projectData.progress
      })

      // Fetch related data safely
      try {
        const enquiriesData = await projectService.getProjectEnquiries(projectId)
        setEnquiries(enquiriesData || [])
      } catch (e) { console.warn("Enquiries fetch failed", e) }

      try {
        const disbursementsData = await projectService.getDisbursements(projectId)
        setDisbursements(disbursementsData || [])
      } catch (e) { console.warn("Disbursements fetch failed", e) }

    } catch (err) {
      console.error("Failed to load details:", err)
      toastError(err.message || "Failed to load project details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchData()
    }
  }, [projectId])

  // --- Handlers: Basic Info ---

  const handleUpdateBasicInfo = async () => {
    try {
      await projectService.updateProject(projectId, basicForm)
      success("Project info updated successfully")
      setIsEditingBasic(false)
      fetchData() // Refresh
    } catch (err) {
      toastError("Failed to update project info")
    }
  }

  // --- Handlers: Wings ---

  const handleCreateWing = async () => {
    try {
      // Auto-generate floors if not provided
      let floorsPayload = wingForm.floors
      if (!floorsPayload || floorsPayload.length === 0) {
         const floorsCount = parseInt(wingForm.noOfFloors) || 1;
         const propsCount = parseInt(wingForm.noOfProperties) || 1;
         const propsPerFloor = Math.max(1, Math.floor(propsCount / floorsCount));

         floorsPayload = Array.from({ length: floorsCount }, (_, i) => ({
            floorNo: i,
            floorName: i === 0 ? "Ground Floor" : `Floor ${i}`,
            propertyType: "Residential", // Default
            property: "",
            area: 0,
            quantity: propsPerFloor
         }))
      }
      
      const payload = { 
          wingName: wingForm.wingName,
          noOfFloors: parseInt(wingForm.noOfFloors),
          noOfProperties: parseInt(wingForm.noOfProperties),
          floors: floorsPayload 
      }
      
      await projectService.createWing(projectId, payload)
      success("Wing created successfully")
      setIsAddingWing(false)
      setWingForm({ wingName: "", noOfFloors: 0, noOfProperties: 0, floors: [] })
      fetchData()
    } catch (err) {
      toastError("Failed to create wing")
    }
  }

  // --- Handlers: Bank Info ---

  const handleSaveBank = async () => {
    try {
      if (editingBankId) {
        await projectService.updateBankInfo(editingBankId, bankForm)
        success("Bank info updated")
      } else {
        await projectService.createBankInfo(projectId, bankForm)
        success("Bank added")
      }
      setIsAddingBank(false)
      setEditingBankId(null)
      setBankForm({ bankName: "", branchName: "", contactPerson: "", contactNumber: "" })
      fetchData()
    } catch (err) {
      toastError("Failed to save bank info")
    }
  }

  const startEditBank = (bank) => {
    setBankForm({ 
      bankName: bank.bankName, 
      branchName: bank.branchName, 
      contactPerson: bank.contactPerson, 
      contactNumber: bank.contactNumber 
    })
    setEditingBankId(bank.id || bank.bankInfoId) // Adjust based on API response ID key
    setIsAddingBank(true)
  }

  // --- Handlers: Amenities ---

  const handleSaveAmenity = async () => {
    try {
      if (editingAmenityId) {
        await projectService.updateAmenity(editingAmenityId, amenityForm)
        success("Amenity updated")
      } else {
        await projectService.createAmenity(projectId, amenityForm)
        success("Amenity added")
      }
      setIsAddingAmenity(false)
      setEditingAmenityId(null)
      setAmenityForm({ amenityName: "" })
      fetchData()
    } catch (err) {
      toastError("Failed to save amenity")
    }
  }

  const handleDeleteAmenity = async (id) => {
    if (!window.confirm("Are you sure you want to delete this amenity?")) return
    try {
      await projectService.deleteAmenity(id)
      success("Amenity deleted")
      fetchData()
    } catch (err) {
      toastError("Failed to delete amenity")
    }
  }

  // --- Handlers: Disbursements ---

  const handleUpdateDisbursements = async () => {
    try {
      // Filter out empty rows
      const validDisbursements = disbursementForm.filter(d => d.disbursementTitle && d.percentage)
      await projectService.updateDisbursements(projectId, validDisbursements)
      success("Disbursements updated")
      setIsEditingDisbursements(false)
      fetchData()
    } catch (err) {
      toastError("Failed to update disbursements")
    }
  }

  const addDisbursementRow = () => {
    setDisbursementForm([...disbursementForm, { disbursementTitle: "", description: "", percentage: 0 }])
  }

  const removeDisbursementRow = (index) => {
    const newD = [...disbursementForm]
    newD.splice(index, 1)
    setDisbursementForm(newD)
  }

  // --- Render Helpers ---

  if (loading) {
    return (
      <AppLayout>
        <SkeletonLoader type={"stat"} count={4} />
        <SkeletonLoader type={"table"} count={5} />
      </AppLayout>
    )
  }

  if (!project) return <AppLayout><div>Project not found</div></AppLayout>

  const tabs = [
    {
      label: "Overview",
      content: (
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Details</h3>
              {!isEditingBasic ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditingBasic(true)}>
                  <Edit size={16} className="mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingBasic(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleUpdateBasicInfo}>Save</Button>
                </div>
              )}
            </div>

            {isEditingBasic ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name</label>
                  <FormInput value={basicForm.projectName} onChange={e => setBasicForm({...basicForm, projectName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <FormInput value={basicForm.projectAddress} onChange={e => setBasicForm({...basicForm, projectAddress: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <FormInput type="date" value={basicForm.startDate} onChange={e => setBasicForm({...basicForm, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Completion Date</label>
                  <FormInput type="date" value={basicForm.completionDate} onChange={e => setBasicForm({...basicForm, completionDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">MahaRERA No</label>
                  <FormInput value={basicForm.mahareraNo} onChange={e => setBasicForm({...basicForm, mahareraNo: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Progress (%)</label>
                  <FormInput type="number" value={basicForm.progress} onChange={e => setBasicForm({...basicForm, progress: e.target.value})} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500">MahaRERA</p>
                  <p className="font-medium">{project.mahareraNo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion</p>
                  <p className="font-medium">{formatDate(project.completionDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      label: "Wings & Floors",
      content: (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsAddingWing(true)}>
              <Plus size={18} className="mr-2" /> Add Wing
            </Button>
          </div>

          {isAddingWing && (
             <Card className="mb-4 border-blue-200 bg-blue-50">
                <h4 className="font-semibold mb-3">New Wing Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                   <FormInput 
                      placeholder="Wing Name (e.g. Wing A)" 
                      value={wingForm.wingName} 
                      onChange={e => setWingForm({...wingForm, wingName: e.target.value})} 
                   />
                   <FormInput 
                      type="number" 
                      placeholder="No. of Floors" 
                      value={wingForm.noOfFloors} 
                      onChange={e => setWingForm({...wingForm, noOfFloors: e.target.value})} 
                   />
                   <FormInput 
                      type="number" 
                      placeholder="Total Properties" 
                      value={wingForm.noOfProperties} 
                      onChange={e => setWingForm({...wingForm, noOfProperties: e.target.value})} 
                   />
                </div>
                <div className="flex justify-end gap-2">
                   <Button variant="ghost" onClick={() => setIsAddingWing(false)}>Cancel</Button>
                   <Button onClick={handleCreateWing}>Create Wing</Button>
                </div>
             </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.wings?.map((wing) => (
              <Card key={wing.id || wing.wingId} className="hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Building2 size={20} className="text-blue-600"/>
                      {wing.wingName}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {wing.noOfFloors} Floors • {wing.noOfProperties} Properties
                    </p>
                  </div>
                  {/* Edit Wing logic could be added here */}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Floor Breakdown</p>
                  <div className="flex flex-wrap gap-2">
                    {wing.floors?.slice(0, 5).map((f, idx) => (
                      <Badge key={f.floorId || idx} variant="secondary" className="text-xs">
                        {f.floorName}: {f.quantity}
                      </Badge>
                    ))}
                    {(wing.floors?.length || 0) > 5 && <Badge variant="outline">+{wing.floors.length - 5} more</Badge>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: "Bank Info",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold">Approved Banks</h3>
             <Button onClick={() => { setEditingBankId(null); setBankForm({ bankName:"", branchName:"", contactPerson:"", contactNumber:"" }); setIsAddingBank(true); }}>
               <Plus size={18} className="mr-2" /> Add Bank
             </Button>
          </div>

          {isAddingBank && (
             <Card className="mb-4 bg-gray-50">
                <h4 className="font-semibold mb-3">{editingBankId ? "Edit Bank" : "Add New Bank"}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <FormInput placeholder="Bank Name" value={bankForm.bankName} onChange={e => setBankForm({...bankForm, bankName: e.target.value})} />
                   <FormInput placeholder="Branch Name" value={bankForm.branchName} onChange={e => setBankForm({...bankForm, branchName: e.target.value})} />
                   <FormInput placeholder="Contact Person" value={bankForm.contactPerson} onChange={e => setBankForm({...bankForm, contactPerson: e.target.value})} />
                   <FormInput placeholder="Contact Number" value={bankForm.contactNumber} onChange={e => setBankForm({...bankForm, contactNumber: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2">
                   <Button variant="ghost" onClick={() => setIsAddingBank(false)}>Cancel</Button>
                   <Button onClick={handleSaveBank}>Save Bank</Button>
                </div>
             </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.projectApprovedBanksInfo?.map((bank) => (
              <Card key={bank.id || bank.bankInfoId}>
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-lg">{bank.bankName}</h4>
                   <Button variant="ghost" size="sm" onClick={() => startEditBank(bank)}><Edit size={16}/></Button>
                </div>
                <p className="text-sm text-gray-600">{bank.branchName}</p>
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                   <p><span className="font-medium">Person:</span> {bank.contactPerson}</p>
                   <p><span className="font-medium">Phone:</span> {bank.contactNumber}</p>
                </div>
              </Card>
            ))}
            {(!project.projectApprovedBanksInfo || project.projectApprovedBanksInfo.length === 0) && (
               <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  No banks added yet.
               </div>
            )}
          </div>
        </div>
      )
    },
    {
      label: "Amenities",
      content: (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold">Project Amenities</h3>
             <Button onClick={() => { setEditingAmenityId(null); setAmenityForm({ amenityName:"" }); setIsAddingAmenity(true); }}>
               <Plus size={18} className="mr-2" /> Add Amenity
             </Button>
          </div>

          {isAddingAmenity && (
             <Card className="mb-4 bg-green-50 border-green-100">
                <div className="flex gap-4 items-end">
                   <div className="flex-1">
                     <label className="text-sm font-medium mb-1 block">Amenity Name</label>
                     <FormInput 
                        value={amenityForm.amenityName} 
                        onChange={e => setAmenityForm({...amenityForm, amenityName: e.target.value})} 
                        placeholder="e.g. Swimming Pool, Gym"
                     />
                   </div>
                   <Button onClick={handleSaveAmenity}>Save</Button>
                   <Button variant="ghost" onClick={() => setIsAddingAmenity(false)}><X size={18}/></Button>
                </div>
             </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {project.amenities?.map((amenity) => (
               <div key={amenity.id || amenity.amenityId} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
                  <span className="font-medium text-gray-800">{amenity.amenityName}</span>
                  <div className="flex gap-1">
                     <button onClick={() => { setEditingAmenityId(amenity.id || amenity.amenityId); setAmenityForm({ amenityName: amenity.amenityName }); setIsAddingAmenity(true); }} className="p-1 text-gray-500 hover:text-blue-600">
                        <Edit size={16} />
                     </button>
                     <button onClick={() => handleDeleteAmenity(amenity.id || amenity.amenityId)} className="p-1 text-gray-500 hover:text-red-600">
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
            ))}
          </div>
        </div>
      )
    },
    {
      label: "Disbursements",
      content: (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold">Payment Stages</h3>
             {!isEditingDisbursements && (
               <Button onClick={() => { setDisbursementForm(disbursements.length ? disbursements : [{disbursementTitle:"", description:"", percentage:""}]); setIsEditingDisbursements(true); }}>
                 <Edit size={18} className="mr-2" /> Edit Stages
               </Button>
             )}
           </div>

           {isEditingDisbursements ? (
              <Card>
                 <div className="space-y-4">
                    {disbursementForm.map((item, idx) => (
                       <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center border-b border-gray-100 pb-3">
                          <div className="flex-1 w-full">
                             <FormInput placeholder="Title (e.g. Plinth)" value={item.disbursementTitle} onChange={e => { const n = [...disbursementForm]; n[idx].disbursementTitle = e.target.value; setDisbursementForm(n); }} />
                          </div>
                          <div className="flex-[2] w-full">
                             <FormInput placeholder="Description" value={item.description} onChange={e => { const n = [...disbursementForm]; n[idx].description = e.target.value; setDisbursementForm(n); }} />
                          </div>
                          <div className="w-full md:w-24">
                             <FormInput type="number" placeholder="%" value={item.percentage} onChange={e => { const n = [...disbursementForm]; n[idx].percentage = e.target.value; setDisbursementForm(n); }} />
                          </div>
                          <button onClick={() => removeDisbursementRow(idx)} className="text-red-500 p-2"><Trash2 size={18} /></button>
                       </div>
                    ))}
                    <Button variant="outline" onClick={addDisbursementRow} className="w-full border-dashed">+ Add Stage</Button>
                    
                    <div className="flex justify-end gap-3 mt-4 pt-2 border-t">
                       <Button variant="ghost" onClick={() => setIsEditingDisbursements(false)}>Cancel</Button>
                       <Button onClick={handleUpdateDisbursements}>Save Changes</Button>
                    </div>
                 </div>
              </Card>
           ) : (
             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                      <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                      </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                      {disbursements.map((d, idx) => (
                         <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{d.disbursementTitle}</td>
                            <td className="px-6 py-4 text-gray-500">{d.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-blue-600">{d.percentage}%</td>
                         </tr>
                      ))}
                      {disbursements.length === 0 && (
                         <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No payment stages defined.</td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
           )}
        </div>
      )
    },
    {
      label: "Enquiries",
      content: (
        <Card>
          {enquiries && enquiries.length > 0 ? (
            <Table
              columns={[
                { key: "clientName", label: "Client Name", render: (val) => <p className="font-medium text-gray-900">{val}</p> },
                { key: "budget", label: "Budget", render: (val) => <p className="text-gray-700">{val}</p> },
                { key: "reference", label: "Reference", render: (val) => <p className="text-sm text-gray-600">{val}</p> },
                { key: "status", label: "Status", render: (val) => <Badge status={val}>{val}</Badge> },
              ]}
              data={enquiries}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">No enquiries for this project</div>
          )}
        </Card>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={() => navigate("/projects")} className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{project.projectName}</h1>
              <p className="text-gray-600 mt-1 text-sm break-words flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                {project.projectAddress}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-col-reverse sm:flex-row">
            <Button variant="danger" className="w-full sm:w-auto" onClick={async () => {
              if(window.confirm("Are you sure? This cannot be undone.")){
                 await projectService.deleteProject(projectId);
                 navigate("/projects");
              }
            }}>
              <Trash2 size={20} />
              Delete Project
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} />
      </div>
    </AppLayout>
  )
}