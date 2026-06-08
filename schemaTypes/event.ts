import { defineField, defineType } from "sanity";

const event = defineType({
  name: "event",
  title: "Eveniment",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Titlu",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "date",
      title: "Dată",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "photos",
      title: "Fotografii",
      description: "Trageți și plasați mai multe imagini deodată.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],

  preview: {
    select: { title: "title", date: "date", media: "photos.0" },
    prepare({ title, date, media }) {
      return {
        title: title || "Eveniment fără titlu",
        subtitle: date
          ? new Date(date as string).toLocaleDateString("ro-RO")
          : undefined,
        media,
      };
    },
  },
});

export default event;
