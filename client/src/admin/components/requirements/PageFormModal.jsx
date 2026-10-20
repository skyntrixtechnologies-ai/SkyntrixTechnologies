import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaChevronUp, FaChevronDown, FaCheck } from "react-icons/fa";
import { Button, Field, Input, Select, Switch, Textarea } from "../Ui";
import {
  PAGE_TYPES,
  PAGE_PRIORITIES,
  PAGE_STATUSES,
  PAGE_SECTION_TYPES,
  PAGE_FEATURE_TOGGLES,
  PAGE_ANIMATION_LEVELS,
  CONTENT_SOURCES,
  CONTENT_TYPES,
  CRUD_OPTIONS,
  emptyPage,
  emptySection,
  normalizePage,
  slugify,
} from "../../utils/requirementPages";

const toggle = (arr, value) => (arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

function ChipToggle({ value, label, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(value)}
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all " +
        (active ? "border-primary bg-primary/10 text-primary" : "border-base bg-white text-ink/60 hover:border-primary/40")
      }
    >
      {active && <FaCheck className="h-3 w-3" />}
      {label}
    </button>
  );
}

function ChipGroup({ options, values, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <ChipToggle key={o} value={o} label={o} active={values.includes(o)} onToggle={onToggle} />
      ))}
    </div>
  );
}

function Card({ title, hint, children }) {
  return (
    <div className="rounded-2xl border border-base bg-white p-4">
      <h5 className="mb-1 font-display text-sm font-bold text-ink/70">{title}</h5>
      {hint && <p className="mb-3 text-xs text-ink/40">{hint}</p>}
      {!hint && <div className="mb-3" />}
      {children}
    </div>
  );
}

export default function PageFormModal({ open, onClose, page, onSave }) {
  const [draft, setDraft] = useState(() => emptyPage());

  useEffect(() => {
    if (open) setDraft(page ? normalizePage(JSON.parse(JSON.stringify(page))) : emptyPage());
  }, [open, page]);

  const set = (key) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e?.target?.value;
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const setNested = (group, key) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e?.target?.value;
    setDraft((d) => ({ ...d, [group]: { ...d[group], [key]: value } }));
  };

  const setNestedValue = (group, key, value) =>
    setDraft((d) => ({ ...d, [group]: { ...d[group], [key]: value } }));

  const toggleFeature = (key, value) =>
    setDraft((d) => ({ ...d, features: { ...d.features, [key]: Boolean(value) } }));

  const setSection = (i, patch) =>
    setDraft((d) => {
      const next = [...d.sections];
      next[i] = { ...next[i], ...patch };
      return { ...d, sections: next };
    });

  const addSection = () =>
    setDraft((d) => ({ ...d, sections: [...d.sections, emptySection(d.sections.length)] }));

  const removeSection = (i) =>
    setDraft((d) => {
      const next = [...d.sections];
      next.splice(i, 1);
      return { ...d, sections: next.map((s, si) => ({ ...s, order: si })) };
    });

  const moveSection = (i, dir) =>
    setDraft((d) => {
      const next = [...d.sections];
      const j = i + dir;
      if (j < 0 || j >= next.length) return d;
      const tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
      return { ...d, sections: next.map((s, si) => ({ ...s, order: si })) };
    });

  const [errors, setErrors] = useState({});

  const save = () => {
    const errs = {};
    if (!draft.pageName.trim()) errs.pageName = "Page name is required";
    if (!draft.pageType) errs.pageType = "Page type is required";
    if (!draft.priority) errs.priority = "Priority is required";
    if (!draft.status) errs.status = "Status is required";
    if (draft.slug && !/^\/?[a-z0-9][a-z0-9\-_\/]*$/.test(draft.slug)) errs.slug = "Slug can only contain letters, numbers, - and _";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({
      ...draft,
      slug: draft.slug || (draft.pageName ? slugify(draft.pageName) : ""),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm">
      <div className="mt-4 w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">{page ? "Edit Page" : "Add Page"}</h3>
            <p className="text-xs text-ink/50">Capture detailed requirements for this page</p>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink" aria-label="Close">✕</button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          <div className="space-y-4">
            {/* Basic Information */}
            <Card title="Basic Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Page Name" required error={errors.pageName}>
                  <Input value={draft.pageName} onChange={set("pageName")} placeholder="e.g. Home" />
                </Field>
                <Field label="URL / Slug" hint="Leave blank to auto-generate from the page name" error={errors.slug}>
                  <Input value={draft.slug} onChange={set("slug")} placeholder="e.g. /about" />
                </Field>
                <Field label="Page Type" required error={errors.pageType}>
                  <Select value={draft.pageType} onChange={set("pageType")} options={PAGE_TYPES.map((t) => ({ value: t, label: t }))} placeholder="Select page type" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Priority" required error={errors.priority}>
                    <Select value={draft.priority} onChange={set("priority")} options={PAGE_PRIORITIES} placeholder={false} />
                  </Field>
                  <Field label="Status" required error={errors.status}>
                    <Select value={draft.status} onChange={set("status")} options={PAGE_STATUSES} placeholder={false} />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Purpose & Content */}
            <Card title="Purpose & Content">
              <Field label="Purpose" hint="What is this page meant to achieve?">
                <Textarea rows={2} value={draft.purpose} onChange={set("purpose")} placeholder="e.g. Showcase services and capture enquiries" />
              </Field>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Content Source">
                  <Select value={draft.content.source} onChange={setNested("content", "source")} options={CONTENT_SOURCES} placeholder={false} />
                </Field>
                <Field label="Content Types">
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {CONTENT_TYPES.map((t) => (
                      <ChipToggle key={t} value={t} label={t} active={draft.content.types.includes(t)} onToggle={(v) => setNested("content", "types")({ target: { value: toggle(draft.content.types, v) } })} />
                    ))}
                  </div>
                </Field>
                <div className="sm:col-span-2 flex flex-wrap gap-x-6 gap-y-2">
                  <Switch checked={Boolean(draft.content.imagesRequired)} onChange={(v) => setNestedValue("content", "imagesRequired", v)} label="Images Required" />
                  <Switch checked={Boolean(draft.content.videosRequired)} onChange={(v) => setNestedValue("content", "videosRequired", v)} label="Videos Required" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Content Notes">
                    <Textarea rows={2} value={draft.content.notes} onChange={setNested("content", "notes")} placeholder="Details about content needs" />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Sections / Components */}
            <Card title="Sections / Components" hint="Building blocks of this page, in order">
              <div className="space-y-3">
                {draft.sections.map((s, i) => (
                  <div key={i} className="rounded-xl border border-base bg-base/30 p-3">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                      <Select
                        value={s.sectionType}
                        onChange={(e) => setSection(i, { sectionType: e.target.value })}
                        options={PAGE_SECTION_TYPES.map((t) => ({ value: t, label: t }))}
                        placeholder={false}
                        className="flex-1"
                      />
                      <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0} className="rounded-lg border border-base bg-white p-2 text-ink/50 hover:text-primary disabled:opacity-30" title="Move up">
                        <FaChevronUp className="h-3 w-3" />
                      </button>
                      <button type="button" onClick={() => moveSection(i, 1)} disabled={i === draft.sections.length - 1} className="rounded-lg border border-base bg-white p-2 text-ink/50 hover:text-primary disabled:opacity-30" title="Move down">
                        <FaChevronDown className="h-3 w-3" />
                      </button>
                      <button type="button" onClick={() => removeSection(i)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100" title="Remove section">
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-3">
                      <Field label="Section Name">
                        <Input value={s.name} onChange={(e) => setSection(i, { name: e.target.value })} placeholder="e.g. Hero Banner" />
                      </Field>
                      <Field label="Description">
                        <Textarea rows={2} value={s.description} onChange={(e) => setSection(i, { description: e.target.value })} placeholder="What goes in this section" />
                      </Field>
                      <Field label="Content Requirements">
                        <Input value={s.contentRequirements} onChange={(e) => setSection(i, { contentRequirements: e.target.value })} placeholder="Copy, images, etc." />
                      </Field>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Switch checked={Boolean(s.imagesRequired)} onChange={(v) => setSection(i, { imagesRequired: v })} label="Images" />
                        <Switch checked={Boolean(s.videosRequired)} onChange={(v) => setSection(i, { videosRequired: v })} label="Videos" />
                        <Switch checked={Boolean(s.ctaRequired)} onChange={(v) => setSection(i, { ctaRequired: v })} label="CTA / Button" />
                      </div>
                      <Field label="Notes">
                        <Input value={s.notes} onChange={(e) => setSection(i, { notes: e.target.value })} placeholder="Anything specific about this section" />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="sm" variant="secondary" type="button" className="mt-3" onClick={addSection}>
                <FaPlus className="h-3 w-3" /> Add Section
              </Button>
            </Card>

            {/* Features & Functionality */}
            <Card title="Features & Functionality">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PAGE_FEATURE_TOGGLES.map(([key, label]) => (
                  <div key={key} className="rounded-xl border border-base bg-base/40 px-3 py-2.5">
                    <Switch checked={Boolean(draft.features[key])} onChange={(v) => toggleFeature(key, v)} label={label} />
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Field label="Other / Custom Features" hint="Describe any features not listed above">
                  <Input value={draft.otherFeatures} onChange={set("otherFeatures")} placeholder="e.g. Loan EMI calculator" />
                </Field>
              </div>
            </Card>

            {/* Dynamic Data / API */}
            <Card title="Dynamic Data / API">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Switch checked={Boolean(draft.dynamicData.enabled)} onChange={(v) => setNestedValue("dynamicData", "enabled", v)} label="Dynamic Data Required" />
                <Switch checked={Boolean(draft.dynamicData.apiRequired)} onChange={(v) => setNestedValue("dynamicData", "apiRequired", v)} label="API Required" />
                <Switch checked={Boolean(draft.dynamicData.adminManagement)} onChange={(v) => setNestedValue("dynamicData", "adminManagement", v)} label="Admin Management" />
              </div>
              {draft.dynamicData.enabled && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Data Source">
                    <Input value={draft.dynamicData.dataSource} onChange={setNested("dynamicData", "dataSource")} placeholder="e.g. Product database, CMS" />
                  </Field>
                  <Field label="Database Table / Collection">
                    <Input value={draft.dynamicData.databaseTable} onChange={setNested("dynamicData", "databaseTable")} placeholder="e.g. products, articles" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="CRUD Operations">
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {CRUD_OPTIONS.map((c) => (
                          <ChipToggle key={c.value} value={c.value} label={c.label} active={draft.dynamicData.crudOperations.includes(c.value)} onToggle={(v) => setNested("dynamicData", "crudOperations")({ target: { value: toggle(draft.dynamicData.crudOperations, v) } })} />
                        ))}
                      </div>
                    </Field>
                  </div>
                  {draft.dynamicData.apiRequired && (
                    <div className="sm:col-span-2">
                      <Field label="API Description">
                        <Textarea rows={2} value={draft.dynamicData.apiDescription} onChange={setNested("dynamicData", "apiDescription")} placeholder="Endpoints, third-party APIs, data flow" />
                      </Field>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Design & Responsive */}
            <Card title="Design & Responsive">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Design Preference">
                  <Input value={draft.design.preference} onChange={setNested("design", "preference")} placeholder="e.g. Modern, minimal, playful" />
                </Field>
                <Field label="Layout Style">
                  <Input value={draft.design.layout} onChange={setNested("design", "layout")} placeholder="e.g. Single column, sidebar" />
                </Field>
                <Field label="Reference Website">
                  <Input value={draft.design.referenceWebsite} onChange={setNested("design", "referenceWebsite")} placeholder="Site name the client likes" />
                </Field>
                <Field label="Reference URL">
                  <Input value={draft.design.referenceUrl} onChange={setNested("design", "referenceUrl")} placeholder="https://..." />
                </Field>
                <Field label="Color Preference">
                  <Input value={draft.design.colorPreference} onChange={setNested("design", "colorPreference")} placeholder="e.g. Brand purple + white" />
                </Field>
                <Field label="Typography">
                  <Input value={draft.design.typography} onChange={setNested("design", "typography")} placeholder="Fonts / heading styles" />
                </Field>
                <Field label="Animation Level">
                  <Select value={draft.design.animation} onChange={setNested("design", "animation")} options={PAGE_ANIMATION_LEVELS} placeholder={false} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Design Notes">
                    <Textarea rows={2} value={draft.design.notes} onChange={setNested("design", "notes")} placeholder="Anything about the look and feel" />
                  </Field>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-base bg-base/30 p-3">
                <p className="mb-2 text-sm font-medium text-ink/70">Responsive Support</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Switch checked={Boolean(draft.responsive.desktop)} onChange={(v) => setNestedValue("responsive", "desktop", v)} label="Desktop" />
                  <Switch checked={Boolean(draft.responsive.tablet)} onChange={(v) => setNestedValue("responsive", "tablet", v)} label="Tablet" />
                  <Switch checked={Boolean(draft.responsive.mobile)} onChange={(v) => setNestedValue("responsive", "mobile", v)} label="Mobile" />
                </div>
                <div className="mt-3">
                  <Field label="Responsive Notes">
                    <Input value={draft.responsive.notes} onChange={setNested("responsive", "notes")} placeholder="e.g. Mobile-first design required" />
                  </Field>
                </div>
              </div>
            </Card>

            {/* SEO */}
            <Card title="SEO">
              <Switch checked={Boolean(draft.seo.enabled)} onChange={(v) => setNestedValue("seo", "enabled", v)} label="SEO Required" />
              {draft.seo.enabled && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Meta Title">
                      <Input value={draft.seo.metaTitle} onChange={setNested("seo", "metaTitle")} placeholder="Title shown in search results" />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Meta Description">
                      <Textarea rows={2} value={draft.seo.metaDescription} onChange={setNested("seo", "metaDescription")} placeholder="Short search result snippet" />
                    </Field>
                  </div>
                  <Field label="Keywords">
                    <Input value={draft.seo.keywords} onChange={setNested("seo", "keywords")} placeholder="Comma separated keywords" />
                  </Field>
                  <Field label="SEO Notes">
                    <Input value={draft.seo.notes} onChange={setNested("seo", "notes")} placeholder="Schema markup, redirects, etc." />
                  </Field>
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t px-5 py-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save}>Save Page</Button>
        </div>
      </div>
    </div>
  );
}
