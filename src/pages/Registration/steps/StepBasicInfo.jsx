import { FormInput } from "../../../components/ui/FormInput"
import { FormSelect } from "../../../components/ui/FormSelect"
import { FormTextarea } from "../../../components/ui/FormTextarea"

export default function StepBasicInfo({ basicInfo, setBasicInfo }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Basic Information</h2>
      <FormInput
        label="Project Name"
        value={basicInfo.projectName}
        onChange={(e) => setBasicInfo({ ...basicInfo, projectName: e.target.value })}
        required
      />
      <FormInput
        label="Maharera Number"
        value={basicInfo.mahareraNo}
        onChange={(e) => setBasicInfo({ ...basicInfo, mahareraNo: e.target.value })}
        placeholder="P52100012345"
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Start Date"
          type="date"
          value={basicInfo.startDate}
          onChange={(e) => setBasicInfo({ ...basicInfo, startDate: e.target.value })}
          required
        />
        <FormInput
          label="Completion Date"
          type="date"
          value={basicInfo.completionDate}
          onChange={(e) => setBasicInfo({ ...basicInfo, completionDate: e.target.value })}
          required
        />
      </div>
      <FormSelect
        label="Status"
        value={basicInfo.status}
        onChange={(e) => setBasicInfo({ ...basicInfo, status: e.target.value })}
        options={[
          { value: "UPCOMING", label: "Upcoming" },
          { value: "IN_PROGRESS", label: "In Progress" },
          { value: "COMPLETED", label: "Completed" },
        ]}
      />
      <FormTextarea
        label="Address"
        value={basicInfo.address}
        onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
      />
    </div>
  )
}