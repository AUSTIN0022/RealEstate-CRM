import { useState } from "react"
import { Card } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"
import { useToast } from "../../../components/ui/Toast"
import { Edit } from "lucide-react"
import { formatDate } from "../../../utils/helpers"
import { projectService } from "../../../services/projectService"

export default function OverviewTab({ project, onUpdate }) {
  const { success, error: toastError } = useToast()
  const [isEditingBasic, setIsEditingBasic] = useState(false)
  
  const [basicForm, setBasicForm] = useState({
    projectName: project.projectName,
    projectAddress: project.projectAddress,
    startDate: project.startDate?.split("T")[0],
    completionDate: project.completionDate?.split("T")[0],
    mahareraNo: project.mahareraNo,
    progress: project.progress,
  })

  const handleUpdateBasicInfo = async () => {
    console.log(`id: ${project.id} | _id: ${project._id}`);
    console.log("Updating basic info with:", basicForm)
    try {
      // Assuming projectId is available inside the project object
      await projectService.updateProject(project.id || project._id, basicForm)
      success("Project info updated")
      setIsEditingBasic(false)
      if (onUpdate) onUpdate()
    } catch (err) {
      toastError("Update failed")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Basic Details</h3>
          {!isEditingBasic ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditingBasic(true)}>
              <Edit size={16} className="mr-2" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditingBasic(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleUpdateBasicInfo}>
                Save
              </Button>
            </div>
          )}
        </div>

        {isEditingBasic ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Name</label>
              <FormInput
                value={basicForm.projectName}
                onChange={(e) =>
                  setBasicForm({ ...basicForm, projectName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <FormInput
                value={basicForm.projectAddress}
                onChange={(e) =>
                  setBasicForm({ ...basicForm, projectAddress: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <FormInput
                type="date"
                value={basicForm.startDate}
                onChange={(e) => setBasicForm({ ...basicForm, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Completion Date</label>
              <FormInput
                type="date"
                value={basicForm.completionDate}
                onChange={(e) =>
                  setBasicForm({ ...basicForm, completionDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">MahaRERA No</label>
              <FormInput
                value={basicForm.mahareraNo}
                onChange={(e) => setBasicForm({ ...basicForm, mahareraNo: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Progress (%)</label>
              <FormInput
                type="number"
                value={basicForm.progress}
                onChange={(e) => setBasicForm({ ...basicForm, progress: e.target.value })}
              />
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
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}