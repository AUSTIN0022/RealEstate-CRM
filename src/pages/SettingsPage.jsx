"use client"

import { useState } from "react"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { Card } from "../components/ui/Card"
import { Button  } from "../components/ui/Button"
import { FormInput } from "../components/ui/FormInput"
import { Tabs } from "../components/ui/Tabs"


export default function SettingsPage() {
  const { success } = useToast()

  const [orgSettings, setOrgSettings] = useState({
    orgName: "PropEase Real Estate",
    orgEmail: "admin@propease.com",
    address: "Mumbai, India",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    enquiryFollowUpDays: 3,
    paymentReminderDays: 7,
    demandLetterAlertDays: 2,
  })

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSaveOrgSettings = () => {
    success("Organization settings saved")
  }

  const handleSaveNotificationSettings = () => {
    success("Notification settings saved")
  }

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    success("Password changed successfully")
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
  }

  const tabs = [
    {
      label: "Organization",
      content: (
        <Card>
          <div className="space-y-4">
            <FormInput
              label="Organization Name"
              value={orgSettings.orgName}
              onChange={(e) => setOrgSettings({ ...orgSettings, orgName: e.target.value })}
            />
            <FormInput
              label="Email"
              type="email"
              value={orgSettings.orgEmail}
              onChange={(e) => setOrgSettings({ ...orgSettings, orgEmail: e.target.value })}
            />
            <FormInput
              label="Address"
              value={orgSettings.address}
              onChange={(e) => setOrgSettings({ ...orgSettings, address: e.target.value })}
            />
            <Button onClick={handleSaveOrgSettings} variant="primary">
              Save Settings
            </Button>
          </div>
        </Card>
      ),
    },
    {
      label: "Notifications",
      content: (
        <Card>
          <div className="space-y-4">
            <FormInput
              label="Enquiry Follow-Up (Days)"
              type="number"
              value={notificationSettings.enquiryFollowUpDays}
              onChange={(e) =>
                setNotificationSettings({ ...notificationSettings, enquiryFollowUpDays: e.target.value })
              }
            />
            <FormInput
              label="Payment Reminder (Days)"
              type="number"
              value={notificationSettings.paymentReminderDays}
              onChange={(e) =>
                setNotificationSettings({ ...notificationSettings, paymentReminderDays: e.target.value })
              }
            />
            <FormInput
              label="Demand Letter Alert (Days)"
              type="number"
              value={notificationSettings.demandLetterAlertDays}
              onChange={(e) =>
                setNotificationSettings({ ...notificationSettings, demandLetterAlertDays: e.target.value })
              }
            />
            <Button onClick={handleSaveNotificationSettings} variant="primary">
              Save Settings
            </Button>
          </div>
        </Card>
      ),
    },
    {
      label: "Account",
      content: (
        <Card>
          <div className="space-y-4">
            <FormInput
              label="Old Password"
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            />
            <FormInput
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <FormInput
              label="Confirm Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
            <Button onClick={handleChangePassword} variant="primary">
              Change Password
            </Button>
          </div>
        </Card>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage system settings and preferences</p>
        </div>

        <Tabs tabs={tabs} />
      </div>
    </AppLayout>
  )
}
