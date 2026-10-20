// Mirrors the configs in client/src/admin/pages/{Services,Portfolio,Team,Testimonials,Blog}.jsx
// Each powers CrudListScreen + CrudFormScreen against the same crud.factory.js backend routes.

const draftPublishedArchived = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const servicesConfig = {
  title: "Services",
  singular: "Service",
  apiPath: "services",
  statusKey: "status",
  statusOptions: draftPublishedArchived,
  imageField: "image",
  imagePreviewKey: "heroImage",
  columns: [
    { key: "title", label: "Title" },
    { key: "icon", label: "Icon" },
  ],
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "short", label: "Short description" },
    { name: "overview", label: "Overview", type: "textarea", rows: 5 },
    { name: "icon", label: "Icon", hint: "e.g. globe, phone, palette, share, search, brush" },
    { name: "displayOrder", label: "Display order", type: "number" },
    { name: "status", label: "Status", type: "select", options: draftPublishedArchived },
    { name: "featured", label: "Featured on home", type: "switch" },
    { name: "features", label: "Features (comma separated)", type: "tags" },
    { name: "technologies", label: "Technologies (comma separated)", type: "tags" },
  ],
};

export const portfolioConfig = {
  title: "Portfolio",
  singular: "Project",
  apiPath: "portfolio",
  statusKey: "status",
  statusOptions: draftPublishedArchived,
  imageField: "image",
  imagePreviewKey: "thumbnail",
  columns: [
    { key: "title", label: "Title" },
    { key: "client", label: "Client" },
  ],
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "client", label: "Client" },
    { name: "duration", label: "Duration", placeholder: "e.g. 12 weeks" },
    { name: "industry", label: "Industry" },
    { name: "category", label: "Category" },
    { name: "displayOrder", label: "Display order", type: "number" },
    { name: "status", label: "Status", type: "select", options: draftPublishedArchived },
    { name: "featured", label: "Featured", type: "switch" },
    { name: "liveDemo", label: "Live demo URL" },
    { name: "github", label: "GitHub URL" },
    { name: "overview", label: "Overview", type: "textarea", rows: 4 },
    { name: "description", label: "Description", type: "textarea", rows: 5 },
    { name: "problem", label: "Problem", type: "textarea", rows: 3 },
    { name: "solution", label: "Solution", type: "textarea", rows: 3 },
    { name: "results", label: "Results", type: "textarea", rows: 3 },
    { name: "technologies", label: "Technologies (comma separated)", type: "tags" },
  ],
};

export const teamConfig = {
  title: "Team",
  singular: "Team member",
  apiPath: "team",
  imageField: "image",
  imagePreviewKey: "photo",
  columns: [
    { key: "name", label: "Name" },
    { key: "position", label: "Position" },
  ],
  fields: [
    { name: "name", label: "Name", required: true },
    { name: "position", label: "Position" },
    { name: "bio", label: "Bio", type: "textarea" },
    { name: "displayOrder", label: "Display order", type: "number" },
    { name: "isActive", label: "Active", type: "switch" },
    { name: "skills", label: "Skills (comma separated)", type: "tags" },
  ],
};

export const testimonialsConfig = {
  title: "Testimonials",
  singular: "Testimonial",
  apiPath: "testimonials",
  statusKey: "status",
  statusOptions: draftPublishedArchived,
  imageField: "image",
  imagePreviewKey: "image",
  columns: [
    { key: "clientName", label: "Client" },
    { key: "company", label: "Company" },
  ],
  fields: [
    { name: "clientName", label: "Client name", required: true },
    { name: "company", label: "Company" },
    { name: "designation", label: "Designation" },
    { name: "rating", label: "Rating (1-5)", type: "number" },
    { name: "review", label: "Review", type: "textarea", rows: 5, required: true },
    { name: "status", label: "Status", type: "select", options: draftPublishedArchived },
    { name: "featured", label: "Featured", type: "switch" },
    { name: "displayOrder", label: "Display order", type: "number" },
  ],
};

export const blogConfig = {
  title: "Blog Posts",
  singular: "Blog post",
  apiPath: "blogs",
  statusKey: "status",
  statusOptions: [...draftPublishedArchived, { value: "scheduled", label: "Scheduled" }],
  imageField: "image",
  imagePreviewKey: "thumbnail",
  columns: [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
  ],
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "category", label: "Category" },
    { name: "author", label: "Author" },
    { name: "status", label: "Status", type: "select", options: [...draftPublishedArchived, { value: "scheduled", label: "Scheduled" }] },
    { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3 },
    { name: "content", label: "Content (HTML)", type: "textarea", rows: 10 },
    { name: "tags", label: "Tags (comma separated)", type: "tags" },
  ],
};
