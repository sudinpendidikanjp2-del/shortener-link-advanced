'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Check, AlertCircle, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [registrationEnabled, setRegistrationEnabled] = useState(true)

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    // Fetch settings
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setRegistrationEnabled(data.settings.registration_enabled === 'true')
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Failed to load settings')
        setIsLoading(false)
      })
  }, [user, router])

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'registration_enabled',
          value: registrationEnabled.toString(),
        }),
      })

      if (!res.ok) {
        setError('Failed to save settings')
      } else {
        setSuccess('Settings saved successfully')
      }
    } catch {
      setError('Network error')
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Configure application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Registration</CardTitle>
          <CardDescription>Control whether new users can register</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 p-3 rounded-lg mb-4">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <FieldGroup>
            <Field>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel className="mb-0">Allow Registration</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    When disabled, new users cannot register. Only admins can create accounts.
                  </p>
                </div>
                <Switch
                  checked={registrationEnabled}
                  onCheckedChange={setRegistrationEnabled}
                />
              </div>
            </Field>
          </FieldGroup>

          <Button onClick={handleSave} disabled={isSaving} className="mt-4">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
