'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { SCENARIO_CONFIG } from '@/lib/utils'
import type { TemplateScenario } from '@/types'

const SCENARIO_OPTIONS = [
  { value: 'THANK_YOU', label: 'Thank You' },
  { value: 'RECONNECT', label: 'Reconnect' },
  { value: 'REFERRAL_REQUEST', label: 'Referral Request' },
  { value: 'APPLICATION_FOLLOWUP', label: 'Application Follow-up' },
  { value: 'CUSTOM', label: 'Custom' },
]

export default function TemplatesPage() {
  const templates = useAppStore((s) => s.templates)
  const user = useAppStore((s) => s.user)
  const addTemplate = useAppStore((s) => s.addTemplate)
  const updateTemplate = useAppStore((s) => s.updateTemplate)
  const deleteTemplate = useAppStore((s) => s.deleteTemplate)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState<string | null>(null)

  const [formTitle, setFormTitle] = useState('')
  const [formScenario, setFormScenario] = useState<TemplateScenario>('CUSTOM')
  const [formBody, setFormBody] = useState('')

  const systemTemplates = templates.filter((t) => t.userId === null)
  const userTemplates = templates.filter((t) => t.userId !== null)
  const canAdd = user.plan === 'PRO' || userTemplates.length < 3

  function openNew() {
    setEditingId(null)
    setFormTitle('')
    setFormScenario('CUSTOM')
    setFormBody('')
    setShowForm(true)
  }

  function openEdit(id: string) {
    const t = templates.find((t) => t.id === id)
    if (!t) return
    setEditingId(id)
    setFormTitle(t.title)
    setFormScenario(t.scenario)
    setFormBody(t.body)
    setShowForm(true)
  }

  function openCustomize(id: string) {
    const t = templates.find((t) => t.id === id)
    if (!t || !canAdd) return
    setEditingId(null)
    setFormTitle(t.title + ' (Custom)')
    setFormScenario(t.scenario)
    setFormBody(t.body)
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formTitle.trim() || !formBody.trim()) return
    if (editingId) {
      updateTemplate(editingId, { title: formTitle.trim(), scenario: formScenario, body: formBody.trim() })
    } else {
      addTemplate({ title: formTitle.trim(), scenario: formScenario, body: formBody.trim() })
    }
    setShowForm(false)
  }

  const previewTemplate = templates.find((t) => t.id === showPreview)

  return (
    <div>
      <Header
        title="Templates"
        subtitle={`${userTemplates.length} custom · ${user.plan === 'FREE' ? `${3 - userTemplates.length} slots remaining on Free` : 'Unlimited on Pro'}`}
      />

      {/* System Templates */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-300">📋 Built-in Templates</h2>
          <span className="text-xs text-gray-500">Click Customize to create your own version</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {systemTemplates.map((template) => {
            const scenario = SCENARIO_CONFIG[template.scenario]
            return (
              <div key={template.id} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{scenario.icon}</span>
                  <h3 className="text-sm font-semibold text-gray-200">{template.title}</h3>
                </div>
                <Badge variant="outline" className="mb-3">{scenario.label}</Badge>
                <p className="text-xs text-gray-400 line-clamp-3 mb-4 whitespace-pre-wrap">{template.body}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowPreview(template.id)}>
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openCustomize(template.id)}
                    disabled={!canAdd}
                    title={!canAdd ? 'Upgrade to Pro for more templates' : undefined}
                  >
                    ✏️ Customize
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* User Templates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-300">✏️ Your Templates</h2>
          <Button size="sm" onClick={openNew} disabled={!canAdd}>
            + New Template
          </Button>
        </div>
        {userTemplates.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-3xl mb-2">📝</p>
            <p className="text-sm text-gray-400">No custom templates yet.</p>
            <p className="text-xs text-gray-500 mt-1">
              Create from scratch or click &ldquo;Customize&rdquo; on any built-in template above.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {userTemplates.map((template) => {
              const scenario = SCENARIO_CONFIG[template.scenario]
              return (
                <div key={template.id} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{scenario.icon}</span>
                      <h3 className="text-sm font-semibold text-gray-200">{template.title}</h3>
                    </div>
                  </div>
                  <Badge variant="outline" className="mb-3">{scenario.label}</Badge>
                  <p className="text-xs text-gray-400 line-clamp-3 mb-4 whitespace-pre-wrap">{template.body}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setShowPreview(template.id)}>
                      Preview
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => openEdit(template.id)}>
                      ✏️ Edit
                    </Button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="ml-auto text-xs text-red-500 hover:text-red-400 px-2 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Variable Help */}
      <div className="glass-card p-4 mt-8">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">💡 Template Variables</h3>
        <p className="text-xs text-gray-400">
          Use{' '}
          <code className="px-1.5 py-0.5 rounded bg-dark-surface text-brand-400">{'{{name}}'}</code>,{' '}
          <code className="px-1.5 py-0.5 rounded bg-dark-surface text-brand-400">{'{{company}}'}</code>, and{' '}
          <code className="px-1.5 py-0.5 rounded bg-dark-surface text-brand-400">{'{{role}}'}</code>{' '}
          in your templates — they&apos;re auto-filled from the contact&apos;s profile when you compose a message from their detail page.
        </p>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Template' : 'New Template'} className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            label="Title *"
            placeholder="e.g. Coffee Chat Follow-Up"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />
          <Select
            id="scenario"
            label="Scenario"
            options={SCENARIO_OPTIONS}
            value={formScenario}
            onChange={(e) => setFormScenario(e.target.value as TemplateScenario)}
          />
          <Textarea
            id="body"
            label="Message Body *"
            placeholder={`Hi {{name}},\n\nI wanted to reach out about...`}
            rows={8}
            value={formBody}
            onChange={(e) => setFormBody(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500">
            Use {'{{name}}'}, {'{{company}}'}, {'{{role}}'} as auto-fill variables.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">{editingId ? 'Save Changes' : 'Create Template'}</Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!showPreview} onClose={() => setShowPreview(null)} title={previewTemplate?.title || 'Preview'} className="max-w-xl">
        {previewTemplate && (
          <div className="space-y-4">
            <Badge variant="outline">{SCENARIO_CONFIG[previewTemplate.scenario].label}</Badge>
            <div className="p-4 rounded-lg bg-dark-surface border border-dark-border">
              <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{previewTemplate.body}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {'{{name}}'}, {'{{company}}'}, {'{{role}}'} auto-filled from contact profile
              </p>
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(previewTemplate.body)
                  setShowPreview(null)
                }}
              >
                📋 Copy
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
