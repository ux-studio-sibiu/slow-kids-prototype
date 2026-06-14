import { defineField, defineType } from "sanity";

// One submission of the event signup form. All fields are written by the public
// form (server action) and are read-only in the Studio.
const signup = defineType({
  name: "signup",
  title: "Înscriere",
  type: "document",

  fields: [
    defineField({ name: "childName", title: "Numele copilului", type: "string", readOnly: true }),
    defineField({ name: "parentName", title: "Numele părintelui", type: "string", readOnly: true }),
    defineField({ name: "contactEmail", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "contactPhone", title: "Telefon", type: "string", readOnly: true }),
    defineField({
      name: "event",
      title: "Eveniment",
      type: "reference",
      to: [{ type: "event" }],
      readOnly: true,
    }),
    defineField({ name: "submittedAt", title: "Data înscrierii", type: "datetime", readOnly: true }),
  ],

  orderings: [
    {
      title: "Cele mai recente",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: { title: "childName", parent: "parentName", event: "event.title", date: "submittedAt" },
    prepare({ title, parent, event, date }) {
      const when = date ? new Date(date as string).toLocaleDateString("ro-RO") : null;
      const subtitle = [event, parent, when].filter(Boolean).join(" · ");
      return { title: title || "Înscriere", subtitle: subtitle || undefined };
    },
  },
});

export default signup;
