import CrudPage from "../components/CrudPage";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
];

const blogConfig = {
  title: "Blog Posts",
  singular: "Blog post",
  apiPath: "blogs",
  statusKey: "status",
  statusOptions,
  imageField: "image",
  imagePreviewKey: "thumbnail",
  columns: [
    { key: "thumbnail", label: "", image: true },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "views", label: "Views" },
  ],
  fields: [
    { name: "title", label: "Title", required: true, fullWidth: true },
    { name: "slug", label: "URL Slug", hint: "Leave blank to auto-generate from the title. Only change this if you know what you're doing - it stays fixed on every future save." },
    { name: "category", label: "Category" },
    { name: "author", label: "Author" },
    {
      name: "status", label: "Status", type: "select", options: statusOptions,
    },
    { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3, fullWidth: true },
    {
      name: "content", label: "Content (Markdown)", type: "textarea", rows: 12, fullWidth: true,
      hint: "Supports # / ## / ### headings, blank-line paragraphs, - bullet lists, 1. numbered lists, **bold**, *italic*, [link text](https://...) and > blockquotes.",
    },
    { name: "tags", label: "Tags (comma separated)", type: "tags", fullWidth: true },
  ],
};

export default function Blog() {
  return <CrudPage config={blogConfig} />;
}